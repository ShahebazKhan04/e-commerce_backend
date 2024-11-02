import userModel from "../models/userModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone, answer } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone ||
      !answer
    ) {
      return res.status(500).json({
        success: false,
        message: "all fields are required",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(500).json({
        success: false,
        message: "email is already taken",
      });
    }

    const createUser = await userModel.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      answer,
    });

    res.status(201).json({
      success: true,
      message: "user registered successfully",
      user: createUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while registring user",
      error: error,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(500).json({
        success: false,
        message: "please add email and password",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(500).json({
        success: false,
        message: "invalid creadential",
      });
    }

    let token = user.generateToken();

    return res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "developement" ? true : false,
        httpOnly: process.env.NODE_ENV === "developement" ? true : false,
        sameSite: process.env.NODE_ENV === "developement" ? true : false,
      })
      .json({
        success: true,
        message: "login successfully",
        user: user,
        token,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while login user",
      error: error.message,
    });
  }
};

export const getProfileController = async (req, res) => {
  try {
    // const user = req.user;
    const user = await userModel.findById(req.user._id);
    user.password = undefined;
    res.status(200).json({
      success: true,
      message: "user profile got successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while getting profile",
      error: error.message,
    });
  }
};

export const logoutUserController = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === "developement" ? true : false,
        httpOnly: process.env.NODE_ENV === "developement" ? true : false,
        sameSite: process.env.NODE_ENV === "developement" ? true : false,
      })
      .json({
        success: true,
        message: "user logout Successfully",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while logout user",
      error: error.message,
    });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    let { name, email, address, city, country, phone } = req.body;
    const user = await userModel.findByIdAndUpdate(
      req.user._id,
      { name, email, address, city, country, phone },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while updating profile",
      error: error.message,
    });
  }
};

export const updatePasswordController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(500).json({
        success: false,
        message: "please enter oldPassword and newPassword",
      });
    }

    const isMatch = user.comparePassword(newPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid old password",
      });
    }
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "password updated successfully",
      password: newPassword,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while updating password",
      error: error.message,
    });
  }
};

export const updateProfilePicController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);

    // Ensure that the uploaded file is accessible
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided",
      });
    }

    // Convert uploaded file to Data URI
    const file = getDataUri(req.file); // Correct usage: Use `req.file`, not `user.file`

    // Optional: Delete the previous profile picture if it exists
    if (user.profilePic?.public_id) {
      await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    }

    // Upload the new profile picture to Cloudinary
    const cloudinaryDb = await cloudinary.v2.uploader.upload(file.content);

    // Update user's profile picture details
    user.profilePic = {
      public_id: cloudinaryDb.public_id,
      url: cloudinaryDb.secure_url,
    };
    await user.save(); // Await the save operation

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while updating picture",
      error: error.message,
    });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;
    if (!email || !newPassword || !answer) {
      return res.status(404).json({
        success: false,
        message: "all fields are required",
      });
    }
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid User and answer",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "password has reset successfully ",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while resetting password",
      error: error.message,
    });
  }
};
