process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
const express = require("express");
const cors = require("cors");

const app = express();
// Allow requests from http://localhost:3000
app.use(cors({ origin: "http://localhost:3000" }));
// Alternatively, allow requests from any origin (use with caution)
// app.use(cors());

const { authRouter } = require("./src/routes/auth");
const queryRouter = require("./src/routes/query");
const logger = require("./src/utils/logger");

app.use(express.json());
app.use("/auth", authRouter);

app.use("/query", queryRouter);
app.use("/query", require("./src/routes/logs"));

app.use(( res, next) => {
  res.setTimeout(15000, () => {
    console.warn("Request timed out");
    res.status(503).json({ error: "Request timeout" });
  });
  next();
});

app.use((req, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use((err, res) => {
  logger.error("Uncaught error:", err.stack);
  res.status(500).json({ success: false, error: "Internal Server Error" });
});

module.exports = app;
