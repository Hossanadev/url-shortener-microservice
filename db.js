const mongoose = require("mongoose");
require("dotenv").config();

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.URL_SHORTENER_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
  }
};

connectToDb();

const urlSchema = new mongoose.Schema({
  original_url: { type: String },
  short_url: { type: String },
});

// Create URL model
const urls = mongoose.model("url", urlSchema);

module.exports = { urls };
