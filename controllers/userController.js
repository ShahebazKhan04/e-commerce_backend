import userModel from "../models/userModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone
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

    const user = await userModel.findOne({email});

    if(!user) {
        res.status(404).json({
            success : false,
            message : "user not found"
        })
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch) {
        return res.status(500).json({
            success : false,
            message : "invalid creadential"
        })
    }

    res.status(200).json({
        success : true,
        message : "login successfully",
        user : user
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while login user",
      error: error.message,
    });
  }
};
