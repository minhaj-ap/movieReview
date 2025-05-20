import { useState, useEffect, useContext } from "react";
import { Skeleton, Stack, Rating, Button } from "@mui/material";
import { ThemeContext } from "../../functions/ThemeContext";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { useNavigate } from "react-router-dom";
export default function MovieList({ props }) {
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (props) {
      setLoading(false);
    }
  }, [props]);
  const baseUrl = "https://image.tmdb.org/t/p/w500";

  const { theme } = useContext(ThemeContext);
  const showMovie = (e) => {
    navigate(`/movie/${e.id}`);
  };
  return (
    <>
      <h2>{props.name}</h2>{" "}
      <div className="list">
        {isLoading ? (
          <div className="list_skelton">
            <Skeleton
              variant="rectangular"
              width={170}
              height={230}
              sx={{ backgroundColor: "grey.900" }}
            />
            <Skeleton sx={{ backgroundColor: "grey.900" }} />
            <Skeleton sx={{ backgroundColor: "grey.900" }} />
          </div>
        ) : (
          props.result.results &&
          props.result.results.map((e, index) => (
            <div className={`${theme} list_item`} key={index}>
              <div className={`${theme} list_content`}>
                <img src={baseUrl + e.poster_path} alt={e.title} />
                <h3>{e.title}</h3>
                <h6>{e.overview || "not available at the moment"}</h6>
              </div>
              <div className="list_functions">
                <Stack spacing={1}>
                  <Rating
                    defaultValue={e.currentRating}
                    precision={0.5}
                    readOnly
                  />
                </Stack>
                <Button
                  variant="contained"
                  endIcon={<RateReviewIcon fontSize="small" />}
                  sx={{ backgroundColor: "#028391" }}
                  onClick={() => showMovie(e)}
                >
                  Post Your Review
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
