const express = require("express");
const jwt = require("jsonwebtoken");
const users = require("../auth/users");
require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY; // Đổi thành mã bí mật thực tế (và lưu trong biến môi trường ở production)

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid credentials" });
  }

  // Tạo token
  const token = jwt.sign(
    { username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "8h" }
  );

  return res.json({ success: true, token });
});

module.exports = { authRouter: router, SECRET_KEY };
