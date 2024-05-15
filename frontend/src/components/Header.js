import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useTheme, useMediaQuery, Icon } from "@mui/material";
export default function Header() {
  const [isDark, setisDark] = useState(false);
  const [search, setSearch] = useState(true);
  function handleSearch() {
    setSearch((prev) => !prev);
  }
  function handleMode() {
    setisDark((prev) => !prev);
  }
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <header className={search && isMobile && "header_col"}>
      <div className="header_name">
        <p>CINEMA REVIEWER</p>
      </div>
      {search ? (
        <form className="header_form">
          <input type="text" placeholder="Search Movies..." />
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
