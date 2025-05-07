const { getDb } = require("./db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const apiKey = process.env.TMDB_API;
async function addReview(params) {
  try {
    const db = await getDb();
    const userId = params.userId;
    const review = params.review;
    const movieId = params.movieId;
    const movieData = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
    );
    const movieRes = await movieData.json();
    const movieName = movieRes.title;
    if (!userId || !review || !movieId) {
      throw new Error("no enough parameters");
    }
    const reviewData = {
      userId: new ObjectId(userId),
      review,
      movieId,
      movieName,
      date: new Date(),
    };
    const response = await db.collection("reviews").insertOne(reviewData);
    const reviewId = response.insertedId;
    await db
      .collection("movie")
      .updateOne(
        { $and: [{ _id: parseInt(movieId) }, { movieName: movieName }] },
        { $push: { reviewIds: new ObjectId(reviewId) } },
        { upsert: true }
      );
    return addingToMovie;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function addRating(data) {
  const db = getDb();
  try {
    const movieId = isNaN(data.movieId)
      ? new ObjectId(data.movieId) // If it's a valid ObjectId string
      : parseInt(data.movieId);
    const userId = new ObjectId(data.userId);
    const rating = parseFloat(data.rating);
    const collection = db.collection("movie");

    // Check if user already rated this movie
    const movie = await collection.findOne({
      _id: parseInt(movieId),
    });

    let finalOutput;
    const movieData = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`
    );
    const movieRes = await movieData.json();
    const movieName = movieRes.title;
    if (movie) {
      // Update existing rating
      const existingRating = await collection.findOne({
        "ratings.userId": userId,
      });

      if (existingRating) {
        // User exists → Update their rating
        await collection.updateOne(
          { _id: movieId, "ratings.userId": userId },
          { $set: { "ratings.$.rating": rating } }
        );
      } else {
        // User doesn't exist → Add a new rating
        await collection.updateOne(
          { _id: movieId },
          {
            $push: { ratings: { userId, rating } },
            $inc: { NoOfRatings: 1 },
          }
        );
      }
    } else {
      // Add new rating
      finalOutput = await collection.updateOne(
        { _id: movieId }, // Only match by ID
        {
          $push: {
            ratings: {
              userId: userId,
              rating: rating,
            },
          },
          $inc: { NoOfRatings: 1 },
          // Optionally set movieName if needed
          $setOnInsert: {
            movieName: movieName,
          },
        },
        { upsert: true }
      );
    }

    // Recalculate average rating (works for both cases)
    const updatedMovie = await collection.findOne({
      _id: movieId,
    });

    if (updatedMovie?.ratings?.length) {
      const totalRating = updatedMovie.ratings.reduce(
        (acc, curr) => acc + curr.rating,
        0
      );
      const newCurrentRating = totalRating / updatedMovie.ratings.length;

      await collection.updateOne(
        { _id: movieId },
        { $set: { currentRating: newCurrentRating } }
      );
    }
    return finalOutput || { acknowledged: true }; // Return success even if just updating
  } catch (error) {
    console.error("Rating error:", error);
    throw error; // Better to throw than return the error
  }
}
async function manipulateReview(data) {
  const db = await getDb();
  try {
    const id = data.id;
    if (!id) {
      throw new Error("No review Id");
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
    console.error(error);
    throw error;
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
    console.error(error);
    throw error;
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
    if (user.isBanned) {
      return "You are banned by the administrator";
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return false;
    }
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function loginAdmin(props) {
  const pass = props.password;
  try {
    const db = getDb();
    const result = await db.collection("admin").findOne({ pass: pass });
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
async function unBanUser(id) {
  try {
    const db = await getDb();
    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(id.userId) },
        {
          $set: { isBanned: false },
        }
      )
      .toArray();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
module.exports = {
  addReview,
  addRating,
  manipulateReview,
  addUser,
  loginUser,
  loginAdmin,
  unBanUser,
};
