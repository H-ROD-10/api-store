const express = require("express");
const errorMidleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");

const user = require("./routes/user.routes");
const product = require("./routes/product.routes");
const cart = require("./routes/cart.routes");
const order = require("./routes/order.routes");

const app = express();

dotenv.config({
  path: "./src/config/local.env",
});

const options = {
  origin: [true, "http://localhost:3000"],
  methods: ["GET", "HEAD", "PUT", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(helmet());
app.use(cors(options));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//All Routes
app.use("/api/v1/", user);
app.use("/api/v1/", product);
app.use("/api/v1", cart);
app.use("/api/v1", order);

// Midleware error handler
app.use(errorMidleware);

module.exports = app;
