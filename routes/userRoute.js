import express from "express";
import {
  loginUser,
  registerController,
} from "../controllers/userController.js";
const userRoute = express.Router();

userRoute.post("/registerUser", registerController);
userRoute.post("/login", loginUser);
export default userRoute;
