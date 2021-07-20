const express = require("express");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductId,
  getFilterProducts,
} = require("../controllers/product.controller");

const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authProtectRoute");

const router = express.Router();

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router
  .route("/admin/product/:_id/update")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

router
  .route("/admin/product/:_id/delete")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/products").get(getProducts);
router.route("/products/filter").get(getFilterProducts);
router.route("/product/:_id").get(getProductId);

module.exports = router;
