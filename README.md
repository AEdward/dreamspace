# Dreamspace Realty

Rebuild of [dreamspacerbg.com](https://dreamspacerbg.com/) — originally a WordPress + Divi
site — as a **Next.js** frontend backed by **Strapi CMS** (MySQL).

## Why this stack

- **`web/`** — Next.js 16 (App Router, TypeScript, Tailwind CSS v4). Renders the public site,
  fetching content from the CMS at request/build time.
- **`cms/`** — Strapi 5 (TypeScript), configured with the **MySQL** database adapter
  (`mysql2`), so content lives in the same kind of database your cPanel hosting already
  provides. Gives non-technical staff a `/admin` panel to edit pricing, listings, and blog
  posts without touching code — replacing what WordPress/Divi gave you before.

They're two independent Node.js apps in one repo, not a monorepo/workspace — that maps
cleanly onto cPanel's "Setup Node.js App" feature, which runs one app per folder.

> Note: Payload CMS was considered first but doesn't support MySQL (only
> Postgres/MongoDB/SQLite) — Strapi was chosen specifically to keep MySQL.

## Content model (`cms/src/api/`)

| Content type | Purpose |
|---|---|
| `unit-type` | A housing unit in the pricing table (1/2/3 Bed Room, pricing breakdown) |
| `office` | A branch address + phone numbers, or a construction site, shown in the footer |
| `partner` | A partner / sister company logo |
| `value-prop` | One of the homepage feature blocks |
| `post` | A blog / news article |
| `site-setting` (single type) | Hero copy, contact info, CTA labels, footer credit |

All are publicly readable via the REST API (`/api/<plural-name>`) — a bootstrap script in
`cms/src/index.ts` opens read-only public permissions automatically on first boot, so you
don't have to click through Settings → Roles → Public on every fresh environment.

## Local development

### 1. MySQL

Create a database and user matching `cms/.env` (copy from `cms/.env.example`):

```sql
CREATE DATABASE dreamspace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'dreamspace'@'localhost' IDENTIFIED BY 'changeme';
GRANT ALL PRIVILEGES ON dreamspace.* TO 'dreamspace'@'localhost';
```

### 2. CMS (Strapi)

```bash
cd cms
cp .env.example .env   # then fill in real secrets + your DB credentials
npm install
npm run develop
```

Visit `http://localhost:1337/admin` to create your first admin user.

**Seed real content** (pulled from the original site — pricing table, offices, value props,
blog post stubs, logo, hero image) once the app has booted at least once:

```bash
node scripts/seed.js
```

It's idempotent — safe to re-run; it skips anything that already exists by name/title.

### 3. Frontend (Next.js)

```bash
cd web
cp .env.example .env.local
npm install
npm run dev
```

Visit `http://localhost:3000`.

`ALLOW_LOCAL_CMS_IMAGES=true` in `.env.local` is only needed because the CMS runs on
`localhost` during local dev — Next's image optimizer blocks optimizing images from private
IPs by default (SSRF protection). Leave that var **unset** in production, where the CMS will
have a real public hostname.

## Deploying on cPanel

1. **MySQL**: create a database + user via cPanel → MySQL Databases, matching `cms/.env`.
2. **CMS**: cPanel → Setup Node.js App → point it at the `cms/` folder, set the same env vars
   as `cms/.env.example` (with real secrets — generate your own, don't reuse dev ones), run
   `npm install && npm run build && npm run start`.
3. **Frontend**: a second Node.js App pointed at `web/`, with
   `NEXT_PUBLIC_STRAPI_URL` set to wherever the CMS is actually reachable (e.g.
   `https://cms.dreamspacerbg.com`), then `npm install && npm run build && npm run start`.
4. Point your domain/subdomains at each app per your host's Node.js app routing.

## What's implemented vs. still needed

**Implemented:** homepage (hero, value props, pricing table, latest news, partners, footer
with all office/construction-site data), a news list + detail page, mobile navigation.

**Not yet built** (original WordPress site had these — worth planning as follow-up work):
- `/about-us`, `/harmony-builders`, `/registration`, `/contact-us` pages (nav links currently
  point at routes that don't exist yet)
- The registration form's actual backend (original used Forminator + Popup Maker — this
  needs a real endpoint, likely a Strapi content type + email notification or a dedicated
  form-submissions table)
- Multi-language support (original used a machine-translated GTranslate widget covering
  hundreds of languages — recommend a smaller, curated, professionally-translated set
  instead, given the content includes pricing/financial terms)
- Full blog post bodies (only excerpts were migrated as placeholders — the original site's
  full article HTML wasn't in the page export)
