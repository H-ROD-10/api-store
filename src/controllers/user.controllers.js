const User = require("../models/user.model");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorsHandler");
const sendToken = require("../utils/jwtToken");

//POST => "/api/v1/new-user"
exports.newUser = catchAsyncError(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  sendToken(user, 201, res);
});

//Post => "/api/v1/login"
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //Finding User in database
  const user = await User.findOne({ email }).select("+password");

  // Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Email o Password invalidos", 401));
  }

  sendToken(user, 200, res);
});

//GET => "/api/v1/me"
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("myCart");

  res.status(200).json({
    success: true,
    user,
  });
});

//PUT => /api/v1/password/update
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+ password");

  //check previus user password
  const isMatched = await user.comparePassword(req.body.oldpassword);
  if (!isMatched) {
    return next(new ErrorHandler("La contraseña no conicide", 400));
  }

  user.password = req.body.password;

  await user.save();

  sendToken(user, 200, res);
});

//PUT => /api/v1/me/update-profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

//GET => /api/v1/logout
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "A cerrado sesión, hasta pronto",
  });
});

//GET => /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({});

  res.status(200).json({
    success: true,
    users,
  });
});

//GET => /api/v1/admin/user/:_id
exports.getUserById = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params._id);

  if (!user) {
    return next(
      new ErrorHandler(`Usuario no encontrado con el id: ${req.params.id}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

//PUT => /api/v1/admin/user/:_id/update-role
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params._id,
    { role: req.body.role },
    {
      new: true,
      runValidators: true,
    }
  );

  console.log(req.params._id);

  res.status(200).json({
    success: true,
    user,
  });
});

//DELETE => /api/v1/admin/user/:_id/delete-user
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params._id);

  if (!user) {
    return next(
      new ErrorHandler(
        `Usuario no encontrado con el id: ${req.params._id}`,
        400
      )
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: `El usuario ${user.firstName} ha sido eliminado exitosamente`,
  });
});
