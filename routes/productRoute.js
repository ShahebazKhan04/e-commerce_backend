import express from 'express';
import { getAllProductsController, getSingleProductController } from '../controllers/productController.js';
const productRoute = express.Router();

productRoute.get('/all-products', getAllProductsController);
productRoute.get('/:id', getSingleProductController);

export default productRoute;