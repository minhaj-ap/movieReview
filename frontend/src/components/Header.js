import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useContext, useState } from "react";
import { useTheme, useMediaQuery, Icon } from "@mui/material";
import { ThemeContext } from "../functions/ThemeContext";
export default function Header() {
  const [isDark, setisDark] = useState(false);
  const { toggleTheme } = useContext(ThemeContext);
  const [search, setSearch] = useState(false);
  function handleSearch() {
    setSearch((prev) => !prev);
  }
  function handleMode() {
    toggleTheme();
    setisDark((prev) => !prev);
  }
  const { theme } = useContext(ThemeContext);
  function searchFunc(e) {
    e.preventDefault();
    const searchTerm = document.getElementById("searchInput").value;
    const baseUrl = "http://localhost:3001/search"; // Your base URL
    const url = `${baseUrl}?query=${encodeURIComponent(searchTerm)}`;

    // Make request using fetch
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert(error.message)
      });
  }
  const size = useTheme();
  const isMobile = useMediaQuery(size.breakpoints.down("sm"));
  return (
    <header className={`${search && isMobile ? " header_col" : ""}`}>
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
          <p onClick={handleSearch}>
            <SearchIcon />
          </p>
          <p onClick={handleMode}>
            {isDark ? <DarkModeIcon /> : <LightModeIcon />}
          </p>
          <p>
            <AccountCircleIcon />
          </p>
        </div>
      )}
    </header>
  );
}
