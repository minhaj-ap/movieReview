const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDb, getDb } = require("./db");
require("dotenv").config();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
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
    const ids = await db.collection("top5").find({}).toArray();
    const id = ids[0].top5;
    const result = await db
      .collection("movie_details")
      .find({ id: { $in: id } })
      .toArray();
    return res.json(result);
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
    console.log(result);
    res.json(result);
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
