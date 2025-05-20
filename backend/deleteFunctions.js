const { getDb, getClient } = require("./db");
const { ObjectId, MongoError } = require("mongodb");
async function deleteReview(id) {
  const db = getDb();
  const reviewObjectId = new ObjectId(id);
  try {
    const deletion = await db
      .collection("reviews")
      .deleteOne({ _id: reviewObjectId });
    const removal = await db
      .collection("movie")
      .updateOne(
        { reviewIds: reviewObjectId },
        { $pull: { reviewIds: reviewObjectId } }
      );
    return { deletion, removal };
  } catch (error) {
    console.error("error in transaction", error);
    throw error;
  }
}
async function deleteRating(movieId, userId) {
  const db = getDb();
  try {
    const movie = await db.collection("movie").findOne({ _id: movieId });
    const updatedRatings = movie.ratings.filter(
      (r) => !r.userId.equals(new ObjectId(userId))
    );
    const result = await db
      .collection("movie")
      .updateOne({ _id: movieId }, { $set: { ratings: updatedRatings } });
    const affectedMovies = await db
      .collection("movie")
      .find({ _id: movieId })
      .toArray();
    const updateOps = affectedMovies.map((movie) => {
      const newRatingCount = movie.ratings?.length || 0;
      const newAverage =
        movie.ratings?.length > 0
          ? movie.ratings.reduce((sum, r) => sum + r.rating, 0) /
            movie.ratings.length
          : 0;
      return {
        updateOne: {
          filter: { _id: movie._id },
          update: {
            $set: {
              currentRating: parseFloat(newAverage),
              NoOfRatings: parseFloat(newRatingCount),
            },
          },
        },
      };
    });
    if (updateOps.length > 0) {
      await db.collection("movie").bulkWrite(updateOps);
    }
    return true;
  } catch (error) {
    console.error("error in transaction", error);
    throw error;
  }
}
async function banUser({
  userId = "681c4d2253d644260cfc6e9f",
  reviewIds = [],
  movieIds = [986056, 1241436],
  type = "delete",
}) {
  let database;
  let client;
  let session; // For transactions

  try {
    // Validate inputs
    if (!userId) throw new Error("User ID is required");
    if (type !== "delete" && type !== "ban") {
      throw new Error('Type must be either "delete" or "ban"');
    }

    // Convert IDs upfront to fail fast if invalid
    const userObjectId = new ObjectId(userId);
    const reviewObjectIds = reviewIds?.map((id) => new ObjectId(id)) || [];
    const movieObjectIds = movieIds?.map((id) => new ObjectId(id)) || [];

    database = await getDb();
    client = await getClient();
    session = client.startSession();

    await session.withTransaction(async () => {
      // Handle user deletion/ban
      const usersCollection = database.collection("users");

      if (type === "delete") {
        const deleteResult = await usersCollection.deleteOne(
          { _id: userObjectId },
          { session }
        );

        if (deleteResult.deletedCount === 0) {
          throw new Error("User not found");
        }
      } else {
        const updateResult = await usersCollection.updateOne(
          { _id: userObjectId },
          { $set: { isBanned: true } },
          { session }
        );

        if (updateResult.matchedCount === 0) {
          throw new Error("User not found");
        }
      }

      // Delete reviews if provided
      if (reviewObjectIds.length > 0) {
        const reviewsCollection = database.collection("reviews");
        const deleteResult = await reviewsCollection.deleteMany(
          { _id: { $in: reviewObjectIds } },
          { session }
        );
      }

      // Update movies if provided
      if (movieObjectIds.length > 0) {
        const movieDetailsCollection = database.collection("movie");

        // First pull the reviews and ratings
        const pullResult = await movieDetailsCollection.updateMany(
          { _id: { $in: movieObjectIds } },
          {
            $pull: {
              reviewIds: { $in: reviewObjectIds },
            },
          },
          { session }
        );
        for (const Id of movieIds) {
          const currentMovie = await movieDetailsCollection
            .find({
              _id: Id,
            })
            .toArray();
          if (!currentMovie.length) continue;
          const updatedRatings = await currentMovie[0].ratings.filter(
            (r) => !r.userId.equals(new ObjectId(userId))
          );
          await database
            .collection("movie")
            .updateOne(
              { _id: Id },
              { $set: { ratings: updatedRatings } },
              { session }
            );
          const updatedMovie = await database
            .collection("movie")
            .find({ _id: Id })
            .toArray();
          const originalMovie = currentMovie[0];
          const newMovie = originalMovie.ratings.filter(
            (r) => !r.userId.equals(userObjectId)
          );
          const updateOps = currentMovie.map((movie) => {
            const newRatingCount = newMovie.ratings?.length || 0;
            const newAverage =
              newMovie.ratings?.length > 0
                ? newMovie.ratings.reduce((sum, r) => sum + r.rating, 0) /
                  newMovie.ratings.length
                : 0;
            return {
              updateOne: {
                filter: { _id: movie._id },
                update: {
                  $set: {
                    currentRating: newAverage,
                    NoOfRatings: newRatingCount,
                  },
                },
              },
            };
          });

          if (updateOps.length > 0) {
            await movieDetailsCollection.bulkWrite(updateOps, { session });
          }
        }
      }
    });
  } catch (error) {
    // Log the error with context
    console.error("Ban user operation failed:", {
      error: error.message,
      userId,
      type,
      reviewIds,
      movieIds,
      stack: error.stack,
    });

    // Differentiate between expected and unexpected errors
    if (error instanceof MongoError) {
      throw new Error("Database operation failed");
    } else if (error.message.includes("not found")) {
      throw error; // Re-throw validation errors
    } else {
      throw new Error("Failed to process ban request");
    }
  } finally {
    if (session) {
      await session.endSession();
    }
  }
}
module.exports = {
  deleteReview,
  banUser,
  deleteRating,
};
