const { MongoClient } = require("mongodb");
require("dotenv").config();
const url = process.env.MONGODB_URI;
const dbName = "Movies";
let db;
async function connectDb() {
  const options = {
    useNewUrlParser: true,
  }
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
