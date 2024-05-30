const { getDb } = require("./db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
async function addMovieDb(params) {
  try {
    const db = await getDb();
    const movie = {
      ...params,
      reviewIds: [],
      currentRating: 0.0,
      NoOfRatings: 0,
    };
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
    console.log("in function",params.user);
    const db = await getDb();
    const userId = params.user;
    const review = params.text;
    if (!userId || !review) {
      return false;
    }
    const reviewData = {
      userId : new ObjectId(userId),
      review,
      like:0,
      date: new Date(),
    };
    const response = await db.collection("reviews").insertOne(reviewData);

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
async function addUser(props) {
  const password = props.password;
  const name = props.name;
  const email = props.email;

  const hashedPassword = await bcrypt.hash(password, 5);
  try {
    const db = getDb();
    const userExists = await db.collection("users").findOne({ email: email });
    if (userExists) {
      return false;
    } else {
      const response = await db.collection("users").insertOne({
        name,
        email,
        password: hashedPassword,
      });
      const result = response.insertedId;
      return result;
    }
  } catch (error) {
    return error;
  }
}
async function loginUser(props) {
  const email = props.email;
  const password = props.password;
  try {
    const db = getDb();
    const user = await db.collection("users").findOne({ email });
    if (!user) {
      return false;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return false;
    }
    return user;
  } catch (error) {
    return error;
  }
}
async function loginAdmin(props) {
  const pass = props.password;
  try {
    const db = getDb();
    const result = await db.collection("admin").findOne({ pass: pass });
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
  addUser,
  loginUser,
  loginAdmin,
};
