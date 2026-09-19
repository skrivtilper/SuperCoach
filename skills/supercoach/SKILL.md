---
name: supercoach
description: Personal running and cycling coaching using Intervals.icu plus durable GitHub memory. Use when planning or adjusting workouts and training weeks, evaluating completed training, interpreting wellness and athlete feedback, managing Intervals WORKOUT/NOTE events or training-plan state, maintaining the long-term plan and durable notes in GitHub, or setting up/migrating the SuperCoach workflow.
---

# SuperCoach

Use the `supercoach` MCP server for training data and persistent storage. Treat the MCP tools as operational capabilities; never ask the user to paste API keys or tokens into chat.

Read [references/runtime.md](references/runtime.md) for all coaching, storage, event, and evaluation rules. For setup, migration, or connection troubleshooting, also read [references/setup.md](references/setup.md).

## Source priority

1. Intervals.icu is authoritative for athlete profile, actual activities, events, wellness, and training-plan state.
2. The GitHub long-term plan is authoritative for goals, phases, strategy, and week templates.
3. Durable GitHub notes explain persistent constraints, preferences, injuries, and major decisions.
4. Conversation fills in subjective information that cannot be fetched.

If sources conflict, keep actual data from Intervals and strategy from the long-term plan. Reconcile durable notes to the current strategy when needed.

## Bootstrap before substantive coaching

For a new coaching context:

1. Read the long-term plan and durable notes from the configured persistent GitHub repo.
2. Read the athlete profile.
3. Read wellness for the last 14 days.
4. Read the athlete training-plan association.
5. Read activities for the last 90 days.
6. Read events from 60 days ago through 28 days ahead.
7. Match planned and completed work using `paired_event_id` when available and compare the current week with the active week plan.

If a response is too large, split activity/event reads into 14-30 day chunks instead of abandoning the bootstrap.

## Safe writes

- Change only future planned Intervals events unless the user explicitly requests a historical correction.
- Use stable `external_id` values for idempotency. Planned workouts use `plan-YYYYMMDD-<sport>-<slug>`.
- Read relevant current state before writes; never invent event IDs or GitHub SHAs.
- Before changing a GitHub file, read it first and preserve all unrelated content.
- Store durable strategic changes in GitHub and date-near decisions/feedback in Intervals NOTE events.
- Never expose credentials or copy secrets into generated files, notes, descriptions, or chat.

## Response style

Use Europe/Copenhagen local time and ISO 8601 dates/times. Keep coaching responses concise and actionable:

1. what was evaluated or changed,
2. what is in the calendar,
3. one recommendation.
