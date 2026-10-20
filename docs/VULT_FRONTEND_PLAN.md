# Vult frontend — build plan

> **Status (Oct 20, 2026): Phases 0–9 implemented.** All five decisions in section 6 went with the recommended option. Verification: `pnpm check` clean, `pnpm test` 21/21, and `pnpm build:static` clean. Browser QA: every route at 375/768/1024/1440 with no console errors and no horizontal overflow, a 34-step end-to-end flow, and axe-core WCAG A/AA clean on 15 key pages.

Goal: a complete, production-quality frontend for **Vult**. It covers the public marketing site, sign in / sign up, and the full CRM dashboard behind login. It is React 19 + TypeScript + Vite, Tailwind v4, lucide-react, framer-motion, wouter and Recharts. There is no backend: all CRM data lives in local state and is saved to `localStorage`.

Visual reference: the Vult design canvas (marketing site light, CRM app dark). Layout reference only: attio.com. No Attio text, images, logos, captured HTML/CSS or customer names ship in this repo.

---

## 1. Where the repo is today

| Area | State | Action |
|---|---|---|
| `client/src/App.tsx` | One ~60-line file with every screen inline. It uses Attio copy ("Welcome to agentic revenue", "Ask Attio"), the Attio wordmark, and real company names (Google, Microsoft, Attio…) as seed data. | Replace entirely |
| `client/public/attio-snapshots/` (5 MB) | Captured Attio HTML + CSS shown in iframes | Delete |
| `client/public/attio-wordmark.svg`, `public-route-index.json`, `manus-routes.json` | Attio branding and Attio's 1,000-URL sitemap | Delete |
| `reference/` | Attio capture scripts and notes | Delete (keep out of the product) |
| `plan.md`, `TODO.md` | Describe the Attio replica; TODO marks work done that is not in the code | Replace with this plan |
| `client/src/index.css` | 18 lines — the class names `App.tsx` uses (`.sidebar`, `.crm` …) have no styles | Rewrite with Vult tokens |
| `client/src/components/ui/*` | shadcn/Radix primitives (dialog, dropdown, tabs, select, command …) | Keep; restyle to Vult tokens |
| `server/`, `drizzle/`, tRPC | Express + MySQL template, not needed for a frontend-only app | Leave untouched, run with `pnpm dev:static` / `pnpm build:static` |
| Dependencies | react 19, tailwind 4, framer-motion 12, wouter, recharts, lucide, cmdk, radix already installed | Add `@dnd-kit/core` + `@dnd-kit/sortable` (accessible drag-and-drop) |

---

## 2. Route map

**Public (light)**

| Route | Page |
|---|---|
| `/` | Home |
| `/platform/data-model`, `/platform/agents`, `/platform/automations`, `/platform/reporting`, `/platform/enrichment` | Product pages (one shared template, 5 content files) |
| `/pricing` | Plans, Monthly/Yearly toggle, comparison table, FAQ |
| `/customers` | Case-study grid + industry filter |
| `/changelog` | Release timeline |
| `/about`, `/careers`, `/contact` | Company pages (contact = validated form + success state) |
| `/legal/privacy`, `/legal/terms` | Long-form doc + sticky table of contents |
| `/signin`, `/signup` | Auth cards (Google / Microsoft / email, UI only) |
| `*` | 404 |

**App (dark, requires a session)**

| Route | Page |
|---|---|
| `/app/home` | Greeting, Ask Vult composer, today's meetings, tasks preview |
| `/app/inbox` | Notifications / mentions feed |
| `/app/tasks` | Task list + create/edit modal |
| `/app/notes`, `/app/notes/:id` | Notes list + editor |
| `/app/emails` | Drafts / Outbox / Templates tabs + compose modal |
| `/app/calls` | Call log list (demo) |
| `/app/reports`, `/app/reports/:id` | Dashboards list + dashboard with 4 Recharts charts |
| `/app/sequences`, `/app/sequences/:id` | List + step editor |
| `/app/workflows`, `/app/workflows/:id` | List + node workflow builder |
| `/app/companies`, `/app/people`, `/app/deals` | Record tables (+ Deals board view) |
| `/app/:object/:id` | Record detail side panel (also deep-linkable) |
| `/app/lists/:id`, `/app/chats/:id` | Saved list view, AI chat thread |
| `/app/settings/{profile,workspace,members,billing}` | Settings (UI only) |

Auth flow: `/signin` or `/signup` → fake session written to `localStorage` (`vult.session`) → redirect to `/app/home`. A `<RequireSession>` guard sends logged-out users from `/app/*` to `/signin?next=…`. Sign out clears the session and returns to `/`.

---

## 3. Folder structure

