const express = require("express");
const nodeCache = require("node-cache");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
const cache = new nodeCache({ stdTTL: 0, checkperiod: 60 });
app.get("/search", async (req, res) => {
  try {
    const keyword = req.query.q;
    if (!keyword) {
      return res.status(400).send("No keyword provided");
    }
    const db = getDb();
    const regex = await RegExp(keyword, "i");
    const result = await db.collection("movie_details").find({}).toArray();
    console.log(result);
    if (!result) {
      return res.json();
    }
    const movies = result.filter((movie) => {
      return regex.test(movie.title);
    });
    console.log(movies);
    res.json(movies);
  } catch (error) {
    console.log(error);
  }
});
app.get("/top-movie", async (req, res) => {
  try {
    const db = getDb();
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
    if (result) {
      cache.set("top5", result, cacheExpiry);
    }
    const cachedResults = cache.get("top5");
    console.log(cache.getStats());
    return res.json(cachedResults || result);
  } catch (error) {
    res.status(500).json({ error: "error fetching data" });
    console.error("Error fetching trending movies:", error);
  }
});
app.get("/get-movies", async (req, res) => {
  try {
    const { query } = req.query;
    const db = getDb();
    const result = await db
      .collection("movie_details")
      .find({ genre_ids: parseInt(query) })
      .toArray();
    let cacheExpiry = 3 * 24 * 60 * 60;
    if (result) {
      cache.set(`movie${query}`, result, cacheExpiry);
    }
    console.log(cache.keys());
    const cachedResults = cache.get(`movie${query}`);
    return res.json(cachedResults || result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
    console.log("error fetching data", error);
  }
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
