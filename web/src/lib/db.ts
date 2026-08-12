import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var __dbPool: mysql.Pool | undefined;
}

function createPool(): mysql.Pool {
  return mysql.createPool({
    host: process.env.DATABASE_HOST ?? "127.0.0.1",
    port: Number(process.env.DATABASE_PORT ?? 3306),
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    maxIdle: 5,
    idleTimeout: 60000,
  });
}

// Reused across hot reloads / requests in the same process.
const pool = global.__dbPool ?? createPool();
if (process.env.NODE_ENV !== "production") {
  global.__dbPool = pool;
}

export async function query<T>(sql: string, params: unknown[] = []): Promise<T> {
  const [rows] = await pool.query(sql, params);
  return rows as T;
}

export { pool };
