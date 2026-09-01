# Generator contract

## Commands

```sh
create-qing create <target> [--name <package-name>] [--no-install] [--force]
create-qing skills [target] [--force]
create-qing generate page <name> --route /segment/page --title "页面标题" [--title-tw "頁面標題"] [--title-en "Page title"] [--group demos] [--roles admin,user] [--dry-run]
```

`create` copies the complete project template and its `.agents/skills`. `skills` installs only `AGENTS.md` and the bundled repository skills. `generate page` edits an existing scaffold.

The complete project template retains the same 89-page feature manifest as the source workspace. It must not downsample those routes to a generic demo component. The page command creates a compile-safe skeleton only for a new, user-defined module.

## Page names and routes

- `<name>` is kebab-case after normalization; the URL segments choose `src/features/<segments>/`.
- Component names use PascalCase plus `Page`.
- `--route` is an absolute, lowercase URL composed of letters, digits, `/`, and `-`.
- The generated TanStack route file is `src/routes/_app.<segments>.tsx` and uses the `/_app/...` file-route ID.
- `--group` accepts an existing `navigationGroups` key: `dashboard`, `demos`, `examples`, or `system`. Default: `demos`.
- `--roles` accepts `admin`, `super`, `user`, or a comma-separated combination. `super` bypasses narrower page roles; omit the option for every signed-in role.

## Self-registering feature slice

The generator creates exactly three files:

- `src/features/<segments>/feature.ts`: group, roles, three-language labels/descriptions, and lazy page loader;
- `src/features/<segments>/page.tsx`: visible page composed inside `PageContainer`;
- `src/routes/_app.<segments>.tsx`: explicit route with `staticData.adminPagePath` and the shared access guard.

`core/page-registry.tsx` discovers manifests through `import.meta.glob`, so generation never edits shared registry or translation files. The command rejects any colliding target and removes newly created files if a write fails.

The distributable template is generated from the canonical application by `pnpm template:sync`; `pnpm template:check` rejects source drift. Do not repair the embedded application directly and do not omit its Playwright/coverage gates.
