# Escyncial website

Scroll-driven 3D site for Escyncial: black, white and burgundy, with a particle-logo hero, a camera flight through the work, and scroll chapters for numbers, brands and founders.

## Run

```
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
npm run preview  # serve the build
```

## Where things live

- `src/content/home.json` – hero, work, services, brands, contact copy
- `src/content/render.js` – turns the content into HTML at build time (numbers, brands slider and founders sections are here)
- `src/styles/escyncial.css` – Escyncial look on top of the base styles
- `src/ui/chapters.js` – scroll animations from "Attention, counted." down
- `src/scene/` – Three.js scene (logo particles, shards, project tiles)
- `public/assets/logo/` – Escyncial logo and wordmark

Display font is Roxborough CF with DM Serif Display as the free fallback; body is Poppins and Montserrat.
