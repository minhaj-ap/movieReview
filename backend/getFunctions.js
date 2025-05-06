const { getDb } = require("./db");
const { ObjectId } = require("mongodb");
const nodeCache = require("node-cache");
const apiKey = process.env.TMDB_API;
const bcrypt = require("bcrypt");
const cache = new nodeCache({ stdTTL: 0, checkperiod: 60 });
async function searchDb(params, page = 1) {
  try {
    const db = await getDb();
    const keyword = params.query;
    if (!keyword) {
      return "No keyword provided";
    }
    const url = new URL("https://api.themoviedb.org/3/search/multi");
    url.searchParams.append("api_key", apiKey);
    url.searchParams.append("query", keyword);
    url.searchParams.append("page", page);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const sortedData = data.results.sort((a, b) => b.popularity - a.popularity);
    async function findRating(id) {
      const out = await db
        .collection("movie")
        .find({ _id: parseInt(id) })
        .toArray();
      console.log("out ", out);
      return await out;
    }
    const results = await Promise.all(
      sortedData.map(async (item, index) => {
        const ratingObj = await findRating(item.id);
        const rating = ratingObj.length ? ratingObj[0].currentRating : "0.0";
        return {
          ...sortedData[index],
          currentRating: rating,
        };
      })
    );
    console.log("resultsd", results);
    return {
      movieDetails: results,
    };
  } catch (error) {
    console.error("Error searching database:", error);
    throw error;
  }
}

