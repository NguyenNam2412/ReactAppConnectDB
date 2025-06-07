const express = require("express");
const router = express.Router();
const oracledb = require("oracledb");

const initConnection = require("../../db");
const { buildQuery } = require("../services/queryServices");
const {
  validateTable,
  validateBody,
  logQuery,
} = require("../middleware/queryMiddleware");
const { authenticateToken } = require("../middleware/authMiddleware");
const logger = require("../utils/logger");

// router.post("/:table", verifyToken, requireRole("admin"), async (req, res) => {
//   // chỉ admin mới vào đây
// });

router.post(
  "/:table",
  authenticateToken,
  validateTable,
  validateBody,
  logQuery,
  async (req, res) => {
    const table = req.params.table.toUpperCase();
    const query = req.body;

    if (req.user?.role !== "admin") {
      const userTables = req.user?.permissions?.tables || [];
      if (!userTables.includes("*") || !userTables.includes(table)) {
        console.log(userTables);
        return res
          .status(403)
          .json({ success: false, error: "Permission denied for this table" });
      }
    }

    if (table.includes("R_SMT_SCAN_DATA_T") && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, error: "Only admin can access this table" });
    }

    try {
      const { sql, binds, limit, offset } = buildQuery(table, query);
      const conn = await initConnection();
      const result = await conn.execute(sql, binds, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });

      await conn.close();

      logger.info(
        `User: ${
          req.user?.username || "unknown"
        }, Table: ${table}, Conditions: ${JSON.stringify(query)}, Count: ${
          result.rows.length
        }`
      );

      res.json({
        success: true,
        data: result.rows,
        meta: {
          limit,
          offset,
          count: result.rows.length,
        },
      });
    } catch (err) {
      console.error("Query error:", err);

      logger.error(
        `User: ${req.user?.username || "unknown"}, Table: ${table}, Error: ${
          err.message
        }, Conditions: ${JSON.stringify(query)}`
      );

      res.status(500).json({ success: false, error: err.message });
    }
  }
);

module.exports = router;
