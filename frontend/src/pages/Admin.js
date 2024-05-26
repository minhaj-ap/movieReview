import Grid from "@mui/material/Grid";
export default function AdminPage() {
  const data = [
    {
      name: "Total Reviews",
      value: 34,
    },
    {
      name: "Total Users",
      value: 34,
    },
    {
      name: "Most rated movie",
      value: "SpiderMan ",
    },
    { name: "Least rated movie", value: "Batman" },
  ];
  return (
    <div className="admin stats">
      <h2>STATS</h2>
      <Grid container className="stats item">
        {data.map((e) => (
          <Grid item xs={12} sm={4} md={3} gap={4}>
            <div className="stat item">
              <p className="stat_heading">{e.name}</p>
              <span className="stat_value">{e.value}</span>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
