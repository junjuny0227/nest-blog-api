# nest-blog-api Git Scope Guide

Use this guide when selecting branch names, commit scopes, PR title scopes, and logical commit groups.

## Runtime Discovery

Prefer changed files over guesses:

```bash
bash "${CLAUDE_SKILL_DIR}/scripts/discover-changed-areas.sh" auto
```

Use `staged` when the user specifically asks about staged changes:

```bash
bash "${CLAUDE_SKILL_DIR}/scripts/discover-changed-areas.sh" staged
```

## Scope Priority

Choose the most specific meaningful scope:

1. Domain area (derive from changed `src/<domain>/` directory name)
2. Cross-cutting scope such as `common`, `config`, `harness`, `docs`, `ci`

## Common Scope Mapping

| Changed Area                                     | Preferred Scope                   | When to Use                                      |
| ------------------------------------------------ | --------------------------------- | ------------------------------------------------ |
| `src/<domain>/<domain>.controller.ts`            | `<domain>` (derive from dir name) | Route handler changes                            |
| `src/<domain>/<domain>.service.ts`               | `<domain>` (derive from dir name) | Business logic changes                           |
| `src/<domain>/dto/**`                            | `<domain>` (derive from dir name) | DTO or validation changes                        |
| `src/<domain>/entities/**`                       | `<domain>` (derive from dir name) | Entity or schema changes                         |
| `src/<domain>/<domain>.module.ts`                | `<domain>` (derive from dir name) | Module registration changes                      |
| `src/common/**`                                  | `common`                          | Shared guards, decorators, interceptors, filters |
| `src/config/**`                                  | `config`                          | Configuration module changes                     |
| `.claude/**`                                     | `harness`                         | Agent, skill, rule, hook, or settings changes    |
| `.github/**`                                     | `ci`                              | Workflow or PR template changes                  |
| `docs/**`, `README.md`, `CLAUDE.md`              | `docs`                            | Documentation-only changes                       |
| Tooling config                                   | `config`                          | TypeScript, ESLint, Prettier, Nest, package      |

## Commit Type Selection

| Type       | Use For                                              |
| ---------- | ---------------------------------------------------- |
| `feat`     | New API endpoint or user-visible capability          |
| `fix`      | Bug fix or regression fix                            |
| `refactor` | Internal restructuring without behavior change       |
| `chore`    | Harness, tooling, dependency, or maintenance changes |
| `docs`     | Documentation-only changes                           |
| `test`     | Test-only changes                                    |
| `ci`       | GitHub Actions or CI changes                         |

## Examples

```text
chore(harness): NestJS 백엔드에 맞게 하네스 재구성
feat(posts): 게시글 CRUD 모듈 추가
fix(auth): JWT 토큰 검증 오류 수정
test(users): 사용자 서비스 단위 테스트 추가
docs: README 업데이트
```
