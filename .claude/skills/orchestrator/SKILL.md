---
name: orchestrator
description: 'Coordinate the nest-blog-api agent team for backend features, bug fixes, refactors, module implementation, API design, database schema, QA, code review, debugging, branch names, actual commits, PR creation, and PR review comment replies. Use this skill for nest-blog-api implementation tasks, reviews, reruns, updates, revisions, partial reruns, follow-up fixes, Git workflow tasks, and requests to improve previous results. Simple one-off questions may be answered directly.'
---

# nest-blog-api Orchestrator

Coordinate the nest-blog-api harness. This skill routes work to the right specialists and keeps the implementation small, verifiable, and aligned with the repository.

## Execution Mode

Use agent team mode by default.

Team members:

| Agent                    | Type   | Model  | Role                              | Skill                               | Primary Output                                              |
| ------------------------ | ------ | ------ | --------------------------------- | ----------------------------------- | ----------------------------------------------------------- |
| `backend-architect`      | custom | sonnet | Module planning and scope control | `backend-architecture`              | `_workspace/{phase}_backend-architect_plan.md`              |
| `module-implementer`     | custom | sonnet | Controller, service, DTO, entity  | `module-flow`                       | `_workspace/{phase}_module-implementer_changes.md`          |
| `qa-inspector`           | custom | sonnet | Cross-boundary verification       | `quality-gate`                      | `_workspace/{phase}_qa-inspector_report.md`                 |
| `code-reviewer`          | custom | sonnet | Changed-file review               | `code-review`                       | `_workspace/{phase}_code-reviewer_review.md`                |
| `bug-investigator`       | custom | sonnet | Root-cause debugging              | `systematic-debugging`              | `_workspace/{phase}_bug-investigator_report.md`             |
| `git-workflow-assistant` | custom | haiku  | Commit, PR, and review workflow   | `commit` / `write-pr` / `review-pr` | `_workspace/{phase}_git-workflow-assistant_git.md`          |

When invoking agents in a Claude harness that supports model selection, use the `model` value from each agent frontmatter unless the user explicitly asks for a different model.

## Phase 0: Context Check

Before starting work:

1. Check whether `_workspace/` exists.
2. Choose the run mode:
   - No `_workspace/`: initial run.
   - `_workspace/` exists and the user asks for a narrow correction: partial rerun. Read the relevant previous artifacts and update only the affected area.
   - `_workspace/` exists and the user provides a new broad request: fresh run. Preserve the old workspace by moving it to `_workspace_{YYYYMMDD_HHMMSS}/`, then create a new `_workspace/`.
3. Read `CLAUDE.md`, `package.json`, dynamically discovered `.claude/rules/*.md`, and the relevant source files before assigning work.

## Phase 1: Classify the Task

Classify the request into one or more tracks:

- Module design, entity schema, or cross-module dependency: assign `backend-architect`.
- Controller, service, DTO, or entity implementation: assign `module-implementer`.
- Review, regression, or final acceptance: assign `qa-inspector`.
- Explicit code review, staged diff review, or pre-PR review: assign `code-reviewer`.
- Bugs, build failures, test failures, or unclear runtime behavior: assign `bug-investigator` before implementation.
- Branch names, actual commits, logical commit splits, PR creation, or PR review comment replies: assign `git-workflow-assistant`.

For small tasks, use only the needed agents. For cross-module tasks, use the full team.

## Phase 2: Assign Work

Use a supervisor plus producer-reviewer workflow:

1. `backend-architect` defines scope, module ownership, and file list.
2. `bug-investigator` runs before fixes when the task starts from a failure or unclear behavior.
3. `module-implementer` implements only files in the architect's plan.
4. `qa-inspector` verifies after each meaningful module boundary, not only at the end.
5. `code-reviewer` reviews changed files for multi-file or pre-PR work.
6. `git-workflow-assistant` prepares or executes commit, PR creation, and PR review workflows when explicitly requested.
7. The orchestrator integrates findings and keeps the final response concise.

## Data Flow

Use `_workspace/` for intermediate artifacts:

- `_workspace/00_input_request.md`
- `_workspace/01_backend-architect_plan.md`
- `_workspace/02_module-implementer_changes.md`
- `_workspace/03_qa-inspector_report.md`
- `_workspace/03_code-reviewer_review.md`
- `_workspace/01_bug-investigator_report.md`
- `_workspace/04_git-workflow-assistant_git.md`

Preserve `_workspace/` after completion for audit and follow-up work.

## Bundled Resources

Use skill resources only when they help the active task:

- `commit/scripts/discover-changed-areas.sh` for commit and PR scope discovery.
- `commit/references/scope-guide.md` for scope/type selection.
- `write-pr/scripts/create-pr.sh` for explicit PR creation requests.
- `write-pr/references/labels.md` for PR label selection.
- `review-pr/scripts/get-pr-data.sh` for explicit PR review comment handling.
- `review-pr/scripts/reply-review-comment.sh` for explicit GitHub review replies.
- `review-pr/references/reply-formats.md` for Korean reply templates.
- `code-review/references/review-checklist.md` for multi-file or pre-PR reviews.
- `systematic-debugging/references/root-cause-tracing.md` for cross-boundary failures.

## Error Handling

| Situation                                 | Strategy                                                                                                  |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| One agent fails or stalls                 | Retry once with the same narrowed task. If it fails again, continue with a clear gap in the final report. |
| Most agents fail                          | Stop and ask the user whether to continue with partial results.                                           |
| Conflicting findings                      | Keep both claims with file evidence, then inspect the source directly before deciding.                    |
| Validation command fails from environment | Report the environment cause separately from code issues and continue static checks.                      |
| Scope expands unexpectedly                | Return to `backend-architect` to reduce scope before implementation continues.                            |

## Quality Gate

Before final delivery, run or request:

```bash
npm run lint
npm run build
npm run test
```

If a command cannot run, explain the blocker and list the static checks that were completed.

## Test Scenarios

Normal flow:

1. User asks for a feature that adds a new module.
2. Architect defines module files, DTOs, and endpoint contracts.
3. Module implementer creates controller, service, DTO, and entity.
4. QA compares endpoint routes, DTO validation, service methods, and module registration.
5. Final response reports changed behavior and validation results.

Partial rerun flow:

1. User asks to revise only a previous service method.
2. Orchestrator reads `_workspace/` artifacts.
3. Only `module-implementer` and `qa-inspector` are assigned.
4. The relevant artifact is updated and validation is rerun for the affected area.

Debugging flow:

1. User reports a bug, failed test, or unexpected behavior.
2. `bug-investigator` reads the full error and traces the relevant boundary.
3. The responsible implementation agent applies one root-cause fix.
4. `qa-inspector` runs the smallest meaningful check, then the broader quality gate when practical.

Git workflow flow:

1. User asks for a branch name, commit, PR creation, or PR review comment handling.
2. `git-workflow-assistant` inspects actual git state and relevant templates.
3. For commit requests, use `commit`.
4. For PR creation requests, use `write-pr`.
5. For PR review comment handling, use `review-pr`.
6. Do not commit, push, create PRs, or post replies unless the user explicitly requested that side effect.
