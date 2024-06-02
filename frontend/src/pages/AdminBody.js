import { Outlet, Link } from "react-router-dom";
import { Grid, IconButton, Menu, MenuItem, Button } from "@mui/material";
import { useContext, useState } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { AdminAuthContext } from "../functions/AdminAuthContext";
import { AdminThemeContext } from "../functions/AdminThemeContext";
export default function AdminBody() {
  const [isDark, setisDark] = useState(false);
  const { toggleAdminTheme, admin_theme } = useContext(AdminThemeContext);
  const { adminLogout } = useContext(AdminAuthContext);
  const [anchorEl, setAnchorEl] = useState(null);

  function handleLogout() {
    adminLogout();
  }
  function handleMode() {
    toggleAdminTheme();
    setisDark((prev) => !prev);
  }
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <header className={`${admin_theme} admin header`}>
        <div style={{ flexGrow: "1", textAlign: "center" }}>
          <h1>DASHBOARD</h1>
        </div>
        <div style={{ minWidth: "20%" }}>
          <IconButton onClick={handleMode} className={`themeToggler admin ${admin_theme}`}>
            {isDark ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
          <IconButton onClick={handleMenu} className={`accountIcon admin ${admin_theme}`}>
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem>
              <Button
                variant="text"
                color="primary"
                onClick={() => handleLogout}
              >
                Logout
              </Button>
            </MenuItem>
          </Menu>
        </div>
      </header>
      <main className={`page_admin ${admin_theme}`}>
        <Outlet />
      </main>
      <footer className={`admin footer ${admin_theme}`}>
        <div>
          <h3>Links</h3>
          <div className="footer_actions">
            <Grid container gap={1}>
              <Grid item xs={12} sm={4} md={3} className={`footer_link ${admin_theme}`}>
                <Link to="/admin">
                  <p>/</p>
                </Link>
              </Grid>
              <Grid item xs={12} sm={4} md={3} className={`footer_link ${admin_theme}`}>
                <Link to="/admin/your-movies">
                  <p>/your-movies</p>
                </Link>
              </Grid>
              <Grid item xs={12} sm={4} md={3} className={`footer_link ${admin_theme}`}>
                <Link to="/admin/your-genres">
                  <p>/your-genres</p>
                </Link>
              </Grid>
              <Grid item xs={12} sm={4} md={3} className={`footer_link ${admin_theme}`}>
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
