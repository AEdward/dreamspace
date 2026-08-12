"use strict";

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_HOST ?? "127.0.0.1",
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    multipleStatements: true,
  });

  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await connection.query(sql);
  console.log("Schema applied successfully.");
  await connection.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
