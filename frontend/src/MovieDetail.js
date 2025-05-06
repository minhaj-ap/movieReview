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
  const [movieData, setMovieData] = useState(null);
  const [openSaveRating, setOpenSaveRating] = useState(false);
  const [openSaveReview, setOpenSaveReview] = useState(false);
  const [userReview, setUserReview] = useState("");
  const [moviesRatedByUser, setMoviesRatedByUser] = useState(null);
  const [moviesReviewedByUser, setMoviesReviewedByUser] = useState([]);
  const [rating, setRating] = useState();
  const [newReview, setNewReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const id = useParams();
  const { isLoggedIn, uid } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const { admin_theme } = useContext(AdminThemeContext);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/movie-details/${id.id}`
        );
        const data = await response.json();
        setMovieData(data);

        // Initialize empty arrays if they don't exist
        const reviews = data.review || [];
        const ratings = data.rating || [];

        if (!isAdmin) {
          // Handle ratings
          const ratedMovies = ratings.filter((movie) =>
            movie.ratings.some((r) => r.userId === uid)
          );

          // Get the user's rating for the first matching movie
          const userRating = ratedMovies.length
            ? ratedMovies[0].ratings.find((r) => r.userId === uid).rating
            : 0;

          setMoviesRatedByUser(userRating);
          // Handle reviews
          const userReviews = reviews[0].filter(
            (review) => review.userId === uid
          );
          setMoviesReviewedByUser(userReviews.length ? userReviews : []);

          const otherReviews = reviews[0].filter(
            (review) => review.userId !== uid
          );
          setReviews(otherReviews.length ? otherReviews : []);
        }

        if (isAdmin) {
          setReviews(reviews);
        }
      } catch (error) {
        console.log(error);
        alert("An unexpected error occurred");
      }
    }
    fetchData();
  }, [id, uid, isAdmin]); // Removed movieData from dependencies
  const handleRating = (e) => {
    setRating(e.target.value);
  };
  const handleReview = (e) => {
    setNewReview(e.target.value);
  };
  const addRating = async (e) => {
    try {
      const dataToSent = {
        userId: uid,
        movieId: id.id,
        rating: rating,
      };
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/add-rating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSent),
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
        `${process.env.REACT_APP_SERVER_URL}/edit-review/${moviesReviewedByUser[0]._id}`,
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
  const addReview = async () => {
    try {
      await fetch(`${process.env.REACT_APP_SERVER_URL}/add-review/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: uid,
          movieId: id.id,
          movieName: id.title,
          review: userReview,
        }),
      });
      setMoviesReviewedByUser([{ review: userReview }]);
      setUserReview("");
    } catch (error) {
      console.log(error);
      alert("An error occured");
    }
  };
  const deleteReview = async (e) => {
    try {
      await fetch(
        `${process.env.REACT_APP_SERVER_URL}/delete-review/${moviesReviewedByUser[0]._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
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
      <div
        className={`movie_details_container ${isAdmin ? admin_theme : theme}`}
      >
        {movieData && <MovieShowcase data={movieData} isAdmin={isAdmin} />}

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
            {moviesReviewedByUser.length > 0 ? (
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
                {!moviesReviewedByUser.length > 0 && (
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
    </>
  );
}
