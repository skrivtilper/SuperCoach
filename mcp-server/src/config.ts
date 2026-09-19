import { timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";
import type { NextFunction, Request, Response } from "express";

export const PORT = Number(process.env.PORT ?? "3000");
export const HOST = process.env.HOST ?? "0.0.0.0";
export const TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS ?? "30000");
export const INTERVALS_BASE = (process.env.INTERVALS_BASE_URL ?? "https://intervals.icu").replace(/\/+$/, "");
export const GITHUB_BASE = (process.env.GITHUB_API_BASE_URL ?? "https://api.github.com").replace(/\/+$/, "");

export function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function validateStartup(): void {
  requiredEnv("INTERVALS_API_KEY");
  requiredEnv("GITHUB_TOKEN");
  const bearer = process.env.MCP_BEARER_TOKEN?.trim();
  const externalAuth = process.env.ALLOW_UNAUTHENTICATED === "true";
  if (!bearer && !externalAuth) {
    throw new Error(
      "Refusing to expose /mcp without transport protection. Set MCP_BEARER_TOKEN for private testing, " +
      "or ALLOW_UNAUTHENTICATED=true only behind an authenticated OAuth/reverse-proxy layer."
    );
  }
}

function constantTimeEqual(a: string, b: string): boolean {
  const aa = Buffer.from(a);
  const bb = Buffer.from(b);
  if (aa.length !== bb.length) return false;
  return timingSafeEqual(aa, bb);
}

export function mcpGuard(req: Request, res: Response, next: NextFunction): void {
  const expected = process.env.MCP_BEARER_TOKEN?.trim();
  if (!expected) return next();
  const auth = req.header("authorization") ?? "";
  if (!auth.startsWith("Bearer ") || !constantTimeEqual(auth.slice(7), expected)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export function intervalsHeaders(): Record<string, string> {
  const token = Buffer.from(`API_KEY:${requiredEnv("INTERVALS_API_KEY")}`).toString("base64");
  return { Authorization: `Basic ${token}`, Accept: "application/json", "Content-Type": "application/json" };
}

export function githubHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${requiredEnv("GITHUB_TOKEN")}`,
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "pers-supercoach-mcp",
  };
}

export function githubScope(owner: string, repo: string): void {
  const allowedOwner = process.env.GITHUB_ALLOWED_OWNER?.trim();
  const allowedRepo = process.env.GITHUB_ALLOWED_REPO?.trim();
  if (allowedOwner && owner !== allowedOwner) throw new Error("GitHub owner is outside configured scope");
  if (allowedRepo && repo !== allowedRepo) throw new Error("GitHub repo is outside configured scope");
}

export async function requestJson(url: string, init: RequestInit, allowEmpty = false): Promise<unknown> {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  const raw = await response.text();
  if (!response.ok) throw new Error(`Upstream ${response.status} ${response.statusText}: ${raw.slice(0, 1200)}`);
  if (!raw) return allowEmpty ? { ok: true } : null;
  return (response.headers.get("content-type") ?? "").includes("application/json") ? JSON.parse(raw) : raw;
}

export function result(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

export function qs(params: Record<string, string | number | undefined>): string {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined) s.set(k, String(v));
  return s.size ? `?${s.toString()}` : "";
}

export function ghPath(owner: string, repo: string, path = ""): string {
  githubScope(owner, repo);
  const encoded = path.split("/").filter(Boolean).map(encodeURIComponent).join("/");
  return `${GITHUB_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents${encoded ? `/${encoded}` : ""}`;
}
