from flask import Flask, request, jsonify
from flask_cors import CORS
import cx_Oracle
import pandas as pd
import re

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

DB_USER = "SFIS1"
DB_PASSWORD = "SFIS1"
DB_DSN = "10.239.176.92:1526/vndb"

def get_connection():
    return cx_Oracle.connect(DB_USER, DB_PASSWORD, DB_DSN)

ALLOWED_TABLES = [
    "SFIS1.C_BOM_KEYPART_T",
    "SFISM4.R_MO_BASE_T",
    "SFISM4.R_SN_DETAIL_T",
    "SFISM4.R_WIP_TRACKING_T",
    "SFISM4.R_WIP_KEYPARTS_T",
    "SFIS1.C_ROUTE_CONTROL_T",
    "SFISM4.R_SMT_SCAN_DATA_T",
]

@app.route("/api/<table>", methods=["POST"])
def dynamic_query(table):
    table = table.upper()
    if table not in ALLOWED_TABLES:
        return jsonify({"error": "Table not allowed"}), 403

    if not re.match(r"^[A-Z0-9_]+\.[A-Z0-9_]+$", table):
        return jsonify({"error": "Invalid table name"}), 400

    query = request.get_json()
    where_clauses = []
    binds = {}
    param_index = 1

    for key, val in query.items():
        if key in ['limit', 'offset', 'order_by']:
            continue

        if key.endswith('_gt'):
            col = key[:-3]
            where_clauses.append(f"{col} > :{param_index}")
            binds[str(param_index)] = val
        elif key.endswith('_lt'):
            col = key[:-3]
            where_clauses.append(f"{col} < :{param_index}")
            binds[str(param_index)] = val
        elif key.endswith('_like'):
            col = key[:-5]
            where_clauses.append(f"{col} LIKE :{param_index}")
            binds[str(param_index)] = f"%{val}%"
        elif key.endswith('_in'):
            col = key[:-3]
            items = val.split(',')
            in_params = []
            for item in items:
                binds[str(param_index)] = item
                in_params.append(f":{param_index}")
                param_index += 1
            where_clauses.append(f"{col} IN ({', '.join(in_params)})")
            continue
        elif key.endswith('_between'):
            col = key[:-8]
            from_val, to_val = val.split(',')
            where_clauses.append(f"{col} BETWEEN :{param_index} AND :{param_index + 1}")
            binds[str(param_index)] = from_val
            binds[str(param_index + 1)] = to_val
            param_index += 2
            continue
        else:
            where_clauses.append(f"{key} = :{param_index}")
            binds[str(param_index)] = val

        param_index += 1

    where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
    
    order_clause = ""
    if 'order_by' in query:
        orders = []
        for part in query['order_by'].split(','):
            col, *dir = part.split(':')
            direction = dir[0].upper() if dir else 'ASC'
            if direction not in ['ASC', 'DESC']:
                direction = 'ASC'
            orders.append(f"{col} {direction}")
        order_clause = f"ORDER BY {', '.join(orders)}"

    limit = int(query.get('limit', 0))
    offset = int(query.get('offset', 0))
    paginated = limit > 0

    sql = ""
    if paginated:
        inner_sql = f"SELECT * FROM {table} {where_sql} {order_clause}"
        sql = f"""
            SELECT * FROM (
                SELECT a.*, ROWNUM rnum FROM ({inner_sql}) a
                WHERE ROWNUM <= :{param_index}
            ) WHERE rnum > :{param_index + 1}
        """
        binds[str(param_index)] = offset + limit
        binds[str(param_index + 1)] = offset
    else:
        sql = f"SELECT * FROM {table} {where_sql} {order_clause}"

    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(sql, binds)
        columns = [col[0] for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return jsonify(rows)
    except Exception as e:
        print("Query error:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
