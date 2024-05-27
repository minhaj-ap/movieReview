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
  const imageUrl =
    "https://firebasestorage.googleapis.com/v0/b/entri-projects.appspot.com/o/";
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3001/get-movies-all");
        const data = await response.json();
        if (data[0]) {
          setLoading(false);
          setMovies(data);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
        alert("Failed to fetch");
      }
    }
    fetchData();
  }, []);
  function handleIndex(state) {
    if (state === "prev") {
      setmovieIndex(movieIndex - 1);
    } else {
      setmovieIndex(movieIndex + 1);
    }
  }
  console.log(movies.length);
  console.log(!movies.length);
  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url(${
          loading ? " " : imageUrl + movies[movieIndex].imageLink
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
        {!movies.length && (
          <p style={{ maxHeight: "max-content", fontSize: "2rem" }}>
            We are on production stage. Movies will be added soon...
          </p>
        )}
        <h1 style={{ color: loading && "black" }}>
          {!0 && loading ? (
            <Skeleton variant="text" />
          ) : (
            movies[movieIndex].title
          )}
        </h1>
        <p>
          {!movies.length && loading ? (
            <>
              {" "}
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
