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

const redirectHome = (req, res, next) => {
  if (req.session.user) {
    res.redirect("/");
  } else {
    next();
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
router.get("/verifyNo", userController.getVerifyNo);
router.post("/verifyNo", userController.postVerifyNo);
router.get("/getMobile", redirectHome, userController.getGetMobile);
router.post("/getMobile", userController.postGetMobile);
router.get("/loginOTP", redirectHome, userController.getLoginOTP);
router.post("/loginOTP", redirectHome, userController.postLoginOTP);
router.get("/singleProduct/:id", userController.getSingleProduct);

module.exports = router;
