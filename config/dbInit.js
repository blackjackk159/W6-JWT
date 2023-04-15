require("dotenv").config();
const mongoose = require("mongoose");
const DB = process.env.DB.replace("<DB_USER>", process.env.DB_USER)
  .replace("<DB_PASSWORD>", process.env.DB_PASSWORD)
  .replace("<DB_NAME>", process.env.DB_NAME);
mongoose.connect(DB, { useNewUrlParser: true }).then((con) => {
  console.log("DB connection successful!");
});
