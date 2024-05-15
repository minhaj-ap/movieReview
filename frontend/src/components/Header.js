import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useTheme, useMediaQuery, Icon } from "@mui/material";
export default function Header() {
  const [isDark, setisDark] = useState(false);
  const [search, setSearch] = useState(false);
  function handleSearch() {
    setSearch((prev) => !prev);
  }
  function handleMode() {
    setisDark((prev) => !prev);
  }
  function searchFunc(e) {
    e.preventDefault();
    const searchTerm = document.getElementById("searchInput").value;
    const baseUrl = "http://localhost:3001/search"; // Your base URL
    const url = `${baseUrl}?query=${encodeURIComponent(searchTerm)}`;

    // Make request using fetch
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Handle response data
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <header className={search && isMobile ? "header_col": ""}>
      <div className="header_name">
        <p>CINEMA REVIEWER</p>
      </div>
      {search ? (
        <form className="header_form" onSubmit={searchFunc}>
          <input type="text" id="searchInput" placeholder="Search Movies..." />
          <button type="submit">
            <Icon sx={{ color: "green" }}>
              <SearchIcon />
            </Icon>
          </button>
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
        </div>
      )}
    </header>
  );
}
