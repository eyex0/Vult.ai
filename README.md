# Vult — the AI-native CRM (frontend)

A complete frontend for **Vult**: the public marketing site, sign in / sign up, and the full CRM workspace. It runs entirely in the browser. There is no backend; demo data is seeded on first load and saved to `localStorage`.

React 19 · TypeScript · Vite 7 · Tailwind CSS v4 · framer-motion · wouter · Recharts · Radix primitives · dnd-kit · lucide-react

## Run it

```bash
pnpm install
pnpm dev:static        # http://localhost:3000 (honours PORT)
pnpm build:static      # production build → dist/public
pnpm check             # TypeScript
pnpm test              # Vitest (data layer, storage, selectors, markdown)
```

`dist/public` is a static SPA. When you host it, rewrite unknown paths to `index.html` so deep links such as `/app/deals/d1` work.

## What's inside

| Area | Routes |
|---|---|
| Marketing (light) | `/`, `/platform/{data-model,agents,automations,reporting,enrichment}`, `/pricing`, `/customers`, `/changelog`, `/about`, `/careers`, `/contact`, `/legal/{privacy,terms}`, 404 |
| Auth | `/signin`, `/signup` — Google/Microsoft buttons and email (UI only). They create a demo session and open `/app/home`. Without a session, `/app/*` redirects to `/signin?next=…`. |
| App (dark) | `/app/home`, `inbox`, `tasks`, `notes/:id?`, `emails`, `calls`, `reports`, `reports/:id`, `sequences/:id?`, `workflows`, `workflows/:id`, `companies/:id?`, `people/:id?`, `deals/:id?`, `lists/:id`, `chats/:id`, `settings/{profile,workspace,members,billing}` |

Highlights:
- Record tables with sortable columns, filters, view settings (column visibility, order, density), inline cell editing, row selection with bulk actions, and CSV export/import.
- Record side panel with Activity, Notes and Tasks tabs.
- Deals kanban with drag-and-drop by mouse, touch or keyboard (Space, then the arrow keys).
- ⌘K / Ctrl+K command palette.
- The Ask Vult panel answers locally from the demo data; there is no model behind it.
- A Markdown notes editor, a visual workflow builder with test runs, a sequence step editor, and a dashboard with 4 charts (each has a table view).
- Sidebar that collapses to 64px and becomes a drawer on mobile, plus a live Getting-started checklist.
- Settings: workspace menu → *Reset demo data* restores the seed.

## Project layout

```
client/src/
  App.tsx                 router (marketing eager, app lazy-loaded)
  index.css               design tokens (light site + .theme-dark app)
  components/ui/          Button, Card, Badge, Modal, Dropdown, Tabs, Field, Tooltip, Avatar…
  components/marketing/   Header + mega menus, mobile drawer, footer, Section helpers, ProductWindow
  components/app/         AppShell (sidebar, top bar), CommandPalette, AskVult, PageMeta
  components/records/     RecordTable, CellEditor, filters/view settings, RecordPanel, KanbanBoard, NewRecordModal
  components/charts/      ChartCard + chart palette
  data/                   types, deterministic seed, persisted store, selectors
  content/                marketing copy (navigation, platform pages)
  pages/{marketing,auth,app}/
client/public/brand/      vult-logo-black.png, vult-logo-white.png (+ favicon.png, apple-touch-icon.png)
```

## Quality

- Every page sets `document.title` to `<Page> · Vult`.
- Responsive at 375 / 768 / 1024 / 1440 px with no horizontal page scroll; wide tables scroll inside their own box.
- Accessibility: landmarks, a skip link, visible focus rings, keyboard-operable menus, modals, palette, table editing and kanban; labelled icon buttons; a table view for every chart. Key pages pass axe-core WCAG 2 A/AA checks.
- Motion: framer-motion with `MotionConfig reducedMotion="user"` and a global `prefers-reduced-motion` CSS override.
- Data: all names, companies and numbers are fictional. Every `localStorage` read and write is wrapped so the app still works when storage is blocked.

The `server/` and `drizzle/` folders are the original Express/tRPC template. The frontend doesn't use them, and they are left untouched.

See `docs/VULT_FRONTEND_PLAN.md` for the build plan.
