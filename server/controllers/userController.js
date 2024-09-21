import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (userId, role) => {
	return jwt.sign({ userId, role }, process.env.SECRET, { expiresIn: "30d" });
};

export const checkToken = (req, res) => {
	const token = req.headers["authorization"]?.split(" ")[1];

	if (!token) {
		return res.status(403).json({ message: "No token provided" });
	}

	jwt.verify(token, process.env.SECRET, (err, decoded) => {
		if (err) {
			if (err.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Token has expired" });
			}
			return res.status(401).json({ message: "Invalid token" });
		}

		return res.status(200).json({ message: "Token is valid", user: decoded });
	});
};

export const registerUser = async (req, res) => {
	const { name, email, password, role } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400).json({ message: "User already exists" });
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({
		name,
		email,
		password: hashedPassword,
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
		res.status(400).json({ message: "Invalid user Data" });
	}
};

export const loginUser = async (req, res) => {
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

		const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET, { expiresIn: "30d" });

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

export const getProfile = async (req, res) => {
	const userId = req.user.userId;
	try {
		const user = await User.findById(userId);
		if (!user) {
			res.status(404).json({ message: "User Not found." });
		}
        console.log(user)
		res.json({
            message: "User Found",
			user: {
				userId: user._id,
				name: user.name,
				email: user.email,
				cartItems: user.cartItems,
			},
			
		});
	} catch (error) {
		console.log("Server error: ", error.message);
		res.status(500).json({ message: "Error in getting Your Profile" });
	}
};
