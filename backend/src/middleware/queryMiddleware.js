const allowedTables = [
  "SFIS1.C_BOM_KEYPART_T",
  "SFISM4.R_MO_BASE_T",
  "SFISM4.R_SN_DETAIL_T",
  "SFISM4.R_WIP_TRACKING_T",
  "SFISM4.R_WIP_KEYPARTS_T",
  "SFIS1.C_ROUTE_CONTROL_T",
  "SFISM4.R_SMT_SCAN_DATA_T",
];

function validateTable(req, res, next) {
  const table = req.params.table?.toUpperCase();

  if (process.env.NODE_ENV === "test") {
    allowedTables.push("MOCKED_TABLE");
  }

  if (!allowedTables.includes(table)) {
    return res.status(403).json({ success: false, error: "Table not allowed" });
  }

  // Attach back to req
  req.table = table;
  next();
}

function validateBody(req, res, next) {
  if (!req.body || typeof req.body !== "object") {
    return res.status(400).json({ success: false, error: "Invalid JSON body" });
  }
  next();
}

function logQuery(req, res, next) {
  console.log(`[${new Date().toISOString()}] Query to: ${req.table}`);
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  next();
}

module.exports = { validateTable, validateBody, logQuery };
