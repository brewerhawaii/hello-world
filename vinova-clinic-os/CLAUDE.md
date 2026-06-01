# VINOVA Clinic OS — Project Context

## What this is
A React + Vite CRM for **VINOVA Longevity Experts** clinic (vinovacr.com).
Single-page app, no backend yet — all state is in-memory React useState.

## Brand & Design
- **Primary font:** Cormorant Garamond (serif headings)
- **Body font:** DM Sans
- **Teal:** `#1B6B72` (primary actions, nav active state)
- **Coral:** `#E8725A` (secondary actions, doctor role, warnings)
- **Light theme only** — no dark mode
- Load fonts from Google Fonts in `index.html`

## File locations
- `vinova-clinic-os/` — Vite project root
- `vinova-clinic-os/src/App.jsx` — entire app (single-file component tree)
- `vinova-clinic-os/src/index.css` — global reset + CSS vars
- `vinova-clinic-os/index.html` — loads Google Fonts

## Architecture decisions
- **Single App.jsx** — all components, seed data, and styles live here
- Inline styles via JS objects (`S.*` constants at top of file) — no CSS modules, no Tailwind
- No router library — page state managed with `useState` (page key string)
- No external state management — props + useState only
- Seed data constants at top of file (LEADS_SEED, PRODUCTS_SEED, TEAM_SEED, etc.)

## Roles
Three user roles, selected at login screen (no real auth yet):
- **Admin** — full access
- **Sales Rep** — pipeline + leads focus
- **Doctor** — client assessments + Torus data

## Core features (all built)

### Pipeline (Kanban)
- 6 stages: New Lead → Contacted → Consultation → Proposal → Closed Won → Closed Lost
- Clickable cards open Lead Detail view
- Add Lead modal

### Lead Detail (5 tabs)
1. **Overview** — notes, stage switcher, purchase summary, Torus snapshot donut
2. **Torus Report** — bioage, score, 6 biomarker bars, recommended protocols
3. **Documents** — file list + upload drop zone (UI only, no real upload yet)
4. **Timeline** — activity log with type icons, add entry input
5. **Sales** — purchase history table, lifetime value

Contact action buttons on every lead: 📞 Call · 💬 WhatsApp · 📨 Messenger · ✉️ Email

### Products & Services
Grid of product cards → Product Detail view

Product Detail (4 tabs):
1. **Overview** — description, price/cost/margin, status switcher
2. **Commission Config** — visual split bar (Sales Rep % / Doctor % / Clinic %)
3. **Purchase Orders** — PO table, add new PO form, inline status dropdown
4. **Supplier** — supplier name, SKU, lead time, payment terms

### Reports Dashboard
- 4 KPI cards: Total Revenue, Active Clients, Avg Deal Size, Conversion Rate
- Pipeline funnel bar chart (by stage)
- Top clients by lifetime value
- Monthly revenue trend bars
- Torus assessment summary stats

### Team Management
- Cards per team member with role, status, clients, revenue
- Activate / Deactivate toggle
- Add Member modal

### API / HDT Integration
- Webhook endpoint docs (POST /api/leads/ingest)
- Torus Score Sync endpoint docs
- Sample JSON payload display
- "Simulate Ingest" button with mock response

## Planned next features (not yet built)
Tell Claude Code to add these one at a time:
1. `"Add Supabase for persistent data storage"` — replace useState seed data with Supabase tables
2. `"Add real file upload with Supabase Storage"` — Documents tab upload
3. `"Add PIN-based authentication with Supabase Auth"` — replace role-picker login
4. `"Connect WhatsApp Business API via Twilio"` — wire the WhatsApp button
5. `"Add real Torus API data sync endpoint"` — replace mock Torus data
6. `"Deploy to custom domain vinovacr.com"` — Vercel custom domain setup

## Deploy
- **Platform:** Vercel
- **Root directory:** `vinova-clinic-os`
- **Framework:** Vite (auto-detected)
- `vercel.json` present with SPA rewrite rule
- Build command: `npm run build` → outputs to `dist/`
- To deploy: `vercel --token $VERCEL_TOKEN --yes` from `vinova-clinic-os/`

## Git
- Repo: `brewerhawaii/hello-world`
- Feature branch: `claude/react-artifact-vercel-deploy-r510S`
- Always develop on this branch, push with `git push -u origin <branch>`
