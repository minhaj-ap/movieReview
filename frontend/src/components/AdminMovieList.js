import { useState, useEffect, useContext } from "react";
import { Skeleton, IconButton, OutlinedInput, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import BarChartIcon from "@mui/icons-material/BarChart";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ThemeContext } from "../functions/ThemeContext";
import MovieModifier from "./subComponets/movieModifier";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState();
  const [formType, setFormType] = useState("");
  const [fetchNew, setFetchNew] = useState(false);
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3001/get-movies-all`);
        const data = await response.json();
        console.log(data);
        setMovies(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    }
    fetchData();
  }, [fetchNew]);
  const handleForm = () => {
    setShowForm((prev) => !prev);
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
    console.log(e);
    setFormType("Edit");
    setEditData(e);
    setShowForm(true);
  }

  return (
    <>
      <h1 style={{ padding: "2em 1em", textAlign: "center" }}>YOUR MOVIES</h1>{" "}
      {showForm && (
        <MovieModifier
          {...formData()}
          data={() => {
            setFetchNew(true);
          }}
        />
      )}
      <Grid container spacing={2} className="list admin">
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div
            className={`${theme} list_item add_button`}
            onClick={() => handleForm}
          >
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
          <div className="list_skelton">
            <Skeleton
              variant="rectangular"
              width={170}
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
              <div className={`${theme} admin list_item items`} key={e.id}>
                <div>
                  <img src={e.img_path} alt="" />
                </div>
                <div className="list_content">
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
                  <IconButton>
                    <BarChartIcon />
                  </IconButton>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </div>
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
}
