import { useEffect, useState, useContext } from "react";
import { useTheme, useMediaQuery, Skeleton } from "@mui/material";
import { FontSize } from "../functions/fontSize";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { AuthContext } from "../functions/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Hero() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [movieIndex, setmovieIndex] = useState(0);
  const { uid, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const baseUrl = "https://moviereview-8vcv.onrender.com/get-movies-all";
  const url = uid ? `${baseUrl}?user=${uid}` : baseUrl;
  const imageUrl =
    "https://firebasestorage.googleapis.com/v0/b/entri-projects.appspot.com/o/";
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.isBanned) {
          alert("You are banned by the admin");
          logout();
        } else if (data[0]) {
          setLoading(false);
          setMovies(data);
        }
      } catch (err) {
        console.error("Failed to fetch", err);
        alert("Failed to fetch");
      }
    }
    fetchData();
  }, [logout, uid, url]);
  function handleIndex(state) {
    if (state === "prev") {
      setmovieIndex(movieIndex - 1);
    } else {
      setmovieIndex(movieIndex + 1);
    }
  }
  const redirect = (index) => {
    const id = movies[index]._id;
    navigate(`/movie/${id}`);
  };
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
        <h1 style={{ color: loading && "black" }}>
          {loading ? <Skeleton variant="text" /> : movies[movieIndex].title}
        </h1>
        <p>
          {loading ? (
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
          <button
            className="rate"
            style={{ fontSize: FontSize() }}
            onClick={() => redirect(movieIndex)}
          >
            Rate Now &nbsp;
            <StarHalfIcon fontSize="small" />
          </button>
          <button
            className="review"
            style={{ fontSize: FontSize() }}
            onClick={() => redirect(movieIndex)}
          >
            Write a review &nbsp;
            <BorderColorIcon fontSize="small" />
          </button>
        </div>
      </div>
      <span className="ArrowKeys right">
        <p onClick={() => handleIndex("next")}>
          {movieIndex < movies.length - 1 && (
            <ArrowForwardIosIcon fontSize="large" />
          )}
        </p>
      </span>
    </div>
  );
}
