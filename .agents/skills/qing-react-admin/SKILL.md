---
name: qing-react-admin
description: 'Implement or review features in this pure CSR React 19, TanStack Router, and Ant Design 6 admin application. Use for routing, browser authentication, role access, navigation, tabs, React Activity retention, preferences, i18n, client data, QueryForm, or ProTable.'
---

# Qing React Admin

Work from the repository root and preserve the established architecture.

## Start here

1. Read `AGENTS.md` and `references/architecture.md`.
2. Inspect the relevant route and colocated `features/**/feature.ts` manifest before editing.
3. Query the installed Ant Design 6 API before adding or changing Ant Design components.
4. Keep remote API state in TanStack Query, cross-page client preferences/tabs in TanStack Store, and local field lifecycle in the page's form owner.
5. Use the shared `QueryForm` and `ProTable` for schema-driven searches and business tables. Extend their composable APIs instead of copying toolbar, density, column-setting, reload, or reset behavior into pages.

## Non-negotiable boundaries

- Use explicit TanStack Router file routes in `apps/web-admin/src/routes`; each admin leaf publishes `staticData.adminPagePath` and delegates its guard to `beforeLoadAdminPage`. Keep `@tanstack/router-plugin` before the React plugin in Vite.
- Define visible application pages with `defineAdminFeature` in a colocated `features/**/feature.ts`; `core/page-registry.tsx` discovers manifests and the Activity host preserves opened-tab state.
- Use React `Activity` only for already visited tabs. Hidden mode preserves state and DOM but cleans up effects.
- Validate runtime boundaries with Zod: form input, URL search, persisted storage, and API payloads. Extend `core/preferences.ts` and its schema instead of adding raw local-storage JSON parsing.
- Express multi-tab operations through `core/tab-model.ts`; bulk close commands must compute the next URL and tab state as one transition.
- Keep this template pure CSR. Do not add TanStack Start, SSR entries, server functions, or server bundles.
- `core/auth.ts` is a browser-storage demo only. Integrate production authentication with an external API and never bundle secrets or treat local role data as an authorization boundary.
- Preserve role checks in both route `beforeLoad` and navigation visibility for protected pages.
- Prefer Ant Design tokens and existing CSS variables over hard-coded theme forks.
- Keep the Rust React Compiler enabled through `@vitejs/plugin-react` and its `compiler.sources` application boundary. Put a documented incompatible integration in `react-compiler-excluded/`; do not widen the exclusion or disable compilation project-wide.
- Treat `core/page-manifest.ts` and the discovered registry as a contract: 89 standalone feature pages plus four auxiliary fallback routes. A title-only route or shared placeholder does not satisfy the contract.
- Preserve interaction states, not only the initial render: dialogs/drawers, validation, loading/empty/error states, table operations, permission branches, tab retention, external links, and preference-controlled chrome must remain usable.

## Completion gate

Run `pnpm check`. If working on Ant Design UI, also run `antd lint apps/web-admin/src --format json`. Exercise the primary interaction in a browser and report any compiler opt-out or residual warning explicitly.
