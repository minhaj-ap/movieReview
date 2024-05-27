const { getDb } = require("./db");
const { ObjectId } = require("mongodb");
async function addMovieDb(params) {
  try {
    const db = await getDb();
    const movie = { ...params, reviewIds: [] };
    const result = await db.collection("movie_details").insertOne(movie);
    const movieId = result.insertedId;
    console.log("Inserted document:", movieId);
    const updated = await db
      .collection("genres")
      .updateMany(
        { id: { $in: params.genre_ids } },
        { $addToSet: { movieIds: movieId } }
      );
    console.log("Update result:", updated);
    return result;
  } catch (error) {
    console.error("Error adding movie to database:", error);
    return false;
  }
}
async function editMovie({ _id, ...updatedData }) {
  try {
    const db = await getDb();
    const movie = updatedData;
    console.log("movie", movie);
    const result = await db.collection("movie_details").findOneAndUpdate(
      { _id: new ObjectId(_id) },
      {
        $set: updatedData,
      },
      { returnOriginal: false }
    );
    return result;
  } catch (error) {
    console.error("Error adding movie to database:", error);
    return false;
  }
}
async function addReview(params) {
  try {
    console.log(params);
    const db = await getDb();
    const movieId = parseInt(params.movieId);
    const user = parseInt(params.user);
    const likes = parseInt(params.likes);
    const text = decodeURIComponent(params.text);
    if (!movieId || !user || !likes || !text) {
      return false;
    }
    const review = {
      movieId,
      user,
      text,
      likes,
      date: new Date(),
    };
    const response = await db.collection("reviews").insertOne(review);

    const result = response.insertedId;
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function manipulateReview(type, data) {
  const db = await getDb();
  try {
    const id = data.id;
    const newText = data.text;
    if (!id) {
      return false;
    }
    const updateOperation = {};
    if (type === "like") {
      updateOperation.$inc = { likes: 1 };
    } else if (type === "edit") {
      const newText = data.text;
      updateOperation.$set = { text: newText };
    } else {
      // Handle invalid type
      return false;
    }
    const response = await db
      .collection("reviews")
      .findOneAndUpdate({ _id: new ObjectId(id) }, updateOperation, {
        returnOriginal: false,
      });
    const result = response.insertedId;
    return result;
  } catch (error) {
    return false;
  }
}
async function eliminate(id, type) {
  try {
    const db = getDb();
    const property = () => {
      if (type === "movie") return "movie_details";
      else if (type === "review") return "reviews";
      else return;
    };
    console.log(property(), id.id);
    const response = await db
      .collection(property())
      .deleteOne({ _id: new ObjectId(id.id) });
    const result = repsonse.insertedId;
    return result;
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function createGenre(props) {
  try {
    const db = getDb();
    const data = { id: props.id, name: props.name, movieIds: [] };
    const response = await db.collection("genres").insertOne(data);
    const result = response.insertedId;
    return result;
  } catch (error) {
    return error;
  }
}

module.exports = {
  addMovieDb,
  editMovie,
  addReview,
  manipulateReview,
  eliminate,
  createGenre,
};
