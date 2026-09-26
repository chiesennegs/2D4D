# 2D4D

A mobile/laptop-friendly web app that estimates a 2D:4D digit ratio from calibrated hand photos
and compares it to published population data. Everything runs client-side (React + TypeScript +
Vite, installable as a PWA) — no backend, no accounts, nothing uploaded. Hand-landmark detection
runs on-device via MediaPipe Hands (`@mediapipe/tasks-vision`).

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL **on an HTTPS origin or `localhost`** — browsers only allow camera
access (`getUserMedia`) on secure origins. To test on a phone on your LAN, either use a tunnel
(e.g. `ngrok`) or accept the dev server's self-signed setup; plain `http://<lan-ip>` will not get
camera permission.

## How it works

1. **Demographics** (`src/pages/Demographics.tsx`) — sex, mother's/father's regional ancestry,
   age range. Every field is skippable; skipping widens the comparison group.
2. **Calibration** (`src/pages/Calibration.tsx`) — pick a known-size object (credit card, a
   coin, or a printable sheet at `public/calibration-sheet.html`) to convert pixels to millimetres.
3. **Capture** (`src/pages/Capture.tsx`) — photograph each hand next to the reference object.
   MediaPipe Hands detects 21 hand landmarks on-device; you then tap the two ends of the
   reference object's known edge to calibrate scale.
4. **Results** (`src/pages/Results.tsx`) — converts the measured ratio to a z-score/percentile
   against `src/data/referenceData.ts` (sourced from Butovskaya et al. 2021, the largest
   single-methodology sex × ancestry × hand dataset available) and shows both the number and its
   uncertainty.
5. **Methodology** (`src/pages/Methodology.tsx`) — the actual state of the science, including the
   replication failures, with citations in `src/data/citations.ts`.

## Notes for further work

- Camera capture and MediaPipe detection can't be exercised in a headless/sandboxed browser —
  test the capture flow on a real phone or laptop with camera access.
- The reference dataset only covers three broad ancestry groupings (European/African/Asian
  origin); anything else falls back to the pooled overall figures rather than guessing — see
  `mapAncestryToStatGroup` in `src/data/referenceData.ts`.
- Every citation in `src/data/citations.ts` was checked against a real PubMed/DOI/journal page.
  If you add more, verify the same way before trusting the number.
