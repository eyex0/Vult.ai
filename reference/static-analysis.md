# Static Attio home: SSR source analysis

The supplied `home.html` is already a usable structural source, not an empty application shell: it is **1,112,020 bytes** and contains 119 links, 15 buttons, 4 forms, 47 images, 370 inline SVGs, and 2 canvases. It also contains 44 external scripts and 25 inline scripts, chiefly Next/Turbopack hydration and React Flight payloads. A local replica should preserve the rendered body and inline SVG markup, retain styles and media, and **not** attempt to serve the original Next runtime.

## Recommended static conversion boundary

1. Start from the body markup, inline SVG, metadata, and the nine stylesheet links. Remove every `<script>` element, including the three JSON-LD script tags, the Next Flight `self.__next_f` payloads, the theme bootstrap, all `/_next/...js` chunks, `/scripts/manage-site-banner-visibility.js`, `/scripts/mark-signed-in-visitor.js`, and the `rel="preload" as="script"` hint.
2. Do **not** hydrate any retained `data-*` attributes. They are inert structural hooks once Next is gone. The original first-party banner and signed-in scripts are behavior/personalization code, not required CSS.
3. Keep the page in the **signed-out** presentation deliberately. The supplied markup includes Sign in, Start for free, and Open Attio together. The original CSS hides `.signed-out:hidden` whenever `:root` lacks `.signed-in`; therefore Open Attio is already suppressed in a script-free document. Do not add `.signed-in` unless a local authenticated state actually exists.
4. Replace Next image-optimizer URLs (`/_next/image?url=...&w=...&q=75`) with direct local files. A static server will not implement the optimizer query endpoint. Either retain the source directory shape (`/_next/static/immutable/chunks/` beside `../media/`) or rewrite both CSS font URLs and markup paths to a local asset root such as `/assets/media/`.
5. Preserve the original relative/absolute navigation only where that destination exists. Relative product pages such as `/platform/data` require matching local static routes; otherwise make the intended external destinations canonical Attio URLs. The account CTAs should remain absolute, as detailed below.

This yields a small independent static document plus a small, local, non-analytics interaction layer for navigation menus, mobile drawer, banner dismissal, and reveal effects. It avoids loading the original framework, trackers, or React payloads.

## CSS: retain in source order

The linked CSS totals **535,836 bytes**. The 487,009-byte shared utility/design-system chunk is essential: the SSR DOM uses generated utility classes throughout, including breakpoints, typography, colors, layout, and state selectors. It is not safe to retain only component CSS.

| Order | Chunk | Size | Function observed in CSS |
|---:|---|---:|---|
| 1 | `2h8eq-_npw11u.css` | 11,441 B | Primary, outline, and ghost button design tokens/states |
| 2 | `2i9pge5y_zlr5.css` | 1,092 B | AI-hero conic-gradient animation |
| 3 | `3b0nh55-lyi1r.css` | 2,592 B | Bento frame and pricing-grid animation |
| 4 | `02xyn5f_8tmz5.css` | 588 B | Keen slider base layout |
| 5 | `271cqbyh6w88p.css` | 15,277 B | Custom-agent and other page visual styles |
| 6 | `0ac_omfeqjtez.css` | 11,858 B | Reporting radar and Universal Context visual animation |
| 7 | `055icncwu11kg.css` | 4,506 B | `@font-face` declarations and generated font variables |
| 8 | `2sgim22r-qlvn.css` | 487,009 B | Shared theme, utility classes, responsive rules, navigation keyframes, header variables |
| 9 | `31dm-rrirdb7m.css` | 1,473 B | Enrichment scroll mask and infrastructure reveal rules |

Load the copied files in exactly that sequence, then load a small local override sheet. The shared CSS defines the `lg` breakpoint as **992px**, `md` as **768px**, and a default `--site-header-nav-height` of 52px which becomes 68px at 992px. Because this document has a `.site-banner`, its computed header height is 100px below 992px and 116px at/above 992px: 48px banner plus the nav height. These values drive sticky hero offsets and fragment scroll margins. [1] [2] [3]

The font CSS references **15 WOFF2 files**. Ten are preloaded in HTML; the five extra JetBrains subsets are nevertheless referenced by `@font-face` and should be copied if the CSS stays unchanged. Serve these under the path expected by `055icncwu11kg.css`:

