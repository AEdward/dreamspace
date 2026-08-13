import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { query } from "./db";

export const SESSION_COOKIE = "admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export type AdminRole = "admin" | "editor";

export interface AdminSession {
  userId: number;
  role: AdminRole;
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPasswordHash(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64).toString("hex");
  return safeEqual(candidate, hash);
}

/** Pure check usable both in Middleware (NextRequest cookies) and Server Components (next/headers cookies). */
export function parseSessionToken(token: string | undefined | null): AdminSession | null {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (!safeEqual(sign(payload), signature)) return null;

  const [userIdStr, role, expiresStr] = payload.split(":");
  const userId = Number(userIdStr);
  const expires = Number(expiresStr);
  if (!Number.isFinite(userId) || (role !== "admin" && role !== "editor") || !Number.isFinite(expires)) return null;
  if (Date.now() >= expires) return null;

  return { userId, role };
}

export function verifySessionToken(token: string | undefined | null): boolean {
  return parseSessionToken(token) !== null;
}

export async function createSession(userId: number, role: AdminRole): Promise<void> {
  const expires = Date.now() + SESSION_DURATION_MS;
  const payload = `${userId}:${role}:${expires}`;
  const token = `${payload}.${sign(payload)}`;
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(expires),
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return parseSessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function isAuthenticated(): Promise<boolean> {
  return (await getSession()) !== null;
}

interface AdminUserRow {
  id: number;
  password_hash: string;
  role: AdminRole;
}

export async function verifyCredentials(email: string, password: string): Promise<AdminSession | null> {
  const rows = await query<AdminUserRow[]>(
    "SELECT id, password_hash, role FROM admin_users WHERE email = ? LIMIT 1",
    [email.trim().toLowerCase()]
  );
  const row = rows[0];
  if (!row || !verifyPasswordHash(password, row.password_hash)) return null;
  return { userId: row.id, role: row.role };
}

/** Redirects to /admin (dashboard) if the current session isn't an admin. Use in admin-only Server Components and Server Actions. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "admin") redirect("/admin");
  return session;
}
