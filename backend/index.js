const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = 3001;

app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from the React app's origin
  })
);
// Define a route to fetch movies

app.get("/movies", async (req, res) => {
  try {
    const apiKey = "d9fdf3dc87ba0c9297001381d0a1df80";
    const { query } = req.query;
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?sort_by=popularity.desc&api_key=${apiKey}&query=${encodeURIComponent(
        query
      )}`
    );
    const movies = response.data.results;
    movies.sort((a, b) => b.popularity - a.popularity);
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Error fetching movies" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
