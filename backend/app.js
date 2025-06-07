const express = require("express");
const cors = require("cors");

const app = express();
// Allow requests from http://localhost:3000
app.use(cors({ origin: "http://localhost:3000" }));
// Alternatively, allow requests from any origin (use with caution)
// app.use(cors());

const { authRouter } = require("./src/routes/auth");
const queryRouter = require("./src/routes/query");

app.use(express.json());
app.use("/auth", authRouter);
app.use("/api", queryRouter);
app.use("/api", require("./src/routes/logs"));

module.exports = app;
