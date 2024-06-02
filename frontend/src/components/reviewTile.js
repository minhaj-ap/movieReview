import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ConfirmDialog from "../ConfirmBox";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { useState } from "react";
export default function ReviewTile({ data, isAdmin }) {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleted, setDelete] = useState(false);
  const deleteReview = async (e) => {
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
      setDelete(true);
    } catch (error) {
      console.log(error);
      alert("An unexpected error occurred");
    }
  };
  return (
    <div className="review_tile">
      {!deleted ? (
        <>
          {" "}
          <div>
            <div className="review_user_section">
              <AccountCircleIcon fontSize="medium" />
              <p>{data.userName}</p>
            </div>
            {isAdmin && (
              <div>
                <IconButton onClick={() => setOpenConfirm(true)}>
                  <DeleteIcon />
                </IconButton>
                <ConfirmDialog
                  open={openConfirm}
                  handleClose={() => setOpenConfirm(false)}
                  handleConfirm={() => {
                    deleteReview(data);
                  }}
                  text="delete this review"
                />
              </div>
            )}
          </div>
          <p>{data.review}</p>
          <hr />
        </>
      ) : (
        <p>This review has been deleted</p>
      )}
    </div>
  );
}
