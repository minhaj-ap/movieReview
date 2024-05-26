import { useState, useEffect, useContext } from "react";
import { Skeleton } from "@mui/material";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { ThemeContext } from "../../functions/ThemeContext";
export default function MovieList({ title, genre }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:3001/get-movies?query=${genre}`
        );
        const data = await response.json();
        setMovies(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    }
    fetchData();
  }, [genre]);
  return (
    <>
      <h2>{title}</h2>{" "}
      <div className="list">
        {isLoading ? (
          <div className="list_skelton">
            <Skeleton
              variant="rectangular"
              width={170}
              height={230}
              sx={{ backgroundColor: "grey.900" }}
            />
            <Skeleton sx={{ backgroundColor: "grey.900" }} />
            <Skeleton sx={{ backgroundColor: "grey.900" }} />
          </div>
        ) : (
          movies &&
          movies.map((e) => (
            <div className={`${theme} list_item`} key={e.id}>
              <div>
                <img
                  src={`https://image.tmdb.org/t/p/w154/${e.poster_path}`}
                  alt=""
                />
              </div>
              <div className="list_content">
                <h3>{e.title}</h3>
                <h6>{e.release_date}</h6>
              </div>
              <div>
                <button className={theme}>
                  Rate Now
                  <StarHalfIcon fontSize="small" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
