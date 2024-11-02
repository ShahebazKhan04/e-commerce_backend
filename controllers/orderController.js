import stripe from "stripe";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";

export const createOrderController = async (req, res) => {
  try {
    const {
      shippingInfo,
      orderItem,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    } = req.body;

    if (
      !shippingInfo ||
      !orderItem ||
      !itemPrice ||
      !tax ||
      !shippingCharges ||
      !totalAmount
    ) {
      return res.status(500).json({
        success: false,
        message: "all fields are required",
      });
    }

    const order = await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItem,
      itemPrice,
      tax,
      shippingCharges,
      totalAmount,
    });
    // updating stock
    for (let i = 0; i < orderItem.length; i++) {
      const product = await productModel.findById(orderItem[i].product);
      product.stock -= orderItem[i].quantity;
      await product.save();
    }

    res.status(201).json({
      success: true,
      message: " order pleased successfully",
      order: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while creating order",
      error: error.message,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({ users: req.params._id });
    if (!orders) {
      return res.status(404).json({
        success: false,
        message: "No product found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Got orders",
      totalOrders: orders.length,
      orders: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while getting all order",
      error: error.message,
    });
  }
};

export const getSingleOrderController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No product found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Got single order",
      order: order,
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
      message: "error while getting all order",
      error: error.message,
    });
  }
};

export const getPaymentController = async (req, res) => {
  try {
    const { totalAmount } = req.body;
    if (!totalAmount) {
      return res.status(404).json({
        success: false,
        message: "total amount is required",
      });
    }
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount),
      currency: "usd",
    });
    res.status(200).json({
      success: true,
      client_secret,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while getting payment",
      error: error.message,
    });
  }
};

export const getAllAdminOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({
      success: true,
      message: "all orders data",
      totalOrders: orders.length,
      orders: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "error while getting all products for admin",
      error: error.message,
    });
  }
};

export const changeOrderStatusController = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "order not found",
      });
    }
    if (order.orderStatus === "processing") {
      order.orderStatus = "shipped";
    } else if (order.orderStatus === "shipped") {
      order.orderStatus = "delivered";
      order.deliveredAt = Date.now();
    } else {
      return res.status(500).json({
        success: false,
        message: "order already delivered",
      });
    }
    await order.save()
    res.status(200).json({
      success : true,
      message : "order status updated"
    })
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(500).json({
        success: false,
        message: "Invalid Id",
      });
    }

    res.status(500).json({
      success: false,
      message: "error while changing status",
      error: error.message,
    });
  }
};
