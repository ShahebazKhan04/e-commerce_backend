import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "category is required"],
    },
  },
  { timestamps: true }
);
    
const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;
