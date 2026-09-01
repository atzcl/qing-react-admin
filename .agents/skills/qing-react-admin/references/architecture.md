# Architecture map

| Concern                       | Owner                               | Boundary                              |
| ----------------------------- | ----------------------------------- | ------------------------------------- |
| URL, loader, redirect, search | `src/routes`                        | TanStack Router client file routes    |
| Feature page and metadata    | `features/**`                       | Colocated page and feature manifest   |
| Visible admin pages and menu | `core/page-registry.tsx`            | Auto-discovered feature definitions   |
| Opened-page retention         | `components/activity-page-host.tsx` | React Activity visible/hidden modes   |
| Demo session                  | `core/auth.ts`                      | Validated local/session storage       |
| Auth operations               | `core/auth.ts`                      | Browser-only demo boundary            |
| Remote API cache             | feature-local query modules         | TanStack Query options                |
| Preference contract/storage  | `core/preferences.ts`               | Zod schema and versioned browser data |
| Tab commands                 | `core/tab-model.ts`                 | Atomic retained-tab transitions       |
| Preferences and tabs         | `core/app-store.tsx`                | Hydrated client TanStack Store         |
| Forms                        | page-local or `QueryForm`           | Ant Design Form plus Zod boundaries   |
| Theme and locale              | `components/app-providers.tsx`      | Ant Design ConfigProvider tokens      |
| Layout chrome                 | `components/admin-shell.tsx`        | Sidebar, mixed, and top navigation    |

## State ownership test

- Data fetched from or mutated through a remote API belongs in Query.
- State shared by unrelated client routes belongs in Store.
- Input and validation lifecycle belongs in Form.
- URL-shareable filters belong in validated route search.
- A page draft that should survive tab switching can remain local state because Activity retains the tree.

## CSR boundary

`src/main.tsx` mounts `RouterProvider` into `index.html`. Vite emits one static client application; production hosting must rewrite unknown routes to `/index.html`. Do not add server entry points or rely on server loaders. Browser demo authentication controls UI routing only and must be replaced by a real API authorization boundary in production.

## Adding a protected page

Use the generator or add the three-file slice atomically: `feature.ts`, `page.tsx`, and an explicit route with `staticData.adminPagePath`. The manifest owns labels, descriptions, group, permissions, and lazy loading; Vite discovers it without central-file edits. The file route must call `beforeLoadAdminPage`; do not add another role list to the route. Verify direct URL entry and menu access for admin, super, and user roles.

Registration is only the outer seam. Implement the page's real states and shared component composition; do not route multiple features to a generic placeholder merely to satisfy the registry count.