- **JetBrains Mono:** `13bf9871fe164e7f-s.3bz3aq452sydg.woff2`, `cc545e633e20c56d-s.2sb9jzhmrh7ny.woff2`, `71b036adf157cdcf-s.343obqi851wr5.woff2`, `89b21bb081cb7469-s.40kcwrf1wub16.woff2`, `3fe682a82f50d426-s.p.200l3jur7oygh.woff2`, `70bc3e132a0a741e-s.269kn9uafm0ti.woff2`
- **Inter:** `inter_regular-s.p.2bb4e2w2f8b5l.woff2`, `inter_medium-s.p.34qksex-rl00o.woff2`, `inter_semibold-s.p.09gosfwumfywy.woff2`, `inter_bold-s.p.381ms9a343v0r.woff2`
- **Inter Display:** `inter_display_medium-s.p.07iq05yz_unj-.woff2`, `inter_display_semibold-s.p.36u5fws9cofop.woff2`, `inter_display_bold-s.p.2k3a9i_yln7se.woff2`
- **Tiempos Text:** `tiempos_text_regular-s.p.2zim17452b7pq.woff2`, `tiempos_text_regular_italic-s.p.0jw09uachdu6t.woff2`

## Required visual assets

Inline SVGs, including the Attio wordmark, have no separate file dependency. The static files below are the **54 non-font visual media resources** referenced by the SSR markup or styles. Their original base is `/_next/static/immutable/media/`.

- **Logo/integration SVGs:** `claude.2nutjf_0spu_8.svg`, `notion.0_83efoo-4zvt.svg`, `apollo.02u38bj2f8xjm.svg`, `linear.24toa1a2d23rr.svg`, `slack.0e7mm5wjqbvbr.svg`, `lemlist.0ysfiovqdgfgg.svg`, `fin.1x93s--m0zas0.svg`, `chatgpt.2tk-pok11y62s.svg`, `stripe.3c5to-2h9vh9d.svg`, `granola.1e705plmn6543.svg`.
- **Customer/logo-strip SVG masks:** `granola.0y2-fbfxh5c4j.svg`, `turbopuffer.0n-8zzp7g5kh_.svg`, `parallel.0lezqtkxokpb4.svg`, `modal.2xywsy8w0j5z3.svg`, `railway.13aix7f0cbnzj.svg`, `listen.29y745f_gee1n.svg`, `taskrabbit.1de29s640o1iq.svg`, `aiuc.32qzygye5yitg.svg`, `wordsmith.2_cluga6wyyro.svg`, plus `granola-mark.00w75x2tqzkrn.svg`, `railway-mark.07dl0uxjgf2tg.svg`, `modal-mark.0gz6b_nw-88np.svg`, and `taskrabbit-mark.3orcmgkv1gi7i.svg`.
- **Customer-cover WebP:** `granola-cover.347g2ung0q2xn.webp`, `railway-cover.1n75rha1hq8p2.webp`, `modal-cover.3a68bj1_pd52p.webp`, `taskrabbit-cover.1v4othn6m5vcg.webp`.
- **PNG/JPG product and avatar imagery:** `pylon.1bflpjswhguzo.png`, `wispr-flow.34eed4pj_n9m3.png`, `hero-slack-avatar.06yrawpz2a498.jpg`, `header-avatar.3clsd4uignt-9.png`, `openai.1q3ldnamzp2nd.png`, `harvey.2h4ac858ph470.png`, `browserbase.311xyiikr61ob.png`, `cursor.0auf0dzl3mox5.png`, `notion-square.2h0iafxpo7pxb.png`, `granola.05iydegr23f5g.png`, `ramp.096s8_leqotah.png`, `elevenlabs.29qajjsj5vjvb.png`, `linear.1v5yzs9__96h_.png`, `shopify.0uhh5_ktvytqn.png`, `dropbox.02ox0mwl273xu.png`, `context-radial-mark.2uhsv6v997m9o.png`, `avatar.1o9_vp_7y2rqg.png`, `logo.1w86dkvs-5cd_.png`, `avatar-1.14js51ue_a48u.jpg`, and `owner-isla.3p-wpi0ped5wm.png`, `owner-george.0jfgva5g98bc4.png`, `owner-theo.1qzho4oxmm0qi.png`, `owner-amelia.2i4a-uxfxwtin.png`, `owner-nathan.3-kf3xa9n9hi_.png`, `owner-daniel.2iwoaxqbl7g72.png`, `owner-maxwell.1c05-qo80-s32.png`, `owner-samuel.0mo8cxzkho_7v.png`.

The wide cover images currently have `srcset` candidates for widths 640–3840 through Next Image. For a static replica, use direct original files with `object-fit` retained; optionally produce local width variants and a conventional direct-file `srcset`. Do not leave the original optimizer URLs in `src` or `srcset`.

## Header and desktop menus

