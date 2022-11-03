const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/", adminController.getAdminHome);
router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);
router.get("/delete-product/:id", adminController.getDeleteProduct);
router.get("/edit-product/:id", adminController.getEditProduct);
router.post("/edit-product/:id", adminController.postEditProduct);
module.exports = router;
