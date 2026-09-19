# Runtime rules

## Persistent files

Default GitHub persistence uses the configured owner and repository, normally:

- plan: `maal_og_langsigtet_plan.md`
- notes: `noter.md`

`noter.md` contains one JSON object with these top-level keys:

```json
{
  "schema_version": 1,
  "profile": {},
  "constraints": {"time": [], "injuries": [], "health": []},
  "preferences": {"running": [], "cycling": [], "general": []},
  "rules": [],
  "major_decisions": []
}
```

Assume valid JSON. Update existing fields instead of creating duplicates, and remove obsolete/inactive items so the file stays short.

Use the plan for goals, phases, strategy, and reusable week templates. Do not use it as a diary. Weekly evaluations and date-specific decisions belong in NOTE events and, only when durable, in notes.

## Intervals NOTE format

Descriptions use:

```text
NOTE | Date=YYYY-MM-DD | Kind=Weekly|Decision|Daily|Health|Goal | Author=Coach|Athlete | Tags=comma,separated | Summary=<short> | Actions=<change/none>
```

Required fields: `Date`, `Kind`, `Author`, `Summary`.

Stable external IDs:

- Weekly: `note-week-YYYY-Www`
- Decision: `note-decision-<eventId>-<yyyymmdd>` when tied to an event; otherwise use a stable date/topic identifier
- Daily: `note-daily-yyyymmdd`

Coach-authored notes record decisions; athlete-authored notes record feedback.

## Long-term strategy changes

When a durable change affects phase, typical weekly volume, key sessions, rhythm, goals, or strategy:

1. explain the rationale briefly,
2. create/update a Decision NOTE with tags such as `plan,phase`,
3. read and update only the relevant part of the long-term plan,
4. update durable notes only if a general rule/preference/constraint also changed.

Always keep Intervals training-plan state and the GitHub plan conceptually consistent.

## Weekly planning

Read the active week template and compare it with Intervals events and completed activities.

Build Monday-Sunday training that respects:
- fixed user commitments,
- recovery,
- current tolerated run/cycle frequency,
- recent actual volume,
- planned hard/easy spacing.

Create/update future WORKOUT events with stable external IDs. Create a Weekly NOTE containing the focus and short summary. State expected total time/volume.

Mountain biking can be self-directed if that is the athlete's current preference. A hard MTB day counts as a hard day and normally replaces, rather than stacks on top of, a quality session.

## Weekly evaluation

Compare the last 7 days of planned events with actual activities, plus wellness and subjective feedback.

Guidance:
- sleep score < 60 or fatigue >= 7: reduce next week's volume about 10% and avoid hard intensity on consecutive days,
- resting HR about +5 bpm versus the 14-day baseline: move high intensity later and use Z2 instead,
- rapid weight change > 0.7%/week: keep intensity conservative and prioritize recovery,
- subjective RPE/fatigue/sleep can justify a 5-10% adjustment.

Use these as signals, not automatic medical conclusions.

## Event safety and idempotency

Before creating a workout:
1. list the relevant date range,
2. look for the intended `external_id`,
3. update an existing matching event instead of duplicating it.

Only edit future planned events unless explicitly correcting history.

For destructive operations, confirm that the target event ID and date/name match the intended event before deleting.

If an API response is too large, retry using shorter date ranges.

## Workout Builder syntax

Intervals workout descriptions should stay parseable:

- each step starts with `-`,
- duration examples: `30s`, `10m`, `1m30`,
- targets may use watts, `%FTP`, HR, cadence, zones, ramps, or absolute pace,
- repeats use a heading such as `Main set 6x` followed by steps,
- avoid unrelated free text in the workout description.

Example:

```text
Warmup
- 10m Z1 Pace

Main set
- 20m Z3 Pace

Cooldown
- 10m Z1 Pace
```

## Available MCP tools

Intervals:
- `getAthleteProfile`
- `listEvents`, `createEvent`, `updateEvent`, `deleteEvent`
- `listActivities`
- `getWellnessByDate`, `upsertWellnessByDate`, `upsertWellness`, `upsertWellnessBulk`
- `getAthleteTrainingPlan`, `setAthleteTrainingPlan`

GitHub:
- `getFileContents`, `putFileContents`
- `getRepo`, `listCommitsForPath`
