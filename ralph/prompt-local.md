# ISSUES

Open issue files from `.scratch/orbitrade-energy-transform/issues/` are provided at the start of context. Issues already marked `## Status: done` have been filtered out before you received them — do not re-implement them.

You will work on the AFK issues only (`Type: AFK`), NOT the HITL ones (`Type: HITL`).

If all AFK tasks are complete, output <promise>NO MORE TASKS</promise>.

# CONTEXT

This is the Orbitrade energy/industrial transformation. The authoritative spec is `SPEC.md` at the repo root and the PRD is at `.scratch/orbitrade-energy-transform/PRD.md`. Read them and `CLAUDE.md` before starting. Respect declared "Blocked by" dependencies: do NOT start an issue whose blockers are not yet `## Status: done`.

# TASK SELECTION

Pick the next unblocked task. Prioritize in this order:

1. Critical bugfixes
2. Development infrastructure (tests, types, dev scripts) — a precursor to features
3. Tracer bullets for new features — a tiny end-to-end slice first, then expand
4. Polish and quick wins
5. Refactors

# EXPLORATION

Explore the repo before changing anything.

# IMPLEMENTATION

Where the issue calls for tests, use a red-green-refactor loop:

## RED: write a single failing test
## GREEN: write the minimal implementation
## RED: write another failing test

Repeat until the slice is complete.

# FEEDBACK LOOPS

Before committing, run the feedback loops that exist:

- `pnpm run test` (if a `test` script exists)
- `pnpm run typecheck` (if a `typecheck` script exists)
- `pnpm build` must pass

If `test`/`typecheck` scripts do not exist yet, the test-infrastructure issue (00) is the one to do first.

# COMMIT

Make a git commit on the current branch. The commit message must:

1. Include key decisions made
2. Summarize files changed
3. Note blockers/notes for the next iteration

End the commit message with:
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>

# MARKING AN ISSUE DONE

When a task is complete, append the following block to the bottom of its issue file at `.scratch/orbitrade-energy-transform/issues/<NN>-*.md`:

```
## Status: done
```

Do not write anything else after that line — it is a machine-readable marker for the loop runner. NOTE: the `.scratch/` directory is gitignored, so you do NOT need to `git add` the issue file — just write the marker to disk.

# FINAL RULES

ONLY WORK ON A SINGLE TASK per iteration.
