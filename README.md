# emoji-minis

Monorepo for a suite of tiny emoji games. Built with React, TypeScript, Vite, and pnpm workspaces so the apps share a common look and feel through the `@emoji-minis/kit` package.

## Stack
- Node 20 + pnpm 9
- Vite + React 18 + TypeScript 5
- Shared Kit: CSS tokens, primitives (Shell, Button, HUD, Emoji) and helpers (`toast`, `wrongShake`, `stars`).

## Workspace layout
```
apps/
  emogenius
  typehopper
  odd-one-out
  pattern-path
packages/
  kit
```

Each app imports `@emoji-minis/kit`, has its own strict tsconfig extending the root `tsconfig.base.json`, and can run independently with `pnpm -C apps/<name> dev`.

## Commands
- `pnpm install` – install workspace dependencies
- `pnpm dev` – start all apps in parallel
- `pnpm -C apps/<name> dev` – start a single app
- `pnpm build` – build all apps and bundle them into `dist/<app>` for GitHub Pages
- `pnpm clean` – remove build artifacts

## Deployment
GitHub Pages workflow (`.github/workflows/deploy.yml`) runs on pushes to `main`. It builds all apps, collects their output into `dist`, and deploys so every game is served from `/apps-name` under the site root.

## Next steps
More detailed README sections (architecture notes, porting guides, deployment URLs) will be added in the upcoming design pass.
