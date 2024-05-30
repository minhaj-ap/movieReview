import AccountCircleIcon from "@mui/icons-material/AccountCircle";
export default function ReviewTile({ type, data }) {
  console.log(type, data);
  return (
    <div className="review_tile">
      <div>
        <AccountCircleIcon fontSize="medium" />
        <p>{data.userName}</p>
      </div>
      <p>{data.review}</p>
      <hr />
    </div>
  );
}
