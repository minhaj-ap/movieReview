const { getDb } = require("./db");
const { ObjectId } = require("mongodb");
async function deleteMovie(id) {
  try {
    const db = getDb(); // Assuming getDb() is your function to get the database instance
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const movieObjectId = new ObjectId(id);

    const result = await db
      .collection("movie_details")
      .deleteOne({ _id: movieObjectId });
    console.log(result);
    const updateResult = await db.collection("genres").updateMany(
      { movieIds: movieObjectId }, // Match the ObjectId in the array
      { $pull: { movieIds: movieObjectId } }
    );

    return updateResult;
  } catch (error) {
    return error;
  }
}
async function deleteReview(id) {
  const db = getDb();
  if (!ObjectId.isValid(id)) {
    console.log("invalid review");
    return false;
  }

  const reviewObjectId = new ObjectId(id);
  console.log("starting");
  try {
    const deletion = await db
      .collection("reviews")
      .deleteOne({ _id: reviewObjectId });
    console.log("deletion", deletion);
    const results = await db
      .collection("movie_details")
      .updateOne(
        { reviewIds: reviewObjectId },
        { $pull: { reviewIds: reviewObjectId } }
      );
    console.log("results", results);
    return results;
  } catch (error) {
    console.log("error in transaction", error);
    return error;
  }
}
async function banUser({ userId, reviewIds, movieIds, type }) {
  const database = await getDb();
  if (type === "delete") {
    const userCollection = await database
      .collection("users")
      .deleteOne({ _id: new ObjectId(userId) });
    console.log(userCollection);
  } else if (type === "ban") {
    const usersCollection = database.collection("users");
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { isBanned: true } }
    );
  }
  if (reviewIds) {
    const reviewsCollection = database.collection("reviews");
    await reviewsCollection.deleteMany({
      _id: { $in: reviewIds.map((id) => new ObjectId(id)) },
    });
  }
  if (movieIds) {
    const movieDetailsCollection = database.collection("movie_details");
    await movieDetailsCollection.updateMany(
      { _id: { $in: movieIds.map((id) => new ObjectId(id)) } },
      { $pull: { reviewIds: { $in: reviewIds.map((id) => new ObjectId(id)) } } }
    );
  }
}
module.exports = {
  deleteMovie,
  deleteReview,
  banUser,
};