async function getMovieDb(params) {
  try {
    console.log(params);
    const { query } = params;
    const db = getDb();
    const result = await db
      .collection("movie_details")
      .find({ genre_ids: parseInt(query) })
      .toArray();
    let cacheExpiry = 3 * 24 * 60 * 60;
    const cachedResults = cache.get(`movie${query}`);
    if (!cachedResults && result) {
      cache.set(`movie${query}`, result, cacheExpiry);
    }
    return cachedResults || result;
  } catch (error) {
    console.error("Error searching database:", error);
    throw error;
  }
}
async function myReviewsDb(params) {
  try {
    console.log(params);
    const db = await getDb();
    const id = params;
    const result = await db
      .collection("reviews")
      .find({ user: parseInt(id) })
      .toArray();
    return result;
  } catch (error) {
    console.error("Error searching database:", error);
    throw error;
  }
}
async function getAllMovie() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`
    );
    const data = await response.json();
    console.log(data.results);
    return data.results;
  } catch (error) {
    return error;
  }
}
async function getAllGenres() {
  try {
    const db = await getDb();
    const result = db.collection("genres").find({}).toArray();
    return result;
  } catch (error) {
    return error;
  }
}
async function getStat() {
  try {
    const db = await getDb();
    const mostRatedMovie = await db
      .collection("movie")
      .find({}, { projection: { movieName: 1, _id: 0 } })
      .sort({ currentRating: -1 })
      .limit(1)
      .toArray();
    const leastRatedMovie = await db
      .collection("movie")
      .find({}, { projection: { movieName: 1, _id: 0 } })
      .sort({ currentRating: 1 })
      .limit(1)
      .toArray();
    console.log("most rated", leastRatedMovie);
    const numberofReviews = await db.collection("reviews").countDocuments({});
    const numberofUsers = await db.collection("users").countDocuments({});
    const Users = await db.collection("users").find({}).limit(3).toArray();
    const recentUsers = Users.map((user) => user.name);
    const data = [
      {
        mostRatedMovie: mostRatedMovie[0].movieName,
        leastRatedMovie: leastRatedMovie[0].movieName,
        numberofReviews,
        numberofUsers,
        recentUsers,
      },
    ];
    return data;
  } catch (error) {
    return error;
  }
}
async function getFullGenresWIthMovie() {
  try {
    const db = await getDb();
    const result = await db
      .collection("genres")
      .aggregate([
        {
          $project: {
            name: 1,
            id: 1,
            movieIds: { $ifNull: ["$movieIds", []] },
          },
        },
        { $unwind: { path: "$movieIds", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "movie_details",
            localField: "movieIds",
            foreignField: "_id",
            as: "movieDetails",
          },
        },
        {
          $group: {
            _id: "$_id",
            id: { $first: "$id" },
            name: { $first: "$name" },
            movieDetails: {
              $push: {
                $cond: {
                  if: { $eq: ["$movieDetails", []] },
                  then: null,
                  else: {
                    id: "$movieIds",
                    title: { $arrayElemAt: ["$movieDetails.title", 0] },
                    desc: { $arrayElemAt: ["$movieDetails.desc", 0] },
                    imageLink: { $arrayElemAt: ["$movieDetails.imageLink", 0] },
                  },
                },
              },
            },
          },
        },
        {
          $sort: { id: 1 },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    return error;
  }
}
async function getGenresWIthMovie() {
  try {
    const genres = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
    );
    const genresData = await genres.json();
    console.log(genresData);
    const topGenreIds = genresData.genres
      .slice(0, 5)
      .map((g, index) => ({ id: g.id, name: g.name, index: index }));
    const movies = [];
    for (const genre of topGenreIds) {
      const moviesRes = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genre.id}`
      );
      movies[genre.index] = {
        name: genre.name,
        result: await moviesRes.json(),
      };
    }
    return movies;
  } catch (error) {
    return error;
  }
}
async function getFullDetailMovieAndReviews(id) {
  try {
    const db = await getDb();
    const movie = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
    );
    console.log(movie);
    const movieDetails = await movie.json();
    const review = await db
      .collection("reviews")
      .find({ movieId: id })
      .toArray();
    const rating = await db
      .collection("movie")
      .find({ _id: parseInt(id) })
      .toArray();
    async function findName(id) {
      const response = await db
        .collection("users")
        .find({ _id: new ObjectId(id) })
        .toArray();
      return response[0].name;
    }
    let namedReview = [];
    for (const data of review) {
      namedReview = [
        {
          ...data,
          userName: await findName(data.userId),
        },
        ...namedReview,
      ];
    }
    const result = {
      movieDetails,
      review: [namedReview],
      rating,
    };
    console.log("result:", result);
    return result;
  } catch (error) {
    console.error(error);
    return error;
  }
}
async function getUsersAndReviews() {
  try {
    const db = await getDb();
    const reviewedUsers = await db
      .collection("users")
      .aggregate([
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "userId",
            as: "userReviews",
          },
        },
        {
          $unwind: {
            path: "$userReviews",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "movie",
            let: { movieIdNum: { $toInt: "$userReviews.movieId" } }, // Convert string to number
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [
                      "$_id", // _id is already a number
                      "$$movieIdNum",
                    ],
                  },
                },
              },
            ],
            as: "userReviews.movieDetails",
          },
        },
        {
          $group: {
            _id: "$_id",
            userName: { $first: "$name" },
            userEmail: { $first: "$email" },
            isBanned: { $first: "$isBanned" },
            userReviews: { $push: "$userReviews" },
          },
        },
        {
          $project: {
            userName: 1,
            userEmail: 1,
            isBanned: 1,
            "userReviews.review": 1,
            "userReviews._id": 1,
            "userReviews.movieDetails._id": 1,
            "userReviews.movieDetails.movieName": 1,
          },
        },
      ])
      .toArray();
    async function fetchReview(userId) {
      console.log("recieved id:", userId);
      const movie = await db.collection("movie");
      const review = await db.collection("review");
      const userReview = await review.find({ userId: userId }).toArray();
      console.log("review", userReview);
    }
    const users = await db.collection("users").find().toArray();
    console.log("users", users);
    function run() {
      Promise.all(
        users.map(async (user) => {
          await fetchReview(user._id);
        })
      );
    }
    run();
    return reviewedUsers;
  } catch (error) {
    console.log(error);
    return error;
  }
}
async function getBannedUsers() {
  try {
    const db = getDb();
    const result = await db
      .collection("users")
      .aggregate([
        {
          $match: {
            isBanned: true,
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    return error;
  }
}
async function isBanned(id) {
  const db = await getDb();
  try {
    const result = await db
      .collection("users")
      .find({ _id: new ObjectId(id) })
      .toArray();
    let isBanned;
    if (result) {
      isBanned = result[0].isBanned || false;
    }
    console.log(result);
    console.log(isBanned);
    return isBanned;
  } catch (error) {
    return error;
  }
}
module.exports = {
  searchDb,
  getMovieDb,
  myReviewsDb,
  getAllMovie,
  getAllGenres,
  getStat,
  getFullGenresWIthMovie,
  getGenresWIthMovie,
  getFullDetailMovieAndReviews,
  getUsersAndReviews,
  getBannedUsers,
  isBanned,
};
