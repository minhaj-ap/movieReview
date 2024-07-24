import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useContext, useState } from "react";
import {
  useTheme,
  useMediaQuery,
  Icon,
  Menu,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import { ThemeContext } from "../functions/ThemeContext";
import { AuthContext } from "../functions/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Header({ inLink }) {
  const [isDark, setisDark] = useState(false);
  const { toggleTheme } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const { isLoggedIn, logout, user } = useContext(AuthContext);
  const [search, setSearch] = useState(false);
  const navigate = useNavigate();
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
  function searchFunc(e) {
    e.preventDefault();
    const searchTerm = document.getElementById("searchInput").value;
    navigate(`/search/${searchTerm}`);
  }
  const handleLogout = () => {
    logout();
  };
  const size = useTheme();
  const isMobile = useMediaQuery(size.breakpoints.down("sm"));
  return (
    <header className={`${search && isMobile ? "header_col" : ""} ${theme}`}>
      {inLink ? (
        <IconButton
          onClick={() => {
            navigate("/");
          }}
          className={`back_icon ${theme}`}
        >
          <KeyboardBackspaceIcon fontSize="large" />
        </IconButton>
      ) : (
        ""
      )}
      <div className="header_name">
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
          <IconButton className={`searchIcon ${theme}`} onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
          <IconButton
            className={`accountIcon ${theme}`}
            onClick={handleMenu}
            style={{ cursor: "pointer" }}
          >
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {isLoggedIn && <MenuItem onClick={handleClose}>{user}</MenuItem>}

            {isLoggedIn ? (
              <MenuItem onClick={handleLogout}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => handleLogout}
                >
                  Logout
                </Button>
              </MenuItem>
            ) : (
              <MenuItem onClick={() => navigate("/login")}>
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </MenuItem>
            )}
          </Menu>
          <IconButton className={`themeToggler ${theme}`} onClick={handleMode}>
            {isDark ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </div>
      )}
    </header>
  );
}
