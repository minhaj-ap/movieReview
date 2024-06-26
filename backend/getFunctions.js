const { getDb } = require("./db");
const { ObjectId } = require("mongodb");
const nodeCache = require("node-cache");
const bcrypt = require("bcrypt");
const cache = new nodeCache({ stdTTL: 0, checkperiod: 60 });
async function searchDb(params) {
  try {
    const db = await getDb();
    const keyword = params.query;
    if (!keyword) {
      return "No keyword provided";
    }
    const regex = new RegExp(keyword, "i");
    const result = await db
      .collection("movie_details")
      .find({ title: regex })
      .toArray();
    return result.length ? result : [];
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
    const db = await getDb();
    const result = await db
      .collection("movie_details")
      .aggregate([
        { $unwind: "$genre_ids" },
        {
          $lookup: {
            from: "genres",
            localField: "genre_ids",
            foreignField: "id",
            as: "genres",
          },
        },
        { $unwind: "$genres" },
        {
          $group: {
            _id: "$_id",
            title: { $first: "$title" },
            desc: { $first: "$desc" },
            imageLink: { $first: "$imageLink" },
            genre_ids: { $push: { id: "$genre_ids", name: "$genres.name" } },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            desc: 1,
            imageLink: 1,
            genre_ids: 1,
          },
        },
      ])
      .toArray();
    return result;
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
      .collection("movie_details")
      .find({}, { projection: { title: 1, _id: 0 } })
      .sort({ currentRating: -1 })
      .limit(1)
      .toArray();
    const leastRatedMovie = await db
      .collection("movie_details")
      .find({}, { projection: { title: 1, _id: 0 } })
      .sort({ currentRating: 1 })
      .limit(1)
      .toArray();
    const numberofReviews = await db.collection("reviews").countDocuments({});
    const numberofUsers = await db.collection("users").countDocuments({});
    const numberofMovies = await db
      .collection("movie_details")
      .countDocuments({});
    const Users = await db.collection("users").find({}).limit(3).toArray();
    const recentUsers = Users.map((user) => user.name);
    const data = [
      {
        mostRatedMovie: mostRatedMovie[0].title,
        leastRatedMovie: leastRatedMovie[0].title,
        numberofReviews,
        numberofUsers,
        numberofMovies,
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
    const db = await getDb();
    const result = await db
      .collection("genres")
      .aggregate([
        {
          $match: {
            movieIds: { $exists: true, $ne: [] }, // Ensure movieIds exists and is not empty
          },
        },
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
                id: "$movieIds",
                title: { $arrayElemAt: ["$movieDetails.title", 0] },
                desc: { $arrayElemAt: ["$movieDetails.desc", 0] },
                imageLink: { $arrayElemAt: ["$movieDetails.imageLink", 0] },
                currentRating: {
                  $arrayElemAt: ["$movieDetails.currentRating", 0],
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
async function getFullDetailMovieAndReviews(id) {
  try {
    const db = getDb();
    await db.collection("movie_details").updateMany({}, [
      {
        $set: {
          reviewIds: {
            $map: {
              input: "$reviewIds",
              as: "id",
              in: { $toObjectId: "$$id" },
            },
          },
        },
      },
    ]);
    await db.collection("reviews").updateMany({}, [
      {
        $set: {
          userId: { $toObjectId: "$userId" },
        },
      },
    ]);
    const result = await db
      .collection("movie_details")
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "genres",
            localField: "genre_ids",
            foreignField: "id",
            as: "genreDetails",
          },
        },
        {
          $lookup: {
            from: "reviews",
            localField: "reviewIds",
            foreignField: "_id",
            as: "reviewDetails",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "reviewDetails.userId",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        {
          $addFields: {
            combinedReviews: {
              $map: {
                input: "$reviewDetails",
                as: "review",
                in: {
                  review: "$$review.review",
                  userId: "$$review.userId",
                  date: "$$review.date",
                  _id: "$$review._id",
                  userName: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$userDetails",
                          as: "user",
                          cond: { $eq: ["$$user._id", "$$review.userId"] },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            desc: 1,
            imageLink: 1,
            currentRating: 1,
            NoOfRatings: 1,
            ratings: 1,
            "genreDetails.id": 1,
            "genreDetails.name": 1,
            combinedReviews: {
              review: 1,
              userId: 1,
              date: 1,
              _id: 1,
              "userName.name": 1,
            },
          },
        },
        {
          $addFields: {
            combinedReviews: {
              $map: {
                input: "$combinedReviews",
                as: "cr",
                in: {
                  review: "$$cr.review",
                  userId: "$$cr.userId",
                  _id: "$$cr._id",
                  userName: "$$cr.userName.name",
                },
              },
            },
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
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
            from: "movie_details",
            localField: "userReviews._id",
            foreignField: "reviewIds",
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
          $project:{
            userName:1,
            userEmail:1,
            isBanned:1,
            "userReviews.review":1,
            "userReviews._id":1,
            "userReviews.movieDetails._id":1,
            "userReviews.movieDetails.title":1,
          }
        }
      ])
      .toArray();
    return reviewedUsers;
  } catch (error) {
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
    const result = await db.collection("users").find({ _id: new ObjectId(id) }).toArray()
    let isBanned;
    if (result) {
      isBanned = result[0].isBanned || false;
    }
    console.log(result)
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
