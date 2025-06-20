const oracledb = require("oracledb");

// Hàm chuẩn hóa giá trị bind
const createBindVal = (val) => {
  if (val === null || val === undefined || val === "") {
    return { val: null, type: oracledb.STRING, dir: oracledb.BIND_IN };
  }

  // Nếu là chuỗi định dạng ngày
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (typeof val === "string" && datePattern.test(val)) {
    return {
      val: new Date(val),
      type: oracledb.DATE,
      dir: oracledb.BIND_IN,
    };
  }

  // Nếu là số
  if (!isNaN(val) && val !== "") {
    return {
      val: Number(val),
      type: oracledb.NUMBER,
      dir: oracledb.BIND_IN,
    };
  }

  // Mặc định là chuỗi
  return {
    val: val,
    type: oracledb.STRING,
    dir: oracledb.BIND_IN,
  };
};

const buildQuery = (table, query) => {
  const where = [];
  const binds = {};
  let orderClause = "";
  let bindIndex = 1;

  for (const key in query) {
    const val = query[key];
    if (["limit", "offset", "order_by"].includes(key)) continue;

    if (key.endsWith("_gt")) {
      const col = key.slice(0, -3);
      const bindName = `b${bindIndex++}`;
      where.push(`${col} > :${bindName}`);
      binds[bindName] = createBindVal(val);
    } else if (key.endsWith("_lt")) {
      const col = key.slice(0, -3);
      const bindName = `b${bindIndex++}`;
      where.push(`${col} < :${bindName}`);
      binds[bindName] = createBindVal(val);
    } else if (key.endsWith("_like")) {
      const col = key.slice(0, -5);
      const bindName = `b${bindIndex++}`;
      where.push(`${col} LIKE :${bindName}`);
      binds[bindName] = createBindVal(`%${val}%`);
    } else if (key.endsWith("_in")) {
      const col = key.slice(0, -3);
      const list = val.split(",").map((v) => v.trim());
      const placeholders = list.map(() => `:b${bindIndex++}`);
      where.push(`${col} IN (${placeholders.join(",")})`);
      list.forEach((v, i) => {
        const bindName = placeholders[i].substring(1); // remove :
        binds[bindName] = createBindVal(v);
      });
    } else if (key.endsWith("_between")) {
      const col = key.slice(0, -8);
      const [from, to] = val.split(",");
      const bindName1 = `b${bindIndex++}`;
      const bindName2 = `b${bindIndex++}`;
      where.push(`${col} BETWEEN :${bindName1} AND :${bindName2}`);
      binds[bindName1] = createBindVal(from);
      binds[bindName2] = createBindVal(to);
    } else {
      const bindName = `b${bindIndex++}`;
      where.push(`${key} = :${bindName}`);
      binds[bindName] = createBindVal(val);
    }
  }

  if (query.order_by) {
    const orders = query.order_by.split(",").map((part) => {
      const [col, dir = "asc"] = part.split(":");
      return `${col} ${dir.toUpperCase() === "DESC" ? "DESC" : "ASC"}`;
    });
    orderClause = `ORDER BY ${orders.join(", ")}`;
  }

  const limit = parseInt(query.limit) || 10;
  const offset = parseInt(query.offset) || 0;

  const sql = `
    SELECT *
    FROM ${table}
    ${where.length ? "WHERE " + where.join(" AND ") : ""}
    ${orderClause}
    OFFSET :offsetRow ROWS FETCH NEXT :maxRow ROWS ONLY
  `;

  binds.maxRow = limit;
  binds.offsetRow = offset;

  console.log("sql", sql);

  return { sql, binds, limit, offset };
};

module.exports = { buildQuery };
