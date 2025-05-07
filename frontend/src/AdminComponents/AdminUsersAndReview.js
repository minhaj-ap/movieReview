import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import ConfirmDialog from "../ConfirmBox";
import { toast } from "react-toastify";
function TotalUserAndReviews() {
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState([]);
  const [fetchNew, setFetchNew] = useState(false);
  const [openBanConfirm, setOpenBanConfirm] = useState(false);
  const [openDeleteUserConfirm, setOpenDeleteUserConfirm] = useState(false);
  const [openDeleteReviewConfirm, setOpenDeleteReviewConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/get-users-and-reviews`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Failed to get reviews");
        }
        console.log(data);
        setData(data);
        setExpanded(false);
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
    fetchData();
  }, [fetchNew]);

  const deleteReview = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/delete-review/${selectedReview._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete Review");
      }
      setOpenDeleteReviewConfirm(false);
      setFetchNew((prev) => !prev);
    } catch (error) {
      console.log(error);
      alert(error?.message || error);
    }
  };

  const banUser = async (type) => {
    try {
      const user = selectedUser;
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/ban-user`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            userId: user._id,
            reviewIds: giveData({ type: "review", data: user }),
            movieIds: giveData({ type: "movie", data: user }),
            type,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to ban user");
      }
      setOpenBanConfirm(false);
      setOpenDeleteUserConfirm(false);
      setFetchNew((prev) => !prev);
    } catch (error) {
      alert(error?.message || error);
    }
  };

  const unBanUser = async (e) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/unban-user`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            userId: e._id,
          }),
        }
      );
      setFetchNew((prev) => !prev);
      if (!response.ok) {
        throw new Error("Failed to unban user");
      }
    } catch (error) {
      alert(error?.message || error);
    }
  };
  const giveData = ({ type, data }) => {
    if (type === "review") {
      if (data.userReviews[0]?.movieDetails[0]) {
        return data.userReviews.map((e) => e._id);
      } else {
        return null;
      }
    } else if (type === "movie") {
      if (data.userReviews[0]?.movieDetails[0]) {
        return data.userReviews.flatMap((review) =>
          (review.movieDetails || []).map((movie) => movie._id)
        );
      } else {
        return null;
      }
    }
  };
  return (
    <div className="admin genre_drop">
      <h1 style={{ padding: "2em 1em", textAlign: "center", color: "white" }}>
        YOUR USERS AND REVIEWS
      </h1>
      {data.map((e, index) => (
        <Accordion
          expanded={expanded === e.userName}
          onChange={handleChange(e.userName)}
          key={index}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Box className="user_tile">
              <Typography>{e.userName}</Typography>
              <div>
                {e.isBanned ? (
                  <IconButton onClick={() => unBanUser(e)}>
                    <SettingsBackupRestoreIcon sx={{ color: "green" }} />
                  </IconButton>
                ) : (
                  <>
                    <IconButton
                      onClick={() => {
                        setSelectedUser(e);
                        setOpenBanConfirm(true);
                      }}
                    >
                      <BlockIcon sx={{ color: "orange" }} />
                    </IconButton>
                    <ConfirmDialog
                      open={openBanConfirm}
                      handleClose={() => setOpenBanConfirm(false)}
                      handleConfirm={() => banUser("ban")}
                      text="ban this user"
                    />
                  </>
                )}
                <IconButton
                  onClick={() => {
                    setSelectedUser(e);
                    setOpenDeleteUserConfirm(true);
                  }}
                >
                  <DeleteIcon sx={{ color: "red" }} />
                </IconButton>
                <ConfirmDialog
                  open={openDeleteUserConfirm}
                  handleClose={() => setOpenDeleteUserConfirm(false)}
                  handleConfirm={() => banUser("delete")}
                  text="delete this user"
                />
              </div>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <>
              <Box className="user_details_tile">
                <Typography>
                  Banned status: {e.isBanned ? "true" : "false"}
                </Typography>
                <Typography>Email: {e.userEmail}</Typography>
              </Box>
              <AccordionDetails>
                {e.userReviews.length > 0 ? (
                  e.userReviews.map((review, reviewIndex) => (
                    <React.Fragment key={reviewIndex}>
                      <div className="review_info_tile">
                        <div>
                          <Typography>
                            Review: {review.review || "NO DATA"}
                          </Typography>
                          {review.movieDetails &&
                            review.movieDetails.length > 0 &&
                            review.movieDetails.map((movie, movieIndex) => (
                              <Typography key={movieIndex}>
                                Movie Name: {movie.movieName}
                              </Typography>
                            ))}
                        </div>
                        <IconButton
                          onClick={() => {
                            setSelectedReview(review);
                            setOpenDeleteReviewConfirm(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <ConfirmDialog
                          open={openDeleteReviewConfirm}
                          handleClose={() => setOpenDeleteReviewConfirm(false)}
                          handleConfirm={deleteReview}
                          text="delete this review"
                        />
                      </div>
                      <hr />
                    </React.Fragment>
                  ))
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <strong> THE USER HAVE NO REVIEWS</strong>
                  </div>
                )}
              </AccordionDetails>
            </>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default TotalUserAndReviews;
