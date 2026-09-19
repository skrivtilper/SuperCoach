# Pers supercoach MCP server

A small Streamable HTTP MCP server that mirrors the Intervals.icu and GitHub tools used by Pers supercoach.

## Tools

Intervals:
- `getAthleteProfile`
- `listEvents`, `createEvent`, `updateEvent`, `deleteEvent`
- `listActivities`
- `getWellnessByDate`, `upsertWellnessByDate`, `upsertWellness`, `upsertWellnessBulk`
- `getAthleteTrainingPlan`, `setAthleteTrainingPlan`

GitHub:
- `getFileContents`, `putFileContents`
- `getRepo`, `listCommitsForPath`

## Local development

```bash
cp .env.example .env
# Fill the .env file locally; never commit it.
npm install
npm run check
npm run dev
```

For local/private testing, set `MCP_BEARER_TOKEN` and send it as an `Authorization: Bearer ...` header.

## Docker

```bash
docker build -t pers-supercoach-mcp .
docker run --rm -p 3000:3000 --env-file .env pers-supercoach-mcp
```

## Deployment notes

Use a stable HTTPS endpoint ending in `/mcp`.

The upstream Intervals and GitHub credentials stay on the server. GitHub scope can be bounded with `GITHUB_ALLOWED_OWNER` and `GITHUB_ALLOWED_REPO`.

The built-in static bearer guard is suitable for private testing or a trusted client. For a ChatGPT-facing remote MCP server, terminate supported MCP authentication (normally OAuth) in front of this service and set `ALLOW_UNAUTHENTICATED=true` only inside that protected network path.
