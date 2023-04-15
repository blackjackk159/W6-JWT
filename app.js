process.on("uncaughtException", (err) => {
  console.log("Uncaught exception happen!");
  console.log(err);
  process.exit(1);
});

require("./config/dbInit");
const cors = require("cors");
const express = require("express");
const handleError = require("./utils/handleError");
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// Routes not found
app.all("*", (req, res, next) =>
  res.status(404).json({
    statysL: "error",
    message: "route not found",
  })
);

// Deal with Error
app.use(handleError);

app.listen(3000, () => console.log("Server running at port 3000..."));

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection happen!");
  console.log(err);
  server.close(() => process.exit(1));
});
