export const registerUserServices = async ({
  name,
  email,
  password,
  address,
  city,
  country,
  phone,
  answer,
}) => {
  try {
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
    return createUser;
  } catch (error) {
    console.log("error while regestering user in services", error.message);
  }
};
