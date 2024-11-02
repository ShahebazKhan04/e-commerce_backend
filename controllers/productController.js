import productModel from "../models/productModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

export const getAllProductsController = async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json({
      success: true,
      message: "got all produts",
      products: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while getting all products",
      error: error.message,
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const oneProduct = await productModel.findById(req.params.id);
    if (!oneProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "one product got",
      product: oneProduct,
    });
  } catch (error) {
    // cast error || object ID
    if (error.name === "CastError") {
      return res.status(500).json({
        success: false,
        message: "Invalid id",
      });
    }
    res.status(500).json({
      success: false,
      message: "error while getting single products",
      error: error.message,
    });
  }
};

export const createProductController = async (req, res) => {
  try {
    let { name, description, price, stock, quantity, category, image } =
      req.body;

    if (!name || !description || !price || !stock || !quantity || !category) {
      return res.status(500).json({
        success: false,
        message: "all fields are required",
      });
    }

    const file = getDataUri(req.file);
    const cloudinaryDb = await cloudinary.v2.uploader.upload(file.content);
    if (!req.file) {
      return res.status(500).json({
        success: false,
        message: "please provide product image",
      });
    }
    image = {
      public_id: cloudinaryDb.public_id,
      url: cloudinaryDb.secure_url,
    };

    const product = await productModel.create({
      name,
      description,
      price,
      stock,
      quantity,
      category,
      images: [image],
    });

    res.status(201).json({
      success: true,
      message: "product created successfully",
      product: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while creating product",
      error: error.message,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!product) {
      return res.status(500).json({
        success: false,
        message: "product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "product updated successfully",
      updatedProduct: product,
    });
  } catch (error) {
    if (error.name == "CastError") {
      return res.status(500).json({
        success: false,
        message: "Invalid ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "error while updating product",
      error: error.message,
    });
  }
};

export const updateProductImageController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(req.params.id);
    if (!product) {
      return res.status(500).json({
        success: false,
        message: "product not found",
      });
    }

    if (!req.file) {
      return res.status(500).json({
        success: false,
        message: "no file provided",
      });
    }
    const file = await getDataUri(req.file);
    // if (user.profilePic?.public_id) {
    //   await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
    // }

    const cloudinaryDb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cloudinaryDb.public_id,
      url: cloudinaryDb.secure_url,
    };
    // save
    product.images.push(image);
    await product.save();
    res.status(201).json({
      success: true,
      message: "image updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while updating product Image",
      error: error.message,
    });
  }
};

export const deleteProductImageController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(500).json({
        success: false,
        message: "No product found",
      });
    }

    const id = req.query.id;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "product image not found",
      });
    }

    let isExist = -1;
    product.images.forEach((imageItem, index) => {
      if (imageItem._id.toString() === id.toString()) isExist = index;
    });
    if (isExist < 0) {
      return res.status(404).json({
        success: false,
        message: "image not found",
      });
    }

    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
    product.images.splice(isExist, 1);
    await product.save();

    return res.status(200).json({
      success: true,
      message: "producr image deleted successfully",
    });
  } catch (error) {
    if (error.name == "CastError") {
      return res.status(500).json({
        success: false,
        message: "Invalid ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "error while deleting product Image",
      error: error.message,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "product not found",
      });
    }
    for (let index = 0; index < product.images.length; index++) {
      await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }
    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while deleting product Image",
      error: error.message,
    });
  }
};

export const productReviewController = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if the user has already reviewed the product
    const alreadyReviewed = product.reviews.find((review) => {
      return review.user.toString() === req.user._id.toString();
    });
    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Product already reviewed",
      });
    }

    const review = {
      name: req.user.name,
      rating,
      comment,
      user: req.user._id,
    };

    // Add the new review to the product's reviews array
    product.reviews.push(review);

    // Update the number of reviews and the overall rating
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // Save the updated product
    await product.save();

    res.status(201).json({
      success: true,
      message: "Review added",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Error while adding review",
      error: error.message,
    });
  }
};
