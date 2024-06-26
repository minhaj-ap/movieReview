import { useState, useEffect } from "react";
import { Skeleton, IconButton, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BarChartIcon from "@mui/icons-material/BarChart";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import MovieModifier from "./subComponents/movieModifier";
import ConfirmDialog from "../ConfirmBox";
import { useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState();
  const [formType, setFormType] = useState("");
  const [fetchNew, setFetchNew] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const size = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(size.breakpoints.down("sm"));
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://moviereview-8vcv.onrender.com/get-movies-all"
        );
        const data = await response.json();
        console.log(data);
        setMovies(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch", error);
        alert(error.message);
      }
    }
    fetchData();
  }, [fetchNew]);
  const handleForm = () => {
    setShowForm((prev) => !prev);
  };
  const redirectToMovie = (e) => {
    navigate(`/admin/movie/${e._id}`);
  };
  function formData() {
    let data = { type: "Add" };
    if (formType === "Edit") {
      data = {
        type: "Edit",
        ...editData,
      };
    }
    return data;
  }
  function editForm(e) {
    setFormType("Edit");
    setEditData(e);
    setShowForm(true);
  }
  async function deleteMovie(e) {
    const response = await fetch(
      `https://moviereview-8vcv.onrender.com/delete-movie/${e._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    console.log(response);
    if (response.ok) {
      setFetchNew(true);
    } else {
      const error = await response.json();
      alert(error.message);
    }
  }
  return (
    <>
      <h1 style={{ padding: "2em 1em", textAlign: "center", color: "white" }}>
        YOUR MOVIES
      </h1>{" "}
      {showForm && (
        <MovieModifier
          {...formData()}
          data={() => {
            setFetchNew(true);
          }}
        />
      )}
      <Grid container spacing={2} className="list admin">
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{ display: "grid", placeContent: "center" }}
        >
          <div className={` list_item add_button`} onClick={() => handleForm}>
            <AddCircleIcon
              fontSize="large"
              sx={{ color: "lightgreen", fontSize: "10rem" }}
              onClick={() => {
                setFormType("Add");
                setEditData();
                setShowForm(true);
              }}
            />
            <h3>ADD MOVIES</h3>{" "}
          </div>
        </Grid>
        {isLoading ? (
          <div
            className="list_skelton"
            style={{ width: isMobile ? "100%" : "43%" }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height={230}
              sx={{ backgroundColor: "grey.900" }}
            />
            <Skeleton sx={{ backgroundColor: "grey.900" }} />
            <Skeleton sx={{ backgroundColor: "grey.900" }} />
          </div>
        ) : (
          movies &&
          movies.map((e) => (
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <div className={` admin list_item items`} key={e.id}>
                <div>
                  <img src={e.imageLink} alt="" />
                </div>
                <div className="list_content admin">
                  <h3>{e.title}</h3>
                  <h6>{e.desc}</h6>
                </div>
                <div className="admin list_actions">
                  <IconButton
                    onClick={() => {
                      editForm(e);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      redirectToMovie(e);
                    }}
                  >
                    <BarChartIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setOpenConfirm(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <ConfirmDialog
                    open={openConfirm}
                    handleClose={() => {
                      setOpenConfirm(false);
                    }}
                    handleConfirm={() => {
                      deleteMovie(e);
                    }}
                  />
                </div>
              </div>
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
}
