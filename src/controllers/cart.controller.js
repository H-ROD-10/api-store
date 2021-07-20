const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const ErrorHandler = require("../utils/errorsHandler");
const catchAsyncError = require("../middleware/catchAsyncError");

// POST => /api/v1/cart
exports.addItemToCart = catchAsyncError(async (req, res, next) => {
  const item = await Product.findById({ _id: req.query.productId });

  const itemsCart = {
    name: item.name,
    image: item.images[0].url,
    brand: item.brand,
    description: item.description,
    product: item.id,
    quantity: req.query.quantity,
    price: item.price,
  };

  const amount = item.price * req.query.quantity;

  if (item.stock < req.query.quantity) {
    return next(
      new ErrorHandler(
        "Error: La cantidad de productos solicitados excede nuestro inventario",
        404
      )
    );
  }
  //Verificar si hay cart
  let cart = await Cart.findOne({ user: req.user._id });

  const productExist = cart?.cartItems.filter(
    (p) => p.product.toString() === req.query.productId.toString()
  );

  if (productExist?.length > 0) {
    productExist[0].quantity =
      Number(productExist[0].quantity) + Number(req.query.quantity);
    cart.totalPrice = amount + cart.totalPrice;
    item.stock = item.stock - req.query.quantity;

    await cart.save({ validateBeforeSave: false });
    await item.save({ validateBeforeSave: false });
    return next(
      res.send(
        "Este producto existe en tu carrito, incrementamos en una unidad más, no obstante puedes modificarla en el carrito"
      )
    );
  }

  if (cart) {
    cart.cartItems.push(itemsCart);
    cart.totalPrice = amount + cart.totalPrice;

    item.stock = item.stock - req.query.quantity;

    await cart.save({ validateBeforeSave: false });
    await item.save({ validateBeforeSave: false });
  } else {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: itemsCart,
      totalPrice: amount,
    });
    const user = await User.findById({ _id: req.user._id });
    user.myCart = cart._id;
    await user.save({ validateBeforeSave: false });

    item.stock = item.stock - req.query.quantity;
    await item.save({ validateBeforeSave: false });
  }

  res.status(201).json({
    success: true,
    cart,
  });
});

//PUT => /cart/:id/quantity/decrement
exports.decrementQtyItemToCart = catchAsyncError(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });

  const product = await Product.findOne({ _id: req.params._id });

  const productRemove = cart?.cartItems.filter(
    (p) => p.product.toString() === product._id.toString()
  );

  const decrement =
    Number(productRemove[0].quantity) - Number(req.params.quantity);

  const amount = cart.totalPrice - decrement * product.price;

  if (decrement === 0) {
    return next(
      new ErrorHandler("Error: La cantidad no debe ser inferior a 1")
    );
  } else {
    productRemove[0].quantity = decrement;
    cart.totalPrice = amount;

    product.stock = Number(product.stock) + Number(req.params.quantity);
    await product.save({ validateBeforeSave: false });
    await cart.save({ validateBeforeSave: false });
  }

  res.status(201).json({
    success: true,
    cart,
  });
});

//PUT => /cart/:_id/delete-item
exports.removeItemToCart = catchAsyncError(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user._id });

  const product = await Product.findOne({ _id: req.params._id });

  const productRemove = cart?.cartItems.filter(
    (p) => p.product.toString() === product._id.toString()
  );

  const decrement = Number(productRemove[0].quantity);
  const amount = cart.totalPrice - decrement * product.price;

  try {
    cart.totalPrice = amount;
    product.stock = Number(product.stock) + Number(productRemove[0].quantity);

    await cart.updateOne({ $pull: { cartItems: productRemove[0] } });

    await cart.save({ validateBeforeSave: false });
    await product.save({ validateBeforeSave: false });
  } catch (error) {
    console.log(error);
  }

  res.status(201).json({
    success: true,
  });
});

//DELETE => /cart/delete-cart
exports.deleteCart = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id });

  const cart = await Cart.deleteOne({ user: req.user._id });

  if (!cart) {
    return next(new ErrorHandler("Error: carrito de compra no encontrado"));
  }

  user.myCart = null;
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
  });
});

exports.getAllCarts = catchAsyncError(async (req, res, next) => {
  const carts = await Cart.find({});

  res.status(200).json({
    success: true,
    carts,
  });
});

exports.getCartById = catchAsyncError(async (req, res, next) => {
  const cart = await Cart.findOne({ _id: req.params._id });

  if (!cart) {
    return next(new ErrorHandler("Error: carrito de compra no encontrado"));
  }

  res.status(200).json({
    success: true,
    cart,
  });
});
