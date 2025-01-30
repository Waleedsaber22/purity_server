const { createLogger, format, transports } = require("winston");

class Logger {
  static logger;
  static create() {
    const logger = createLogger({
      level: "info", // Set the logging level
      format: format.combine(
        format.timestamp(), // Add a timestamp
        format.json() // Log in JSON format
      ),
      transports: [
        new transports.Console(), // Log to the console
        // new transports.File({ filename: "combined.log" }), // Log to a file
      ],
    });
    Logger.logger = logger;
  }
  static get() {
    if (!Logger.logger) {
      Logger.create();
    }
    return Logger.logger;
  }
}

module.exports = Logger;
