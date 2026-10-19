# Attio CRM UI reference inspection

**Status:** blocked before application access. Read-only inspection attempted on 2026-10-19 in the supplied shared sandbox browser.

## Routes actually observed

| Requested route | Resulting URL / state | Observation |
|---|---|---|
| `https://app.attio.com/vult/companies` | `https://app.attio.com/auth/sign-in?origin=%2Fvult%2Fcompanies` | Redirected to sign-in; CRM UI, Companies table, and sidebar were not rendered. |

## Screen observed: Sign in (not CRM)

- Heading / text: **Sign in**, **Sign in with Google**, **Continue**.
- Legal copy: “By proceeding you acknowledge that you have read, understood and agree to our Services Agreement.”
- Footer: `© 2026 Attio Limited`, `Privacy Policy`, `Support`.
- The initial direct load was blank while routing, then the DOM confirmed `document.readyState === "complete"` on the authentication route.

## CRM pages requested but not observable without an authenticated browser session

| Area | Route | UI details recorded |
|---|---|---|
| Companies | `/vult/companies` | **Blocked** — no table/header/modal visible. |
| Tasks | not reached | **Blocked**. |
| Notes | not reached | **Blocked**. |
| Emails | not reached | **Blocked**. |
| Calls | not reached | **Blocked**. |
| Reports | not reached | **Blocked**. |
| Sequences | not reached | **Blocked**. |
| Workflows | not reached | **Blocked**. |
| People | not reached | **Blocked**. |
| Deals | not reached | **Blocked**. |
| Users | not reached | **Blocked**. |
| Workspaces | not reached | **Blocked**. |
| Workspace Settings | not reached | **Blocked**. |

## Non-browser reference supplied in the task

- Sidebar: approximately **274 px**, black `#0b0c0d`.
- Main background: `#101112`.
- Font: **InterVariable** (reported already downloaded).
- Expected Companies examples (provided, not re-copied from the UI): Google, Microsoft, Disney, Apple, United Airlines, PayPal, Airbnb, LVMH, Intercom, Attio.

## Blocker

The available browser session had no valid Attio authentication state despite the task stating it was signed in. To preserve the explicit read-only constraint, no sign-in, OAuth, credential entry, account creation, or other state-changing action was attempted. Re-run with the signed-in **My Browser** session exposed to the browser tool, then inspect the listed CRM pages and safe-to-open non-submit modals.
