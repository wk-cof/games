# emoji-minis

Monorepo for a suite of tiny emoji games. A suite of beautifully crafted emoji games designed to build cognitive skills and make learning delightful. Built with React, TypeScript, Vite, and pnpm workspaces so the apps share a common look and feel through the `@emoji-minis/kit` package.

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


## How to add a new game

1.  **Scaffold the app**: Create a new directory in `apps/<name>` and set up the `package.json` and `vite.config.ts`.
2.  **Assign a Port**: Choose a unique port (e.g., 3011) and configure it with `strictPort: true` in `apps/<name>/vite.config.ts` so proxying doesn't silently break:
    ```ts
    server: {
      port: 3011,
      strictPort: true,
    },
    ```
3.  **Configure Base Path**: Set the `base` in `apps/<name>/vite.config.ts` to support proxying in dev:
    ```ts
    base: process.env.NODE_ENV === "production" ? "./" : "/<name>/",
    ```
4.  **Update Home Proxy**: Add a proxy rule in `apps/home/vite.config.ts` so `localhost:3000/<name>` redirects to your local app server. **Do not forget this step, otherwise the app will redirect to a blank screen!**
    ```ts
    "/<name>": {
      target: "http://localhost:<port>",
    },
    ```
5.  **Register in Home App**: Add the game's metadata to the `apps` array in `apps/home/src/App.tsx`.
6.  **Update Kill Script**: Update the `kill` script in the root `package.json` to include the new port range.

## Next steps

More detailed README sections (architecture notes, porting guides, deployment URLs) will be added in the upcoming design pass.
