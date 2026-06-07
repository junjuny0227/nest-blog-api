---
description: 'Controller, service, DTO, entity, guard, and test conventions for nest-blog-api TypeScript source files.'
paths:
  - 'src/**/*.ts'
  - 'test/**/*.ts'
---

# NestJS Conventions

## Naming

- Classes: `PascalCase` — `PostsController`, `PostsService`, `CreatePostDto`, `Post` (entity).
- Methods and injected dependencies: `camelCase`.
- File names: `<domain>.<type>.ts` — e.g. `posts.service.ts`, `create-post.dto.ts`, `post.entity.ts`.

## Controllers

- Use `@Controller('<path>')` with a plural, kebab-case path.
- Annotate handlers with `@Get()`, `@Post()`, `@Patch(':id')`, `@Delete(':id')`, etc.
- Extract route params with `@Param('id')`, body with `@Body()`, query strings with `@Query()`.
- Return values directly; do not manually set status codes unless the default is wrong.
- Use `@HttpCode()` only when the default 200/201 is incorrect.

## Services

- Inject dependencies through the constructor.
- Throw typed NestJS exceptions: `NotFoundException`, `BadRequestException`, `ConflictException`, `ForbiddenException`, `UnauthorizedException`.
- Do not catch exceptions inside a service unless re-throwing a more specific type.

## DTOs

- Use class-validator decorators: `@IsString()`, `@IsNotEmpty()`, `@IsOptional()`, `@IsEmail()`, `@IsInt()`, `@Min()`, etc.
- Keep Create and Update DTOs separate. Use `PartialType(CreateDto)` from `@nestjs/mapped-types` for Update DTOs.
- Do not share a DTO between incompatible request shapes.

## Entities

- Use TypeORM decorators: `@Entity()`, `@Column()`, `@PrimaryGeneratedColumn()`, `@CreateDateColumn()`, `@UpdateDateColumn()`.
- Define relationships explicitly: `@OneToMany()`, `@ManyToOne()`, `@ManyToMany()`, `@JoinTable()`.
- Keep entity classes free of business logic.

## Testing

- Unit tests: `src/<domain>/<domain>.service.spec.ts` — test service methods with mocked dependencies using `jest.fn()`.
- E2E tests: `test/<domain>.e2e-spec.ts` — test HTTP endpoints using `supertest` and `@nestjs/testing`.
- Use `Test.createTestingModule()` for unit test module setup.
- Mock repository or service dependencies; do not hit real databases in unit tests.