The desktop navigation is all present in SSR markup at `lg`/992px and has only two dropdown triggers: **Platform** and **Resources**. Each trigger begins with `aria-expanded="false"` and `data-base-ui-navigation-menu-trigger`. Its following panel is in DOM but begins `hidden data-closed`. A static controller can therefore retain the markup and only needs to assign an ID, synchronise `aria-controls`/`aria-expanded`, and perform the following state changes:

- **Open:** remove `hidden` and `data-closed`; set `data-open` and optionally `data-activation-direction="right"` or `"left"` based on the previous active trigger.
- **Close:** remove `data-open`, set `data-closed`, wait 200ms for the source exit animation, then restore `hidden`.
- **Access:** support click, Enter/Space, Escape, focus leaving the menu, and roving Arrow keys; move focus to the first item when the user explicitly opens a menu.

The shared CSS already supplies the source transition: direction-based menu entry is a 0.2s cubic animation from ±200px with blur, and reduced motion switches it to a short fade. It also applies `button-ghost[data-state=open]` hover colors, so set `data-state="open"` on the active trigger if that visual state is desired. [1] [3]

Platform has the following content groups in the SSR panel: **Context** (Universal Context, Data Model, Enrichment, Call Intelligence, Reporting & Forecasts), **Orchestration** (Ask Attio, Workflows, Custom Agents, Web Agent, Sequences), **Ecosystem** (Apps, MCP, Developer Platform, Slack, ChatGPT, Claude), and **Attio for / Get started** (Attio 101, Startup program, Talk to sales). Resources has **Support** (Help Center, Academy, Developer Docs, Attio Community), **Partners** (Technology, Expert, Creator), and **Company** (Changelog, Announcements, Engineering blog, Careers). Preserve those already-rendered links rather than rebuilding their content from text.

## Mobile menu: it is not actually in SSR

Below 992px the desktop link list is hidden and the visible 36px ghost button has:

```text
aria-label="Open menu"
aria-controls="site-header-mobile-menu"
aria-expanded="false"
aria-haspopup="dialog"
data-site-header-mobile-menu-trigger="true"
```

There is **no element with `id="site-header-mobile-menu"`**, no dialog, and no other menu ID in the supplied SSR DOM. The original client rendered it later. A faithful independent replica must add its own local `<dialog id="site-header-mobile-menu">` or fixed drawer, using the same navigation destinations/grouping. It should open from the supplied trigger, trap focus, close on Escape/backdrop/link selection, return focus to the trigger, and set `aria-expanded` accurately. The source z-index tokens place the drawer overlay/content at 90/91, the sticky header at 92, and desktop navigation menus at 93; keep that ordering to avoid covering the close affordance. [1]

The banner is SSR-visible. With the original banner script removed, either leave it permanently visible or give its existing **Dismiss banner** button a local behavior that removes the `.site-banner` node. Merely applying `display:none` is not sufficient: the source uses `:root:has(.site-banner)` to reserve its 48px header height. Removing the node, or explicitly changing `--site-header-banner-height` to `0px`, prevents an empty sticky-header gap.

## Initial hidden state and scroll reveals

The SSR source has **41 inline `opacity:0` declarations** (95 inline opacity declarations total) and **7 `.invisible` nodes**. These values are client-animation starting points, not CSS failures. The most important affected content is the desktop and mobile hero: badge, `h1`, supporting paragraph, and CTA wrapper initially carry `filter:blur(1.5px); opacity:0`. The desktop app-window shell (`data-home-hero="attio-window-shell"`) also begins at `opacity:0; transform:scale(0.98)`.

Do not apply a blanket rule such as `[style*="opacity:0"] { opacity:1 }`. It would simultaneously display three deliberately overlapping, inactive hero app layers (call, Slack, and terminal) and other staged product visual layers. Instead, during static extraction identify the content reveal wrappers that should be independently visible and add a local marker such as `data-static-reveal`; add a separate marker to the one selected static hero frame. Leave alternate layer wrappers alone unless a local scene controller is deliberately implemented.

The copied CSS has useful native effect primitives: `.motion-safe:animate-in`, `fade-in-0`, and `slide-in-from-bottom-2` use the `enter` animation, while `prefers-reduced-motion: reduce` disables or simplifies many component animations. An independent reveal controller should use `IntersectionObserver` only to add a local revealed state, with the content visible by default if that controller does not run. It should respect reduced motion. The source styles already include component-specific reduced-motion fallbacks for the reporting radar and Universal Context visuals. [1] [6] [9]

Load the following **after** the copied source CSS. This is intentionally scoped to locally marked reveal nodes; it is not a global repair for arbitrary source inline styles.

