"use strict";

/**
 * Entry point for cPanel's "Setup Node.js App" (Phusion Passenger).
 *
 * Passenger expects a plain script it can run with `node`, not an npm
 * script — it doesn't invoke `npm run start`. This wraps Next's
 * programmatic server API so the same production build works either
 * way (Passenger locally on cPanel, or a plain `node server.js`
 * anywhere else).
 *
 * Requires a production build first: `npm run build`.
 */

const { createServer } = require("node:http");
const next = require("next");

const port = process.env.PORT || 3000;
const app = next({ dev: false });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => handle(req, res)).listen(port, () => {
      console.log(`Ready on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
