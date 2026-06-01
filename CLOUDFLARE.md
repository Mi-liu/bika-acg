# Cloudflare Workers Deployment

This project is configured for Cloudflare Workers with static assets.

Current preview URL: <https://bika-acg.miliu.workers.dev>

## Dashboard deployment with Git

In Cloudflare Workers, import the Git repository and use:

- Project name: `bika-acg`
- Build command: `pnpm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: repository root
- Environment variables:
  - `NODE_VERSION=22.16.0`
  - `PNPM_VERSION=10.18.2`

Cloudflare reads `wrangler.jsonc`, where the Worker name is `bika-acg` and the
static assets directory is `./dist`.

The app currently uses Vue Router hash history, so it does not need an SPA
fallback. If the router is changed to web history mode later, add Workers static
assets fallback handling at the same time and verify static assets still load.

## Local preview

```sh
pnpm cloudflare:preview
```

## Direct deploy with Wrangler

```sh
pnpm cloudflare:login
pnpm cloudflare:deploy
```
