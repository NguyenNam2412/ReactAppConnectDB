const oracledb = require("oracledb");

require("dotenv").config({
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

if (process.env.NODE_ENV !== "test") {
  oracledb.initOracleClient({
    libDir: "C:\\OracleSql\\instantclient\\instantclient_23_8",
  });
}

const initConnection = async () => {
  try {
    return await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING,
    });
  } catch (err) {
    console.error("Oracle connection error:", err);
    process.exit(1);
  }
};

module.exports = initConnection;