```
client/src/
  main.tsx, App.tsx                 # router only
  styles/tokens.css                 # color, radius, shadow, type tokens (light + .theme-dark)
  lib/
    storage.ts                      # safeGet/safeSet (try/catch), versioned keys
    session.ts                      # fake auth
    motion.ts                       # shared framer-motion variants + spring presets
    format.ts, useDocumentTitle.ts
  data/
    types.ts                        # Company, Person, Deal, Task, Note, Email, Workflow, Sequence, Dashboard
    seed.ts                         # deterministic fictional seed: 30 companies, 60 people, 25 deals …
    store.tsx                       # React context + reducer, persisted, undo for deletes
    selectors.ts                    # search index for ⌘K, report aggregations
  components/
    ui/                             # Button, Card, Badge, Modal, Dropdown, Tabs, Table, Tooltip, Input (Vult-styled)
    brand/Logo.tsx                  # mark + "vult" wordmark, light/dark
    marketing/                      # AnnouncementBar, Header, MegaMenu, MobileDrawer, Footer, Section, ProductWindow, FAQ, CTA
    app/                            # AppShell, Sidebar, TopBar, CommandPalette, GettingStarted, TrialBanner
    records/                        # RecordTable, ColumnHeader, CellEditor, FilterBar, ViewSettings, NewRecordModal, RecordPanel, KanbanBoard
    charts/                         # Recharts wrappers with Vult palette
  pages/
    marketing/*.tsx
    auth/SignIn.tsx, SignUp.tsx
    app/*.tsx
  content/                          # marketing copy as typed data (platform pages, pricing, changelog, careers, legal)
client/public/brand/                # vult-logo-black.png, vult-logo-white.png; /favicon.png, /apple-touch-icon.png
```

---

## 4. Phases

Each phase ends with `pnpm check` (no TypeScript errors) and a commit.

### Phase 0 — Clean slate (½ day)
- Delete the Attio snapshots, wordmark, route index, capture scripts, `reference/`, and the Attio-specific `App.tsx`.
- Replace `plan.md` / `TODO.md` with this plan.
- Add brand assets: black and white logo PNGs from the supplied mark, favicon, apple-touch-icon.
- Make `pnpm dev:static` / `build:static` the documented commands; update README.

### Phase 1 — Design system (1 day)
- Tokens: ink `#16171A`, secondary `#4B4F5C`, muted `#7C808C`, border `#E7E8EC`, soft `#F6F7F9`, accent `#3B5BFD`, dark section `#0E0F11`; app `#101112` / sidebar `#0B0C0D` / app border `#242526`.
- Inter variable 400–700, headings at −0.04em letter-spacing. Radius: buttons 8px, cards 16–18px. Soft layered shadows.
- Button (36 / 44 px, weight 550, arrow-nudge on hover), Card, Badge (stage colors), Modal (focus trap, Esc, restore focus), Dropdown, Tabs, Table, Tooltip, Input/Select/Checkbox.
- `motion.ts`: spring presets, `fadeUp` / `stagger` / `pop` variants. `<MotionConfig reducedMotion="user">` at the root.
- Component showcase route (`/dev/ui`, dev builds only) to review every component in light and dark.

### Phase 2 — Marketing shell + Home (2 days)
- Announcement bar (dismiss saved), sticky 64px blurred header, Platform/Resources mega-menus (keyboard: arrows, Esc, focus return), mobile drawer under 960px with accordions, footer with columns, social links and a status dot.
- Home, built from the canvas: hatched hero, word-by-word headline, ProductWindow (searchable deals table, stage badges, avatars), logo grid, stats row, bento, dark Agents section with tabbed animated steps, automations node diagram, animated reporting chart, integrations grid, testimonials carousel, security section, final CTA with glow.
- Scroll reveals via `whileInView` with `viewport={{ once: true }}`; product window tilt-in.

### Phase 3 — Remaining marketing pages (2 days)
- `PlatformPage` template + 5 content files (hero, 3–4 alternating sections with mockups, FAQ, CTA).
- Pricing (toggle with layout-animated pill, 4 plans, sticky-header comparison table with groups, FAQ), Customers (filterable grid with `AnimatePresence` layout), Changelog, About, Careers, Contact (validation + success), Legal (sticky TOC with scroll-spy), 404.
- `useDocumentTitle("<Page> · Vult")` on every page.

### Phase 4 — Auth (½ day)
- Sign in / Sign up cards with Google and Microsoft buttons and an email field (validated). Any submit creates a demo session and routes to `/app/home`.
- Route guard, sign out from the workspace menu, `?next=` redirect.

