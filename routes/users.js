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
router
  .route("/login")
  .get(userController.getLogin)
  .post(userController.postLogin);
router
  .route("/signup")
  .get(userController.getSignup)
  .post(userController.postSignup);
router.get("/logout", userController.getLogout);
router.get("/cart", verifyLogin, userController.getCart);
//verifyLogin required
router.get("/addToCart/:id", userController.getAddToCart);
router.get("/wishlist", verifyLogin, userController.getWishlist);
//verifyLogin required
router.get("/addToWishlist/:id", verifyLogin, userController.getAddToWishlist);
router.route("/otp").get(userController.getOTP).post(userController.postOTP);
router
  .route("/verifyNo")
  .get(userController.getVerifyNo)
  .post(userController.postVerifyNo);
router
  .route("/getMobile")
  .get(redirectHome, userController.getGetMobile)
  .post(userController.postGetMobile);
router
  .route("/loginOTP")
  .get(redirectHome, userController.getLoginOTP)
  .post(userController.postLoginOTP);
router.get("/singleProduct/:id", userController.getSingleProduct);
router.post(
  "/changeCartProductQuantity",
  userController.postChangeCartProductQuantity
);
router.post(
  "/changeWishlistProductQuantity",
  userController.postChangeWishlistProductQuantity
);
router.get(
  "/removeCartProduct/:cartId/:prodId",
  userController.postRemoveCartProduct
);
router.get(
  "/removeWishlistProduct/:wishlistId/:prodId",
  userController.postRemoveWishlistProduct
);
router.post("/wishlistToCart", userController.postWishlistToCart);
router
  .route("/placeOrder")
  .get(verifyLogin, userController.getplaceOrder)
  .post(userController.postplaceOrder);

router.get("/orders", verifyLogin, userController.getOrders);
router.get(
  "/viewOrderProducts/:id",
  verifyLogin,
  userController.getViewOrderProducts
);
router.post("/cancelOrder", userController.postCancelOrder);
router.get("/category/:id", userController.getCategoryProducts);
router.post("/saveAddress", userController.postSaveAddress);

module.exports = router;
