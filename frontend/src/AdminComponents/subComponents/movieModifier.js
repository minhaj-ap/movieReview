import {
  FormControl,
  FormHelperText,
  InputLabel,
  Box,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material/";
import { Link } from "react-router-dom";
import { IconButton, OutlinedInput, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
export default function MovieModifier(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [image, setImage] = useState(null);
  const [imageLink, setImageLink] = useState("");
  const [options, setOptions] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [upload, setUpload] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleImage = async (e) => {
    setUpload(true);
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const baseUrl =
    "https://firebasestorage.googleapis.com/v0/b/entri-projects.appspot.com/o/";
  useEffect(() => {
    async function uploadImage() {
      if (!image) return;
      try {
        const storageRef = ref(storage, `images/${image.name}`);
        const snapshot = await uploadBytes(storageRef, image);
        const downloadURL = await getDownloadURL(snapshot.ref);
        const relativeUrl = downloadURL.replace(baseUrl, "");
        setImageLink(relativeUrl);
        setUpload(false);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }
    uploadImage();
  }, [image]);
  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleDesc = (e) => {
    setDesc(e.target.value);
  };
  const handleChange = (event) => {
    const { name, checked } = event.target;
    setSelectedOptions({
      ...selectedOptions,
      [name]: checked,
    });
  };
  const handleReset = () => {
    setTitle("");
    setDesc("");
    setImageLink("");
    const resetOptions = Object.fromEntries(
      Object.keys(selectedOptions).map((key) => [key, false])
    );
    setSelectedOptions(resetOptions);
  };
  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await fetch(
          "https://moviereview-8vcv.onrender.com/get-all-genres"
        );
        const data = await response.json();
        const initialStatus = {};
        data.forEach((option) => {
          initialStatus[option.id] = false;
        });
        setOptions(data);
        if (props.type === "Add") {
          setSelectedOptions(initialStatus);
        }
      } catch (error) {
        console.error("Failed to fetch", error);
      }
    }
    fetchOptions();
    if (props.type === "Add") {
      setTitle("");
      setDesc("");
    } else if (props.type === "Edit") {
      const initialStatus = {};
      props.genre_ids.forEach((id) => {
        initialStatus[id.id] = true;
      });
      setImageLink(props.imageLink);
      setTitle(props.title);
      setDesc(props.desc);
      setSelectedOptions(initialStatus);
    }
  }, [props.desc, props.genre_ids, props.imageLink, props.title, props.type]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let checkedOptions = Object.keys(selectedOptions)
      .filter((key) => selectedOptions[key])
      .map((key) => parseInt(key, 10));
    if (!checkedOptions.length) {
      alert("Please select atleast one genre");
      return;
    }
    const data = {
      title,
      desc,
      imageLink,
      genre_ids: checkedOptions,
    };
    await fetch(
      `https://moviereview-8vcv.onrender.com/${
        props.type === "Add" ? "add" : "edit"
      }-movie`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, _id: props._id }),
      }
    )
      .then((response) => response.json())
      .then(() => {
        props.data(true);
      });
  };
  return (
    <>
      <Box
        sx={{
          padding: " 1em",
          margin: "2em",
          backgroundColor: "#9BBEC8",
          borderRadius: "10px",
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <h3 className="form_heading admin">{props.type + " movie"}</h3>
        <Box
          display="flex"
          flexDirection={isMobile ? "column" : "row"}
          justifyContent="space-evenly"
          sx={{ paddingTop: "1em" }}
        >
          <FormControl sx={{ width: "100%" }}>
            <InputLabel htmlFor="component-outlined">Title</InputLabel>
            <OutlinedInput
              id="component-outlined"
              label="Title"
              value={title}
              onChange={handleTitle}
              required
            />
            <FormHelperText id="component-helper-text">
              Title of the movie
            </FormHelperText>
          </FormControl>
          <FormControl
            sx={{
              width: "98%",
              alignItems: "flex-start",
            }}
          >
            <Grid item xs={6} sm={4} sx={{ width: "100%" }}>
              {options.length ? (
                options.map((e, index) => (
                  <FormControlLabel
                    value="start"
                    key="index"
                    control={
                      <Checkbox
                        checked={selectedOptions[e.id] || false}
                        onChange={handleChange}
                        name={e.id.toString()}
                      />
                    }
                    label={e.name}
                    labelPlacement="start"
                  />
                ))
              ) : (
                <div
                  className="non_genre_link"
                  style={{
                    margin: `${isMobile ? "0 0 10px 0" : "0 0 0 10px"}`,
                  }}
                >
                  <Link to="/admin/your-genres">
                    <p>Click here to add genres</p>
                  </Link>
                </div>
              )}
            </Grid>
            {options.length ? (
              <FormHelperText id="component-helper-text">
                Choose Genres
              </FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
        </Box>
        <Box display="flex" flexDirection="column">
          <FormControl>
            <TextField
              fullWidth
              id="fullWidth"
              placeholder="Description"
              value={desc}
              onChange={handleDesc}
              required
            />
            <FormHelperText id="component-helper-text">
              Description of the movie
            </FormHelperText>
          </FormControl>
          <FormControl sx={{ display: "flex", flexDirection: "column" }}>
            {imageLink && (
              <img
                src={baseUrl + imageLink}
                alt="Loading..."
                style={{ width: "5em", height: "max-content" }}
              />
            )}

            <Box display="flex" flexDirection="row" alignItems="center">
              <input
                type="file"
                accept="image/jpeg,image/png"
                id="image"
                required
                onChange={handleImage}
              />
              <IconButton>
                <DeleteIcon
                  sx={{
                    color: "grey",
                    paddingLeft: "1em",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setImageLink("");
                  }}
                />
              </IconButton>
            </Box>
          </FormControl>
          <FormHelperText id="component-helper-text">
            Select an image of the movie (jpeg and png are the supported
            formats)
          </FormHelperText>
          <Box display="flex" gap="1em">
            <Button
              variant="contained"
              color="success"
              type="submit"
              disabled={upload}
            >
              {props.type === "Add" ? "Submit" : "Save"}
            </Button>
            <Button variant="outlined" type="reset" onClick={handleReset}>
              Reset
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
