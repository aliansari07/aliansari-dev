# aliansari.dev

Developer portfolio for **Muhammad Ali Ansari**, a backend and full-stack engineer specializing in .NET Core microservices, high-performance C++ algorithms, and PyTorch deep learning pipelines.

The site is a single-page Next.js application with interactive project visualizers, responsive layouts, and a dark, terminal-inspired UI.

## Highlights

### Video Deepfake Detection & Verification System

Dual-stream PyTorch architecture combining spatial (EfficientNet-B0) and frequency-domain (FFT) features with Transformer temporal reasoning.

- **0.9047** validation AUC on FaceForensics++ (C23)
- Grad-CAM heatmaps for forensic review
- Interactive spectral/spatial toggle, scanner animation, and Grad-CAM overlay in the browser
- Stack: PyTorch, Python, OpenCV, REST API

### StarSeeker: Multithreaded A* Pathfinding Engine

Parallelized A* grid pathfinding engine written in C++ with OpenMP.

- **3.8x** speedup across 8 threads on 4096x4096 grids
- 40% reduction in peak memory via custom allocators
- Step-by-step 5x5 interactive grid sandbox on the site
- Stack: C++, C, OpenMP, multithreading, priority queues, memory allocators

### Enterprise Resource Management REST API

.NET Core REST API for resource allocation and user authentication.

- 12 endpoints with repository-pattern data access
- **85%** business logic coverage across 35 xUnit tests
- Stack: C#, ASP.NET Core, Entity Framework Core, MS SQL Server, xUnit

### SocioStruct: Society Management Platform

Full-stack event management platform for FAST University.

- JWT authentication, venue scheduling, and live WebSocket updates for 200+ participants
- Database query latency reduced from ~320ms to under 50ms via indexing
- Stack: PostgreSQL, Express.js, React, Node.js, WebSockets, Docker, JWT

## Tech Stack

| Layer | Tools |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, lucide-react |
| Language | TypeScript 5 |
| Utilities | clsx, tailwind-merge |
| Assets | next/font (Geist), next/image |
| Tooling | ESLint 9, TypeScript compiler |
| Deployment | Vercel |

## Local Setup

### Prerequisites

- Node.js **20.9.0 or newer**
- npm (or pnpm/yarn/bun)

### Install and run

```bash
git clone https://github.com/aliansari07/aliansari-dev.git
cd aliansari-dev
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are required for the current build.

### Available scripts

```bash
npm run dev      # Start the development server
npm run build    # Create an optimized production build
npm run start    # Serve the production build
npm run lint     # Run ESLint
```

## Project Structure

```text
app/
  layout.tsx      # Root layout, metadata, and font setup
  page.tsx        # Single-page portfolio and interactive demos
  globals.css     # Tailwind import and global styles
public/
  ali.jpeg
  bradpitt1.png
  id1_0009_gradcam.png
  Muhammad_Ali_Ansari_Resume.pdf
next.config.ts    # Next.js and Turbopack configuration
```

## Deployment

The project deploys cleanly to Vercel. Import the repository, keep the default Next.js build settings, and deploy.

```bash
npm run build
```

## Connect

- GitHub: [github.com/aliansari07](https://github.com/aliansari07)
- LinkedIn: [linkedin.com/in/aliansari63224135](https://linkedin.com/in/aliansari63224135)
- Email: [aliansari224135@gmail.com](mailto:aliansari224135@gmail.com)
- Resume: [Muhammad_Ali_Ansari_Resume.pdf](./public/Muhammad_Ali_Ansari_Resume.pdf)
