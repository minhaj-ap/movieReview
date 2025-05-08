const { MongoClient } = require("mongodb");
require("dotenv").config();
const url = process.env.MONGODB_URI;
const dbName = "Movies";
let db;
let client;
async function connectDb() {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  client = new MongoClient(url, options);
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
function getClient() {
  if (!client) {
    throw new Error("No MongoDB connection");
  }
  return client;
}
module.exports = { connectDb, getDb, getClient };
