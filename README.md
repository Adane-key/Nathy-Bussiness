# Hossana Market

A bilingual (English / Amharic) marketplace website for Hossana city, Ethiopia —
covering Land, House, Car, Sound Equipment, and Decoration rent & sale, organized
by the city's woredas/kebeles.

## What's included

- **Customer site**: browse by category, filter by kebele and rent/sell, view
  listing details, and submit a booking/inquiry request.
- **Admin dashboard**: login-protected. View and manage bookings, add/edit/delete
  listings per category, and manage the list of kebeles/woredas.
- **Bilingual**: every page has an English/Amharic toggle in the header.
- **Storage**: plain JSON files in `/data` — no database to set up.

## Before you launch: things to edit

1. **Kebele/woreda names** — `data/locations.json` currently has 5 real names you
   gave me (Jello Naremo, Hetto, Kebele 18, Gombora, Ambicho) and 6 placeholders
   labeled "Kebele 06 (edit me)" through "Kebele 11 (edit me)". Once you're logged
   into the admin dashboard, go to **Locations** and edit those 6 placeholder rows
   with your real kebele/woreda names (English and Amharic). You can also do this
   by editing `data/locations.json` directly.
2. **Sample listings** — each category (`data/land.json`, `house.json`, `car.json`,
   `sound.json`, `decoration.json`) ships with 2 example listings so you can see
   the site working. Delete these from the admin dashboard and add your real ones,
   or edit them directly, once you're ready to go live.
3. **Admin password** — set in your `.env` file (see below). Change it before you
   deploy publicly.

## Running it locally (or on your phone via Termux, etc.)

```bash
npm install
cp .env.example .env
# edit .env and set your own ADMIN_USERNAME / ADMIN_PASSWORD / SESSION_SECRET
npm start
```

The site runs at `http://localhost:3000`. The admin dashboard is at
`http://localhost:3000/admin/login`.

## Environment variables (`.env`)

| Variable | Purpose |
|---|---|
| `PORT` | Port the server listens on (Railway sets this automatically) |
| `SESSION_SECRET` | Long random string used to sign admin login sessions |
| `ADMIN_USERNAME` | Admin dashboard username |
| `ADMIN_PASSWORD` | Admin dashboard password |
| `SITE_NAME` | Site name shown in the header/title |

**Never commit your real `.env` file to GitHub** — it's already listed in
`.gitignore` so it won't be pushed by accident.

## Pushing to GitHub (from your phone)

1. Unzip this folder.
2. Create a new repository on GitHub (e.g. `hossana-market`).
3. Upload all the files and folders **keeping the folder structure** — the
   GitHub mobile web uploader sometimes flattens nested folders, so if you use
   it, upload one folder at a time (`data/`, `views/`, `routes/`, `middleware/`,
   `utils/`, `public/`) rather than dragging everything at once.
4. Do **not** upload `node_modules/` (it's excluded by `.gitignore` — Railway
   installs dependencies itself from `package.json`).

## Deploying on Railway

1. Sign in to Railway and choose **New Project → Deploy from GitHub repo**.
2. Select your `hossana-market` repository.
3. Railway will detect Node.js automatically and run `npm install` + `npm start`.
4. Go to your project's **Variables** tab and add:
   - `SESSION_SECRET` — a long random string
   - `ADMIN_USERNAME` — your chosen admin username
   - `ADMIN_PASSWORD` — your chosen admin password
   - `SITE_NAME` — e.g. `Hossana Market`
   (Railway sets `PORT` for you automatically — you don't need to add it.)
5. Once deployed, Railway gives you a public URL. Visit `/admin/login` on that
   URL to log in to your dashboard.

## Project structure

```
hossana-market/
├── server.js              # App entry point
├── routes/
│   ├── public.js          # Customer-facing routes
│   └── admin.js           # Admin dashboard routes
├── middleware/auth.js      # Admin login guard
├── utils/
│   ├── db.js               # Reads/writes the JSON data files
│   ├── i18n.js              # Language switching (EN/AM)
│   └── icons.js             # Small inline icons for categories
├── data/                   # All content lives here as JSON — edit directly
│   ├── categories.json
│   ├── locations.json      # The 11 kebeles/woredas
│   ├── land.json / house.json / car.json / sound.json / decoration.json
│   └── bookings.json       # Customer booking requests land here
├── locales/en.json, am.json # All site text, in both languages
├── views/                  # EJS page templates
└── public/css/style.css     # All styling
```

## Adding a new listing category later

If you ever want a 6th category, add an entry to `data/categories.json`, create
a matching `data/<category>.json` file with `[]`, and it will automatically show
up in the navigation and admin listings section.

## Notes

- Listings don't currently support photo uploads — each listing shows a styled
  placeholder banner. If you want real photos later, that's a straightforward
  addition (image upload + storage) we can build next.
- Payment is handled manually: a customer submits a booking request, and you
  contact them directly (Telebirr, CBE, Awash, Dashen, or cash) to confirm — the
  same pattern used in your other projects.
