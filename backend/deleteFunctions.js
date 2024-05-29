const { getDb } = require("./db");
const { ObjectId } = require("mongodb");
async function deleteMovie(id) {
  try {
    const db = getDb(); // Assuming getDb() is your function to get the database instance
    if (!ObjectId.isValid(id)) {
      return false;
    }
    const movieObjectId = new ObjectId(id);

    // const session = db.startSession();
    // session.startTransaction();
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

module.exports = {
  deleteMovie,
};
