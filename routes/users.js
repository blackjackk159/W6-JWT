const express = require("express");
const router = express.Router();
const usersControllers = require("../controllers/users");
const authsControllers = require("../controllers/auth");

router.route("/").get(usersControllers.getAll).post(usersControllers.createOne);

router.post("/sign_up", usersControllers.sign_up);
router.post("/sign_in", usersControllers.sign_in);

router
  .route("/updatePassword")
  .patch(authsControllers.isAuth, usersControllers.updatePassword)

router
  .route("/profile")
  .get(authsControllers.isAuth, usersControllers.getProfile)
  .post(authsControllers.isAuth, usersControllers.updateProfile);

router
  .route("/:id")
  .get(usersControllers.getOne)
  .delete(usersControllers.deleteAll);

module.exports = router;
