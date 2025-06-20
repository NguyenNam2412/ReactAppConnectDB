const fs = require("fs");
const path = require("path");
const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize, errors } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
});

const logDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const queryTransport = new transports.File({
  filename: path.join(logDir, "query.log"),
  level: "info",
});

const dbTransport = new transports.File({
  filename: path.join(logDir, "db.log"),
  level: "info",
});

const authTransport = new transports.File({
  filename: path.join(logDir, "auth.log"),
  level: "info",
});

const errorTransport = new transports.File({
  filename: path.join(logDir, "error.log"),
  level: "error",
});

const consoleTransport = new transports.Console({
  level: "debug",
  format: combine(colorize(), logFormat),
});

const logger = createLogger({
  // level: "info", // info, warn, err
  format: combine(
    timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    errors({ stack: true }),
    logFormat
  ),
  transports: [
    // new transports.File({ filename: path.join(__dirname, "../logs/query.log") }),
    consoleTransport,
    errorTransport
  ],
  exitOnError: false,
});

const loggers = {
  queryLog: logger.child({ transports: [queryTransport] }),
  dbLog: logger.child({ transports: [dbTransport] }),
  authLog: logger.child({ transports: [authTransport] }),
  errorLog: logger, // lỗi chung
};

module.exports = loggers;