```css
/* Static-first: SSR remains readable if the local interaction module fails. */
[data-static-reveal] {
  opacity: 1 !important;
  filter: none !important;
  transform: none !important;
  visibility: visible !important;
}

/* Add .js only from the local, non-analytics interaction module. */
html.js [data-static-reveal] {
  opacity: 0 !important;
  filter: blur(1.5px) !important;
  transform: translateY(8px) !important;
  transition: opacity 420ms var(--ease-out-cubic),
              filter 420ms var(--ease-out-cubic),
              transform 420ms var(--ease-out-cubic);
}
html.js [data-static-reveal].is-revealed {
  opacity: 1 !important;
  filter: none !important;
  transform: none !important;
}

/* Show one intentional still of the app scene, not all staged overlays. */
[data-home-hero="attio-window-shell"].static-hero-frame {
  opacity: 1 !important;
  transform: scale(1) !important;
}

/* A locally added mobile dialog/drawer. */
#site-header-mobile-menu {
  position: fixed;
  z-index: var(--mobile-nav-drawer-content-z-index);
  inset: var(--site-header-height) 0 0;
  width: 100%;
  max-width: none;
  max-height: none;
  margin: 0;
  border: 0;
  background: var(--color-primary-background);
}
#site-header-mobile-menu::backdrop {
  background: rgb(16 16 16 / 0.28);
}
@media (prefers-reduced-motion: reduce) {
  html.js [data-static-reveal] {
    opacity: 1 !important;
    filter: none !important;
    transform: none !important;
    transition: none;
  }
}
@media (min-width: 992px) {
  #site-header-mobile-menu { display: none; }
}
```

## Hero visuals and canvases

The page has separate desktop (`hidden md:block`) and mobile (`md:hidden`) hero compositions. The desktop scene is a sticky, scroll-driven grid using `data-home-hero` on the application shell, window, and three named desktop windows (`call`, `slack`, `terminal`). The interaction and scene progression are **not encoded in CSS**; the data attributes are hooks for removed client code. A lightweight local state machine can reproduce a chosen set of scroll thresholds, but CSS alone cannot faithfully reproduce the original scroll choreography.

The two `<canvas aria-hidden="true">` elements are empty canvases in the SSR HTML—no `width`, `height`, bitmap, SVG fallback, or `<video>` fallback is provided. One sits in a masked later desktop visual; the other is inside a 560px-max radial-masked visual on a dark section. Their pixels must have been drawn by JavaScript. With all original scripts stripped, their content cannot be recovered from this source/CSS pair. For visual fidelity, supply approved local raster/SVG snapshots or write an independent local canvas renderer; otherwise treat them as intentional static decorative omissions. Do not count their expected images among the above asset list because there are none in the provided markup.

## CTA and form navigation

Direct anchors already contain usable destinations. Preserve these account CTAs as absolute external navigation:

- **Sign in** and **Open Attio**: `https://app.attio.com/`
- **Start for free**: `https://app.attio.com/welcome/sign-in`

The visible **Talk to sales** anchors use `/contact/sales`. Point them to the local route only if that static page exists; otherwise use `https://attio.com/contact/sales`. The banner links to `/architecture` and likewise needs a local page or canonical external URL. The feature-selector links are in-page hashes and will work with the retained section IDs.

The four SSR forms have no `action` or `method`; they carry `toolname="subscribe_newsletter"` and rely on removed React behavior. Three are labelled **Send me a demo** and one **Subscribe**. In a static replica, they must be converted to normal CTA links, connected to a local form endpoint, or removed. Leaving them as forms creates a misleading submit control that cannot navigate or submit.

## References

[1]: https://www.attio.com/_next/static/immutable/chunks/2sgim22r-qlvn.css "Attio shared utility and navigation stylesheet"
[2]: https://www.attio.com/_next/static/immutable/chunks/055icncwu11kg.css "Attio font declarations stylesheet"
[3]: https://www.attio.com/_next/static/immutable/chunks/2h8eq-_npw11u.css "Attio button stylesheet"
[4]: https://www.attio.com/_next/static/immutable/chunks/2i9pge5y_zlr5.css "Attio AI hero stylesheet"
[5]: https://www.attio.com/_next/static/immutable/chunks/3b0nh55-lyi1r.css "Attio bento and pricing stylesheet"
[6]: https://www.attio.com/_next/static/immutable/chunks/0ac_omfeqjtez.css "Attio reporting and context visual stylesheet"
[7]: https://www.attio.com/_next/static/immutable/chunks/271cqbyh6w88p.css "Attio component visual stylesheet"
[8]: https://www.attio.com/_next/static/immutable/chunks/02xyn5f_8tmz5.css "Keen slider stylesheet"
[9]: https://www.attio.com/_next/static/immutable/chunks/31dm-rrirdb7m.css "Attio enrichment scroll stylesheet"
