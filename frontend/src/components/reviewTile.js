import AccountCircleIcon from "@mui/icons-material/AccountCircle";
export default function ReviewTile({ data }) {
  console.log(data)
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
