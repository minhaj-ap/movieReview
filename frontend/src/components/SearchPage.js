import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Header from "./Header";
import MovieShowcase from "../MovieShowCase";
import { ThemeContext } from "../functions/ThemeContext";
export default function SearchPage() {
  const { key } = useParams();
  const [data, setData] = useState([]);
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    const baseUrl = "https://moviereview-8vcv.onrender.com/search";
    const url = `${baseUrl}?query=${encodeURIComponent(key)}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert(error.message);
      });
  }, [key]);

  return (
    <div>
      {" "}
      <Header inLink={true} />
      <div className={`search_page ${theme}`}>
        <div className="search_key">
          <p>Search results for :&nbsp;</p>
          <h3>{key}</h3>
        </div>
        {data.length ? (
          data.map((e, index) => (
            <MovieShowcase e={e} isAdmin={false} isSearch key={index} />
          ))
        ) : (
          <div className="no_search_result">
          <strong>NO MOVIES MATCH YOUR RESULT</strong></div>
        )}
      </div>
    </div>
  );
}
