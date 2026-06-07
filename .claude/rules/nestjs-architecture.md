---
description: 'NestJS module structure, dependency injection, layer ownership, and request lifecycle rules for nest-blog-api source files.'
paths:
  - 'src/**/*'
  - 'CLAUDE.md'
---

# NestJS Architecture Rules

## Module Structure

Each domain module owns:

- `<domain>.module.ts` — declares the module, registers providers and imports
- `<domain>.controller.ts` — route handlers only, no business logic
- `<domain>.service.ts` — business logic and exception throwing
- `<domain>/dto/*.dto.ts` — request and response DTOs
- `<domain>/entities/<domain>.entity.ts` — database entity

## Dependency Direction

- Controllers depend on services.
- Services depend on repositories or other injected services.
- Never import a controller into a service.
- Cross-module access: import the module, then inject the service.
- Avoid circular module dependencies.

## Request Lifecycle

```text
request -> guard -> interceptor -> pipe (validation) -> controller -> service -> repository
```

- Guards run before the controller and decide authorization.
- Pipes transform and validate incoming DTOs before the controller handler executes.
- Interceptors wrap the controller for logging, caching, or response transformation.
- Filters catch exceptions thrown by services and format error responses.

## Change Scope

- Make the smallest change that satisfies the request.
- Do not refactor adjacent modules unless the current change requires it.
- Register new providers in the owning module, not `AppModule` directly unless it is a global provider.
- Add abstractions only when they remove real duplication.
