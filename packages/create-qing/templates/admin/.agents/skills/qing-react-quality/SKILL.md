---
name: qing-react-quality
description: 'Verify and diagnose this Qing React Admin workspace with Oxfmt, type-aware Oxlint, TypeScript 7 native and TypeScript 6 compatibility checks, Vitest, Vite production builds, Agent Skill validation, and browser smoke tests. Use after changes or when a quality gate fails.'
---

# Qing React Quality

Run the gate from the repository root and preserve the first actionable failure.

1. Run `pnpm format:check`; apply `pnpm format` only when the task authorizes edits.
2. Run `pnpm lint`. Treat warnings as failures because Oxlint uses `maxWarnings: 0` and type-aware rules.
3. Run `pnpm build` so the TanStack Router Vite plugin refreshes `routeTree.gen.ts` and the CSR artifact assertion runs, especially after page generation.
4. Run `pnpm typecheck` for TypeScript 7, `pnpm typecheck:compat` for tools still using the TypeScript 6 API, then `pnpm test` and `pnpm test:coverage`.
5. Run `pnpm routes:check`, `pnpm template:check`, `pnpm skills:validate`, and, for Ant Design changes, `antd lint apps/web-admin/src --format json`.
6. Run `pnpm test:e2e` when routes, Activity, auth, layout, page loading, or parity behavior changes.
7. Start the built or development server and exercise the affected flow in a real browser.
8. Verify the registry counts (41 demos, 41 examples, 89 standalone pages), then capture at least the login page and one authenticated default-layout page at 1440×900. A passing compiler does not make a generic or visually divergent page complete.

When a stage fails, fix its cause and restart at that stage. Before handoff, run the aggregate `pnpm check`; it must exit zero. Read `references/quality-gate.md` when diagnosing React Compiler, Activity, CSR hosting, or generated-route behavior.
