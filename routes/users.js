const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getHome);
router.get("/login", userController.getLogin);
router.get("/signup", userController.getSignup);

module.exports = router;
