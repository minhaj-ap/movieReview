import Grid from "@mui/material/Grid";
import { useEffect } from "react";
import { useState } from "react";
export default function AdminPage() {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      await fetch("http://localhost:3001/stats")
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((err) => console.log(err));
    }
    fetchData();
  }, []);
  console.log(data);
  let result;
  if (data[0]) {
    result = [
      {
        title: "Total Movies",
        value: data[0].numberofMovies,
      },
      {
        title: "Total Reviews",
        value: data[0].numberofReviews,
      },
      {
        title: "Total Users",
        value: data[0].numberofUsers,
      },
      {
        title: "Most rated movie",
        value: data[0].mostRatedMovie,
      },
      {
        title: "Least rated movie",
        value: data[0].leastRatedMovie,
      },
    ];
  }

  return (
    <div className="admin stats">
      <h2>STATS</h2>
      <Grid container className="stats item">
        {result &&
          result.map((e) => (
            <Grid item xs={12} sm={4} md={3} gap={4}>
              <div className="stat item">
                <p className="stat_heading">{e.title}</p>
                <span className="stat_value">{e.value}</span>
              </div>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}
