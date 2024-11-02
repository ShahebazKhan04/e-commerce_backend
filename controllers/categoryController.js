import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { category } = req.body;
    const createCategory = await categoryModel.create({ category });
    if (!categoryModel) {
      return res.status(404).json({
        success: false,
        message: "please select category",
      });
    }
    res.status(201).json({
      success: true,
      message: `${createCategory.category} category created successfully`,
      cetagory: createCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while creating category",
      error: error.message,
    });
  }
};

export const getAllCategory = async (req, res) => {
  try {
    const getCaterories = await categoryModel.find();
    res.status(200).json({
      success: true,
      message: "got all categories",
      totalCategories: getCaterories.length,
      categories: getCaterories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while getting category",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "category not found",
      });
    }
    // finding product with category id
    const products = await productModel.find({ category: category._id });
    // if category deleted then showing undefined in product
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = undefined;
      await product.save();
    }
    res.status(200).json({
      success: true,
      message: "category deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(500).json({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).json({
      success: false,
      message: "error while deleting category",
      error: error.message,
    });
  }
};
export const updateCategory = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndUpdate(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "category not found",
      });
    }
    // get new category
    const {updatedCategory} = req.body
    // finding product with category id
    const products = await productModel.find({ category: category._id });
    // if category deleted then showing undefined in product
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.category = updatedCategory;
      await product.save();
    }
    if(updatedCategory) category.category = updatedCategory
    await category.save()
    res.status(200).json({
      success: true,
      message: "category updated successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(500).json({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).json({
      success: false,
      message: "error while updating category",
      error: error.message,
    });
  }
};
