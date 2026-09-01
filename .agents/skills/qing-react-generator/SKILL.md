---
name: qing-react-generator
description: 'Generate a complete Qing React Admin project or add a registered admin page with the bundled CLI. Use when asked to scaffold, bootstrap, create a page/module, extend navigation, install the repository Agent Skills, or verify generated output.'
---

# Qing React Generator

Use the bundled CLI instead of manually duplicating boilerplate.

## Project scaffold

1. Run `pnpm create:admin -- <target> --name <package-name> --no-install` from this repository, or `create-qing create <target>` from the published package.
2. Inspect the target summary. The command refuses a non-empty directory unless `--force` is explicit; force overwrites colliding template files but does not delete unrelated files.
3. Unless `--no-install` was requested, let the CLI install exact lockfile dependencies with pnpm.
4. In the generated project run `pnpm check`. The scaffold is complete only when skills, TypeScript checks, tests, and production build pass.
5. Assert that the generated registry still exposes the 89-page feature contract and that no generic page fallback exists.
6. When changing the canonical app or bundled skills, run `pnpm template:sync` and commit the synchronized template. Never make a standalone fix only under `packages/create-qing/templates/admin`.

## Page scaffold

1. Read `references/generator-contract.md` for names, route constraints, and files touched.
2. Run `pnpm generate -- page <name> --route <absolute-route> --title <label> --group <group>`.
3. Review the colocated feature manifest, lazy page, and explicit registry-delegated route as one three-file slice. The manifest owns group, labels, descriptions, and roles; central registry and i18n files remain untouched.
4. Implement real business behavior in the generated page; the placeholder is only a compile-safe seam.
5. Run `pnpm check`. Navigate to the route and switch tabs away and back to verify Activity retention.

Use `--dry-run` before generation when the route or target repository is uncertain.
