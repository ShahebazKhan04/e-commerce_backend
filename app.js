import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/connectDB.js";
import morgan from "morgan";
import userRoute from "./routes/userRoute.js";
import cookieParser from "cookie-parser";
import cloudinary from 'cloudinary'
import productRoute from "./routes/productRoute.js";

// dot env config
dotenv.config();

// express instance
const app = express();

// database connection
connectDb();

// cloudinary config
cloudinary.v2.config({
  cloud_name : process.env.CLOUDINARY_NAME,
  api_key : process.env.CLOUDINARY_API_KEY,
  api_secret : process.env.CLOUDINARY_SECRETE 
})

// expresss middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// routes
app.use("/ecom/user", userRoute);
app.use("/ecom/product", productRoute);

app.listen(process.env.PORT || 5500, () => {
  console.log(
    `server started at http://localhost:${process.env.PORT} on ${process.env.NODE_ENV} Mode`
  );
});
