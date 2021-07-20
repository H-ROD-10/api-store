const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  addressInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    codePostal: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        require: true,
        default: 1,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        require: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "EN_PROCESO",
    enum: {
      values: ["EN_PROCESO", "ENVIADA"],
    },
  },
  paidAt: {
    type: Date,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
