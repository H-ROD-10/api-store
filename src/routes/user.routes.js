const express = require("express");
const {
  newUser,
  loginUser,
  getUserProfile,
  updatePassword,
  updateProfile,
  logout,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
} = require("../controllers/user.controllers");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authProtectRoute");

const router = express.Router();

router.route("/new-user").post(newUser);
router.route("/login").post(loginUser);

router.route("/me").get(isAuthenticatedUser, getUserProfile);
router.route("/me/update-profile").put(isAuthenticatedUser, updateProfile);
router.route("/me/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/logout").get(logout);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers);

router
  .route("/admin/user/:_id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getUserById);

router
  .route("/admin/user/:_id/update-role")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole);

router
  .route("/admin/user/:_id/delete-user")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
