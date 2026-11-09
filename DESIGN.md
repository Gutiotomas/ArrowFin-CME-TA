---
name: ArrowFin CME Candle Chart
description: A warm paper trading console that keeps synthetic session data legible, precise, and active at the last close.
colors:
  paper: "#f3efe3"
  paper-surface: "#f8f6ef"
  paper-surface-muted: "#e9e5d7"
  ink: "#294235"
  ink-secondary: "#59685d"
  rule: "#d1cdbc"
  accent: "#b94f35"
  accent-dark: "#8d3926"
  green-line: "#496a50"
  paper-light: "#fffaf0"
typography:
  display:
    fontFamily: 'Georgia, "Times New Roman", serif'
    fontSize: "clamp(2rem, 3vw, 2.65rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  heading:
    fontFamily: 'Georgia, "Times New Roman", serif'
    fontSize: "1.08rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: '"Avenir Next", Avenir, "Segoe UI", Arial, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace'
    fontSize: "0.66rem"
    fontWeight: 600
    letterSpacing: "0.08em"
    lineHeight: 1.3
  metric:
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace'
    fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)"
    fontWeight: 550
    lineHeight: 1.3
    letterSpacing: "0em"
rounded:
  xs: "3px"
  sm: "4px"
  md: "4px"
spacing:
  xxs: "5px"
  xs: "7px"
  sm: "9px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  xxl: "23px"
  huge: "34px"
components:
  header-wordmark:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "0"
  select-field:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: "0 32px 0 11px"
    height: "40px"
  metric-card:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink}"
    typography: "{typography.metric}"
    rounded: "{rounded.sm}"
    padding: "13px 15px 14px"
  chart-panel:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "21px 23px 13px"
  retry-button:
    backgroundColor: "transparent"
    textColor: "{colors.accent-dark}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: "0 13px"
---

## Overview

**Creative North Star: "Cuaderno de levantamiento."** This interface reads like a paper ledger for a synthetic market session: warm mineral paper, a fir-green ink system, and a single oxide accent that marks the active value under review. The data is not styled as a generic dashboard; it behaves like a clean record sheet where each close keeps a real place in the time axis.

The app is organized around the evaluator’s task: choose contract and timeframe, verify the backend response, and read the session without hiding state transitions. Loading, empty, and error screens stay explicit. The chart reinforces the main fact by leaning on a thin oxide guide that connects the final close to its exact value. With reduced motion, that guide arrives instantly instead of animating in.

## Colors

- `paper`: `#f3efe3` — warm mineral paper background for the full shell.
- `paper-surface`: `#f8f6ef` — card and panel surfaces.
- `paper-surface-muted`: `#e9e5d7` — lower-contrast field fill and page accents.
- `ink`: `#294235` — primary text and fir-green ink.
- `ink-secondary`: `#59685d` — supporting metadata and secondary labels.
- `rule`: `#d1cdbc` — thin dividers and border language.
- `accent`: `#b94f35` — oxide selection and active data cue.
- `accent-dark`: `#8d3926` — button and error treatment depth.
- `green-line`: `#496a50` — chart line and point base tone.
- `paper-light`: `#fffaf0` — high-contrast text on oxide labels.

**The Paper Rule.** Use the warm paper field as the default surface and reserve oxide for selected points, active values, and direct action states; keep the overall interface flat and legible rather than glossy or ornamental.

## Typography

The system mixes editorial serif headlines with modern interface text. Headings are Georgian-style serif; body copy and selector labels use Avenir Next; numeric values and chart labels use monospaced tabular numerals so the measurement stays exact and aligned.

- `display`: `Georgia, "Times New Roman", serif` at `clamp(2rem, 3vw, 2.65rem)`, weight `500`, tracking `-0.035em`, line-height `1.12`.
- `heading`: same serif family, `1.08rem`, weight `500`, tracking `-0.01em`.
- `body`: `"Avenir Next", Avenir, "Segoe UI", Arial, sans-serif` with a 1rem base.
- `label`: `SFMono-Regular` / `Consolas` / `Liberation Mono`, uppercase small labels with 0.08em tracking.
- `metric`: tabular monospaced values for session stats and chart labels.

**The Ledger Rule.** Numeric precision is structural: times, prices, and session totals use tabular figures so the reading preserves alignment across candle counts and values.

## Layout

The shell is a disciplined reading surface: an upper bar, a narrow filter row, a metric strip, and a wide chart panel. Max width is approximately 1292px on desktop, with balanced side padding that tightens to mobile sizes without losing the chart’s legibility.

- Desktop shell padding: `0 max(28px, calc((100vw - 1292px) / 2))`.
- Workspace margin: 34px top, 42px bottom.
- Filters: 92px minimum height, with compact 14px/16px gaps and a dense label row.
- Measurement grid: four cards across on desktop, two across on narrow screens.
- Chart area: large enough to show full session range with left/right axes and consistent time labels.

**The Measure Rule.** Keep the evaluator’s path short and explicit: query controls, summary metrics, then chart. The chart is the final authority, while the top bar and labels provide context rather than decoration.

## Elevation & Depth

Depth is created with contrast and linework, not raised shadows. The system uses thin dividing rules and paper-tone layering to separate header, filters, metric cards, and chart surfaces. The only active depth cue is the oxide guide that connects the last close to its exact value.

**The Flat Ledger Rule.** Surfaces remain nearly flush: no broad shadows, no glossy overlays, no faux metal or dashboard chrome. The paper stock and the rule lines carry separation instead.

## Shapes

The visual language is intentionally plain, with tightly controlled corners and minimal ornament. Select elements use a 3-4px radius, and the card/frame system carries square, precise edges that feel like a worksheet rather than a polished app shell.

- radius: mostly `3px` / `4px` with no soft 12px+ curvature
- borders: 1px rule color; no heavy strokes
- panels: rectangular, direct, low-contrast frames
- chart point: 5px at latest close, 2.5px for prior candle points

**The Square Rule.** Keep corners and forms disciplined and technical; visually, the design is archival and measured rather than decorative.

## Components

- `header-wordmark`: compact uppercase wordmark with oxide marker and understated line length.
- `select-field`: recognizable web select control; fir-green ink, paper fill, tight labels, 40px height.
- `metric-card`: stat tile with monospaced value and upper-case label.
- `chart-panel`: large frame around the close-price chart with heading and legend.
- `retry-button`: low-contrast oxide action for error recovery.
- `loading-state`: slim sweep line with explicit status copy.
- `error-panel`: warm alert card with oxide accent on the warning mark and action button.
- `latest-guide`: dashed oxide line connecting point to exact value label.

**The Guide Rule.** The last close is the active datum. Keep its exact-value label in a reserved band above the plot, with the leader routed through that clear space before connecting to the final point. The chart trace must never sit behind the label.

## Do's and Don'ts

- Do keep the warm paper field and fir-green ink as the default reading environment.
- Do use oxide for the active point, selection state, and only the most important action cue.
- Do make the chart axes and metric values tabular, precise, and easy to compare.
- Do keep loading, empty, and error states explicit and readable.
- Do animate the guide briefly on motion-capable systems, and make it immediate in reduced-motion mode.
- Don't switch the system to glossy dashboard chrome, soft shadows, or generic neutral UI surfaces.
- Don't use serif body copy or display typography as a general override; the world stays editorial only in headings.
- Don't hide the synthetic backend state behind decorative language or vague status messaging.
