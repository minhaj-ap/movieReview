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
    const db = await getDb();
    const userId = params.userId;
    const review = params.review;
    const movieId = params.movieId;
    if (!userId || !review || !movieId) {
      return false;
    }
    const reviewData = {
      userId: new ObjectId(userId),
      review,
      date: new Date(),
    };
    const response = await db.collection("reviews").insertOne(reviewData);

    const reviewId = response.insertedId;
    const addingToMovie = await db
      .collection("movie_details")
      .updateOne(
        { _id: new ObjectId(movieId) },
        { $push: { reviewIds: new ObjectId(reviewId) } }
      );
    console.log(addingToMovie);
    return addingToMovie;
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function addRating(data) {
  const db = getDb();
  try {
    const movieId = data.movieId;
    const userId = data.userId;
    const rating = parseFloat(data.rating);
    const collection = db.collection('movie_details');

    // Check if the user has already rated the movie
    const movie = await collection.findOne({ _id: new ObjectId(movieId), 'ratings.userId': new ObjectId(userId) });

    if (movie) {
      // User has rated the movie before, update the rating
      await collection.updateOne(
        { _id: new ObjectId(movieId), 'ratings.userId': new ObjectId(userId) },
        { $set: { 'ratings.$.rating': rating } }
      );

      // Recalculate the current rating
      const updatedMovie = await collection.findOne({ _id: new ObjectId(movieId) });
      const totalRating = updatedMovie.ratings.reduce((acc, rating) => acc + rating.rating, 0);
      const newCurrentRating = totalRating / updatedMovie.ratings.length;

      await collection.updateOne(
        { _id: new ObjectId(movieId) },
        { $set: { currentRating: newCurrentRating } }
      );
    } else {
      // User has not rated the movie before, add the rating
      await collection.updateOne(
        { _id: new ObjectId(movieId) },
        {
          $push: { ratings: { userId: new ObjectId(userId), rating: rating } },
          $inc: { NoOfRatings: 1 },
        }
      );

      // Recalculate the current rating
      const updatedMovie = await collection.findOne({ _id: new ObjectId(movieId) });
      const totalRating = updatedMovie.ratings.reduce((acc, rating) => acc + rating.rating, 0);
      const newCurrentRating = totalRating / updatedMovie.ratings.length;

     const finalOutput = await collection.updateOne(
        { _id: new ObjectId(movieId) },
        { $set: { currentRating: newCurrentRating } }
      );
    }

    console.log('Rating update successful');
    return finalOutput
  } catch (error) {
    return error;
  }
}
async function manipulateReview(data) {
  const db = await getDb();
  try {
    const id = data.id;
    if (!id) {
      return false;
    }
    const updateOperation = {};
    const review = data.review;
    updateOperation.$set = { review: review };

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
  addRating,
  manipulateReview,
  eliminate,
  createGenre,
  addUser,
  loginUser,
  loginAdmin,
};
