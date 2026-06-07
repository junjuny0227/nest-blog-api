---
description: 'Root-cause debugging, boundary tracing, and fix discipline rules for nest-blog-api bugs, test failures, and build errors.'
paths:
  - 'src/**/*'
  - 'test/**/*'
  - '.claude/**/*.sh'
---

# Debugging Rules

## Root Cause First

Do not patch symptoms before identifying the likely root cause.

Before changing code:

1. Read the full error output.
2. Reproduce the issue or explain why reproduction is unavailable.
3. Check recent diffs and relevant call sites.
4. Compare the broken path with a working local pattern.
5. State one specific hypothesis before editing.

## Boundary Tracing

For API request failures, trace:

```text
request -> guard -> pipe (DTO validation) -> controller -> service -> repository
```

For DTO validation failures, trace:

```text
incoming body -> ValidationPipe -> class-validator decorators -> controller handler
```

For authentication failures, trace:

```text
request -> AuthGuard -> Passport strategy -> JWT verification -> user lookup
```

For build or type failures, trace:

```text
first TypeScript error -> owning file -> imports and types -> recent diff -> local pattern
```

For test failures, trace:

```text
failing spec -> TestingModule setup -> mocked dependencies -> assertion
```

## Fix Discipline

- Make one root-cause fix at a time.
- Do not bundle unrelated cleanup with a bug fix.
- If two fix attempts fail, stop and re-evaluate the hypothesis.
- If the failure depends on environment variables or external services, separate environment evidence from code evidence.
