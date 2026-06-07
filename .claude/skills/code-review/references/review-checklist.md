# nest-blog-api Review Checklist

Use this checklist after loading `.claude/rules/*.md` and `CLAUDE.md`.

## Architecture

- Controllers depend on services, not repositories.
- Services depend on repositories or other services.
- No circular module dependencies were introduced.
- New providers are registered in the owning module's `providers` array.
- Cross-module services are exported and their module is imported by the consumer.

## Controllers

- Route paths use plural, kebab-case naming.
- `@Param()`, `@Body()`, `@Query()` are used consistently.
- Controllers return service results directly without extra business logic.
- `@HttpCode()` is used only when the default status code is wrong.

## Services

- Business logic belongs in services, not controllers or repositories.
- Expected failure cases throw typed NestJS exceptions (`NotFoundException`, `BadRequestException`, etc.).
- No generic `Error` is thrown where a typed exception applies.

## DTOs

- All user-facing fields have class-validator decorators.
- Optional fields use `@IsOptional()`.
- Update DTOs use `PartialType(CreateDto)` where appropriate.
- Nested objects use `@ValidateNested()` and `@Type(() => NestedDto)`.

## Entities

- TypeORM decorators are present on all columns.
- Relationships are defined with correct cardinality decorators.
- Entities contain no business logic.

## Security and Configuration

- No secrets, database credentials, or API keys are hardcoded.
- Environment variables are accessed through the config module or `process.env`.
- User-controlled input retains validation before use in queries.

## Tests

- Changed service methods have corresponding unit test coverage.
- New endpoints have e2e test coverage when feasible.
- Test modules mock all injected dependencies.

## Validation

- `npm run lint`, `npm run build`, and `npm run test` are run when feasible.
- If a check is skipped, the blocker and residual risk are reported.
