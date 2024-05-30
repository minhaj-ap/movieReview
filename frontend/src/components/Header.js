import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useContext, useState } from "react";
import {
  useTheme,
  useMediaQuery,
  Icon,
  Menu,
  MenuItem,
  Button,
} from "@mui/material";
import { ThemeContext } from "../functions/ThemeContext";
import { AuthContext } from "../functions/AuthContext";
export default function Header() {
  const [isDark, setisDark] = useState(false);
  const { toggleTheme } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const [search, setSearch] = useState(false);
  function handleSearch() {
    setSearch((prev) => !prev);
  }
  function handleMode() {
    toggleTheme();
    setisDark((prev) => !prev);
  }
  const { theme } = useContext(ThemeContext);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log(theme);
  function searchFunc(e) {
    e.preventDefault();
    const searchTerm = document.getElementById("searchInput").value;
    const baseUrl = "http://localhost:3001/search"; // Your base URL
    const url = `${baseUrl}?query=${encodeURIComponent(searchTerm)}`;

    // Make request using fetch
    fetch(url)
      .then((response) => response.json())
      .then((data) => {})
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert(error.message);
      });
  }
  const handleLogout = () => {
    logout();
  };
  const size = useTheme();
  const isMobile = useMediaQuery(size.breakpoints.down("sm"));
  return (
    <header className={`${search && isMobile ? " header_col" : ""}`}>
      <div className={`${isLoggedIn && "admin"} header_name`}>
        <p>CINEMA REVIEWER</p>
      </div>
      {search ? (
        <form className="header_form" onSubmit={searchFunc}>
          <button type="submit">
            <Icon sx={{ color: "green" }}>
              <SearchIcon />
            </Icon>
          </button>
          <input type="text" id="searchInput" placeholder="Search Movies..." />
          <button onClick={handleSearch}>
            <Icon sx={{ color: "red" }}>
              <CloseIcon />
            </Icon>
          </button>
        </form>
      ) : (
        <div className="header_actions">
          <p onClick={handleSearch}>
            <SearchIcon />
          </p>
          <p onClick={handleMode}>
            {isDark ? <DarkModeIcon /> : <LightModeIcon />}
          </p>
          <p onClick={handleMenu} style={{ cursor: "pointer" }}>
            <AccountCircleIcon />
          </p>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>{user}</MenuItem>
            <MenuItem onClick={handleLogout}>
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
      )}
    </header>
  );
}
