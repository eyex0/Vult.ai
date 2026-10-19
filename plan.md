# Attio replica

Recreate https://attio.com/ and the authenticated dark workspace at https://app.attio.com/vult/home. The user requests all pages and exact visual similarity. Preserve the real source account: inspection is read-only and the replica is independent.

Use the installed React/TypeScript/Vite starter. The source sitemap lists 1,001 pages; 1,000 public pages have been successfully captured, while `/experts` returns HTTP 403. For this rebuild, preserve the captured HTML structure and downloaded source CSS for the primary public pages and the inspected workspace screens in `client/public/attio-snapshots/`, and use those snapshots as visual references where the server-rendered content is complete. Keep the dashboard content in React where the capture is client-rendered or incomplete, so it remains usable locally. Expose the complete sitemap as local route declarations and keep the public fallback route-aware. This is an independent UI replica rather than a copy of Attio’s private Next runtime. Local replica interactions should support search, record creation/editing, task completion, notes, filtering, sorting, view selection, modals, theme selection and browser persistence. Do not claim proprietary Attio infrastructure, live email/calendar synchronization, external sending, or AI automation works without the relevant service integration. Do not collect Attio login passwords or copy sensitive account records into public assets.

## Reference design

Public-site design is determined by the reference inspection workflow, not a substitute visual style. Dashboard uses Inter Variable, near-black background #101112, sidebar #0b0c0d, fine low-contrast borders, gray secondary text, white primary text, pink V workspace avatar, compact 14px controls, 274px sidebar and 49px header. Home has a centered 710px content column, the observed greeting, assistant composer, Meetings and Tasks empty states. Preserve spacing, typography, icons, colors, hover states and route hierarchy; respond sensibly on smaller screens.

## Structure

`client/src/pages/marketing/` contains public-site pages and content templates. `client/src/pages/crm/` contains dashboard route screens. `client/src/components/attio/` contains shared navigation, logo, controls and CRM shell. `client/src/lib/` contains demo state and persistent browser data. `client/public/` contains fonts, reference-derived brand assets and the synchronized route manifest. `reference/` records inspected URLs and design notes. The initial project is served as a static frontend with the installed `pnpm dev:static` command on port 3000 and the provided static build configuration.

## Scope constraints

Exactness depends on accessible reference content. Record any inaccessible pages or unimplemented external-service behavior explicitly. The phrase all pages remains an open acceptance requirement until the discovered route inventory is accounted for; do not imply full parity from a handful of screenshots.
