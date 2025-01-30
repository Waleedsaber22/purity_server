process.on("uncaughtException", function (err) {
  console.error("Caught exception: " + err);
});
require("express-async-errors");
const Logger = require("./lib/logger");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initRoutes } = require("./routes");

const app = express();
const sequelize = require("./db");
const morgan = require("morgan");
const config = require("./config");
const ErrorHandler = require("./lib/handlers/errorHandler/error.handler");

const logger = Logger.get("dev");
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

if (config.logging.enabled) {
  app.use(morgan("dev"));
}

app.use(express.static("public"));
app.set("port", config.app.port);
app.listen(app.get("port"), async () => {
  try {
    await sequelize.db.connect();
    logger.info(`server is running at port ${app.get("port")}`);
  } catch (err) {
    logger.error(err);
  }
});

// setup all routes
initRoutes(app);

// Global error handler
app.use(ErrorHandler.catchRoutesErrors);
