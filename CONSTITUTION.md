# Project Constitution

Version: 1.0.0
Date: 2026-04-21

## Purpose

Build a small, well-tested TypeScript utility library that parses ISO-8601 duration strings into a typed component object. The public API surface is a single pure function: `parseISO8601Duration(input: string): Duration | null` where `Duration = { years, months, days, hours, minutes, seconds }` with all fields as numbers.

The library runs in Node.js (>=22) and modern browsers. Zero runtime dependencies. Pure, deterministic, easy to reason about.

## Principles

- **Correctness over flexibility** — reject malformed input with `null` rather than guessing. No partial parses.
- **Zero runtime dependencies** — the library ships as pure TypeScript with no external packages at runtime.
- **Test every branch** — every accept/reject path is covered by a Vitest unit test.
- **Public API is tiny** — one function, one type. Don't grow it.

## Stack

- language: typescript
- package_manager: pnpm
- install: pnpm install --frozen-lockfile
- test: pnpm vitest run
- lint: pnpm eslint .
- typecheck: pnpm tsc --noEmit
- build: pnpm build

## Boundaries

- Will NOT add runtime dependencies. All implementation must be vanilla TypeScript using the standard library.
- Will NOT support ISO-8601 weeks duration format (e.g. `P2W`) in the MVP — out of scope.
- Will NOT accept case-insensitive designators — the ISO-8601 spec uses uppercase; we match that exactly.
- Will NOT silently coerce invalid components to zero; invalid input returns `null`.

## Quality Standards

- `pnpm tsc --noEmit` passes with strict mode enabled (strict: true in tsconfig.json).
- `pnpm vitest run` passes with >= 15 test cases covering valid formats, invalid formats, and edge cases (zero values, large values, decimal seconds).
- `pnpm eslint .` passes with zero warnings using the project's flat config.
- `pnpm build` produces a single `dist/index.js` plus `dist/index.d.ts`.

## Roadmap

### MVP

- Implement `parseISO8601Duration` supporting the full P[n]Y[n]M[n]D[T[n]H[n]M[n]S] format (excluding weeks).
- Export the `Duration` type and the parse function from `src/index.ts`.
- Provide a Vitest unit suite in `src/index.test.ts` with at least 15 cases.
- Wire up tsconfig.json (strict), eslint.config.js (flat config), vitest.config.ts, and package.json with the stack commands above.

### Hardening

- Add a property-based test using `fast-check` style manual generators (no new runtime deps — pure TypeScript fixture generation).
- Add doc comments (JSDoc) to every exported symbol.
- Add a README section explaining the grammar accepted and rejected.

### Polish

- Add a `formatDuration(d: Duration): string` inverse helper.
- Add a small example `examples/basic.ts` showing typical usage.

## Verification

- type: library
