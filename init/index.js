const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Connection Error:", err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  
  // Add an 'owner' field (replace 'ownerIdHere' with a real ObjectId)
  const sampleOwnerId = "685b9ec7c97fa1e522ca6bd0"; // Replace with actual ObjectId

  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: sampleOwnerId,
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log("Database initialized with sample data.");
};

initDB();
