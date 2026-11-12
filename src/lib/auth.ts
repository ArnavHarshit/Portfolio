import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Single-owner admin auth. Only someone who knows ADMIN_PASSWORD (a secret
 * environment variable that never reaches the browser) can sign in.
 * The session is an HMAC-signed, httpOnly cookie. Changing the password
 * instantly signs out every existing session.
 */
export const COOKIE = "admin_session";
const TTL_MS = 7 * 24 * 60 * 60 * 1000;
const MIN_PASSWORD = 12;

const password = () => process.env.ADMIN_PASSWORD ?? "";
const secret = () => `${process.env.ADMIN_SECRET ?? ""}::${password()}`;

export function adminConfigured() {
  return password().length >= MIN_PASSWORD;
}

const sha = (s: string) => crypto.createHash("sha256").update(s).digest();
const sign = (payload: string) => crypto.createHmac("sha256", secret()).update(payload).digest("base64url");

export function checkPassword(attempt: string) {
  if (!adminConfigured()) return false;
  return crypto.timingSafeEqual(sha(attempt), sha(password()));
}

export function createSession() {
  const payload = `owner.${Date.now() + TTL_MS}`;
  return { value: `${payload}.${sign(payload)}`, maxAge: TTL_MS / 1000 };
}

export function verifySession(token?: string) {
  if (!token || !adminConfigured()) return false;
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  const payload = token.slice(0, i);
  const sig = token.slice(i + 1);
  const expected = sign(payload);
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const exp = Number(payload.split(".")[1]);
  return Number.isFinite(exp) && exp > Date.now();
}

export async function isAdmin() {
  return verifySession((await cookies()).get(COOKIE)?.value);
}

// Brute-force protection: 5 failed logins per 15 minutes per IP.
const fails = new Map<string, number[]>();
export function tooManyAttempts(ip: string) {
  const now = Date.now();
  const recent = (fails.get(ip) ?? []).filter((t) => now - t < 15 * 60 * 1000);
  fails.set(ip, recent);
  return recent.length >= 5;
}
export function recordFailure(ip: string) {
  fails.set(ip, [...(fails.get(ip) ?? []), Date.now()]);
}
export function clientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}
