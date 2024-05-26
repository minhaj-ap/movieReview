const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { connectDb } = require("./db");
const {
  searchDb,
  topFetch,
  getMovieDb,
  myReviewsDb,
  getAllMovie,
  getAllGenres,
} = require("./getFunctions");
const {
  addMovieDb,
  addReview,
  manipulateReview,
  setTopMovieDb,
  eliminate,
  editMovie,
} = require("./postFunctions");
require("dotenv").config();
const app = express();
const PORT = 3001;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.get("/search", async (req, res) => {
  try {
    const searchResult = await searchDb(req.query);
    res.json(searchResult);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({
        message: "An error occurred while searching the database",
        error: error,
      });
  }
});
app.get("/top-movie", async (req, res) => {
  try {
    const topResult = await topFetch();
    res.json(topResult);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({ message: "An error occurred while fetching Top5", error: error });
  }
});
app.get("/get-movies-all", async (req, res) => {
  try {
    const movieResult = await getAllMovie();
    res.json(movieResult);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: "An error occurred while fetching Movies",
        error: error,
      });
  }
});
app.get("/get-all-genres", async (req, res) => {
  try {
    const result = await getAllGenres();
    res.json(result);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: "An error occurred while fetching Movies",
        error: error,
      });
  }
});
app.get("/get-movies-genre", async (req, res) => {
  try {
    const movieResult = await getMovieDb(req.query);
    res.json(movieResult);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({
        message:
          "An error occurred while searching the database for the genres",
        error: error,
      });
  }
});
app.post("/add-movie", async (req, res) => {
  try {
    const result = await addMovieDb(req.body);
    console.log(result.insertedId);
    res
      .status(200)
      .send({ message: "Movie added successfully", data: result.insertedId });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({
        message: "An error occurred while adding movies to the database",
        error: error,
      });
  }
});
app.post("/edit-movie", async (req, res) => {
  try {
    await editMovie(req.body);
    res.status(200).send({ message: "Movie edited successfully" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({
        message: "An error occurred while editing the movie on the database",
        error: error,
      });
  }
});
app.post("/review", async (req, res) => {
  try {
    await addReview(req.body);
    res
      .status(200)
      .send({ message: "Movie added successfully", data: req.body });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({
        message: "An error occurred while adding reviews to the database",
        error: error,
      });
  }
});
app.post("/review/:type/:id", async (req, res) => {
  try {
    const requestData = {
      id: req.params.id,
      text: req.body.text,
    };
    await manipulateReview((type = req.params.type), (data = requestData));
    res
      .status(200)
      .send({ message: "Movie added successfully", data: req.body });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({
        message: "An error occurred while manipulating the review",
        error: error,
      });
  }
});
app.post("/delete/:type", async (req) => {
  try {
    const type = req.params.type;
    await eliminate(req.body, type);
    res
      .status(200)
      .send({ message: "Movie added successfully", data: req.body });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "An error occurred while deleting", error: error });
  }
});

app.post("/set-top-movie", async (req, res) => {
  try {
    await setTopMovieDb(req.body);
    res
      .status(200)
      .send({ message: "Movie added successfully", data: req.body });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "An error occurred while setting top movies",
      error: error,
    });
  }
});
app.get("/my-reviews/:id", async (req, res) => {
  try {
    const reviews = await myReviewsDb(req.params.id);
    res.json(reviews);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .send({
        message: "An error occurred while fetching user reviews",
        error: error,
      });
  }
});
app.get("/test", (req, res) => {
  fetch("http://localhost:3001/delete/review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: "664bf7ddaca2dbad0f129827",
    }),
  });
});
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
