const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();
const PORT = 3001;
require("dotenv").config();

app.use(cors());
// Define a route to fetch movies

const apiKey = process.env.TMDB_API;
app.get("/search", async (req, res) => {
  try {
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
app.get("/top-movie", async (req, res) => {
  const trendingUrl = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}`;
  // Fetch trending movies
  try {
    const response = await fetch(trendingUrl);
    const data = await response.json();
    // Get the top 5 trending movies
    const top5TrendingMovies = data.results.slice(0, 5);
    // console.log('Top 5 Trending Movies:', top5TrendingMovies);
    res.json(top5TrendingMovies);
  } catch (error) {
    res.status(500).json({ error: "error fetching data" });
    console.error("Error fetching trending movies:", error);
  }
});
app.get("/get-movies", async (req, res) => {
  try {
    const { query } = req.query;
    const fetchingUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${query}&page=1`;
    const response = await fetch(fetchingUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
    console.log("error fetching data", error);
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
