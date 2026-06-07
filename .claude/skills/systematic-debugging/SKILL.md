---
name: systematic-debugging
description: 'Investigate nest-blog-api bugs, build failures, test failures, runtime errors, validation issues, and unexpected behavior by finding root cause before fixes. Use whenever debugging, test failure, build failure, regression, or unclear behavior is mentioned.'
---

# nest-blog-api Systematic Debugging

Use this skill before fixing bugs or validation failures.

## Rule

Find root cause before editing code. A quick patch that only hides the symptom is not a fix.

## Phase 1: Evidence

1. Read the full error, warning, stack trace, or user reproduction.
2. Identify whether the issue is reproducible.
3. Inspect recent diffs and directly related files.
4. Compare against a working local pattern.
5. State one root-cause hypothesis.

## Phase 2: Boundary Trace

Choose the relevant trace:

```text
API request:    request -> guard -> pipe (validation) -> controller -> service -> repository
DTO validation: incoming body -> ValidationPipe -> class-validator decorators -> controller handler
Auth:           request -> AuthGuard -> Passport strategy -> JWT verification -> user lookup
Build:          first TypeScript error -> owning file -> imports/types -> recent diff
Test:           failing spec -> TestingModule setup -> mocked dependencies -> assertion
```

For failures that cross more than one boundary, read `${CLAUDE_SKILL_DIR}/references/root-cause-tracing.md` before proposing a fix.

## Phase 3: Minimal Fix

- Change one thing that addresses the hypothesis.
- Do not bundle cleanup or refactors.
- Prefer adding a focused regression test if the repository has a suitable test path.
- If no test exists, document the smallest command that verifies the fix.

## Phase 4: Verification

Run the smallest meaningful check first, then the broader gate:

```bash
npm run lint
npm run build
npm run test
```

If a check cannot run because of environment constraints, report the constraint separately from code risk.
