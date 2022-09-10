const express = require("express");
const router = express.Router();
require("cors");

const Productcontroller = require("../controllers/ProductController");
const getProducts = Productcontroller.getProducts;
const saveProduct = Productcontroller.saveProduct;
const getProductById = Productcontroller.getProductById;
const deleteProduct = Productcontroller.deleteProduct;
const updateProduct = Productcontroller.updateProduct;

const AuthUser = require("../middleware/AuthUser");
const verifyUser = AuthUser.verifyUser;
const adminOnly = AuthUser.adminOnly;

//End point dari "/"  adalah => /api/products
router.get("/", verifyUser,  getProducts); //get all product
router.post("/", verifyUser, saveProduct); //add a product
router.get("/:id", verifyUser, getProductById); //find product by id
router.delete("/:id", verifyUser, deleteProduct); //delete product
router.patch("/:id", verifyUser, updateProduct); //update product

module.exports = router;