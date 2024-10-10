const jwt = require("jsonwebtoken")

const protect = async (req, res, next) => {
	let token;

	if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
		try {
			
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.SECRET);

			req.user = decoded;

			next();
		} catch (error) {
			console.error(error);
			res.status(401).json({ message: "Not authorized, token failed" });
		}
	}

	if (!token) {
		res.status(401).json({ message: "Not authorized, no token" });
	}
};

// const adminOnly = (req, res, next) => {
// 	if (req.user && req.user.role === "admin") {
// 		next();
// 	} else {
// 		res.status(403);
// 		throw new Error("Not authorized as an admin");
// 	}
// };

module.exports={
	protect
}