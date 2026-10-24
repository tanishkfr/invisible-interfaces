# Phase 3 critique and correction plan

Method: independent assessments A (`phase3_design_review`) and B
(`phase3_evidence_review`), fresh browser contexts. A completed before detector
findings entered the parent synthesis. Implementing-agent review also used the
actual in-app browser at 932×908, forward scrolling, chapter pauses and About.
This is agent-led critique, not human research or physical-device validation.

Recorded before visual implementation on 2026-10-23, starting `ad3869e`.

## Actionable findings

| Severity | Location | Observed problem and effect | Targeted correction | Verification |
| --- | --- | --- | --- | --- |
| P1 | 320×568; 320×650 | The 650px stage minimum sends navigation below the viewport; anticipation detail intersects its rail at 650px. This makes the exhibition hard to navigate on a real supported viewport. | Remove unsafe minimum; fit short-view world and simplify auxiliary annotation only at shortest heights. | 320×568/650/667, all acts, navigation visible and no meaningful collisions. |
| P2 | 768×1024, anticipation t90–96 | Context enters outside left edge, including x≈−7.6px at full opacity. Resting-only checks missed this. | Bring tablet context entrance and final position inward with adequate photo separation. | Capture t90/93/96/106 forward and reverse, inspect actual text bounds. |
| P2 | 375/320×667, gesture t59–79 | Heading nearly touches tilted shell; 320px shell extends to x−4.2/right326.5. No proven glyph collision, but clear crowding/cropping. | Fit short-phone camera composition with a visible heading gap and side margins. | t59/67/72/79, including reverse and a tall phone control. |
| P2 | Short-phone opening | Scroll cue lies across terminal's left boundary instead of in a distinct exhibition strip. | Recompose opening scale/placement and give cue a clear strip above navigation. | t0 and early departure, 375/320×667 and 320×568. |
| P2 | 932×908 opening | Supporting description crowds the terminal's top border. | Fit tablet opening pose; preserve title and its two-line hierarchy. | Before/after opening at932×908 plus768×1024. |
| P2 | Anticipation | SVG connector arms and stem cross context/result text. Linework competes with the narrative and appears unfinished. | Remove obsolete connector field; preserve context choreography and photograph focus brackets. | Desktop/tablet/mobile transition and resting captures; density reduced without losing the photograph anchor. |
| P2 | Header About | `/about` describes v1's hidden-tab work and receipts, then returns to v1. This misexplains v2. | Link to v2's existing semantic reading room. Leave v1 About untouched. | Keyboard/click reach current narrative and replay returns to v2. |

## Preserve

Both reviewers confirmed actual Newsreader/IBM Plex Mono loading; Chromium CDP
identified custom font glyphs and WebKit corroborated intended faces and widths.
There is no fallback substitution and no basis for changing the font family.
Preserve the red boat, spatial camera arc, era-specific geometry, dark/amber
identity and quiet finale. Do not add effects or new notification/chrome layers.

Assessment A scored 22/28 on applicable Nielsen heuristics: status3, match3,
control3, consistency4, recognition3, aesthetics3, help3; error prevention,
operational efficiency and error recovery were not applicable. Cognitive load
was low to moderate, with anticipation the peak. Five ordered chapter links
remain justified by the narrative rather than being treated as a menu defect.

Strongest passage: spatial window into full-colour touch. Best resting state:
the photograph and closing statement. Anticipation is the least spacious state;
its exact clipping and linework defects should be corrected before inventing
new content or changing its meaning. Terse mobile “Expect” and “Be” remain a
minor comprehension question for genuine visitor testing.

## Evidence boundary

Before captures: `output/playwright/phase3/reviewer-before/`,
`output/playwright/phase3/evidence-review/`, and
`output/playwright/phase3/before/layout/`.
Assessment B ran the detector exactly once, with zero findings. That did not
detect the rendered geometry defects. WebKit smoke checks succeeded, but Windows
WebKit's native Tab policy limited tab-order evidence; explicit focus/Enter was
tested. No physical Safari pass is implied. Screenshots and scheduled browser
traversal do not establish human-perceived temporal smoothness.

## Independent final review

Assessment A inspected nine final desktop/tablet/short-phone images after the
corrections. Disposition: **visual acceptance for the supplied frames**. No
material remaining text overlap, font anomaly or unintended subject crop was
visible; it recommended no further design changes from this evidence.

The short opening now separates terminal, cue and navigation. Gesture retains
its corners and an intentional heading gap. Tablet context stays onscreen at
t93, with deliberate two-line wrapping. Desktop Absence remains the best resting
composition. Anticipation at 320×568 is orderly but least generous: secondary
machine annotation is miniature. The photograph and primary context remain
understandable. Window→Gesture is the strongest transformation; Gesture→Anticipation
still asks the most interpretation. Terse “Expect”/“Be” labels and first-time
comprehension remain owner-testing questions, not invented participant findings.

Final selected images and before/after captures are retained in
`docs/v2-phase3-evidence/`. The independent final pass inspected stills; it did
not establish continuous human-perceived playback quality.
