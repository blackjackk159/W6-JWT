const express = require("express");
const router = express.Router();
const postsController = require("../controllers/posts");
const authsControllers = require("../controllers/auth");

router
  .route("/")
  .get(postsController.getAll)
  .post(authsControllers.isAuth, postsController.createOne);

router
  .route("/:id")
  .get(postsController.getOne)
  .delete(authsControllers.isAuth, postsController.deleteAll);

module.exports = router;
