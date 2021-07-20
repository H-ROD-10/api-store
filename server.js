const app = require("./src/app");
const dotenv = require("dotenv");
const dataBase = require("./src/config/database");

// Handled Uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

// Setting Config Upload file
dotenv.config({
  path: "./src/config/local.env",
});

//Connect to DataBase
dataBase();

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(
    `Server started on http://${host}:${port} in ${process.env.NODE_ENV} mode.`
  );
});

// Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log(
    "Se detuvo el servidor debido al rechazo de una promesa no gestionada"
  );
  server.close(() => {
    process.exit(1);
  });
});
