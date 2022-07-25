const router = require("express").Router();
const userController = require("../../controllers/userController");

// Matches route with "/api/user/"
router.route("/").post(userController.addUser);

module.exports = router;
