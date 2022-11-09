const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const verifyLogin = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

router.get("/", userController.getHome);
router.get("/login", userController.getLogin);
router.get("/signup", userController.getSignup);
router.post("/signup", userController.postSignup);
router.post("/login", userController.postLogin);
router.get("/logout", userController.getLogout);
router.get("/cart", verifyLogin, userController.getCart);
router.get("/otp", userController.getOTP);
router.post("/otp", userController.postOTP);
router.get("/loginOTP", userController.getLoginOTP);
router.post("/loginOTP", userController.postLoginOTP);

module.exports = router;
