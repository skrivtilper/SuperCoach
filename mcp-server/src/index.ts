import express from "express";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import { HOST, PORT, mcpGuard, validateStartup } from "./config.js";
import { registerIntervals } from "./intervals.js";
import { registerGithub } from "./github.js";

function buildServer(): McpServer {
  const server = new McpServer(
    { name: "pers-supercoach", version: "0.1.0" },
    {
      capabilities: { tools: {} },
      instructions:
        "SuperCoach exposes one athlete's Intervals.icu data and bounded GitHub persistence. " +
        "Read relevant state before writes. Never invent IDs or SHAs. Use stable external_id values. " +
        "Modify only future planned Intervals events unless explicitly correcting history. Never request or return credentials.",
    }
  );
  registerIntervals(server);
  registerGitHub(server);
  return server;
}

validateStartup();

const app = express();
app.disable("x-powered-by");
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "pers-supercoach-mcp",
    githubScope: {
      owner: process.env.GITHUB_ALLOWED_OWNER ?? null,
      repo: process.env.GITHUB_ALLOWED_REPO ?? null,
    },
  });
});

const mcp = createMcpHandler(() => buildServer(), { responseMode: "auto", maxRequestBodySize: 1024 * 1024 });
const nodeMcp = toNodeHandler(mcp, {
  onerror: (error) => console.error("MCP adapter error", error),
});

app.all("/mcp", mcpGuard, (req, res) => {
  void nodeMcp(req, res);
});

app.listen(PORT, HOST, () => console.log(`pers-supercoach-mcp listening on http://${HOST}:${PORT}`));
