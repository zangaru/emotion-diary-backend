# AGENTS.md

This file provides guidelines for agentic coding agents working in this NestJS backend repository.

## Build Commands

```bash
npm run build          # Compile TypeScript to dist/
npm run start:dev      # Run in watch mode (development)
npm run start:prod     # Run production build from dist/
```

## Linting & Formatting

```bash
npm run lint           # Run ESLint with auto-fix
npm run format         # Format with Prettier
```

## Testing

```bash
npm run test           # Run all unit tests
npm run test:e2e       # Run e2e tests
npm run test:cov       # Run with coverage
npm run test:watch     # Watch mode
```

To run a single test file:

```bash
jest path/to/file.spec.ts
```

## Code Style Guidelines

### TypeScript Configuration

- Target: ES2023, strict mode enabled
- Definite assignment assertions (`!`) are used on required entity fields
- Decorators enabled for NestJS decorators
- Type checking: `noImplicitAny` is disabled in tsconfig but type-safe coding is expected

### Formatting (Prettier)

- Single quotes only
- Always use semicolons
- 2 spaces indentation
- Trailing commas everywhere
- Max line length: 120
- Arrow function parens: always

### Import Organization

- Framework imports first: `@nestjs/*`
- External libraries next
- Internal modules use absolute paths: `src/user/user.entity` (not `../../user.entity`)
- Group related imports together

### Naming Conventions

- Classes: PascalCase (`AuthService`, `User`)
- Methods: camelCase (`signIn`, `findAll`)
- Variables/Properties: camelCase
- Files: kebab-case for folders (`auth`, `diary`), PascalCase for class files

### NestJS Architecture Patterns

- Use standard NestJS folder structure: each module has controller, service, module, entity, dto
- DTOs in `dto/` subdirectory with `*-dto.ts` naming
- Entities use TypeORM decorators with `!` assertion on required fields
- Controllers use constructor injection with `private readonly`
- Services are `@Injectable()` with async methods returning `Promise<T>`

### Error Handling

- Use NestJS built-in exceptions: `UnauthorizedException`, `NotFoundException`, etc.
- User-facing error messages in Korean
- Log errors with `this.logger.error()` using NestJS Logger
- Handle unknown errors with type checking: `error instanceof Error ? error.message : 'Unknown error'`

### Validation

- DTOs use `class-validator` decorators: `@IsEmail()`, `@IsNotEmpty()`, `@MinLength()`
- Validation messages in Korean
- Global ValidationPipe configured in main.ts with whitelist: true, transform: true

### Comments & Documentation

- Use JSDoc-style comments (`/** ... */`) for public methods
- Describe parameters with `@param` and return values
- Korean language used for user-facing descriptions
- Inline comments for complex logic

### Database & TypeORM

- Logical deletion pattern: `deleteYn` flag instead of physical DELETE
- Use `@InjectRepository()` for TypeORM repositories
- Query builder for complex queries: `createQueryBuilder('alias')`
- Date columns: `@CreateDateColumn({ name: 'created_at' })`

### Testing

- Use NestJS `TestingModule` for unit tests
- Basic test: `expect(controller).toBeDefined();`
- Test files named `*.spec.ts`

### Type Safety

- Explicit return types on all methods: `Promise<Diary>`, `Promise<{ accessToken: string }>`
- Interface definitions for external API responses
- No `any` types - use `unknown` for truly unknown data, then type guard

### Best Practices

- Async/await for all async operations
- Use `firstValueFrom()` for RxJS observables in services
- Custom decorators for request context: `@CurrentUser()` from `common/decorators`
- Environment variables via `ConfigService`, use `!` assertion for required values
