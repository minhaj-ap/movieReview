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
    res.json(movies);
  } catch (error) {
    res.status(500).send(error);
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
    const cachedResults = cache.get("top5");
    if (!cachedResults && result) {
      cache.set("top5", result, cacheExpiry);
    }
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
    const cachedResults = cache.get(`movie${query}`);
    if (!cachedResults && result) {
      cache.set(`movie${query}`, result, cacheExpiry);
    }
    return res.json(cachedResults || result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
    console.log("error fetching data", error);
  }
});
app.post("/add-movie", async (req, res) => {
  try {
    const db = await getDb();
    const movie = req.body;
    console.log("movie", movie);
    await db.collection("movie_details").insertOne(movie);
    res.status(200).send("OK");
  } catch (error) {
    res.status(400).json({ error });
  }
});
app.post("/review", async (req, res) => {
  try {
    const db = await getDb();
    const movieId = parseInt(req.query.movieId);
    const user = parseInt(req.query.uid);
    const likes = parseInt(req.query.likes);
    const text = decodeURIComponent(req.query.text);
    if (!movieId || !user || !likes || !text) {
      res.status(400).send("no sufficient parameters");
    }
    const review = {
      movieId,
      user,
      text,
      likes,
      date: new Date(),
    };
    await db.collection("reviews").insertOne(review);
    res.status(201).send("success");
  } catch (error) {
    res.status(400).json({ error });
  }
});
app.post("/like-review/:id", async (req, res) => {
  try {
    const db = await getDb();
    const id = req.params.id;
    if (!id) {
      res.status(400).send("no sufficient parameters");
    }
    const result = await db
      .collection("reviews")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $inc: { likes: 1 } },
        { returnOriginal: false }
      );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.post("/edit-review/:id", async (req, res) => {
  try {
    const db = await getDb();
    const id = req.params.id;
    const newText = req.body.text;
    if (!id) {
      res.status(400).send("no sufficient parameters");
    }
    const result = await db
      .collection("reviews")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { text: newText } },
        { returnOriginal: false }
      );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
app.post("/set-top-movie", async (req, res) => {
  try {
    const order = req.body;
    const db = await getDb();
    console.log(order.numbers);
    if (!order) {
      res.status(400).send("No order provided");
      return;
    }
    await db
      .collection("top5")
      .updateOne({}, { $set: { top5: order.numbers } });
    res.status(200).send("OK");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.get("/my-reviews/:id", async (req, res) => {
  try {
    const db = await getDb();
    const id = req.params.id;
    const result = await db
      .collection("reviews")
      .find({ user: parseInt(id) })
      .toArray();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
