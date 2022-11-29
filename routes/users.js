const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const userMiddlewear = require("../middlewares/userMiddlewear");

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
router.get("/cart", userMiddlewear.verifyLogin, userController.getCart);
//verifyLogin required
router.get("/addToCart/:id", userController.getAddToCart);
router.get("/wishlist", userMiddlewear.verifyLogin, userController.getWishlist);
//verifyLogin required
router.get(
  "/addToWishlist/:id",
  userMiddlewear.verifyLogin,
  userController.getAddToWishlist
);
router.route("/otp").get(userController.getOTP).post(userController.postOTP);
router
  .route("/verifyNo")
  .get(userController.getVerifyNo)
  .post(userController.postVerifyNo);
router
  .route("/getMobile")
  .get(userMiddlewear.redirectHome, userController.getGetMobile)
  .post(userController.postGetMobile);
router
  .route("/loginOTP")
  .get(userMiddlewear.redirectHome, userController.getLoginOTP)
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
  .get(userMiddlewear.verifyLogin, userController.getplaceOrder)
  .post(userController.postplaceOrder);

router.get("/orders", userMiddlewear.verifyLogin, userController.getOrders);
router.get(
  "/viewOrderProducts/:id",
  userMiddlewear.verifyLogin,
  userController.getViewOrderProducts
);
router.post("/cancelOrder", userController.postCancelOrder);
router.get("/category/:id", userController.getCategoryProducts);
router.post("/saveAddress", userController.postSaveAddress);
router.post("/verifyPayment", userController.postverifyPayment);
router.post("/paypal/:total", userController.postPaypalOrder);
router.post("/paypal/:orderID/capture", userController.postApprove);
router.get("/profile", userMiddlewear.verifyLogin, userController.getProfile);
router.post("/deleteAddress", userController.postDeleteAddress);
router.post("/editEmail", userController.postEditEmail);
router.post("/editMobile", userController.postEditMobile);
router.post("/checkCoupon", userController.postCheckCoupon);

module.exports = router;
