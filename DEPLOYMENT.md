# 🚀 Deployment

This document describes the deployment process for the **3D Mannequin** project. The project is built as a monolithic application based on **Next.js 14+ (App Router)** and does not require a separate backend server (NestJS API is integrated into Next.js API Routes).

## 1. System Requirements

### Environment
- **Node.js:** version 18.17 or higher (LTS recommended).
- **Package Manager:** Bun 1.0+ (recommended) or npm/yarn/pnpm.
- **OS:** Linux (Ubuntu/Debian), macOS, or Windows.

### Hardware Requirements
- **RAM:** Minimum 1GB (for build).
- **CPU:** 1 core (minimum).

---

## 2. Step-by-Step Installation Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Melik1986/3D-Mannequin.git
   cd 3D-Mannequin
   ```

2. **Install dependencies:**
   Use `bun` for maximum speed, or `npm` as an alternative.
   ```bash
   bun install
   # or
   npm install --legacy-peer-deps
   ```

---

## 3. Environment Setup

The project works "out of the box" with a local manifest. If connection to external services is required, create a `.env.local` file:

```bash
# Example (optional)
NEXT_PUBLIC_API_URL=https://api.example.com
```

For the current configuration, environment variables are **not required**.

---

## 4. Launch Procedure

### Local Development
```bash
bun dev
# Application available at http://localhost:3000
```

### Production (Vercel - Recommended)
This is the easiest way to deploy Next.js applications.

1. Install [Vercel CLI](https://vercel.com/docs/cli): `npm i -g vercel`
2. Login: `vercel login`
3. Deploy:
   ```bash
   vercel
   # For production:
   vercel --prod
   ```

### Production (Self-hosted / VPS)

1. **Build the application:**
   ```bash
   bun run build
   # Creates an optimized build in the .next folder
   ```

2. **Start the server:**
   ```bash
   bun start
   # Starts the Node.js server on port 3000
   ```

3. **Using Process Manager (PM2):**
   For stable operation on a VPS, it is recommended to use PM2.
   ```bash
   npm install -g pm2
   pm2 start npm --name "3d-mannequin" -- start
   ```

### Docker (Alternative)

Create a `Dockerfile` in the project root:

```dockerfile
FROM oven/bun:1 as base
WORKDIR /app
COPY . .
RUN bun install
RUN bun run build
EXPOSE 3000
CMD ["bun", "start"]
```

Build and run:
```bash
docker build -t 3d-mannequin .
docker run -p 3000:3000 3d-mannequin
```

---

## 5. Troubleshooting

### Error: `JavaScript heap out of memory` during build
**Solution:** Increase the memory limit for Node.js.
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
bun run build
```

### Error: 404 on static files (images/sprites)
**Cause:** Incorrect paths in `public` or file name case sensitivity.
**Solution:**
- Ensure files are located in `public/costum/`.
- Check file names (e.g., `frame-0.png` vs `Frame-0.png`). Linux is case-sensitive!

### Error: PixiJS does not render canvas
**Cause:** Issue with WebGL on the device or SSR.
**Solution:** The `MannequinViewer` component must be loaded dynamically with `ssr: false` (already implemented in `ProductPageClient.tsx`).

### Dependency error during `npm install`
**Solution:** Use the `--legacy-peer-deps` flag or switch to `bun install`.
