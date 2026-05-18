# Repository Guidelines

## Project Structure & Module Organization

This is a Vue 3, Vite 7, TypeScript, and pnpm application. Main app code lives in `src/`.
Use `src/views/` for route pages, `src/components/` for feature components, `src/layout/`
for shell UI, `src/router/` for route modules, `src/store/` for Pinia stores, `src/api/`
and `src/services/` for request logic, and `src/utils/` for shared helpers. Shared reusable
building blocks live in `common/`. Assets are in `src/assets/`, public files in `public/`,
generated declarations in `typings/`, and build output in `dist/`.

## Build, Test, and Development Commands

- `pnpm install`: install dependencies using the lockfile.
- `pnpm dev`: start the Vite development server.
- `pnpm build`: create a production build in `dist/`.
- `pnpm type-check`: run `vue-tsc --build` for TypeScript and Vue SFC checks.
- `pnpm type-check-build`: type-check, then build.
- `pnpm lint`: run Oxlint and ESLint with fixes.
- `pnpm format:prettier`: format Markdown/YAML files.

Use Node `22.16.0` and pnpm `10.18.2` as declared in `package.json`.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, LF endings, two-space indentation, final newline, and
trimmed trailing whitespace. Prettier uses single quotes, no semicolons, and a 100-column
print width. Prefer lowercase route/view filenames such as `src/views/comic/detail.vue`;
component folders commonly expose `index.vue` and `type.ts`.

## Testing Guidelines

No test runner is currently configured. Before submitting changes, run `pnpm type-check` and
`pnpm lint`; run `pnpm build` for user-facing or routing changes. If tests are introduced,
place them near the related module or under a clearly named test directory, then document the
new command.

## Commit & Pull Request Guidelines

Git history follows Conventional Commit prefixes, often with Chinese descriptions, such as
`feat: 重新设计用户评论页面UI` and `fix: 优化登录页面细节`. Use `feat:`, `fix:`, `docs:`,
`refactor:`, or `chore:` with a concise behavior summary. Pull requests should include a
short summary, validation commands, linked issues when available, and screenshots for UI
changes.

## Security & Configuration Tips

Do not commit local secrets, generated `dist/` output, or environment-specific files. Keep
API and configuration changes centralized in `src/services/config.ts`, `common/config/`, or
`env/`.

## Agent-Specific Instructions

When the user says `提交代码`, commit and push only code changed in the current conversation
with a Conventional Commit message. When the user says `提交全部代码`, inspect staged changes,
split them into logical commits by feature, and push them with Conventional Commit messages.
