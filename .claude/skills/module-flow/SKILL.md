---
name: module-flow
description: 'Implement nest-blog-api NestJS modules: controllers, services, DTOs, entities, guards, and module registration. Use whenever a task touches request handling, business logic, data persistence, or DTO validation.'
---

# nest-blog-api Module Flow

Use this skill for any work that touches request handling, business logic, data models, or validation.

## Standard Paths

- Module declaration: `src/<domain>/<domain>.module.ts`
- Route handlers: `src/<domain>/<domain>.controller.ts`
- Business logic: `src/<domain>/<domain>.service.ts`
- Request DTOs: `src/<domain>/dto/create-<domain>.dto.ts`, `update-<domain>.dto.ts`
- Database entity: `src/<domain>/entities/<domain>.entity.ts`
- Shared guards: `src/common/guards/`
- Shared decorators: `src/common/decorators/`
- Shared interceptors: `src/common/interceptors/`

## Controller Rules

- Controllers receive validated DTOs and call service methods.
- Do not write query logic or business rules in controllers.
- Return the service result directly; NestJS serializes it.

## Service Rules

- Services own all business logic.
- Throw typed NestJS exceptions for expected failures.
- Keep service methods focused on one operation.

## DTO Rules

- All user-facing fields must have class-validator decorators.
- Use `PartialType(CreateDto)` for Update DTOs.
- Keep Create and Update DTOs in separate files.

## Module Registration

For every new provider added:

1. Add to `providers` in the owning `*.module.ts`.
2. If another module needs it, add to `exports` and import the module there.

## Integration Review

For every module-flow change, verify:

```text
HTTP method + path -> controller handler -> service method -> repository call -> response shape
DTO fields -> class-validator decorators -> ValidationPipe -> controller body param
```

If one link is missing or mismatched, treat it as a bug to resolve or explicitly report.
