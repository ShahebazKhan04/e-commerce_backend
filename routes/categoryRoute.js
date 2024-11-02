import express from "express";
import { isAuth } from "../middlewares/authMiddleware.js";
import { createCategoryController, deleteCategory, getAllCategory, updateCategory } from "../controllers/categoryController.js";

const categoryRoute = express.Router();

categoryRoute.post("/create", isAuth, createCategoryController);
categoryRoute.get('/get', getAllCategory)
categoryRoute.delete('/delete/:id', isAuth, deleteCategory)
categoryRoute.put('/update/:id', isAuth, updateCategory)

export default categoryRoute;