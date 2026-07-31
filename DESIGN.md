---
name: Panther01Agency
description: Signal red, disciplined darkness, and editorial product staging for a premium AI automation agency.
colors:
  signal-red: "#e32620"
  signal-red-bright: "#ff4138"
  signal-red-deep: "#700907"
  coal: "#050505"
  deep-black: "#090909"
  graphite: "#0d0d0d"
  raised-graphite: "#121212"
  metal: "#1a1a1a"
  paper: "#f4f3f0"
  paper-soft: "#d8d6d1"
  muted: "#aaa8a3"
  dim: "#777570"
  line: "rgba(255, 255, 255, 0.11)"
  line-strong: "rgba(255, 255, 255, 0.2)"
  error: "#ff756f"
  success: "#8de2b1"
typography:
  display:
    fontFamily: "Schibsted Grotesk Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(2.5rem, 5vw, 5rem)"
    fontWeight: 400
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  inner-display:
    fontFamily: "Schibsted Grotesk Variable, Arial Narrow, sans-serif"
    fontSize: "clamp(3.8rem, 6.1vw, 6.7rem)"
    fontWeight: 420
    lineHeight: 0.94
    letterSpacing: "-0.045em"
  body:
    fontFamily: "Manrope Variable, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Schibsted Grotesk Variable, Arial Narrow, sans-serif"
    fontSize: "0.69rem"
    fontWeight: 600
    letterSpacing: "0.12em"
rounded:
  control: "0px"
  compact: "4px"
  device-screen: "6px"
  panel: "8px"
  circle: "999px"
spacing:
  control-x: "20px"
  field-gap: "9px"
  grid-gap: "18px"
  section-min: "110px"
  section-max: "196px"
components:
  button-primary:
    backgroundColor: "{colors.signal-red}"
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "52px"
  button-ghost:
    backgroundColor: "rgba(255, 255, 255, 0.02)"
    textColor: "{colors.paper-soft}"
    rounded: "{rounded.control}"
    padding: "0 20px"
    height: "52px"
  field:
    backgroundColor: "rgba(0, 0, 0, 0.34)"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    padding: "12px 14px"
    height: "50px"
  demo-badge:
    backgroundColor: "transparent"
    textColor: "{colors.dim}"
    rounded: "{rounded.compact}"
    padding: "0.35em 0.7em"
---

# Design System: Panther01Agency

## Overview

**Creative North Star: "Signal in the Dark"**

The system behaves like a controlled operations room seen through a premium product lens: coal-black space, compact editorial typography, decisive signal red, and metal-edged interface surfaces. Visual density stays low around authored product moments, allowing the panther-eye `01` mark, the CSS laptop, or one inner-page visual to carry the scene without competing decoration.

The tone is corporate and cinematic, never cyberpunk. Motion communicates continuity, system state, and transformation; ordinary reading sections remain calm and document-like.

**Key Characteristics:**

- A red panther symbol used as a precise identity anchor
- Signal red reserved for focus, progress, active state, and bounded atmosphere
- Wide editorial spacing and asymmetric split compositions
- Squared controls paired with softly rounded product UI and circular system nodes
- One cinematic reveal on the home surface; restrained motion everywhere else

## Colors

Signal red identifies focus and system activity. Coal and graphite create depth; warm off-white establishes hierarchy, while muted stone supports explanatory copy. Error and success colors appear only as form feedback.

**The One Signal Rule.** Red is a scarce directional cue and focused light source, never a page-wide neon wash.

**The Warm Neutral Rule.** Use `paper`, `paper-soft`, `muted`, and `dim` instead of cold blue-gray text on dark surfaces.

**The Verified State Rule.** Reserve `error` and `success` for genuine validation or submission feedback; do not use them decoratively.

## Typography

**Display Font:** Schibsted Grotesk Variable, with Arial Narrow and sans-serif fallbacks  
**Body Font:** Manrope Variable, with Arial and sans-serif fallbacks

