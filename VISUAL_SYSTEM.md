# Invisible Interfaces — visual system

The governing question is: does this spend attention on the thesis, or merely take it?

## Typography

Two voices only.

- Human: Newsreader, weights 300–500. Editorial statements, reflection, and outcomes.
- Machine: IBM Plex Mono 400. Commands, ledgers, boundaries, hints, and controls.

Minimum practical machine text is 0.6875rem; essential controls and long machine copy use 0.75rem. No meaningful information relies on faint type plus reduced opacity.

## Colour

- void: #000000
- canvas: #0A0A0B
- surface: #111113
- ink: #E8E6E3
- ink-dim: #918E88
- ink-faint: #827E76
- line: rgba(232, 230, 227, 0.10)
- accent: #E8A33D

Amber means the machine is requesting attention or focus. It is not decorative. Focus outlines use two pixels of amber.

## Spacing

Element scale: 4, 8, 12, 16, 24, 40, 64, 104 pixels.

Narrative pauses remain viewport-relative, but every timed pause has a hurry path and a reduced-motion path. Silence may create meaning; it may not conceal an affordance.

## Shape and elevation

Radius remains era-indexed:

- 0: terminal
- 2px: early GUI
- 8px: touch
- 14px or pill: ambient systems

There are no decorative drop shadows. Elevation is expressed through luminance, borders, and focus.

## Motion

Five verbs govern movement:

- Appear: opacity plus no more than eight pixels of settlement.
- Recede: dissolve in place.
- Transform: reserved for the simplification scene and chrome decay.
- Rearrange: the ambient field responding to scroll.
- Illuminate: a state or boundary becoming more legible.

Reduced motion removes repeated animation, collapses transition duration, preserves sequence, and converts continuous transformations to discrete states.

## Scene density

| Scene | Visible chrome | Accent | Primary density |
|---|---|---|---|
| Forgotten | wordmark, scene menu, cue | cursor | two statements plus peripheral evidence |
| Demanding | full early chrome | peak | working terminal |
| Simplification | decaying header and later rail | declining | one transformation and one ledger |
| Remembering | rail residue | none | one anticipatory beat at a time |
| Entrusted/Return | none | task/focus only | intent, absence, result, receipts |

The header menu and left rail crossfade without a period in which both read at full strength.

## Responsive behavior

The same installation is rendered at a nearer distance on phones.

- Nothing conceptually important is removed.
- The header uses compressed spacing and type at narrow widths.
- The morph uses dedicated compact geometry.
- Controls meet a 44-pixel minimum target where practical.
- No horizontal overflow is permitted.
- Original/restored comparison remains operable by touch and keyboard.

## Accessibility

Visual disappearance never removes document structure. Opening artifacts have a semantic equivalent. Animated terminal characters are hidden from the accessibility tree while complete lines are announced. Session measurement is disclosed in the final receipt and About route.