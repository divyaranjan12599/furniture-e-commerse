import express from "express";
import { loginUser, registerUser, checkToken, getProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get("/check", checkToken);

router.get("/get-profile", protect, getProfile);

export default router;