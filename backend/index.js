const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const { connectDb } = require("./db");
const {
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
} = require("./getFunctions");
const {
  addMovieDb,
  addReview,
  manipulateReview,
  eliminate,
  editMovie,
  createGenre,
  addUser,
  loginUser,
  loginAdmin,
  addRating,
  unBanUser,
} = require("./postFunctions");
const { deleteMovie, deleteReview, banUser } = require("./deleteFunctions");
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
    res.status(500).send({
      message: "An error occurred while searching the database",
      error: error,
    });
  }
});

app.get("/get-movies-all", async (req, res) => {
  const result = await isBanned(req.query.user);
  if (result) return res.status(403).json({ isBanned: true });
  try {
    const movieResult = await getAllMovie();
    res.json(movieResult);
  } catch (error) {
    console.log(error);
    res.status(500).send({
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
    res.status(500).send({
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
    res.status(500).send({
      message: "An error occurred while searching the database for the genres",
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
    res.status(500).send({
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
    res.status(500).send({
      message: "An error occurred while editing the movie on the database",
      error: error,
    });
  }
});
app.post("/add-review", async (req, res) => {
  try {
    console.log(req.body);
    await addReview(req.body);
    res
      .status(200)
      .send({ message: "Review added successfully", data: req.body });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "An error occurred while adding reviews to the database",
      error: error,
    });
  }
});
app.post("/edit-review/:id", async (req, res) => {
  try {
    const requestData = {
      id: req.params.id,
      review: req.body.review,
    };
    console.log(requestData);
    const response = await manipulateReview((data = requestData));
    console.log(response);
    res
      .status(200)
      .send({ message: "Movie added successfully", data: req.body });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
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
app.post("/add-rating", async (req, res) => {
  try {
    const result = await addRating(req.body);
    console.log(result);
    res
      .status(200)
      .send({ message: "Rating added successfully", data: result.insertedId });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "An error occurred while adding ratings to the database",
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
    res.status(500).send({
      message: "An error occurred while fetching user reviews",
      error: error,
    });
  }
});
app.get("/stats", async (req, res) => {
  try {
    const result = await getStat();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "An error occurred while fetching stats from server",
      error: error,
    });
  }
});
app.get("/genres-with-movie", async (req, res) => {
  try {
    const data = await getFullGenresWIthMovie();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message:
        "An error occurred while fetching genres with movies from server",
      error: error,
    });
  }
});
app.get("/genres-with-full-movie", async (req, res) => {
  try {
    const data = await getGenresWIthMovie();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message:
        "An error occurred while fetching genres with movies from server",
      error: error,
    });
  }
});
app.post("/add-genre", async (req, res) => {
  try {
    const result = await createGenre(req.body);
    res
      .status(200)
      .send({ message: "Genre added successfully", result: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "An error occurred while adding genres to the database",
      error: error,
    });
  }
});
app.post("/signup", async (req, res) => {
  try {
    const result = await addUser(req.body);
    if (result) {
      res.status(200).json({ message: "Success", result: result });
    } else {
      res.status(404).json({
        message: "User already exists with this email",
        result: result,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "An error occurred while adding user to the database",
      error: error,
    });
  }
});
app.post("/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);
    console.log(result);
    if (result == "You are banned by the administrator") {
      res.status(403).json({ message: result, ok: false });
    } else if (result) {
      res.status(200).json({ message: "Success", result: result });
    } else {
      res.status(404).json({ message: "Invalid Credentials", result: result });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "An error occurred while logging in",
      error: error,
    });
  }
});
app.post("/admin-login", async (req, res) => {
  try {
    const result = await loginAdmin(req.body);
    res.status(200).send({ message: "Success", result: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "An error occurred while logging.",
      error: error,
    });
  }
});
app.delete("/delete-movie/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const result = await deleteMovie(id);
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Movie deleted successfully" });
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
app.delete("/delete-review/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const result = await deleteReview(id);
    console.log(" deletion result", result);
    if (result.modifiedCount === 1) {
      res.status(200).json({ message: "Movie deleted successfully" });
    } else {
      res.status(404).json({ message: "Movie not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
    console.log("error in endpoints", error);
  }
});
app.get("/movie-details/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const result = await getFullDetailMovieAndReviews(id);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "failed to get movie details", error: error });
  }
});
app.get("/get-users-and-reviews", async (req, res) => {
  try {
    const result = await getUsersAndReviews();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "An error occurred while fetching users and reviews",
      error: error,
    });
  }
});
app.delete("/ban-user", async (req, res) => {
  try {
    const result = await banUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "An error occurred while fetching users and reviews",
      error: error,
    });
  }
});
app.post("/unban-user", async (req, res) => {
  try {
    const result = await unBanUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({
      message: "An error occurred while fetching users and reviews",
      error: error,
    });
  }
});
app.get("/test", async (req, res) => {
  try {
    const result = await getBannedUsers();
    // const result = await fetch("http://localhost:3001/review", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     user: "6656bf8f6dfe2117334dda54",
    //     text: "Checking review",
    //   }),
    // });
    res.json(result);
  } catch (error) {
    console.log("error", error);
  }
});
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
