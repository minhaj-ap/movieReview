import React, { useContext, useEffect, useState } from "react";
import MovieList from "./subComponets/movieList";
import { ThemeContext } from "../functions/ThemeContext";
export default function List() {
  const { theme } = useContext(ThemeContext);
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://moviereview-8vcv.onrender.com/genres-with-full-movie`
        );
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }
    fetchData();
  }, []);
  return (
    <div className={`${theme} list-container`}>
      {movies.map((e, index) => (
        <MovieList props={e} key={index} />
      ))}
    </div>
  );
}
