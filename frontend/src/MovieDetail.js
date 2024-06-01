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
import DeleteIcon from "@mui/icons-material/Delete";
import ReviewTile from "./components/reviewTile";
import ConfirmDialog from "./ConfirmBox";
import { ThemeContext } from "./functions/ThemeContext";
export default function MovieDetail() {
  const [movieData, setMovieData] = useState([]);
  const [openSaveRating, setOpenSaveRating] = useState(false);
  const [openSaveReview, setOpenSaveReview] = useState(false);
  const [userReview, setUserReview] = useState("");
  const id = useParams();
  const { uid } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
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
    setOpenSaveRating(false);
  };
  console.log(moviesReviewedByUser);
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
    }
  };
  const editReview = async () => {
    console.log("triggered");
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
  }, [movieData, uid]);
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
    } catch (error) {}
  };
  const baseUrl =
    "https://firebasestorage.googleapis.com/v0/b/entri-projects.appspot.com/o/";
  return (
    <>
      <Header inLink={true} />
      {movieData.map((e, index) => (
        <div className={`movie_details_container ${theme}`} key={index}>
          <div className={`movie_details_shower ${theme}`}>
            <div className="movie_details_image">
              <img src={baseUrl + e.imageLink} alt="" />
            </div>
            <div className={`movie_details_info ${theme}`}>
              <h4>
                Title:<span>{e.title}</span>
              </h4>
              <h4>
                Description:<span>{e.desc}</span>
              </h4>
              <h4>
                No of ratings:<span>{e.NoOfRatings}</span>
              </h4>
              <h4>
                Current rating<span>{e.currentRating}</span>
              </h4>
              <ul>
                Genres:
                {e.genreDetails.map((e, index) => (
                  <li key={index}>{e.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className={`user_rating_review ${theme}`}>
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
            {!moviesRatedByUser && (
              <div className={`non_rating ${theme}`}>
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
                <Button variant="outlined" color="inherit" onClick={addRating}>
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
          <div className={`review_section ${theme}`}>
            <h3>Reviews</h3>
            {!moviesReviewedByUser[0] && (
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
            {reviews.map((e) => (
              <ReviewTile type="user" data={e} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
