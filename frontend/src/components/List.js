import React, { useContext } from "react";
import MovieList from "./subComponets/movieList";
import { ThemeContext } from "../functions/ThemeContext";
export default function List() {
  const { theme } = useContext(ThemeContext);
  function movieList() {
    const titles = [
      { title: "Comedy", id: 35 },
      { title: "Action", id: 28 },
      { title: "Mystery", id: 9648 },
      { title: "Romance", id: 10749 },
    ];
    return (
      <div className={`${theme} list-container`}>
        {titles.map((e) => (
          <MovieList title={e.title} genre={e.id} key={e.id} />
        ))}
      </div>
    );
  }
  return movieList();
}
