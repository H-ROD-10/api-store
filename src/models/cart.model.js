const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  cartItems: [
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

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Cart", cartSchema);
