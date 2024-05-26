const { getDb } = require("./db");
const { ObjectId } = require("mongodb");
const nodeCache = require("node-cache");

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
async function topFetch() {
  try {
    const db = await getDb();
    const result = await db
      .collection("top5")
      .aggregate([
        {
          $match: { _id: new ObjectId("664b68750c2cefd8aa192f4d") },
        },
        {
          $unwind: "$top5",
        },
        {
          $lookup: {
            from: "movie_details",
            localField: "top5",
            foreignField: "id",
            as: "movieDetails",
          },
        },
        {
          $unwind: "$movieDetails",
        },
        {
          $project: {
            _id: 0,
            movieId: "$top5",
            title: "$movieDetails.title",
            desc: "$movieDetails.desc",
            genre_ids: "$movieDetails.genre_ids",
          },
        },
      ])
      .toArray();
    let cacheExpiry = 24 * 60 * 60;
    const cachedResults = cache.get("top5");
    if (!cachedResults && result) {
      cache.set("top5", result, cacheExpiry);
    }
    return cachedResults || result;
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
            genre_ids: { $push: { id: "$genre_ids", name: "$genres.name" } },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            desc: 1,
            genre_ids: 1,
          },
        },
      ])
      .toArray();
    console.log(result);
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
    const data = [
      {
        mostRatedMovie: mostRatedMovie[0].title,
        leastRatedMovie: leastRatedMovie[0].title,
        numberofReviews,
        numberofUsers,
        numberofMovies,
      },
    ];
    return data;
  } catch (error) {
    return error;
  }
}
module.exports = {
  searchDb,
  topFetch,
  getMovieDb,
  myReviewsDb,
  getAllMovie,
  getAllGenres,
  getStat,
};
