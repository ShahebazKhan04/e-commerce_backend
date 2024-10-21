import express from "express";
import {
  getProfileController,
  loginUser,
  logoutUserController,
  registerController,
  updatePasswordController,
  updateProfileController,
  updateProfilePicController,
} from "../controllers/userController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
const userRoute = express.Router();

userRoute.post("/registerUser", registerController);
userRoute.post("/login", loginUser);
userRoute.get("/profile", isAuth, getProfileController);
userRoute.get("/logout", isAuth, logoutUserController);
userRoute.put("/register-update", isAuth, updateProfileController);
userRoute.put("/password-update", isAuth, updatePasswordController);
userRoute.put("/picture-update", singleUpload, isAuth, updateProfilePicController)
export default userRoute;
