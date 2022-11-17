const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

const verifyLogin = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};

router.get("/", adminController.getAdminHome);
router.get("/view-product", verifyLogin, adminController.getViewProduct);
router
  .route("/add-product")
  .get(verifyLogin, adminController.getAddProduct)
  .post(adminController.postAddProduct);
router.get("/delete-product/:id", adminController.getDeleteProduct);
router
  .route("/edit-product/:id")
  .get(adminController.getEditProduct)
  .post(adminController.postEditProduct);
router.get("/view-users", verifyLogin, adminController.getViewUser);
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
router.get("/view-category", verifyLogin, adminController.getViewCategory);
router
  .route("/add-category")
  .get(verifyLogin, adminController.getAddCategory)
  .post(adminController.postAddCategory);
router
  .route("/edit-category/:id")
  .get(verifyLogin, adminController.getEditCategory)
  .post(adminController.postEditCategory);
router.get("/delete-category/:id", adminController.getDeleteCategory);
router.get(
  "/delete-subcategory/:subctgry/:ctgry",
  adminController.getDeleteSubcategory
);
router.get("/orders", verifyLogin, adminController.getAllOrders);
router.post("/setStatus", adminController.postSetStatus);

module.exports = router;
