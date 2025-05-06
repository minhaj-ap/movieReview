const { getDb } = require("./db");
const { ObjectId } = require("mongodb");
async function deleteReview(id) {
  const db = getDb();
  const reviewObjectId = new ObjectId(id);
  try {
    const deletion = await db
      .collection("reviews")
      .deleteOne({ _id: reviewObjectId });
    console.log("deletion", deletion);
    const results = await db
      .collection("movie")
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
  console.log("[1] Starting banUser with details:", {
    userId,
    reviewIds,
    movieIds,
    type,
  });

  const database = await getDb();
  console.log("[2] Database connection established");

  // Handle user deletion/ban
  if (type === "delete") {
    console.log("[3] Processing user deletion");
    const userCollection = await database
      .collection("users")
      .deleteOne({ _id: new ObjectId(userId) });
    console.log("[4] User deletion result:", userCollection);
  } else if (type === "ban") {
    console.log("[5] Processing user ban");
    const usersCollection = database.collection("users");
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { isBanned: true } }
    );
    console.log("[6] User ban completed");
  }

  // Delete reviews from reviews collection
  if (reviewIds && reviewIds.length > 0) {
    console.log("[7] Processing review deletion with IDs:", reviewIds);
    const reviewsCollection = database.collection("reviews");
    const reviewObjectIds = reviewIds.map((id) => new ObjectId(id));
    console.log("[8] Converted review IDs to ObjectIds:", reviewObjectIds);

    const deleteResult = await reviewsCollection.deleteMany({
      _id: { $in: reviewObjectIds },
    });
    console.log("[9] Reviews deletion result:", deleteResult);
  } else {
    console.log("[10] No reviewIds provided or empty array");
  }

  // Update movie documents
  if (movieIds && movieIds.length > 0) {
    console.log("[11] Processing movie updates with IDs:", movieIds);
    const movieDetailsCollection = database.collection("movie");


    const reviewObjectIds = reviewIds
      ? reviewIds.map((id) => new ObjectId(id))
      : [];
    const userObjectId = new ObjectId(userId);
    console.log("[15] Prepared IDs:", {
      reviewObjectIds,
      userObjectId,
    });

    // First pull the review IDs and ratings
    console.log("[16] Attempting to pull reviews and ratings from movies");
    const pullResult = await movieDetailsCollection.updateMany(
      { _id: { $in: movieIds } },
      {
        $pull: {
          reviewIds: { $in: reviewObjectIds },
          ratings: { userId: userObjectId },
        },
      }
    );
    console.log("[17] Pull operation result:", pullResult);

    // Then recalculate ratings for affected movies
    console.log("[18] Finding affected movies for rating recalculation");
    const affectedMovies = await movieDetailsCollection
      .find({
        _id: { $in: movieIds },
      })
      .toArray();

    console.log("[19] Found affected movies:", affectedMovies.length);

    for (const [index, movie] of affectedMovies.entries()) {
      console.log(
        `[20] Processing movie ${index + 1}/${affectedMovies.length}`,
        {
          movieId: movie._id,
          currentRatings: movie.ratings ? movie.ratings.length : 0,
          currentReviewIds: movie.reviewIds ? movie.reviewIds.length : 0,
        }
      );

      const newRatingCount = movie.ratings ? movie.ratings.length : 0;
      const newAverage =
        movie.ratings && movie.ratings.length > 0
          ? movie.ratings.reduce((sum, r) => sum + r.rating, 0) /
            movie.ratings.length
          : 0;

      console.log(`[21] Movie ${movie._id} new values:`, {
        newRatingCount,
        newAverage,
      });

      const updateResult = await movieDetailsCollection.updateOne(
        { _id: movie._id },
        {
          $set: {
            currentRating: newAverage,
            NoOfRatings: newRatingCount,
          },
        }
      );
      console.log(`[22] Update result for movie ${movie._id}:`, updateResult);
    }
  } else {
    console.log("[23] No movieIds provided or empty array");
  }

  console.log("[24] banUser function completed");
}
module.exports = {
  deleteReview,
  banUser,
};
