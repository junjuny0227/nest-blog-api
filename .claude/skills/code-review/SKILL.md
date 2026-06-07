---
name: code-review
description: 'Review nest-blog-api changed files using dynamically discovered .claude/rules, NestJS module conventions, DTO validation, service/controller boundaries, security basics, and validation results. Use for code review requests, staged diff review, pre-PR review, and after multi-file implementation.'
---

# nest-blog-api Code Review

Use this skill for structured review of changed nest-blog-api backend code or harness files.

## Step 1: Load Rules

Discover rules dynamically:

```bash
find .claude/rules -name "*.md" 2>/dev/null
```

Read every returned file. Rules in `CLAUDE.md` still apply; if rules conflict, use this priority:

```text
CLAUDE.md > .claude/rules/** > nearby source patterns
```

For multi-file reviews or pre-PR checks, also read `${CLAUDE_SKILL_DIR}/references/review-checklist.md`.

## Step 2: Determine Review Scope

Use the user's requested scope:

- Staged review: `git diff --staged`
- Working tree review: `git diff`
- Branch review: compare with `main` or `develop` when available
- File-specific review: inspect the named files and direct dependencies

## Step 3: Review Checklist

Check only what is relevant to the changed files. Use the reference checklist for detailed prompts, and keep the final report focused on actual findings:

- NestJS module structure and dependency direction.
- Controller/service/repository responsibility boundaries.
- DTO validation coverage with class-validator.
- Module registration for new providers.
- Guard usage on protected routes.
- Security: no hardcoded secrets, credentials, or API keys.
- Test coverage for changed service methods.
- Validation commands and unverified risk.

## Report Format

Lead with findings:

```markdown
## Findings

- [High|Medium|Low] `path:line` — issue, impact, and suggested fix.

## Open Questions

- Only include real blockers or assumptions.

## Checks

- Commands and static checks performed.
```

If no issues are found, state that clearly and mention remaining test gaps.
