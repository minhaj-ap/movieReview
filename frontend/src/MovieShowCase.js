import { useContext } from "react";
import { ThemeContext } from "./functions/ThemeContext";
import { AdminThemeContext } from "./functions/AdminThemeContext";
import { Link } from "react-router-dom";
import { Button, Rating, useMediaQuery, useTheme, Stack } from "@mui/material";
export default function MovieShowcase({ e, isAdmin, isSearch }) {
  const { admin_theme } = useContext(AdminThemeContext);
  const { theme } = useContext(ThemeContext);
  const size = useTheme();
  const isMobile = useMediaQuery(size.breakpoints.down("sm"));
  const baseUrl =
    "https://firebasestorage.googleapis.com/v0/b/entri-projects.appspot.com/o/";
  return (
    <div className={`movie_details_shower ${isAdmin ? admin_theme : theme}`}>
      <div className="movie_details_image">
        <img src={baseUrl + e.imageLink} alt="" />
      </div>
      <div className={`movie_details_info ${isAdmin ? admin_theme : theme}`}>
        <h4>
          Title:<span>{e.title}</span>
        </h4>
        {!(isSearch && isMobile) && (
          <h4>
            Description:<span>{e.desc}</span>
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
              to={`/movie/${e._id}`}
              style={{ display: "grid", placeContent: "stretch" }}
            >
              <Button variant="outlined">RATE NOW</Button>
            </Link>
          </div>
        )}
        {!isSearch && (
          <>
            <h4>
              No of ratings:<span>{e.NoOfRatings}</span>
            </h4>
            <h4>
              Current rating<span>{e.currentRating}</span>
            </h4>
            {e.genreDetails && (
              <ul>
                Genres:
                {e.genreDetails.map((e, index) => (
                  <li key={index}>{e.name}</li>
                ))}
              </ul>
            )}
            {isAdmin && (
              <Button
                variant="outlined"
                sx={{ fontWeight: "bold" }}
              >
                <Link to="/admin/your-movies">EDIT THIS MOVIE</Link>
              </Button>
            )}{" "}
          </>
        )}
      </div>
    </div>
  );
}
