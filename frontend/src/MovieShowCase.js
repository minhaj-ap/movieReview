import { useContext } from "react";
import { ThemeContext } from "./functions/ThemeContext";
import { AdminThemeContext } from "./functions/AdminThemeContext";
import { Link } from "react-router-dom";
import { Button, Rating, useMediaQuery, useTheme, Stack } from "@mui/material";
export default function MovieShowcase({ data, isAdmin, isSearch }) {
  const { admin_theme } = useContext(AdminThemeContext);
  const { theme } = useContext(ThemeContext);
  const size = useTheme();
  const e = data.movieDetails || data;
  const isMobile = useMediaQuery(size.breakpoints.down("sm"));
  const baseUrl = "https://image.tmdb.org/t/p/w500";
  return (
    <div className={`movie_details_shower ${isAdmin ? admin_theme : theme}`}>
      <div className="movie_details_image">
        <img src={baseUrl + e.poster_path} alt="" />
      </div>
      <div className={`movie_details_info ${isAdmin ? admin_theme : theme}`}>
        <h4>
          Title:<span>{e.title}</span>
        </h4>
        {!(isSearch && isMobile) && (
          <h4>
            Description:<span>{e.overview || "not available at the moment"}</span>
          </h4>
        )}
        {isSearch && (
          <Stack sx={{ alignContent: "baseline", padding: "1em 0" }}>
            <Rating
              className="rating"
              precision={0.5}
              size="large"
              readOnly
              defaultValue={e.currentRating}
            />
          </Stack>
        )}
        {isSearch && (
          <div style={{ display: "grid", placeContent: "stretch" }}>
            {" "}
            <Link
              to={`/movie/${e.id}`}
              style={{ display: "grid", placeContent: "stretch" }}
            >
              <Button variant="outlined">RATE NOW</Button>
            </Link>
          </div>
        )}
        {!isSearch && (
          <>
            <h4>
              No of ratings:<span>{data.rating[0]?.NoOfRatings || 0}</span>
            </h4>
            <h4>
              Current rating:
              <span>{data.rating[0]?.currentRating || "0.0"}</span>
            </h4>
          </>
        )}
      </div>
    </div>
  );
}
