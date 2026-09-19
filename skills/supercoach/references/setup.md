# Setup and migration

Use this reference when connecting SuperCoach on a new account, migrating the coach, or diagnosing missing capabilities.

## Behavior

Start setup immediately from the available capabilities. Do not conduct a generic onboarding interview.

- Detect capabilities first.
- Do every safe/read-only setup step autonomously.
- Ask only for a real blocker that cannot be discovered through tools.
- Never ask the user to paste API keys, GitHub tokens, passwords, or other secrets into chat.

## Required capabilities

A complete setup needs:

1. Intervals.icu read/write tools for profile, activities, events, wellness, and training-plan state.
2. Persistent GitHub read/write access.
3. A known persistent repository and plan/notes filenames.

Default durable GitHub files:
- `maal_og_langsigtet_plan.md`
- `noter.md`

If GitHub is explicitly declined, a file-backed fallback may be used, but GitHub is preferred because it provides history and rollback.

## Connection verification

Verify, in this order:

1. `getAthleteProfile` succeeds.
2. the persistent GitHub repository is readable.
3. both plan and notes files exist; initialize minimal templates only if missing.
4. GitHub write capability works before reporting setup as complete.
5. central Intervals reads work.
6. no credentials were exposed in chat.

For a write smoke test, prefer a reversible GitHub change. Only create a temporary Intervals NOTE if cleanup can be guaranteed.

## Ready criteria

Report setup as ready only when:
- Intervals profile can be read,
- storage mode and persistent repository are known,
- persistent plan/notes can be read and written,
- central Intervals reads work,
- any smoke-test data has been cleaned up,
- no secrets were shared in chat.

If a capability is unavailable on the user's current ChatGPT plan/workspace, state the exact missing capability and preserve the rest of the setup.
