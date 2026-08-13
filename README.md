# Dreamspace Realty

Rebuild of [dreamspacerbg.com](https://dreamspacerbg.com/) — originally a WordPress + Divi
site — as a single **Next.js** app backed directly by **MySQL**.

## Why this stack

- **`web/`** — Next.js 16 (App Router, TypeScript, Tailwind CSS v4). Renders the public site
  and includes a built-in, auth-gated `/admin` panel (CRUD for pricing, offices, partners,
  value props, blog posts, and site settings) that reads/writes MySQL directly via `mysql2`.
  No separate CMS process, no second Node.js app, no cross-app network calls — everything
  runs as one app, which maps onto cPanel's "Setup Node.js App" as a single entry.
- **`cms/`** — the original Strapi CMS. **Deprecated and no longer used.** Strapi could not
  run reliably as a second Node.js app on this cPanel host (Passenger/LiteSpeed config never
  stabilized), so the admin functionality was rebuilt directly into `web/` instead. This
  folder is kept for reference only and can be deleted once you're comfortable moving on.

## Content model (`web/scripts/schema.sql`)

| Table | Purpose |
|---|---|
| `unit_types` | A housing unit in the pricing table (1/2/3 Bed Room, pricing breakdown) |
| `offices` + `office_phones` | A branch address + phone numbers, or a construction site, shown in the footer |
| `partners` | A partner / sister company logo |
| `value_props` | One of the homepage feature blocks |
| `posts` | A blog / news article |
| `site_settings` | Hero copy, contact info, CTA labels, footer credit (single row) |
| `bookings` | Appointment/contact submissions from the "Booking" popup and Contact Us page |

## Local development

### 1. MySQL

```sql
CREATE DATABASE dreamspace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'dreamspace'@'localhost' IDENTIFIED BY 'changeme';
GRANT ALL PRIVILEGES ON dreamspace.* TO 'dreamspace'@'localhost';
```

Apply the schema and seed real content (pulled from the original site — pricing table,
offices, value props, blog post stubs, logo, hero image):

```bash
cd web
node scripts/migrate.js   # applies scripts/schema.sql
node scripts/seed.js      # idempotent — safe to re-run
```

### 2. Frontend + admin (Next.js)

```bash
cd web
cp .env.example .env.local   # fill in DATABASE_*, ADMIN_PASSWORD, ADMIN_SESSION_SECRET
npm install
npm run dev
```

Visit `http://localhost:3000` for the public site, `http://localhost:3000/admin` for the
admin panel (log in with `ADMIN_PASSWORD`).

## Deploying on cPanel

1. **MySQL**: create a database + user via cPanel → MySQL Databases (or reuse an existing
   one — see note below on migrating off the old Strapi database).
2. **App**: one Node.js App (cPanel → Setup Node.js App) pointed at `web/`, with env vars:
   `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`,
   `DATABASE_NAME`, `ADMIN_PASSWORD` (a real password, not the dev placeholder),
   `ADMIN_SESSION_SECRET` (a long random string — generate with e.g.
   `openssl rand -hex 32`).
3. Pull the latest code (`main` branch), `npm install`, `node scripts/migrate.js`,
   `node scripts/seed.js` (first deploy only — it's idempotent but only needs to run once),
   `npm run build`, restart the app.
4. Point your domain at this single app. **The old `cms.` subdomain / Strapi Node app is no
   longer needed** — safe to stop and delete once this is confirmed working.....

## What's implemented vs. still needed

**Implemented:** homepage (3D hero, value props, 3D furnished floor-plan pricing cards, latest
news, partners, footer with all office/construction-site data), a news list + detail page,
`/about-us` and `/contact-us` pages, a "Booking" popup (homepage) and contact form
(`/contact-us`) that both save to `bookings` and are reviewable in `/admin/bookings`, mobile
navigation, and a full admin panel (login, dashboard, CRUD for every content type above).

Note: `/about-us`'s body copy is currently assembled from the value props (real, already-
migrated content) as a placeholder — the original WordPress site's actual About Us narrative
wasn't in the homepage export, so replace it via the admin panel (or give it new copy to add)
once you have the real text.

**Not yet built** (original WordPress site had these — worth planning as follow-up work):
- Email/SMS notifications when a new booking or contact message comes in (currently
  admin-panel-only, no push notification)
- Multi-language support (original used a machine-translated GTranslate widget covering
  hundreds of languages — recommend a smaller, curated, professionally-translated set
  instead, given the content includes pricing/financial terms)
- Full blog post bodies (only excerpts were migrated as placeholders — the original site's
  full article HTML wasn't in the page export)
- The "Bank details" account-number table and homepage stats counters (10,000 subscribers,
  etc.) from the original homepage were surfaced during this rebuild but not yet re-added —
  ask if you still want them
