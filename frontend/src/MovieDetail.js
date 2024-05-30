import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Header from "./components/Header";
import {
  Stack,
  Rating,
  IconButton,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { AuthContext } from "./functions/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import ReviewTile from "./components/reviewTile";
export default function MovieDetail() {
  const [movieData, setMovieData] = useState([]);
  const [openSaveRating, setOpenSaveRating] = useState(false);
  const [openSaveReview, setOpenSaveReview] = useState(false);
  const id = useParams();
  const { uid } = useContext(AuthContext);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:3001/movie-details/${id.id}`
        );
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, [id]);
  const [moviesRatedByUser, setMoviesRatedByUser] = useState();
  const [moviesReviewedByUser, setMoviesReviewedByUser] = useState([]);
  const [rating, setRating] = useState();
  const [newReview, setNewReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const handleRating = (e) => {
    console.log(e.target.value);
    setRating(e.target.value);
  };
  const handleReview = (e) => {
    setNewReview(e.target.value);
  };
  useEffect(() => {
    if (movieData.length) {
      const ratedMovies = movieData
        .flatMap((movie) => movie.ratings)
        .filter((rating) => rating.userId === uid)
        .map((rating) => rating.rating);
      setMoviesRatedByUser(parseFloat(ratedMovies));
      const reviewedMovies = movieData
        .flatMap((movie) => movie.combinedReviews)
        .filter((reviews) => reviews.userId === uid);
      setMoviesReviewedByUser(reviewedMovies);
      const otherReviews = movieData[0].combinedReviews.filter(
        (review) => review.userId !== uid
      );
      setReviews(otherReviews);
    }
  }, [movieData, uid]);
  console.log(moviesReviewedByUser);
  const baseUrl =
    "https://firebasestorage.googleapis.com/v0/b/entri-projects.appspot.com/o/";
  return (
    <>
      <Header />
      {movieData.map((e, index) => (
        <div className="movie_details_container" key={index}>
          <div className="movie_details_shower">
            <div className="movie_details_image">
              <img src={baseUrl + e.imageLink} alt="" />
            </div>
            <div className="movie_details_info">
              <h1>
                Title:<span>{e.title}</span>
              </h1>
              <h3>
                Description:<span>{e.desc}</span>
              </h3>
              <h5>
                No of ratings:<span>{e.NoOfRatings}</span>
              </h5>
              <h5>
                Current rating<span>{e.currentRating}</span>
              </h5>
              <ul>
                Genres:
                {e.genreDetails.map((e, index) => (
                  <li key={index}>{e.name}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* <div className="movie_details_reviews">
            {e.combinedReviews.map((e) => (
              <div className="movie_details_review_item">
                <p>{e.userName}</p>
                <p>{e.review}</p>
              </div>
            ))}
          </div> */}
          <div className="user_rating_review">
            {moviesRatedByUser ? (
              <div className="user_rating">
                <div className="user_review_header">
                  <p>YOUR RATING</p>
                  <IconButton
                    onClick={() => {
                      setOpenSaveRating(!openSaveRating);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
                <Stack spacing={1}>
                  <Rating
                    defaultValue={moviesRatedByUser}
                    precision={0.5}
                    value={rating}
                    readOnly={!openSaveRating}
                    fontSize="large"
                    onChange={handleRating}
                  />
                </Stack>
                {openSaveRating && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => setOpenSaveRating(!openSaveRating)}
                  >
                    SAVE
                  </Button>
                )}
              </div>
            ) : (
              ""
            )}
            {moviesReviewedByUser[0] ? (
              <div className="user_review">
                <div className="user_review_header">
                  <p>YOUR REVIEW</p>
                  <IconButton
                    onClick={() => setOpenSaveReview(!openSaveReview)}
                  >
                    <EditIcon />
                  </IconButton>
                </div>
                {openSaveReview ? (
                  <TextField
                    id=""
                    label=""
                    value={newReview || moviesReviewedByUser[0].review}
                    onChange={handleReview}
                  />
                ) : (
                  <span>{newReview || moviesReviewedByUser[0].review}</span>
                )}

                {openSaveReview && (
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => setOpenSaveReview(!openSaveReview)}
                  >
                    SAVE
                  </Button>
                )}
              </div>
            ) : (
              ""
            )}
            {!moviesRatedByUser && (
              <div className="non_rating">
                <p>Rate now</p>
                <Stack spacing={1}>
                  <Rating
                    defaultValue={moviesRatedByUser}
                    precision={0.5}
                    value={rating}
                    fontSize="large"
                    onChange={handleRating}
                  />
                </Stack>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => console.log(rating)}
                >
                  SAVE
                </Button>
              </div>
            )}
            {!moviesReviewedByUser[0] && (
              <div className="non_review">
                <h4>POST YOUR REVIEW NOW</h4>
              </div>
            )}
          </div>
          <div className="review_section">
            <h3>Reviews</h3>
            {!moviesReviewedByUser[0] && (
              <TextField
              label="ADD YOUR REVIEW"
              helperText="POST YOUR REVIEW HERE"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="send review">
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            )}
            {reviews.map((e) => (
              <ReviewTile type="user" data={e} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
