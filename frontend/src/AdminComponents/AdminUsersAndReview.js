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
function TotalUserAndReviews() {
  const [expanded, setExpanded] = useState(false);
  const [data, setData] = useState([]);
  const [fetchNew, setFetchNew] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://moviereview-8vcv.onrender.com/get-users-and-reviews"
        );
        const data = await response.json();
        console.log(data);
        setData(data);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }
    fetchData();
  }, [fetchNew]);
  const deleteReview = async (e) => {
    console.log(e._id);
    try {
      const response = await fetch(
        `https://moviereview-8vcv.onrender.com/delete-review/${e._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      console.log(response);
      setOpenConfirm(false);
      setFetchNew(true);
    } catch (error) {
      console.log(error);
      alert("An unexpected error occurred");
    }
  };
  async function banUser(data) {
    await fetch("https://moviereview-8vcv.onrender.com/ban-user", {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userId: data._id,
        reviewIds: giveData({ type: "review", data: data }),
        movieIds: giveData({ type: "movie", data: data }),
      }),
    });
    setOpenConfirm(false);
    setFetchNew(true);
  }
  async function unBanUser(e) {
    await fetch("https://moviereview-8vcv.onrender.com/unban-user", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userId: e._id,
      }),
    });
    setFetchNew(true);
  }
  function giveData({ type, data }) {
    if (type === "review") {
      if (data.userReviews[0].movieDetails[0]) {
        return data.userReviews.map((e) => e._id);
      } else {
        return null;
      }
    } else if (type === "movie") {
      if (data.userReviews[0].movieDetails[0]) {
        return data.userReviews.flatMap((review) =>
          (review.movieDetails || []).map((movie) => movie._id)
        );
      } else {
        return null;
      }
    }
  }
  return (
    <div className="admin genre_drop">
      <h1 style={{ padding: "2em 1em", textAlign: "center", color: "white" }}>
        YOUR USERS AND REVIEWS
      </h1>{" "}
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
              {e.isBanned ? (
                <IconButton onClick={() => unBanUser(e)}>
                  <SettingsBackupRestoreIcon />
                </IconButton>
              ) : (
                <>
                  <IconButton onClick={() => setOpenConfirm(true)}>
                    <BlockIcon sx={{ color: "red" }} />
                  </IconButton>
                  <ConfirmDialog
                    open={openConfirm}
                    handleClose={() => setOpenConfirm(false)}
                    handleConfirm={() => {
                      banUser(e);
                    }}
                    text="ban this user"
                  />
                </>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <>
              <Box className="user_details_tile">
                <Typography>
                  Banned status :{e.isBanned ? "true" : "false"}
                </Typography>
                <Typography>Email :{e.userEmail}</Typography>
              </Box>
            </>

            <AccordionDetails>
              {e.userReviews.length > 0 &&
                e.userReviews.map((review, index) => (
                  <React.Fragment key={index}>
                    {review.review ? (
                      <>
                        <div className="review_info_tile">
                          <div>
                            <Typography>
                              Review: {review.review || "NO DATA"}
                            </Typography>
                            {review.movieDetails &&
                              review.movieDetails.length > 0 &&
                              review.movieDetails.map((movie, idx) => (
                                <Typography key={idx}>
                                  Movie: {movie.title}
                                </Typography>
                              ))}
                          </div>
                          <IconButton onClick={() => setOpenConfirm(true)}>
                            <DeleteIcon />
                          </IconButton>
                          <ConfirmDialog
                            open={openConfirm}
                            handleClose={() => setOpenConfirm(false)}
                            handleConfirm={() => {
                              deleteReview(review);
                            }}
                            text="delete this review"
                          />
                        </div>
                        <hr />
                      </>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        <strong> THE USER HAVE NO REVIEWS</strong>
                      </div>
                    )}
                  </React.Fragment>
                ))}
            </AccordionDetails>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default TotalUserAndReviews;