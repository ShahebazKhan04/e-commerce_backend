import express from "express";
import {
  createProductController,
  deleteProductController,
  deleteProductImageController,
  getAllProductsController,
  getSingleProductController,
  productReviewController,
  updateProductController,
  updateProductImageController,
} from "../controllers/productController.js";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import { singleUpload } from "../middlewares/multer.js";
const productRoute = express.Router();

productRoute.post(
  "/create",
  isAuth,
  isAdmin,
  singleUpload,
  createProductController
);
productRoute.put("/update/:id", isAuth, isAdmin, updateProductController);
productRoute.put(
  "/update-image/:id",
  isAuth,
  isAdmin,
  singleUpload,
  updateProductImageController
);
productRoute.delete(
  "/delete-image/:id",
  isAuth,
  isAdmin,
  deleteProductImageController
);
productRoute.delete("/delete/:id", isAuth, isAdmin, deleteProductController);
productRoute.get("/all-products", getAllProductsController);
productRoute.get("/:id", getSingleProductController);

productRoute.put('/review/:id', isAuth, productReviewController)

export default productRoute;
