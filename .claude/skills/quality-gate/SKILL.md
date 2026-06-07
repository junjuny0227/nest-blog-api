---
name: quality-gate
description: 'Verify nest-blog-api changes with npm run lint, npm run build, npm run test, module registration coherence, DTO validation coverage, service exception handling, and integration boundary review. Use after implementation, during reviews, for reruns, and whenever a task risks regressions.'
---

# nest-blog-api Quality Gate

Use this skill to verify changes before final delivery.

## Rule Loading

Discover and read project harness rules before static review:

```bash
find .claude/rules -name "*.md" 2>/dev/null
```

Use these files together with `CLAUDE.md` and nearby source patterns.

## Minimum Commands

Run these when feasible:

```bash
npm run lint
npm run build
npm run test
```

For e2e tests when relevant:

```bash
npm run test:e2e
```

If a command fails, inspect whether the failure is caused by the current change, the environment (missing DB, missing env vars), or pre-existing repository state.

## Static Review Checklist

Check the boundaries affected by the task:

- New providers are registered in `providers` of the owning `*.module.ts`.
- New cross-module services are exported from their module and the consuming module imports the provider module.
- Controller route paths match the intended API contract.
- Guard decorators are applied consistently to protected routes.

## DTO and Validation Checklist

For DTO changes, compare both sides:

- All user-facing fields have class-validator decorators.
- `PartialType` is used for Update DTOs instead of duplicating fields.
- Required and optional fields are aligned with the service implementation.

## Service and Exception Checklist

For service changes:

- Business logic does not leak into controllers.
- Expected failure cases throw typed NestJS exceptions, not generic `Error`.
- Repository calls are appropriately wrapped or handled.

## Test Coverage Checklist

- Changed service methods have unit test coverage.
- New endpoints have e2e test coverage when feasible.
- Test module mocks match the real provider signatures.

## Reporting Format

Report findings in this order:

1. Blocking issues
2. Non-blocking risks
3. Commands run
4. Residual risk

If no issues are found, say so directly and still list the checks that were run.
