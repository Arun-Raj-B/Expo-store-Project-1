const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/", adminController.getAdminHome);
router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);
module.exports = router;