### Phase 5 — App shell + data layer (1½ days)
- AppShell: 274px sidebar collapsible to 64px (state saved), workspace switcher with the white logo, search with ⌘K hint, the 9 nav links, Records / Lists / Chats sections, a Getting-started checklist (0/6, live progress), Invite members, trial banner. 49px top bar with page icon + title, Help, Ask Vult.
- Mobile: sidebar becomes a drawer (focus-trapped).
- Store: typed entities, deterministic fictional seed on first load, `localStorage` persistence (every read/write in try/catch, schema version + reset-demo-data action), toast + undo for deletes.
- ⌘K command palette (cmdk): search records, tasks and notes; quick actions (new deal, new task, go to page).

### Phase 6 — Records: Companies / People / Deals (2½ days)
- One generic `RecordTable` driven by column config: sortable headers (`aria-sort`), filter bar (field / operator / value chips), view settings (show/hide/reorder columns, density), inline cell editing (text, number, currency, select, date, relation), row selection + bulk actions, sticky header and first column, virtualization not needed at this size.
- New record modal per object with validation.
- Record side panel (also at `/app/:object/:id`): fields, Activity timeline, Notes tab, Tasks tab.
- Deals board: kanban by stage with @dnd-kit (mouse, touch and keyboard), column totals, and the card's stage updated in the store.

### Phase 7 — Productivity screens (3 days)
- **Home:** greeting by time of day, Ask Vult composer (model picker, send, canned demo answers from the store), today's meetings, tasks preview.
- **Tasks:** grouped list (Overdue / Today / Upcoming / Done), due date, assignee, linked record, complete checkbox, create/edit modal.
- **Notes:** list + editor with a formatting toolbar (bold, italic, headings, lists, links). Notes are stored as Markdown and rendered with `streamdown`, which is already installed.
- **Emails:** Drafts / Outbox / Templates tabs, compose modal (to, subject, template insert, save draft / "send" to outbox).
- **Calls, Inbox:** demo lists.
- **Reports:** dashboards list; one dashboard with 4 Recharts charts (pipeline by stage, closed-won by month, win rate by owner, deal source) and a date-range switch.
- **Workflows:** list + builder: trigger → actions/conditions/agent steps, add/remove/reorder, a branch for conditions, a config side panel, a "Test run" that animates through the steps, and Publish/Pause.
- **Sequences:** list + step editor (email / wait / task steps, delays, enrollment count).
- **Settings:** profile, workspace, members (invite modal, roles), billing (plan card, invoices table) — UI only.

### Phase 8 — Motion + polish (1 day)
- Shared variants applied consistently: page transitions inside the app, stagger on lists, `layout` animations on toggles/tabs/kanban, spring modals and side panels, hover lift and tap scale on buttons and cards, 150ms color transitions.
- Empty, loading-skeleton and error states for every list.

### Phase 9 — QA (1 day)
- Responsive pass at 375 / 768 / 1024 / 1440: no horizontal page scroll, wide tables scroll inside their own box.
- Accessibility: semantic landmarks, visible focus rings, keyboard-only run through menus, modals, palette, table editing and kanban; `aria-label`s on icon buttons; contrast ≥ 4.5:1; reduced motion honored. Automated check with axe.
- Tests: Vitest for store reducers, seed integrity, storage fallbacks and selectors; Playwright smoke test (landing → sign up → create deal → drag to Won → see it in Reports).
- `pnpm check`, `pnpm build:static` clean.

**Total: about 15 working days.** Phases 2–3 (marketing) and 5–7 (app) can run in parallel after Phase 1.

---

## 5. Definition of done

- Every route in section 2 renders, has a `<Page> · Vult` title, and works at the four breakpoints.
- Logged-out users can't reach `/app/*`; sign in / sign up lead to `/app/home`; sign out works.
- First load seeds about 30 companies, 60 people and 25 deals, plus tasks, notes, emails, dashboards, workflows and sequences — all fictional. Changes survive a reload, and the app still works when `localStorage` is unavailable.
- All CRUD in the brief works locally: create, edit inline, delete with undo, sort, filter, select, search, drag between stages.
- No Attio text, assets, captured pages or real customer names anywhere in the repo.
- Zero TypeScript errors; tests and build pass.

---

## 6. Decisions to confirm

1. **Delete the Attio replica content** (snapshots, wordmark, sitemap, capture scripts). Recommended and required by the brief.
2. **App URL prefix:** `/app/*` as the brief says, instead of the current `/vult/*`.
3. **Server code:** keep `server/` dormant (recommended) or remove it to slim the repo.
4. **Drag-and-drop library:** add `@dnd-kit` for accessible kanban (recommended) vs. native HTML5 drag events (no keyboard support).
5. **Notes editor:** Markdown + toolbar (no new dependency, recommended) vs. a full WYSIWYG editor such as TipTap (heavier).
