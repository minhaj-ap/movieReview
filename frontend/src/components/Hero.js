import { useEffect, useState } from "react";
import { useTheme, useMediaQuery, Icon } from "@mui/material";
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
      const response = await fetch("http://localhost:3001/top-movie");
      const data = await response.json();
      setMovies(data);
      console.log(data);
      setLoading(false);
    }
    fetchData();
  }, []);
  // useEffect(() => {
  //   if (movies) {
  //     console.log(movies);
  //   }
  // }, [movies]);
  return (
      <div
        className="hero"
        style={{
          backgroundImage:
            "url(https://image.tmdb.org/t/p/w1280/lLh39Th5plbrQgbQ4zyIULsd0Pp.jpg)",
        }}
      >
      <div
        className="hero_content"
        style={{ fontSize: isMobile ? "1em" : "2em" }}
      >
        <h1>Godzilla x Kong: The New Empire</h1>
        <p>
          Following their explosive showdown, Godzilla and Kong must reunite
          against a colossal undiscovered threat hidden within our world,
          challenging their very existence – and our own.
        </p>
      </div>
    </div>
  );
}
