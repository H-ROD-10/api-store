const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Porfavor ingresa el nombre del producto"],
    trim: true,
    maxLength: [250, "El Nombre no puede exceder de 250 carácteres"],
  },
  price: {
    type: Number,
    required: [true, "Porfavor ingresa el precio del producto"],
    maxLength: [8, "El precio no debe exceder de 8 cifras"],
    default: 0,
  },
  brand: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  stock: {
    type: Number,
    required: [
      true,
      "Porfavor ingresa el inventario disponible para este producto",
    ],
    maxLength: [12, "La cantidad no puede exceder de la docena"],
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updateAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Product", productSchema);
