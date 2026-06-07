# nest-blog-api Root-Cause Tracing

Use this reference when a failure crosses more than one file or layer.

## API Request Failures

Trace in this order:

```text
request -> guard -> pipe (DTO validation) -> controller -> service -> repository
```

Check:

- The HTTP method and route path match between the client and controller.
- The DTO has class-validator decorators for all incoming fields.
- The service throws the correct NestJS exception for the failure case.
- The repository query matches the entity definition.

## DTO Validation Failures

Trace in this order:

```text
incoming body -> ValidationPipe -> class-validator decorators -> controller handler
```

Check:

- `ValidationPipe` is applied globally or on the route.
- Each DTO field has the correct validator (`@IsString()`, `@IsNotEmpty()`, etc.).
- Optional fields use `@IsOptional()` and are not accidentally required.
- Nested objects use `@ValidateNested()` and `@Type(() => NestedDto)`.

## Authentication Failures

Trace in this order:

```text
request -> AuthGuard -> Passport strategy -> JWT verification -> user lookup
```

Check:

- The guard is applied to the correct controller or route.
- The strategy extracts and verifies the token correctly.
- The `validate()` method returns a user that the service expects.

## Build and Type Failures

Trace in this order:

```text
first TypeScript error -> owning file -> import/type chain -> recent diff -> local working example
```

Check:

- Fix the first error before addressing cascading ones.
- Whether generated files (dist/) are stale.
- Whether the failure depends on missing environment types.

## Test Failures

Trace in this order:

```text
failing spec -> TestingModule setup -> mocked dependencies -> assertion
```

Check:

- All providers used by the subject are registered in the test module.
- Mocked methods return the right shape for the test scenario.
- Async operations use `await` consistently.

## Stop Conditions

Stop and re-evaluate when:

- Two attempted fixes fail.
- The hypothesis no longer explains the evidence.
- A fix would require broad architecture changes unrelated to the request.
