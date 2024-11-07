import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/connectDB.js";
import morgan from "morgan";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import productRoute from "./routes/productRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import orderRoute from "./routes/orderRoute.js";
import Stripe from "stripe";
import cors from "cors";

// dot env config
dotenv.config();

// express instance
const app = express();

// database connection
connectDb();

// Stripe config
const stripe = new Stripe(process.env.STRIPE_API_SECRET);

// cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRETE,
});

// CORS configuration
app.use(cors({
  origin: "http://localhost:5173", // replace with your frontend's origin
  credentials: true, // allows cookies to be sent with requests
}));

// express middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// routes
app.use("/ecom/user", userRoute);
app.use("/ecom/product", productRoute);
app.use("/ecom/category", categoryRoute);
app.use("/ecom/order", orderRoute);

app.listen(process.env.PORT || 5500, () => {
  console.log(
    `server started at http://localhost:${process.env.PORT || 5500} on ${process.env.NODE_ENV} Mode`
  );
});
