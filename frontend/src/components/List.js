import React from "react";
import MovieList from "./subComponets/movieList";
export default function List() {
  function movieList() {
    const titles = [
      { title: "Comedy", id: 35 },
      { title: "Action", id: 28 },
      { title: "Mystery", id: 9648 },
      { title: "Romance", id: 10749 },
    ];
    return (
      <div className="list-container">
        {titles.map((e) => (
          <MovieList title={e.title} genre={e.id} />
        ))}
      </div>
    );
  }
  return movieList();
}
