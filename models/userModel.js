import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email is already taken"],
      minLenght: [6, "password lenght should be greater than 6"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    address: {
      type: String,
      required: [true, "address is requies"],
    },
    city: {
      type: String,
      required: [true, "city is requied"],
    },
    country: {
      type: String,
      required: [true, "country is required"],
    },
    phone: {
      type: String,
      required: [true, "phone is requied"],
    },
    profilePic: {
      type: String,
    },
  },
  { timestamps: true }
);

// hashing password
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});

//comparing password
// with the help of method you can create functions in models
userSchema.methods.comparePassword =  async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password)
}
export const userModel = mongoose.model("Users", userSchema);
export default userModel;
