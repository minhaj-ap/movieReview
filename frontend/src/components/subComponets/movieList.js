import { useState, useEffect, useContext } from "react";
import { Skeleton, Stack, Rating, Button } from "@mui/material";
import { ThemeContext } from "../../functions/ThemeContext";
import RateReviewIcon from '@mui/icons-material/RateReview';
export default function MovieList({ props }) {
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (props) {
      setLoading(false);
    }
  }, [props]);
  const { theme } = useContext(ThemeContext);
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
          props.movieDetails &&
          props.movieDetails.map((e) => (
            <div className="list_item" key={e.id}>
              <div className="list_content">
                <h3>{e.title}</h3>
                <h6>{e.desc}</h6>
              </div>
              <div className="list_functions">
                <Stack spacing={1}>
                  <Rating
                    name="half-rating-read"
                    defaultValue={2.5}
                    precision={0.5}
                    readOnly
                  />
                </Stack>
                <Button
                  variant="contained"
                  endIcon={<RateReviewIcon fontSize="small" />}
                  sx={{ backgroundColor: "#028391" }}
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
