const express = require("express");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authProtectRoute");

const {
  addItemToCart,
  decrementQtyItemToCart,
  removeItemToCart,
  deleteCart,
  getAllCarts,
  getCartById,
} = require("../controllers/cart.controller");

const router = express.Router();

router.route("/cart").post(isAuthenticatedUser, addItemToCart);

router
  .route("/cart/:_id/:quantity/decrement")
  .put(isAuthenticatedUser, decrementQtyItemToCart);
router
  .route("/cart/:_id/delete-item")
  .put(isAuthenticatedUser, removeItemToCart);
router.route("/cart/delete-cart").delete(isAuthenticatedUser, deleteCart);

router
  .route("/admin/carts")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllCarts);
router
  .route("/admin/cart/:_id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getCartById);

module.exports = router;
