import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: [true, "address  is required"],
    },
    city: {
      type: String,
      requied: [true, "city is required"],
    },
    country: {
      type: String,
      required: [true, "country is required"],
    },
  },
  orderItem: [
    {
      name: {
        type: String,
        required: [true, "product name is requied"],
      },
      price: {
        type: Number,
        required: [true, "product price is required"],
      },
      stock: {
        type: Number,
        required: [true, "product stock is required"],
      },
      quantity: {
        type: Number,
        required: [true, "product quantity is required"],
      },
      image: {
        type: String,
        requied: [true, "image is required"],
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
    },
  ],
  paymentMothod: {
    type: String,
    enum: ["COD", "ONLINE"],
    default: "COD",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: [true, "user id is required"],
  },
  paidAt: Date,
  paymentInfo: {
    id: String,
    status: String,
  },
  itemPrice: {
    type: Number,
    requied: [true, "item price is required"],
  },
  tax: {
    type: Number,
    requied: [true, "tax price is required"],
  },
  shippingCharges: {
    type: Number,
    requied: [true, "item shippingCharges is required"],
  },
  totalAmount: {
    type: Number,
    requied: [true, "item totalAmount price is required"],
  },
  orderStatus: {
    type: String,
    enum: ["processing", "shipped", "delivered"],
    default: "processing",
  },
  deliveredAt: Date,
});

const orderModel = mongoose.model("orders", orderSchema);
export default  orderModel;