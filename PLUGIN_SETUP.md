# Pers supercoach plugin setup

This repository can be used as a portable ChatGPT plugin/skill backed by a single-user MCP server.

## Layout

- `plugin.json` — portable plugin manifest.
- `mcp.json` — MCP server declaration.
- `skills/supercoach/` — the coach skill.
- `mcp-server/` — Streamable HTTP MCP server for Intervals.icu and GitHub.
- existing root files (`Instruks.md`, `AGENT_SETUP.md`, OpenAPI specs) remain useful as the canonical historical/source documentation.

## 1. Deploy the MCP server

Deploy `mcp-server/` to a host that provides a stable HTTPS endpoint.

Required server-side environment variables:

```text
INTERVALS_API_KEY=<Intervals personal API key>
GITHUB_TOKEN=<GitHub token with Contents read/write for the persistent repo>
GITHUB_ALLOWED_OWNER=skrivtilper
GITHUB_ALLOWED_REPO=SuperCoachPersistent
```

Never place these values in `plugin.json`, `mcp.json`, a skill file, GitHub, or ChatGPT messages.

For private testing you may set:

```text
MCP_BEARER_TOKEN=<long random secret>
```

For ChatGPT deployment, put a supported authenticated layer in front of `/mcp` (normally MCP OAuth 2.1) and set:

```text
ALLOW_UNAUTHENTICATED=true
```

**Important:** that variable means only that this Node process delegates authentication to the upstream proxy/OAuth layer. Do not expose it directly to the internet without that layer.

The server exposes:
- `GET /health`
- `POST /mcp`

## 2. Point the plugin at the deployed URL

Replace both instances of:

```text
https://replace-me.example/mcp
```

in:
- `mcp.json`
- `skills/supercoach/agents/openai.yaml`

with the deployed HTTPS `/mcp` URL.

## 3. Test

Before installing the plugin, verify:

1. `/health` responds without exposing secrets.
2. MCP initialization succeeds.
3. `getAthleteProfile` works.
4. `getFileContents` can read `maal_og_langsigtet_plan.md` from `skrivtilper/SuperCoachPersistent`.
5. A reversible GitHub write succeeds.
6. An Intervals read succeeds.
7. No secrets appear in model-visible tool results.

Do not test destructive Intervals writes unless cleanup is guaranteed.

## 4. Install/use the skill

The source skill is under `skills/supercoach`. Package it with the OpenAI skill packaging tools when distributing it separately.

The coach will bootstrap from Intervals + the persistent GitHub plan/notes, so chat history is not required for normal continuity.

## Security model

This implementation is intentionally **single-user**:
- one Intervals API key is stored server-side,
- one GitHub token is stored server-side,
- GitHub calls can be restricted to one owner/repository,
- credentials are never tool arguments.

If the plugin is ever distributed to multiple users, replace this credential model with per-user OAuth/token storage and user-specific repository/athlete binding.
