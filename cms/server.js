'use strict';

/**
 * Entry point for cPanel's "Setup Node.js App" (Phusion Passenger).
 *
 * Passenger expects a plain script it can run with `node`, not an npm
 * script — it doesn't invoke `npm run start` / the `strapi` CLI. This
 * uses Strapi's own programmatic API to start the same server that
 * `npm run start` would, so it works either way (Passenger locally on
 * cPanel, or a plain `node server.js` anywhere else).
 *
 * Requires a production build first: `npm run build`.
 */

const { compileStrapi, createStrapi } = require('@strapi/strapi');

async function main() {
  const appContext = await compileStrapi();
  const app = createStrapi(appContext);
  await app.start();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
