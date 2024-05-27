import { Outlet, Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
export default function AdminBody() {
  return (
    <>
      <header className="admin header">
        <h1>DASHBOARD</h1>
      </header>
      <main className="page_admin">
        <Outlet />
      </main>
      <footer className="admin footer">
        <div>
          <h3>Links</h3>
          <div className="footer_actions">
            <Grid container gap={1}>
              <Grid item xs={12} sm={4} md={3} className="footer_link">
                <Link to="/admin">
                  <p>/</p>
                </Link>
              </Grid>
              <Grid item xs={12} sm={4} md={3} className="footer_link">
                <Link to="/admin/your-movies">
                  <p>/your-movies</p>
                </Link>
              </Grid>
              <Grid item xs={12} sm={4} md={3} className="footer_link">
                <Link to="/admin/your-genres">
                  <p>/your-genres</p>
                </Link>
              </Grid>
              <Grid item xs={12} sm={4} md={3} className="footer_link">
                <Link to="/admin/users-and-reviews">
                  <p>/users-and-reviews</p>
                </Link>
              </Grid>
            </Grid>
          </div>
        </div>
      </footer>
    </>
  );
}
