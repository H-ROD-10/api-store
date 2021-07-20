const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ErrorHandler = require("../utils/errorsHandler");
const catchAsyncError = require("./catchAsyncError");

//Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new ErrorHandler("debes autenticarte para acceder a este recurso", 401)
    );
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decode.id);

  next();
});

// Role & authorization
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) no te autoriza a ingresar a este recurso`,
          403
        )
      );
    }
    next();
  };
};
