const express = require("express")
const { protect } = require("../middleware/authMiddleware.js");
const userController = require("../controllers/userController.js")
const router = express.Router();

router.route('/register').post(userController.registerUser);

router.route('/login').post(userController.loginUser);

// router.post('/admin/login', adminLoginUser);

router.route('/check-token').get(userController.checkToken);

// router.get("/get-profile", protect, getProfile);

module.exports = router;