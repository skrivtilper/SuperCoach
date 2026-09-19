import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { GITHUB_BASE, ghPath, githubHeaders, githubScope, qs, requestJson, result } from "./config.js";

const base = { owner: z.string().min(1), repo: z.string().min(1) };

export function registerGithub(server: McpServer): void {
  server.registerTool("getFileContents", {
    description: "Read a file/directory from configured GitHub scope. File content is returned by GitHub as base64.",
    inputSchema: z.object({ ...base, path: z.string(), ref: z.string().optional() }),
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, async ({ owner, repo, path, ref }) => result(await requestJson(`${ghPath(owner, repo, path)}${qs({ ref })}`, { method: "GET", headers: githubHeaders() })));

  server.registerTool("putFileContents", {
    description: "Create/update a file in configured GitHub scope. Content must be base64; pass current sha when replacing a file.",
    inputSchema: z.object({
      ...base, path: z.string().min(1), message: z.string().min(1), content: z.string().min(1),
      sha: z.string().optional(), branch: z.string().optional(),
      committer: z.object({ name: z.string().optional(), email: z.string().email().optional() }).optional(),
      author: z.object({ name: z.string().optional(), email: z.string().email().optional() }).optional(),
    }),
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async ({ owner, repo, path, ...body }) => result(await requestJson(ghPath(owner, repo, path), { method: "PUT", headers: githubHeaders(), body: JSON.stringify(body) })));

  server.registerTool("getRepo", {
    description: "Get metadata for a repository in configured GitHub scope.",
    inputSchema: z.object(base), annotations: { readOnlyHint: true, openWorldHint: false },
  }, async ({ owner, repo }) => {
    githubScope(owner, repo);
    return result(await requestJson(`${GITHUB_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, { method: "GET", headers: githubHeaders() }));
  });

  server.registerTool("listCommitsForPath", {
    description: "List commits touching a path in configured GitHub scope.",
    inputSchema: z.object({
      ...base, path: z.string().optional(), sha: z.string().optional(),
      per_page: z.number().int().min(1).max(100).optional(), page: z.number().int().min(1).optional(),
    }),
    annotations: { readOnlyHint: true, openWorldHint: false },
  }, async ({ owner, repo, ...params }) => {
    githubScope(owner, repo);
    return result(await requestJson(
      `${GITHUB_BASE}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits${qs(params)}`,
      { method: "GET", headers: githubHeaders() }
    ));
  });
}
