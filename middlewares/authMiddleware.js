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
  // console.log("decodeData==>" , decodeData)
  // decodeData==> { _id: '6710eb76baf2edfbf897fbaa', iat: 1730282588, exp: 1730887388 }

  req.user = await userModel.findById(decodeData._id);
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Admin only",
    });
  }
  next();
};
