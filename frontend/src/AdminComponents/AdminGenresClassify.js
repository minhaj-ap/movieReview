import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme, useMediaQuery } from "@mui/material";

function GenresClassify() {
  const [expanded, setExpanded] = useState(false);
  const [genres, setGenres] = useState([]);
  const [genreId, setGenreId] = useState(30);
  const [genreName, setGenreName] = useState("");
  const [Fetch, setFetch] = useState(null);
  const size = useTheme();
  const isMobile = useMediaQuery(size.breakpoints.down("sm"));
  const handleName = (e) => {
    setGenreName(e.target.value);
  };
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://moviereview-8vcv.onrender.com/genres-with-movie`
        );
        const data = await response.json();
        setGenres(data);
        data.forEach((document, index) => {
          if (index === data.length - 1) {
            setGenreId(document.id + 1);
          }
        });
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }
    fetchData();
  }, [Fetch]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: genreName,
      id: parseInt(genreId),
    };
    await fetch("https://moviereview-8vcv.onrender.com/add-genre", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => {
      setGenreName("");
      setGenreId((prev) => prev + 1);
      setFetch(true);
    });
  };
  return (
    <div className="admin genre_drop">
      <h1 style={{ padding: "2em 1em", textAlign: "center", color: "white" }}>
        YOUR GENRES
      </h1>{" "}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography color="orange" fontSize="1.5em">
            Add new
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            component="form"
            sx={{
              "& > :not(style)": { m: 1, width: "25ch" },
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
            }}
            onSubmit={handleSubmit}
          >
            <TextField
              label="Name the genre"
              variant="outlined"
              value={genreName}
              onChange={handleName}
            />
            <TextField variant="outlined" value={genreId} disabled />
            <Button variant="contained" type="submit">
              ADD NEW GENRE
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
      {genres.map((e, index) => (
        <Accordion
          expanded={expanded === e.name}
          onChange={handleChange(e.name)}
          key={index}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{e.name}</Typography>
          </AccordionSummary>
          <AccordionDetails component="ul">
            {e.movieDetails[0] != null &&
              e.movieDetails.map((e, index) => (
                <Typography component="li" key={index}>
                  {e.title}
                </Typography>
              ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

export default GenresClassify;
