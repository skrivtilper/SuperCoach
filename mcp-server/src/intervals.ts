import type { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { INTERVALS_BASE, intervalsHeaders, qs, requestJson, result } from "./config.js";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const dateTime = z.string().min(10);
const category = z.enum(["WORKOUT", "NOTE"]);
const wellness = {
  id: date.optional(), weight: z.number().optional(), restingHR: z.number().optional(),
  sleepSecs: z.number().int().optional(), sleepScore: z.number().optional(), sleepQuality: z.number().optional(),
  fatigue: z.number().optional(), soreness: z.number().optional(), stress: z.number().optional(),
  motivation: z.number().optional(), comments: z.string().optional(),
};

export function registerIntervals(server: McpServer): void {
  server.registerTool("getAthleteProfile", {
    description: "Return profile fields for the Intervals athlete bound to the configured API key.",
    inputSchema: z.object({}), annotations: { readOnlyHint: true, openWorldHint: false },
  }, async () => result(await requestJson(`${INTERVALS_BASE}/api/v1/athlete/0/profile`, { method: "GET", headers: intervalsHeaders() })));

  server.registerTool("listEvents", {
    description: "List Intervals WORKOUT/NOTE events in an inclusive local-date range.",
    inputSchema: z.object({ oldest: date, newest: date }), annotations: { readOnlyHint: true, openWorldHint: false },
  }, async ({ oldest, newest }) => result(await requestJson(`${INTERVALS_BASE}/api/v1/athlete/0/events${qs({ oldest, newest })}`, { method: "GET", headers: intervalsHeaders() })));

  server.registerTool("createEvent", {
    description: "Create an Intervals WORKOUT or NOTE event. Use external_id for idempotency.",
    inputSchema: z.object({
      start_date_local: dateTime, end_date_local: dateTime.optional(), category,
      type: z.string().optional(), name: z.string().optional(), description: z.string().min(1), external_id: z.string().optional(),
    }),
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  }, async (body) => result(await requestJson(`${INTERVALS_BASE}/api/v1/athlete/0/events`, { method: "POST", headers: intervalsHeaders(), body: JSON.stringify(body) })));

  server.registerTool("updateEvent", {
    description: "Update an existing Intervals event by numeric event ID.",
    inputSchema: z.object({
      eventId: z.number().int(), start_date_local: dateTime.optional(), end_date_local: dateTime.optional(),
      category: category.optional(), type: z.string().optional(), name: z.string().optional(),
      description: z.string().optional(), external_id: z.string().optional(),
    }),
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ eventId, ...body }) => result(await requestJson(`${INTERVALS_BASE}/api/v1/athlete/0/events/${eventId}`, { method: "PUT", headers: intervalsHeaders(), body: JSON.stringify(body) })));

  server.registerTool("deleteEvent", {
    description: "Delete an Intervals event by ID. Verify the target first.",
    inputSchema: z.object({ eventId: z.number().int() }),
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  }, async ({ eventId }) => result(await requestJson(`${INTERVALS_BASE}/api/v1/athlete/0/events/${eventId}`, { method: "DELETE", headers: intervalsHeaders() }, true)));

  server.registerTool("listActivities", {
    description: "List completed Intervals activities in an inclusive local-date range.",
    inputSchema: z.object({ oldest: date, newest: date }), annotations: { readOnlyHint: true, openWorldHint: false },
  }, async ({ oldest, newest }) => result(await requestJson(`${INTERVALS_BASE}/api/v1/athlete/0/activities${qs({ oldest, newest })}`, { method: "GET", headers: intervalsHeaders() })));

  server.registerTool("getWellnessByDate", {
    description: "Get Intervals wellness for one date.",
    inputSchema: z.object({ date }), annotations: { readOnlyHint: true, openWorldHint: false },
  }, async ({ date }) => result(await requestJson(`${INTERVALS_BASE}/api/v1/athlete/0/wellness/${date}`, { method: "GET", headers: intervalsHeaders() })));

  server.registerTool("upsertWellnessByDate", {
    description: "Create or update Intervals wellness for one date.",
    inputSchema: z.object({ date, ...wellness }),
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ date, ...body }) => result(await requestJson(`${INTERVALS_BASE}/api/v1/athlete/0/wellness/${date}`, { method: "PUT", headers: intervalsHeaders(), body: JSON.stringify(body) })));

  server.registerTool("upsertWellness", {
    description: "Create or update Intervals wellness; date is body id=YYYY-MM-DD.",
    inputSchema: z.object(wellness),
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (body) => result(await requestJson(`${INTERVALS_BASE}/api/v1/athlete/0/wellness`, { method: "PUT", headers: intervalsHeaders(), body: JSON.stringify(body) })));

  server.registerTool("upsertWellnessBulk", {
    description: "Create/update several Intervals wellness days in one request.",
    inputSchema: z.object({ items: z.array(z.object(wellness)).min(1) }),
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async ({ items }) => result(await requestJson(`${INTERVALS_BASE}/api/v1/athlete/0/wellness-bulk`, { method: "PUT", headers: intervalsHeaders(), body: JSON.stringify(items) })));

  server.registerTool("getAthleteTrainingPlan", {
    description: "Get the athlete's Intervals training-plan association.",
    inputSchema: z.object({}), annotations: { readOnlyHint: true, openWorldHint: false },
  }, async () => result(await requestJson(`${INTERVALS_BASE}/api/v1/athlete/0/training-plan`, { method: "GET", headers: intervalsHeaders() })));

  server.registerTool("setAthleteTrainingPlan", {
    description: "Set or change the athlete's Intervals training-plan association.",
    inputSchema: z.object({
      training_plan_id: z.number().int().optional(), training_plan_start_date: date.optional(), training_plan_alias: z.string().optional(),
    }),
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  }, async (body) => result(await requestJson(`${INTERVALS_BASE}/api/v1/athlete/0/training-plan`, { method: "PUT", headers: intervalsHeaders(), body: JSON.stringify(body) })));
}
