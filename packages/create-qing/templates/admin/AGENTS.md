# Repository instructions

This workspace is a pure CSR React 19, TanStack Router, and Ant Design 6 administration application.

- For auth, access, layout, navigation, tabs, Activity retention, theme, i18n, client data, or page behavior, use `.agents/skills/qing-react-admin/SKILL.md`.
- For project scaffolding or page generation, use `.agents/skills/qing-react-generator/SKILL.md`.
- For verification, compiler diagnostics, or CI failures, use `.agents/skills/qing-react-quality/SKILL.md`.
- For Ant Design code, query the installed 6.6.1 API before editing and run `antd lint apps/web-admin/src --format json` afterward.

The unusual seam is intentional: TanStack file routes own URL matching, auth guards, loaders, and search validation; auto-discovered `features/**/feature.ts` manifests plus `ActivityPageHost` own navigation and retained rendering. A new protected page is complete when its colocated manifest and explicit file route agree.

Keep the application browser-only: do not add TanStack Start, SSR entry points, server functions, or server bundles. Production hosts must rewrite unknown application routes to `/index.html`.
