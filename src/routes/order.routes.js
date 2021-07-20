const express = require("express");
const {
  newOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authProtectRoute");

const router = express.Router();

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/:_id").get(isAuthenticatedUser, getOrderById);
router.route("/orders/me").get(isAuthenticatedUser, getMyOrders);
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router
  .route("/admin/order/:_id/update")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);
router
  .route("/admin/order/:_id/delete")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
