const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/", adminController.getAdminHome);
router.get("/view-product", adminController.getViewProduct);
router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);
router.get("/delete-product/:id", adminController.getDeleteProduct);
router.get("/edit-product/:id", adminController.getEditProduct);
router.post("/edit-product/:id", adminController.postEditProduct);
router.get("/view-users", adminController.getViewUser);
router.get("/block-user/:id", adminController.updateToBlockUser);
router.get("/unblock-user/:id", adminController.updateToUnblockUser);
router.get("/signup", adminController.getAdminSignup);
router.post("/signup", adminController.postAdminSignup);
router.get("/login", adminController.getAdminLogin);
router.post("/login", adminController.postAdminLogin);
router.get("/logout", adminController.getAdminLogout);
module.exports = router;
