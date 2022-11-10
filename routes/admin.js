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
router.get("/add-product", verifyLogin, adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);
router.get("/delete-product/:id", adminController.getDeleteProduct);
router.get("/edit-product/:id", adminController.getEditProduct);
router.post("/edit-product/:id", adminController.postEditProduct);
router.get("/view-users", verifyLogin, adminController.getViewUser);
router.get("/block-user/:id", adminController.updateToBlockUser);
router.get("/unblock-user/:id", adminController.updateToUnblockUser);
router.get("/signup", adminController.getAdminSignup);
router.post("/signup", adminController.postAdminSignup);
router.get("/login", adminController.getAdminLogin);
router.post("/login", adminController.postAdminLogin);
router.get("/logout", adminController.getAdminLogout);
router.get("/view-category", verifyLogin, adminController.getViewCategory);
router.get("/add-category", verifyLogin, adminController.getAddCategory);
router.post("/add-category", adminController.postAddCategory);
router.get("/edit-category/:id", verifyLogin, adminController.getEditCategory);
router.get("/edit-category/:id", adminController.postEditCategory);
router.post("/edit-category/:id", adminController.postEditCategory);
router.get("/delete-category/:id", adminController.getDeleteCategory);
router.get(
  "/delete-subcategory/:subctgry/:ctgry",
  adminController.getDeleteSubcategory
);

module.exports = router;
