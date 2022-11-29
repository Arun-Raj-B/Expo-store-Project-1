const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminMiddlewear = require("../middlewares/adminMiddleWear");

router.get("/", adminController.getAdminHome);
router.get(
  "/view-product",
  adminMiddlewear.verifyLogin,
  adminController.getViewProduct
);
router
  .route("/add-product")
  .get(adminMiddlewear.verifyLogin, adminController.getAddProduct)
  .post(adminController.postAddProduct);
router.get("/delete-product/:id", adminController.getDeleteProduct);
router
  .route("/edit-product/:id")
  .get(adminController.getEditProduct)
  .post(adminController.postEditProduct);
router.get(
  "/view-users",
  adminMiddlewear.verifyLogin,
  adminController.getViewUser
);
router.get("/block-user/:id", adminController.updateToBlockUser);
router.get("/unblock-user/:id", adminController.updateToUnblockUser);
router
  .route("/signup")
  .get(adminController.getAdminSignup)
  .post(adminController.postAdminSignup);
router
  .route("/login")
  .get(adminController.getAdminLogin)
  .post(adminController.postAdminLogin);
router.get("/logout", adminController.getAdminLogout);
router.get(
  "/view-category",
  adminMiddlewear.verifyLogin,
  adminController.getViewCategory
);
router
  .route("/add-category")
  .get(adminMiddlewear.verifyLogin, adminController.getAddCategory)
  .post(adminController.postAddCategory);
router
  .route("/edit-category/:id")
  .get(adminMiddlewear.verifyLogin, adminController.getEditCategory)
  .post(adminController.postEditCategory);
router.get("/delete-category/:id", adminController.getDeleteCategory);
router.get(
  "/delete-subcategory/:subctgry/:ctgry",
  adminController.getDeleteSubcategory
);
router.get(
  "/orders",
  adminMiddlewear.verifyLogin,
  adminController.getAllOrders
);
router.post("/setStatus", adminController.postSetStatus);
router.get(
  "/requests",
  adminMiddlewear.verifyLogin,
  adminController.getCancelRequests
);
router.get(
  "/viewOrderProducts/:id",
  adminMiddlewear.verifyLogin,
  adminController.getViewOrderProducts
);
router.get("/coupons", adminMiddlewear.verifyLogin, adminController.getCoupons);

router.post("/addCoupon", adminController.postAddCoupon);
router.post("/deleteCoupon", adminController.postDeleteCoupon);
router.post("/getSubcategory", adminController.getSingleCategory);

module.exports = router;
