import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Header from "./Header";
import MovieShowcase from "../MovieShowCase";
import { ThemeContext } from "../functions/ThemeContext";
import { toast } from "react-toastify";
export default function SearchPage() {
  const { key } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    const baseUrl = `${process.env.REACT_APP_SERVER_URL}/search`;
    const url = `${baseUrl}?query=${encodeURIComponent(key)}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        toast.error(error.message);
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
        {!loading ? (
          data.movieDetails.length ? (
            data.movieDetails.map((e, index) => (
              <MovieShowcase data={e} isAdmin={false} isSearch key={index} />
            ))
          ) : (
            <div className="no_search_result">
              <strong>NO MOVIES MATCH YOUR RESULT</strong>
            </div>
          )
        ) : (
          <div className="no_search_result">
            <h3>Loading....</h3>
          </div>
        )}
      </div>
    </div>
  );
}