Schibsted Grotesk gives headlines compact authority and an engineered editorial cadence; Manrope keeps Turkish body copy open and readable. Large display copy uses weights around 400–420, tight tracking, and balanced wrapping. Body copy generally stays within 46–55 characters in split layouts and should not exceed roughly 65–75 characters in long-form contexts.

### Hierarchy

- **Primary display:** Tight, high-impact statements (`clamp(2.5rem, 5vw, 5rem)`, `-0.04em`, `1.04`).
- **Inner-page display:** Larger and denser (`clamp(3.8rem, 6.1vw, 6.7rem)`, `-0.045em`, `0.94`); mobile relaxes to `0.96`.
- **Section title:** Compact editorial headings around `clamp(2.7rem, 5vw, 5.1rem)` with weight `420`.
- **Body:** Manrope at `1rem`, regular weight, with `1.55–1.75` line height.
- **Label:** Small Schibsted Grotesk, tracked and frequently uppercase; red or muted white according to surface.

**The Two-Voice Rule.** Schibsted Grotesk owns identity, headings, indices, and labels; Manrope owns explanation, navigation, fields, and status copy.

## Layout

The content shell is capped at `1320px` with `48px` desktop gutters, `28px` tablet gutters, and `16px` mobile gutters. Primary sections use generous vertical padding between `110px` and `196px`. Editorial sections typically split a compact label/heading column from a wider content column; borders, indexed rows, and ledgers establish rhythm without card grids.

The home hero is a long sticky product reveal. Inner-page heroes use a full-viewport two-column composition: copy at left and one expressive visual at right. The `flow` variant uses a red system console with input–decision–action staging; the `identity` variant uses the primary red panther logo inside a red identity field. These variants share the same copy hierarchy and page shell, but their visual modules are not interchangeable decoration.

Below `879px`, inner heroes and major editorial grids collapse to one column, sticky copy becomes static, and repeated multi-column sequences stack with dividers preserved. Below `620px`, hero type, section padding, device staging, and form density reduce; the contact form becomes one column and its submit button becomes full width. Below `420px`, identity marks, footer composition, and contact edges tighten again. The layout must remain usable from the `320px` minimum viewport and respect safe-area insets.

**The One Visual Rule.** Each inner-page hero gets one dominant visual module—flow console or identity stage—not a cluster of cards, charts, and badges.

## Elevation & Depth

Depth is structural: tonal black layers, fine light borders, offset device shadows, metal gradients, and one bounded red radial light. Ordinary editorial content remains flat. Blur is limited to the sticky header, contact-panel atmosphere, light bloom, and brief focus/screen transitions.

The home laptop is the deepest object in the system. Inner-page visuals use a single controlled shadow field, while the contact form uses a restrained glass-like layer (`rgba(9, 9, 9, 0.76)`, fine border, `16px` backdrop blur) without becoming glassmorphic.

**The Bounded Light Rule.** Glow belongs behind a signature object or CTA atmosphere and must never reduce copy contrast.

**The Flat Reading Rule.** Editorial sections use borders and tonal changes for hierarchy; shadows are reserved for interactive or signature objects.

## Shapes

Primary controls and text fields are squared and architectural (`0px`). Compact UI badges and small demo panels use `4–8px` rounding. Circular geometry is reserved for process nodes, signal indicators, and controls that represent continuity or state. The laptop’s proportional curves follow product-render geometry rather than the general component radius scale.

The canonical identity consists of `/brand/logo_brand-refresh_mark_20260730_full-color.png` for navigation, footer, favicon, and compact UI placements, plus `/brand/logo_brand-refresh_primary_20260730_full-color.png` for large identity stages. Both assets remain intact and use `object-fit: contain`; they may receive only the established soft red or dark drop shadow. They are decorative and empty-alt inside the wordmark and footer; when the primary logo is the subject of an identity stage, the containing visual supplies the accessible label. Standard sizes are `36px` in the desktop header, `52px` in the desktop footer, and up to `560px` as an identity-stage signature.

