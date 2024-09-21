import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { createProduct, deleteProduct, getAllProducts, getFeaturedProducts, getProductById, getProductByIdProtected,  getUserProducts, setFeatured, updateProduct } from "../controllers/productController.js";

const router = express.Router();

//public routes
router.get("/get-all-products", getAllProducts);

router.get("/get-product/:productId", getProductById);

router.get("/get-featured", getFeaturedProducts);


//private routes
router.post("/create", protect, adminOnly, createProduct);

router.get("/user-products", protect, adminOnly, getUserProducts);

router.get("/user-products/:productId", protect, adminOnly, getProductByIdProtected);

router.put("/products/:productId", adminOnly, updateProduct);

router.delete("/products/:productId", adminOnly, deleteProduct);

router.get("/set-featured/:productId", protect, adminOnly, setFeatured);

export default router;
