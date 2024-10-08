import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import DeleteIcon from "@mui/icons-material/Delete";
import ReviewTile from "./components/reviewTile";
import ConfirmDialog from "./ConfirmBox";
import { ThemeContext } from "./functions/ThemeContext";
import { AdminThemeContext } from "./functions/AdminThemeContext";
import MovieShowcase from "./MovieShowCase";
export default function MovieDetail({ isAdmin }) {
  const [movieData, setMovieData] = useState([]);
  const [openSaveRating, setOpenSaveRating] = useState(false);
  const [openSaveReview, setOpenSaveReview] = useState(false);
  const [userReview, setUserReview] = useState("");
  const id = useParams();
  const { isLoggedIn, uid } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { admin_theme } = useContext(AdminThemeContext);
  const navigate = useNavigate();
  console.log(isLoggedIn);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://moviereview-8vcv.onrender.com/movie-details/${id.id}`
        );
        const data = await response.json();
        setMovieData(data);
      } catch (error) {
        console.log(error);
        alert("An unexpected error occured");
      }
    }
    fetchData();
  }, [id]);
  const [moviesRatedByUser, setMoviesRatedByUser] = useState();
  const [moviesReviewedByUser, setMoviesReviewedByUser] = useState([]);
  const [rating, setRating] = useState();
  const [newReview, setNewReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleRating = (e) => {
    setRating(e.target.value);
  };
  const handleReview = (e) => {
    setNewReview(e.target.value);
  };
  const addRating = async (e) => {
    try {
      const response = await fetch(
        "https://moviereview-8vcv.onrender.com/add-rating",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: uid,
            movieId: id.id,
            rating: rating,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      setOpenSaveRating(false);
      setMoviesRatedByUser(rating);
    } catch (error) {
      console.log(error);
      alert("An unexpected error occurred");
    }
  };
  const editReview = async () => {
    try {
      const response = await fetch(
        `https://moviereview-8vcv.onrender.com/edit-review/${moviesReviewedByUser[0]._id}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            review: newReview,
          }),
        }
      );
      console.log(response);
      setOpenSaveReview(false);
    } catch (error) {}
  };
  useEffect(() => {
    if (!isAdmin) {
      if (movieData.length) {
        if (movieData[0].ratings) {
          const ratedMovies = movieData
            .flatMap((movie) => movie.ratings)
            .filter((rating) => rating.userId === uid)
            .map((rating) => rating.rating);
          setMoviesRatedByUser(parseFloat(ratedMovies));
        }
        const reviewedMovies = movieData
          .flatMap((movie) => movie.combinedReviews)
          .filter((reviews) => reviews.userId === uid);
        setMoviesReviewedByUser(reviewedMovies);
        const otherReviews = movieData[0].combinedReviews.filter(
          (review) => review.userId !== uid
        );
        setReviews(otherReviews);
      }
    }
    if (isAdmin) {
      setReviews(movieData[0] ? movieData[0].combinedReviews : []);
    }
  }, [movieData, uid, isAdmin]);
  const addReview = async () => {
    try {
      const response = await fetch(
        "https://moviereview-8vcv.onrender.com/add-review/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: uid,
            movieId: id.id,
            review: userReview,
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      setMoviesReviewedByUser([{ review: userReview }]);
      setUserReview("");
    } catch (error) {
      console.log(error);
    }
  };
  const deleteReview = async (e) => {
    try {
      const response = await fetch(
        `https://moviereview-8vcv.onrender.com/delete-review/${moviesReviewedByUser[0]._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      console.log(response);
      setOpenConfirm(false);
      setMoviesReviewedByUser([]);
    } catch (error) {
      console.log(error);
      alert("An unexpected error occurred");
    }
  };
  return (
    <>
      <Header inLink={true} />
      {movieData.map((e, index) => (
        <div
          className={`movie_details_container ${isAdmin ? admin_theme : theme}`}
          key={index}
        >
          <MovieShowcase e={e} isAdmin={isAdmin} />
          {!isAdmin && (
            <div
              className={`user_rating_review ${isAdmin ? admin_theme : theme}`}
            >
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
                      onClick={addRating}
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
                    <div style={{ display: "flex" }}>
                      <IconButton
                        onClick={() => setOpenSaveReview(!openSaveReview)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => setOpenConfirm(true)}>
                        <DeleteIcon />
                      </IconButton>
                      <ConfirmDialog
                        open={openConfirm}
                        handleClose={() => setOpenConfirm(false)}
                        handleConfirm={() => {
                          deleteReview();
                        }}
                        text="delete review"
                      />
                    </div>
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
                      onClick={editReview}
                    >
                      SAVE
                    </Button>
                  )}
                </div>
              ) : (
                ""
              )}
              {isLoggedIn ? (
                <>
                  {!moviesRatedByUser && (
                    <div
                      className={`non_rating ${isAdmin ? admin_theme : theme}`}
                    >
                      <p>Rate now</p>
                      <Stack spacing={1} sx={{ margin: "auto" }}>
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
                        onClick={addRating}
                      >
                        SAVE
                      </Button>
                    </div>
                  )}
                  {!moviesReviewedByUser[0] && (
                    <div className="non_review">
                      <h4>POST YOUR REVIEW NOW</h4>
                    </div>
                  )}{" "}
                </>
              ) : (
                <h2>
                  Login to rate and review movies.{" "}
                  <u
                    style={{
                      fontSize: "0.5em",
                      fontStyle: "italic",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Create an account
                  </u>
                </h2>
              )}
            </div>
          )}
          <div className={`review_section ${isAdmin ? admin_theme : theme}`}>
            <h3>Reviews</h3>
            {!isAdmin && !moviesReviewedByUser[0] && isLoggedIn && (
              <TextField
                label="ADD YOUR REVIEW"
                helperText="POST YOUR REVIEW HERE"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="send review" onClick={addReview}>
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                value={userReview}
                onChange={(e) => {
                  setUserReview(e.target.value);
                }}
                className="review_Adder"
              />
            )}
            {reviews.length ? (
              reviews.map((e, index) => (
                <ReviewTile isAdmin={isAdmin} data={e} key={index} />
              ))
            ) : (
              <strong style={{ textAlign: "center", fontStyle: "italic" }}>
                NO REVIEWS TO SHOW
              </strong>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
