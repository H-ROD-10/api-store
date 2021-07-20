const Product = require("../models/product.model");
//const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/errorsHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apiFeature");

//POST => /api/v1/admin/product/new
exports.createProduct = catchAsyncError(async (req, res, next) => {
  /* let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  let imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "store-guitar",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;**/

  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// PUT => /api/v1/admin/product/:_id/update
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params._id);

  if (!product) {
    return next(new ErrorHandler("Producto no encontrado", 404));
  }

  /**let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    //Deleting images asociated width the product
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }*/

  product = await Product.findByIdAndUpdate(req.params._id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(201).json({
    success: true,
    product,
  });
});

//DELETE => /api/v1/admin/product/_id/delete
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params._id);

  if (!product) {
    return next(new ErrorHandler("Producto no encontrado", 404));
  }

  /**Deleting images asociated width the product
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  } */

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Producto fué eliminado correctamente",
  });
});

// GET => /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find({});
  const productsCount = await Product.countDocuments();

  res.status(200).json({
    success: true,
    products,
    productsCount,
  });
});

// GET => /api/v1/product/:_id
exports.getProductId = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params._id);

  if (!product) {
    return next(new ErrorHandler("Producto no encontrado", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//GET products by keyword => /api/v1/products/filter
exports.getFilterProducts = catchAsyncError(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeatures.query;
  const filteredProductsCount = products.length;

  products = await apiFeatures.query;

  res.status(200).json({
    success: true,
    products,
    filteredProductsCount,
  });
});
