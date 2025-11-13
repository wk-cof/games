# emoji-minis

Monorepo for a suite of tiny emoji games. Built with React, TypeScript, Vite, and pnpm workspaces so the apps share a common look and feel through the `@emoji-minis/kit` package.

## Stack
- Node 20 + pnpm 9
- Vite + React 18 + TypeScript 5
- Shared Kit: CSS tokens, primitives (Shell, Button, HUD, Emoji) and helpers (`toast`, `wrongShake`, `stars`).

## Implementation Preferences
- Use **Emotion (`@emotion/react`) for all styling**. Co-locate styles with their TSX component via the `css` prop / `Global` helpers—avoid separate `.css` files when possible.
- Favor reusable kit primitives for UI (Shell, HUD pills, FlipCard, SettingsDialog, Buttons, toasts). App-specific styling should be minimal tokens/overrides.
- Keep critical controls visible without scrolling; headers should host primary actions instead of footers.
- When creating new UI patterns, add them to `packages/kit` so other games inherit the same look and feel.

## Workspace layout
```
apps/
  home
  emogenius
  typehopper
  odd-one-out
  pattern-path
packages/
  kit
```

Each app imports `@emoji-minis/kit`, has its own strict tsconfig extending the root `tsconfig.base.json`, and can run independently with `pnpm -C apps/<name> dev`. The `home` app renders the landing page that links to all games.

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
