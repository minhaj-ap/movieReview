const { MongoClient } = require("mongodb");
const url =
  "mongodb+srv://minhajap00:pUUchraRZfpEqUFJ@entriproject.wnfci6m.mongodb.net/?retryWrites=true&w=majority&appName=entriProject";
const dbName = "Movies";
let db;
async function connectDb() {
  const options = {
    useNewUrlParser: true,
  };
  const client = new MongoClient(url, options);
  await client.connect();
  db = client.db(dbName);
  console.log("Connected to MongoDB");
}
function getDb() {
  if (!db) {
    throw new Error("No MongoDB connection");
  }
  return db;
}
module.exports = { connectDb, getDb };
