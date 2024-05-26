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
import { IconButton, OutlinedInput, Grid } from "@mui/material";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
export default function MovieModifier(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState(null);
  const [imageLink, setImageLink] = useState("");
  const [options, setOptions] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const handleUpload = async (e) => {
    if (!Image) return;
    const storageRef = ref(storage, `images/${image.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);
      const baseUrl =
        "https://firebasestorage.googleapis.com/v0/b/entri-projects.appspot.com/o/";
      const relativeUrl = downloadURL.replace(baseUrl, "");
      setImageLink(relativeUrl);
    } catch (error) {
      console.log(error);
    }
  };
  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e.target.result);
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };
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
    const resetOptions = Object.fromEntries(
      Object.keys(selectedOptions).map((key) => [key, false])
    );
    setSelectedOptions(resetOptions);
  };
  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await fetch("http://localhost:3001/get-all-genres");
        const data = await response.json();
        console.log(data);
        const initialStatus = {};
        data.forEach((option) => {
          initialStatus[option.id] = false;
        });
        setOptions(data);
        console.log(initialStatus);
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
      console.log(props.genre_ids);
      props.genre_ids.forEach((id) => {
        initialStatus[id.id] = true;
      });
      console.log(initialStatus);
      setTitle(props.title);
      setDesc(props.desc);
      console.log(initialStatus);
      setSelectedOptions(initialStatus);
    }
  }, [props.desc, props.genre_ids, props.title, props.type]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let checkedOptions = Object.keys(selectedOptions)
      .filter((key) => selectedOptions[key])
      .map((key) => parseInt(key, 10));
    console.log(checkedOptions);
    const data = {
      title,
      desc,
      imageLink,
      genre_ids: checkedOptions,
    };
    const response = await fetch(
      `http://localhost:3001/${props.type === "Add" ? "add" : "edit"}-movie`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, _id: props._id }),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
        props.data(true);
      });
    console.log(response);
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
        <h3>{props.type + " movie"}</h3>
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
            <Grid item xs={6} sm={4}>
              {options.map((e) => (
                <FormControlLabel
                  value="start"
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
              ))}
            </Grid>
            <FormHelperText id="component-helper-text">
              Choose Genres
            </FormHelperText>
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
            />
            <FormHelperText id="component-helper-text">
              Description of the movie
            </FormHelperText>
          </FormControl>
          <FormControl sx={{ display: "flex", flexDirection: "column" }}>
            {imageUrl && (
              <img
                src={imageUrl}
                alt="Loading..."
                style={{ width: "max-content", height: "max-content" }}
              />
            )}

            <Box display="flex" flexDirection="row" alignItems="center">
              <input
                type="file"
                accept="image/jpeg,image/png"
                id="image"
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
                    setImageUrl("");
                  }}
                />
              </IconButton>
              <IconButton>
                <CloudUploadIcon
                  sx={{
                    color: "grey",
                    cursor: "pointer",
                  }}
                  onClick={handleUpload}
                />
              </IconButton>
            </Box>
          </FormControl>
          <FormHelperText id="component-helper-text">
            Select an image of the movie (jpeg and png are the supported
            formats)
          </FormHelperText>
          <Box display="flex" gap="1em">
            <Button variant="contained" color="success" type="submit">
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