**The Intact Mark Rule.** Do not redraw, recolor, stretch, rotate, or separate the panther eye from its `01` detail.

## Components

### Buttons and Text Links

- **Primary:** Signal-red field, white text, squared corners, at least `48px` high on mobile and `52px` at full density.
- **Ghost:** Fine translucent border over a near-black surface; warm off-white text.
- **State:** Hover strengthens red or the border; active scales to `0.97`; focus uses a `2px` bright-red outline with `4px` offset.
- **Text links:** Minimum `44px` target with a restrained red underline; hover changes both text and rule to bright red.

### Navigation

Desktop navigation is centered in a fixed `84px` header that condenses to `68px` after scroll. The active page is white with its red underline permanently revealed. The wordmark pairs the canonical mark with the Panther01Agency name. Mobile uses a `44px` menu control and a full-viewport menu with `72px` rows; keyboard focus remains visibly red.

### Editorial Sections

Use a small red section label, a large display statement, and either an indexed row list, a ledger, or restrained body column. Dividers are the primary grouping device. A full red editorial field is allowed only for a system-flow chapter, where white type and thin translucent rules replace the dark-surface palette.

### Contact Form

The form is a single elevated dark panel alongside sticky contact copy on desktop and a stacked block below `879px`.

- **Fields:** Squared, minimum `50px` high, dark translucent fill, warm-white text, and fine neutral border.
- **Hover:** Border strengthens without moving the field.
- **Focus:** Bright-red border, subtle warm-red fill, and a `3px` low-opacity red ring.
- **Invalid:** Set `aria-invalid="true"`, use the bright-red border, and place the concise error in `error` red beneath the field.
- **Consent:** Custom `22px` square; checked state fills signal red, and keyboard focus uses a visible offset outline.
- **Pending:** Submit becomes disabled with wait cursor and `0.72` opacity while its label changes; retain the control’s dimensions.
- **Success / failure:** Announce feedback through the live status region; use `success` green or `error` red without adding celebratory animation.

### Demo Panels

Demo UI uses graphite panels, fine light borders, compact labels, and an explicit `DEMO` badge. Illustrative controls remain legible but visually subordinate to the website’s real navigation and contact controls. Demo content must never resemble verified customer data.

### Laptop Experience

The laptop is assembled in CSS 3D from a lid, metal rim, screen bezel, weighted hinge, keyboard deck, keys, speaker grilles, trackpad, layered screens, and shadow. Scroll straightens and recenters it; screen changes use opacity, scale, short blur, and a restrained red scan. It is the home surface’s signature component, not a generic card shell for every route.

## Do's and Don'ts

### Do:

- **Do** keep Panther01Agency as the only brand name and use the approved red panther logo variants consistently.
- **Do** label illustrative automation interfaces as demo content.
- **Do** build editorial rhythm with space, rules, indices, and deliberate type scale.
- **Do** use transform and opacity for primary motion and keep controls fully available with reduced motion.
- **Do** expose hover, focus, invalid, pending, success, and failure states without layout shift.

### Don't:

- **Don't** introduce cyberpunk grids, Matrix motifs, particle rain, gaming chrome, crypto styling, or heavy glassmorphism.
- **Don't** turn signal red into broad card backgrounds or persistent pulsing effects.
- **Don't** distort, recolor, crop, or recreate either approved Panther01Agency logo.
- **Don't** add unverified metrics, logos, testimonials, client outcomes, or service claims.
- **Don't** reuse the cinematic laptop sequence as a mandatory inner-page template.
- **Don't** allow ambient animation, signal pulses, flow sweeps, smooth scrolling, or screen transitions to bypass `prefers-reduced-motion`; reduced mode removes nonessential animation and preserves the final readable state.
