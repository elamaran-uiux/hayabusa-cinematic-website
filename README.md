# Hayabusa — scroll film (independent concept, not affiliated with Suzuki)
React + Vite + Tailwind + GSAP ScrollTrigger (main scroll film) + Framer Motion (UI only).

## Run
    npm install
    npm run dev          # http://localhost:5173
    npm run build
    npm run check-images # real pixel sizes of everything in public/images

## Film (src/Film.jsx)
One pinned stage driven by ONE scrubbed GSAP timeline (reverses when scrolling up): intro (soft fade-in, slow dolly, staggered headline words) → 01 silhouette (camera move on the hero) → 02 front fairing → 03 engine → 04 brakes & wheels (each with its own photo, cross-faded with a slow zoom) → 05 colours. Reduced motion: no pin, no GSAP, static layout.

## Images in public/images (supplied by the project owner; licence/permission is the owner's responsibility)
| File | Shows | Size |
|---|---|---|
| hero.webp | Full side view, black/copper bike, dark studio (also used for chapter 01) | 2000×1422 |
| front-detail.webp | Headlamp, mirrors, fairing | 1500×1000 |
| engine.webp | 1,340 cm³ engine | 1620×1080 |
| brakes.webp | Brembo caliper, drilled disc, wheel | 2200×1898 |
| rear-three-quarter.webp | Rear 3/4, black/copper, dark studio (closing section) | 1280×840 |
| instrument-cluster.png | TFT cluster (mph/°F — non-India units) | 1200×800 |
Not used on purpose: (a) a silver bike image with wrong bodywork/“GTL” lettering — it appears to be AI-generated, not a real Hayabusa; (b) a grey/red rear 3/4 on a street with a blurred background and an Australian plate — different colourway, not studio.
Below the 2400 px hero target: hero (2000), front (1500), rear (1280). They look fine at 1440 wide but will soften on 4K screens; replace with larger originals if available (same filenames, .webp/.png/.jpg all work).
The black/copper colourway is not confirmed here as an India-market colour; chapter 05 uses Suzuki India colour images (hotlinked, see src/data.js). If they fail to load, the colour wipes are skipped and a link to the official page is shown.
Optional: side-profile.(webp|png|jpg) adds a separate photo for chapter 01; frame sequence: public/frames/ + manifest.json (see src/images.js).

## Verified content
Specs/prices: Suzuki Motorcycle India product page and media-kit press release (28 Sep 2026): https://www.suzukimotorcycle.co.in/product-details/hayabusa , https://www.suzukimotorcycle.co.in/media-kit
