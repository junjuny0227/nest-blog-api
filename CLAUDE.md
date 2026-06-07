# nest-blog-api

## Project Overview

nest-blog-api is a NestJS REST API for a blog service. It follows NestJS modular architecture with controllers, services, DTOs, and entities per domain.

## Tech Stack

- Framework: NestJS 11, TypeScript
- Testing: Jest (unit), Supertest (e2e)
- Validation: class-validator, class-transformer
- Package manager: npm

## Project Structure

- `src/`: application root
- `src/<domain>/`: feature module (posts, users, auth, comments, etc.)
  - `<domain>.module.ts`: module declaration and provider registration
  - `<domain>.controller.ts`: route handlers
  - `<domain>.service.ts`: business logic
  - `dto/`: request and response DTOs with class-validator
  - `entities/`: TypeORM entities or Prisma models
- `src/common/`: shared guards, decorators, interceptors, filters, pipes
- `src/config/`: configuration modules
- `test/`: e2e test files

Each module is self-contained. Cross-module dependencies are injected through module imports.

Detailed conventions are split into `.claude/rules/*.md` and injected by path where possible.

## Harness: nest-blog-api Backend

**Goal:** Coordinate focused nest-blog-api backend work through reusable agents, skills, and rules for module architecture, controller/service implementation, debugging, code review, executable Git workflow, and QA.

**Trigger:** For nest-blog-api implementation, review, refactor, bugfix, debugging, branch, commit, PR creation, PR review comments, module creation, API design, database schema, QA, rerun, update, revision, partial rerun, or previous-result improvement requests, use the `orchestrator` skill. Simple questions may be answered directly.

Detailed harness changes are tracked in `.claude/CHANGELOG.md`.
