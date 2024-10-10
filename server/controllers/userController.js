// import User from "../models/userModel.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js")
const bcrypt = require("bcryptjs")

const generateToken = (userId, role) => {
	return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

exports.checkToken = (req, res) => {
	const token = req.headers["authorization"]?.split(" ")[1];

	if (!token) {
		return res.status(403).json({ message: "No token provided" });
	}

	jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
		if (err) {
			if (err.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Token has expired" });
			}
			return res.status(401).json({ message: "Invalid token" });
		}

		return res.status(200).json({ message: "Token is valid", user: decoded });
	});
};

exports.registerUser = async (req, res) => {
	const { name, email, password, phone, address, city, country, zip, role } = req.body;

	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			name,
			email,
			password: hashedPassword,
			phone,
			address,
			city,
			country,
			zip,
			role,
		});

		if (user) {
			const newUser = {
				_id: user._id,
				name: user.name,
				email: user.email,
				token: generateToken(user._id, user.role),
			};
			res.status(201).json({
				message: "User Registered Successfully",
				newUser,
			});
		} else {
			res.status(400).json({ message: "Invalid user data" });
		}
	} catch (error) {
		console.error("Server error:", error.message);
		res.status(500).json({ message: "Error in registering user" });
	}
};

exports.loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid email" });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid password" });
		}

		const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

		res.json({
			token,
			user: {
				userId: user._id,
				name: user.name,
				email: user.email,
				cartItems: user.cartItems,
				role: user.role,
			},
		});
	} catch (error) {
		console.error("Server error:", error.message);
		res.status(500).json({ message: "Error in login" });
	}
};

