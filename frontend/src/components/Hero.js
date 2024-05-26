import { useEffect, useState } from "react";
import { useTheme, useMediaQuery, Skeleton } from "@mui/material";
import { FontSize } from "../functions/fontSize";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
export default function Hero() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movieIndex, setmovieIndex] = useState(0);
  const imageUrl = "https://image.tmdb.org/t/p/original";
  useEffect(() => {
    async function fetchData() {
      console.log("started fetch");
      try {
        const response = await fetch("http://localhost:3001/top-movie");
        const data = await response.json();
        setMovies(data);
        console.log("top", data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch", err);
        alert("Failed to fetch");
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    if (movies) {
      console.log(movies);
    }
  }, [movies]);
  function handleIndex(state) {
    console.log(movieIndex);
    if (state === "prev") {
      setmovieIndex(movieIndex - 1);
    } else {
      setmovieIndex(movieIndex + 1);
    }
  }
  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url(${
          loading ? " " : imageUrl + movies[movieIndex].backdrop_path
        })`,
      }}
    >
      <span className="ArrowKeys left">
        <p onClick={() => handleIndex("prev")}>
          {movieIndex >= 1 && <ArrowBackIosIcon fontSize="large" />}
        </p>
      </span>
      <div
        className="hero_content"
        style={{ fontSize: isMobile ? "1em" : "2em" }}
      >
        <h1 style={{ color: loading && "black" }}>
          {loading ? <Skeleton variant="text" /> : movies[movieIndex].title}
        </h1>
        <p>
          {loading ? (
            <>
              {" "}
              <Skeleton variant="text" height={40} />{" "}
              <Skeleton variant="text" height={40} />{" "}
              <Skeleton variant="text" height={40} />{" "}
            </>
          ) : (
            movies[movieIndex].desc
          )}
        </p>
        <div className="rate_buttons">
          <button className="rate" style={{ fontSize: FontSize() }}>
            Rate Now &nbsp;
            <StarHalfIcon fontSize="small" />
          </button>
          <button className="review" style={{ fontSize: FontSize() }}>
            Write a review &nbsp;
            <BorderColorIcon fontSize="small" />
          </button>
        </div>
      </div>
      <span className="ArrowKeys right">
        <p onClick={() => handleIndex("next")}>
          {movieIndex < 4 && <ArrowForwardIosIcon fontSize="large" />}
        </p>
      </span>
    </div>
  );
}
