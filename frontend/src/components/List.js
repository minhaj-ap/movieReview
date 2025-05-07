import React, { useContext, useEffect, useState } from "react";
import MovieList from "./subComponets/movieList";
import { ThemeContext } from "../functions/ThemeContext";
import { toast } from "react-toastify";
export default function List() {
  const { theme } = useContext(ThemeContext);
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/genres-with-full-movie`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Failed to fetch movies");
        }
        setMovies(data);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
    fetchData();
  }, []);
  return (
    <div className={`${theme} list-container`}>
      {movies.map((e, index) => {
        console.log(e);
        return <MovieList props={e} key={index} />;
      })}
    </div>
  );
}
