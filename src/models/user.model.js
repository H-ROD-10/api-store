const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Porfavor ingresa el nombre"],
    maxLength: [100, "El nombre no puede tener mas de 100 caracteres"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Porfavor ingresa el apellido"],
    maxLength: [100, "El apellido no puede tener mas de 100 caracteres"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Porfavor ingresa el email"],
    unique: [
      true,
      "Verifica el email ingresado, debido a que esta siendo utilizado por otro usuario.",
    ],
    validate: [validator.isEmail, "Porfavor ingresa un email valido"],
  },
  password: {
    type: String,
    required: [
      true,
      "Porfavor ingresa una contraseña, de al menos 8 caracteres",
    ],
    minLength: [8, "La contraseña debe contener al menos 8 caracteres"],
    select: false,
  },
  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "admin"],
    },
  },
  myCart: {
    type: mongoose.Schema.ObjectId,
    ref: "Cart",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdUp: {
    type: Date,
    default: Date.now(),
  },
});

//Encryptin Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
//Return JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

module.exports = mongoose.model("User", userSchema);
