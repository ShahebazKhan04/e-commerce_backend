import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const isAuth = async (req, res, next) => {
  const { token } = req.cookies;
//   const beartoken = req.header("Authorization"); 
//     let arrToken = beartoken.split(" ");
//     let token = arrToken[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "unotherized User",
    });
  }
  const decodeData = jwt.verify(token, process.env.SECRETE_KEY);
  req.user = await userModel.findById(decodeData._id);
  next();
};
