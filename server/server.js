import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoute.js"

const app = express();


dotenv.config();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/user", userRoutes);
app.use("/user/product", productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  