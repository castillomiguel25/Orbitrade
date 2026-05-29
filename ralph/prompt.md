# ISSUES

Open issue files from `docs/issues/` are provided at start of context. Issues already marked `## Status: done` have been filtered out before you received them — do not re-implement them.

You will work on the AFK issues only, not the HITL ones.

If all AFK tasks are complete, output <promise>NO MORE TASKS</promise>.

# TASK SELECTION

Pick the next task. Prioritize tasks in this order:

1. Critical bugfixes
2. Development infrastructure

Getting development infrastructure like tests and types and dev scripts ready is an important precursor to building features.

3. Tracer bullets for new features

Tracer bullets are small slices of functionality that go through all layers of the system, allowing you to test and validate your approach early. This helps in identifying potential issues and ensures that the overall architecture is sound before investing significant time in development.

TL;DR - build a tiny, end-to-end slice of the feature first, then expand it out.

4. Polish and quick wins
5. Refactors

# EXPLORATION

Explore the repo.

# IMPLEMENTATION

Where possible, use a red-green refactor loop:

## RED: Write a single failing test

## GREEN: Write the minimal implementation

## RED: Write another failing test

Repeat until implementation is complete.

# FEEDBACK LOOPS

Before committing, run the feedback loops:

- `pnpm run test` to run the tests
- `pnpm run typecheck` to run the type checker

# COMMIT

Make a git commit. The commit message must:

1. Include key decisions made
2. Include files changed
3. Blockers or notes for next iteration

# MARKING AN ISSUE DONE

When a task is complete, append the following block to the bottom of its issue file (e.g. `docs/issues/001-*.md`) and include that file in your commit:

```
## Status: done
```

Do not write anything else after that line — it is used as a machine-readable marker by the loop runner.

# FINAL RULES

ONLY WORK ON A SINGLE TASK.