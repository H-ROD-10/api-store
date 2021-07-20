const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const ErrorHandler = require("../utils/errorsHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

// POST => /api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
  const shippingItem = await Cart.findOne({ user: req.user._id });

  const { addressInfo } = req.body;

  const order = await Order.create({
    orderItems: shippingItem.cartItems,
    addressInfo: addressInfo,
    totalPrice: shippingItem.totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(200).json({
    success: true,
    order,
  });
});

// GET => /api/v1/order/:id
exports.getOrderById = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params._id).populate(
    "user",
    "firstName email"
  );

  if (!order) {
    return next(
      new ErrorHandler(`La orden con el id ${req.params._id} no existe`, 404)
    );
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// GET => /api/v1/order/me
exports.getMyOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// GET => /api/v1/admin/orders
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({});

  const ordersCount = await Order.countDocuments();

  res.status(200).json({
    success: true,
    orders,
    ordersCount,
  });
});

// PUT => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params._id);

  if (order.orderStatus === "ENVIADA") {
    return new ErrorHandler("La orden ya fue enviada", 400);
  }

  order.orderStatus = req.body.status;

  await order.save();

  res.status(201).json({
    success: true,
    order,
  });
});

// Get single order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params._id);

  if (!order) {
    return next(
      new ErrorHandler(`La orden con el id ${req.params._id} no existe`, 404)
    );
  }

  await order.remove();

  res.status(200).json({
    success: true,
    message: `La order con id: ${req.params._id} ha sido eliminada correctamente`,
  });
});
