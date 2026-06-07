---
name: backend-architecture
description: 'Plan and review nest-blog-api NestJS module structure, dependency injection, entity design, and API contract scope. Use for any module creation, cross-module dependency decision, or architecture scope question.'
---

# nest-blog-api Backend Architecture

Use this skill to keep changes aligned with the repository's modular structure and prevent unnecessary scope expansion.

## Repository Shape

nest-blog-api is a NestJS REST API using:

- NestJS 11, TypeScript
- Jest (unit tests), Supertest (e2e tests)
- class-validator for DTO validation

Module layout:

```text
src/
  <domain>/
    <domain>.module.ts
    <domain>.controller.ts
    <domain>.service.ts
    dto/
      create-<domain>.dto.ts
      update-<domain>.dto.ts
    entities/
      <domain>.entity.ts
  common/       — shared guards, decorators, interceptors, filters, pipes
  config/       — configuration modules
  app.module.ts
  main.ts
```

## Planning Workflow

1. Identify the feature or behavior to add.
2. Locate the owning domain module in `src/`.
3. Determine which layer owns the change: controller (routing), service (logic), or entity (data).
4. Check whether cross-module imports are needed.
5. Define DTOs before writing controllers or services.
6. Choose the smallest scope that satisfies the request.

## Decision Rules

- Add a new module only when the domain is clearly independent.
- Use `forwardRef()` only when circular dependencies cannot be avoided by restructuring.
- Register global providers (pipes, guards, interceptors) in `AppModule` only when they must apply everywhere.
- Do not move files only to make the structure look cleaner.

## Output

Write a plan that includes:

- Modules involved
- DTOs to create or update
- Entity changes
- Module import dependencies
- API endpoint contracts
- Validation steps
