import { useState, useEffect } from "react";
import { Skeleton } from "@mui/material";
export default function MovieList({ title, genre }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:3001/get-movies?query=${genre}`
        );
        const data = await response.json();
        console.log(data);
        setMovies(data.results);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    }
    fetchData();
  }, [genre]);
  console.log(movies);
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
            <div className="list_item">
              <div>
                <img
                  src={`https://image.tmdb.org/t/p/w154/${e.poster_path}`}
                  alt=""
                />
              </div>
              <div>
                <h3>{e.title}</h3>
                <h6>{e.release_date}</h6>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
