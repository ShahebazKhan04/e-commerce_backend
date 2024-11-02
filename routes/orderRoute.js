import express from "express";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import {
  changeOrderStatusController,
  createOrderController,
  getAllAdminOrdersController,
  getAllOrdersController,
  getPaymentController,
  getSingleOrderController,
} from "../controllers/orderController.js";
const orderRoute = express.Router();

orderRoute.post("/create", isAuth, isAdmin, createOrderController);
orderRoute.get("/my-orders", isAuth, getAllOrdersController);
orderRoute.get("/my-orders/:id", isAuth, isAdmin, getSingleOrderController);
orderRoute.post("/payments", isAuth, getPaymentController);

// for admin route

orderRoute.get(
  "/admin/all-orders",
  isAuth,
  isAdmin,
  getAllAdminOrdersController
);

orderRoute.put(
  "/admin/order/:id",
  isAuth,
  isAdmin,
  changeOrderStatusController
);
export default orderRoute;
