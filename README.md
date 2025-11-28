# 3D Mannequin 2.5D Viewer

High-performance module for 360° clothing viewing using Next.js 14+ and PixiJS. The project implements a hybrid pipeline using pre-generated assets (sprite sheets) to achieve photorealistic quality.

## Features

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, PixiJS.
- **Performance:** Hardware acceleration via WebGL (PixiJS), lazy frame loading.
- **Design:** "Museum of Ancient Art" — dark luxury aesthetic with adaptive UI.
- **Responsiveness:** Full support for mobile devices and desktops, smart canvas scaling.
- **Infrastructure:** Monolithic architecture (API Routes + Frontend), ready for deployment on Vercel.

## Quick Start

### Requirements

- Node.js 18+ or Bun 1.0+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Melik1986/3D-Mannequin.git
cd 3D-Mannequin

# Install dependencies
bun install
# or
npm install
```

### Development Mode

```bash
bun dev
# or
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build

```bash
bun run build
bun start
```

## Project Structure

- `app/` — Next.js App Router (pages and API).
- `components/` — React components (MannequinViewer, SKUSelector).
- `public/` — Static files (models, sprites).
- `services/` — Business logic (RotationService).

## License

MIT
