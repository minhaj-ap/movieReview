import Grid from "@mui/material/Grid";
import { useEffect, useState, useContext } from "react";
import { AdminThemeContext } from "../functions/AdminThemeContext";
export default function AdminHome() {
  const [noOfReviews, setNoOfReviews] = useState();
  const [noOfUsers, setNoOfUsers] = useState();
  const [mostRatedMovie, setmostRatedMovie] = useState();
  const [leastRatedMovie, setleastRatedMovie] = useState();
  const [recentUsers, setRecentusers] = useState([]);
  const { admin_theme } = useContext(AdminThemeContext);
  useEffect(() => {
    async function fetchData() {
      await fetch(`${process.env.REACT_APP_SERVER_URL}/stats`)
        .then((res) => res.json())
        .then((data) => {
          setNoOfReviews(data[0].numberofReviews);
          setNoOfUsers(data[0].numberofUsers);
          setmostRatedMovie(data[0].mostRated);
          setleastRatedMovie(data[0].leastRated);
          setRecentusers(data[0].recentUsers);
        })
        .catch((err) => {
          alert(err.message);
          console.error(err);
        });
    }
    fetchData();
  }, []);
  let resultString = "";
  for (let i = 0; i < recentUsers.length; i++) {
    resultString += `${i + 1}.${recentUsers[i]} `;
  }
  resultString = resultString.trim();
  const result = [
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
  console.log(result);
  return (
    <div className={`admin stats ${admin_theme}`}>
      <h2>STATS</h2>
      <Grid container className="stats item">
        {result &&
          result.map((e, index) => (
            <Grid item xs={12} sm={4} md={3} gap={4} key={index}>
              <div className="stat item">
                <p className={`stat_heading ${admin_theme}`}>{e.title}</p>
                <span className={`stat_value ${admin_theme}`}>
                  {e.value || 0}
                </span>
              </div>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}
