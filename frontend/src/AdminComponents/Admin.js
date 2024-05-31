import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import { useState } from "react";
export default function AdminHome() {
  const [data, setData] = useState([]);
  const [noOfMovies, setNoOfMovies] = useState();
  const [noOfReviews, setNoOfReviews] = useState();
  const [noOfUsers, setNoOfUsers] = useState();
  const [mostRatedMovie, setmostRatedMovie] = useState();
  const [leastRatedMovie, setleastRatedMovie] = useState();
  const [recentUsers, setRecentusers] = useState([]);
  useEffect(() => {
    async function fetchData() {
      await fetch("http://localhost:3001/stats")
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.error(err));
    }
    fetchData();
  }, []);
  if (data[0] && !noOfMovies) {
    setNoOfMovies(data[0].numberofMovies);
    setNoOfReviews(data[0].numberofReviews);
    setNoOfUsers(data[0].numberofUsers);
    setmostRatedMovie(data[0].mostRatedMovie);
    setleastRatedMovie(data[0].leastRatedMovie);
    setRecentusers(data[0].recentUsers);
  }
  let resultString = "";
  for (let i = 0; i < recentUsers.length; i++) {
    resultString += `${i + 1}.${recentUsers[i]} `;
  }
  resultString = resultString.trim();
  const result = [
    {
      title: "Total Movies",
      value: noOfMovies || 0,
    },
    {
      title: "Total Reviews",
      value: noOfReviews || 0,
    },
    {
      title: "Total Users",
      value: noOfUsers || 0,
    },
    {
      title: "Most rated movie",
      value: mostRatedMovie || "No movies available",
    },
    {
      title: "Least rated movie",
      value: leastRatedMovie || "No movies available",
    },
    { title: "Recent Users", value: resultString || "No users available" },
  ];

  return (
    <div className="admin stats">
      <h2>STATS</h2>
      <Grid container className="stats item">
        {result &&
          result.map((e, index) => (
            <Grid item xs={12} sm={4} md={3} gap={4} key={index}>
              <div className="stat item">
                <p className="stat_heading">{e.title}</p>
                <span className="stat_value">{e.value || 0}</span>
              </div>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}
