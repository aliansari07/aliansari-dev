'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Mail, Code2, Server, Database, Sparkles, 
  ChevronRight, Play, RefreshCw, Eye, Download, Menu, X 
} from 'lucide-react';

const GithubIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const GRID_SIZE = 12;
const START_POS: [number, number] = [0, 0];
const END_POS: [number, number] = [GRID_SIZE - 1, GRID_SIZE - 1];

const DEFAULT_WALLS = new Set<string>([
  '2,1', '2,2', '2,3', '2,4', '2,5', '2,6', '2,7', '2,8', '2,9',
  '5,2', '5,3', '5,4', '5,5', '5,6', '5,7', '5,8', '5,9', '5,10',
  '8,1', '8,2', '8,3', '8,4', '8,5', '8,6', '8,7', '8,8', '8,9',
  '3,4', '3,8', '4,4', '4,8',
  '6,4', '6,8', '7,4', '7,8',
  '9,4', '9,8', '10,4', '10,8',
  '1,6', '4,1', '7,10', '10,6',
]);

const createGrid = (): number[][] =>
  Array.from({ length: GRID_SIZE }, (_, r) =>
    Array.from({ length: GRID_SIZE }, (_, c) =>
      DEFAULT_WALLS.has(`${r},${c}`) ? 1 : 0
    )
  );

const THREAD_COLORS = [
  'bg-emerald-500/30 text-emerald-200 border-emerald-500/40',
  'bg-cyan-500/30 text-cyan-200 border-cyan-500/40',
  'bg-indigo-500/30 text-indigo-200 border-indigo-500/40',
  'bg-fuchsia-500/30 text-fuchsia-200 border-fuchsia-500/40',
];

const findPath = (
  walls: number[][],
  start: [number, number],
  end: [number, number]
): { order: [number, number][]; path: [number, number][] } => {
  const queue: [number, number][] = [start];
  const seen = new Set<string>([`${start[0]},${start[1]}`]);
  const parent = new Map<string, string>();
  const order: [number, number][] = [];

  while (queue.length > 0) {
    const [r, c] = queue.shift() as [number, number];
    order.push([r, c]);
    if (r === end[0] && c === end[1]) break;

    const neighbors: [number, number][] = [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ];

    for (const [nr, nc] of neighbors) {
      if (nr < 0 || nr >= GRID_SIZE || nc < 0 || nc >= GRID_SIZE) continue;
      if (walls[nr][nc] === 1) continue;
      const key = `${nr},${nc}`;
      if (seen.has(key)) continue;
      seen.add(key);
      parent.set(key, `${r},${c}`);
      queue.push([nr, nc]);
    }
  }

  const startKey = `${start[0]},${start[1]}`;
  const endKey = `${end[0]},${end[1]}`;
  const path: [number, number][] = [];

  if (seen.has(endKey)) {
    let cursor = endKey;
    while (cursor !== startKey) {
      const [r, c] = cursor.split(',').map(Number);
      path.push([r, c]);
      const prev = parent.get(cursor);
      if (!prev) break;
      cursor = prev;
    }
    path.push(start);
    path.reverse();
  }

  return { order, path };
};

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // States for Grad-CAM Heatmap Toggle
  const [isScanning, setIsScanning] = useState(false);
  const [showGradcam, setShowGradcam] = useState(false);

  // States for OpenMP Parallel Pathfinding Visualizer
  const [grid, setGrid] = useState<number[][]>(() => createGrid());
  const [visited, setVisited] = useState<Map<string, number>>(() => new Map());
  const [path, setPath] = useState<[number, number][]>([]);
  const [stats, setStats] = useState({
    nodesExplored: 0,
    pathLength: 0,
    executionTimeMs: 0,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  const startPos = START_POS;
  const endPos = END_POS;
  const runIdRef = useRef(0);

  const handleToggleSpectral = () => {
    if (showGradcam) {
      setShowGradcam(false);
    } else {
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setShowGradcam(true);
      }, 3000);
    }
  };

  // Inject dynamic styles for scanner animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scanner-updown-leftright {
        0%   { transform: translate(0, 0); }
        25%  { transform: translate(100%, 0); }
        50%  { transform: translate(100%, 100%); }
        75%  { transform: translate(0, 100%); }
        100% { transform: translate(0, 0); }
      }
      .scanner-anim {
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, #00ff00, #00aa00);
        animation: scanner-updown-leftright 1.5s ease-in-out infinite;
        pointer-events: none;
      }
      .interactive-container {
        position: relative;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Stop wall drawing if the mouse is released outside the mesh
  useEffect(() => {
    const handleMouseUp = () => setIsMouseDown(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const clearSearch = () => {
    setVisited(new Map());
    setPath([]);
    setStats({ nodesExplored: 0, pathLength: 0, executionTimeMs: 0 });
  };

  const toggleWall = (r: number, c: number) => {
    if (isSearching) return;
    if (
      (r === startPos[0] && c === startPos[1]) ||
      (r === endPos[0] && c === endPos[1])
    ) {
      return;
    }

    runIdRef.current += 1;
    clearSearch();
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = next[r][c] === 1 ? 0 : 1;
      return next;
    });
  };

  const resetGrid = () => {
    runIdRef.current += 1;
    setIsSearching(false);
    setGrid(createGrid());
    clearSearch();
  };

  const runParallelAStar = async () => {
    if (isSearching) return;

    const runId = ++runIdRef.current;
    const { order, path: solution } = findPath(grid, startPos, endPos);

    setIsSearching(true);
    clearSearch();

    const nextVisited = new Map<string, number>();
    const startedAt = Date.now();

    // Emit up to 4 nodes per tick to mimic four threads exploring in parallel
    for (let i = 0; i < order.length; i += 4) {
      if (runIdRef.current !== runId) return;

      const chunkEnd = Math.min(i + 4, order.length);
      for (let j = i; j < chunkEnd; j += 1) {
        const [r, c] = order[j];
        nextVisited.set(`${r},${c}`, j % 4);
      }

      setVisited(new Map(nextVisited));
      setStats({
        nodesExplored: nextVisited.size,
        pathLength: 0,
        executionTimeMs: Date.now() - startedAt,
      });

      await new Promise((resolve) => setTimeout(resolve, 35));
    }

    if (runIdRef.current !== runId) return;

    if (solution.length === 0) {
      setStats({
        nodesExplored: nextVisited.size,
        pathLength: 0,
        executionTimeMs: Date.now() - startedAt,
      });
      setIsSearching(false);
      return;
    }

    for (let i = 1; i <= solution.length; i += 1) {
      if (runIdRef.current !== runId) return;
      setPath(solution.slice(0, i));
      setStats({
        nodesExplored: nextVisited.size,
        pathLength: i,
        executionTimeMs: Date.now() - startedAt,
      });
      await new Promise((resolve) => setTimeout(resolve, 25));
    }

    setIsSearching(false);
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#" className="font-mono text-lg font-bold tracking-tight text-slate-100 hover:text-emerald-400 transition-colors">
            aliansari<span className="text-emerald-400">.dev</span>
          </a>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#projects" className="hover:text-emerald-400 transition-colors">Projects</a>
            <a href="#skills" className="hover:text-emerald-400 transition-colors">Skills</a>
            <a href="#experience" className="hover:text-emerald-400 transition-colors">Experience</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="mailto:aliansari224135@gmail.com"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              Get in Touch
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 text-slate-400 hover:text-slate-100"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full z-50 max-h-[calc(100vh-4rem)] overflow-y-auto bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-4 flex flex-col gap-1 text-sm font-medium text-slate-300 shadow-xl">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="w-full px-3 py-3 rounded-lg hover:bg-slate-900 hover:text-emerald-400 transition-colors">About</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="w-full px-3 py-3 rounded-lg hover:bg-slate-900 hover:text-emerald-400 transition-colors">Projects</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="w-full px-3 py-3 rounded-lg hover:bg-slate-900 hover:text-emerald-400 transition-colors">Skills</a>
            <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="w-full px-3 py-3 rounded-lg hover:bg-slate-900 hover:text-emerald-400 transition-colors">Experience</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="w-full px-3 py-3 rounded-lg hover:bg-slate-900 hover:text-emerald-400 transition-colors">Contact</a>
            <a
              href="mailto:aliansari224135@gmail.com"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 w-full py-2.5 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-center flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Email Me
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="about" className="relative pt-16 sm:pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FAST-NUCES &apos;26 - BS Computer Science (CGPA 3.51)</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-100 mb-6 max-w-3xl leading-[1.1]">
              Muhammad Ali Ansari
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed mb-8">
              Backend & Full-Stack Engineer specializing in resilient <span className="text-slate-200 font-semibold">.NET Core microservices</span>, high-performance <span className="text-slate-200 font-semibold">C++ algorithms</span>, and <span className="text-slate-200 font-semibold">PyTorch deep learning pipelines</span>.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <a 
                href="#projects" 
                className="px-6 py-3 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
              >
                View Projects <ChevronRight className="w-4 h-4" />
              </a>
              <a 
                href="/Muhammad_Ali_Ansari_Resume.pdf" 
                download="Muhammad_Ali_Ansari_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-400 font-medium text-sm hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Resume
              </a>
              <a 
                href="https://github.com/aliansari07" 
                target="_blank" 
                rel="noreferrer"
                className="px-5 py-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium text-sm hover:border-slate-700 hover:text-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <GithubIcon /> GitHub
              </a>
              <a 
                href="https://linkedin.com/in/aliansari63224135" 
                target="_blank" 
                rel="noreferrer"
                className="px-5 py-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium text-sm hover:border-slate-700 hover:text-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <LinkedinIcon /> LinkedIn
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-[320px] w-full">
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 opacity-30 blur-lg group-hover:opacity-60 transition duration-500"></div>
              
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
                <Image 
                  src="/ali.jpeg" 
                  alt="Muhammad Ali Ansari" 
                  width={320}
                  height={380}
                  priority
                  className="w-full h-auto object-cover object-top filter brightness-105 contrast-105 group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">0.9047</div>
            <div className="text-xs text-slate-400 mt-1">Validation AUC on FaceForensics++</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">3.8x</div>
            <div className="text-xs text-slate-400 mt-1">Pathfinding Speedup (OpenMP)</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">85%</div>
            <div className="text-xs text-slate-400 mt-1">Unit Test Coverage (xUnit)</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">200+</div>
            <div className="text-xs text-slate-400 mt-1">Students Reached via FDSS Workshops</div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="projects" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">Featured Engineering Works</h2>
          <p className="text-slate-400 text-sm">Interactive showpieces highlighting AI systems, low-level algorithms, and microservices.</p>
        </div>

        <div className="space-y-10">

          {/* Project 1: Deepfake Detection */}
          <div className="p-4 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-400">
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">Final Year Project</span>
                <span>PyTorch - OpenCV - REST API</span>
              </div>
              <h3 className="text-xl font-bold text-slate-100">Video Deepfake Detection & Verification System</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Dual-stream architecture combining spatial (EfficientNet-B0) and frequency-domain (FFT) features with Transformer temporal reasoning. Achieved <strong className="text-slate-200">0.9047 validation AUC</strong> on FaceForensics++ (C23) with Grad-CAM heatmaps for forensic review.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['PyTorch', 'Python', 'OpenCV', 'Spatial-Frequency Fusion', 'FFT', 'REST API'].map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 text-xs font-mono border border-slate-700/50">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
{/* Interactive Heatmap Toggle Card */}
<div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 text-center flex flex-col gap-4 overflow-hidden interactive-container">
  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-400">
    <span>Interactive Visualizer</span>
    <span className="text-emerald-400 flex items-center gap-1">
      <Eye className="w-3.5 h-3.5" /> Live Preview
    </span>
  </div>
  
  <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-800">
    {/* Base Image / Grad-CAM Layer */}
    <img
      src={showGradcam ? '/id1_0009_gradcam.png' : '/bradpitt1.png'}
      alt={showGradcam ? 'GradCAM Heatmap Analysis' : 'Deepfake detection preview frame'}
      className="w-full h-full object-contain"
    />

    {/* 3-Second Scanning Animation + Spinner Overlay */}
    {isScanning && (
      <>
        <div className="scanner-anim z-10" />
        <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
          <span className="text-xs font-mono text-emerald-400 bg-slate-900/90 px-3 py-1 rounded-full border border-emerald-500/30">
            Generating Grad-Cam Heatmap...
          </span>
        </div>
      </>
    )}
  </div>

  {/* Run Detection Analysis Button */}
  <button
    onClick={handleToggleSpectral}
    disabled={isScanning}
    className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-mono transition-colors border border-slate-700 flex items-center justify-center gap-2"
  >
    <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
    {isScanning
      ? 'Generating Grad-Cam Heatmap...'
      : showGradcam
      ? 'Reset to Original Frame'
      : 'Run Detection Analysis'}
  </button>
</div>
          </div>

          {/* Project 2: StarSeeker */}
          <div className="p-4 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-400">
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">Systems & High Performance</span>
                <span>C++ - OpenMP - Parallel Computing</span>
              </div>
              <h3 className="text-xl font-bold text-slate-100">StarSeeker: Multithreaded A* Pathfinding Engine</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Parallelized A* grid pathfinding engine built in C++ with OpenMP. Parallelized search loops across 8 threads on 4096x4096 grids, achieving a <strong className="text-slate-200">3.8x speedup</strong> and reducing peak memory usage by 40% with custom allocators.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['C++', 'C', 'OpenMP', 'Multithreading', 'Priority Queue', 'Memory Allocators'].map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 text-xs font-mono border border-slate-700/50">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Step-by-step Interactive High-Performance Mesh Console */}
            <div className="lg:col-span-5 p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
              {/* Console Header */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>OpenMP Mesh Visualizer</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">8 Threads</span>
                  <span>12x12 Grid</span>
                </div>
              </div>

              {/* Interactive Mesh */}
              <div
                className="grid grid-cols-12 gap-1 bg-slate-900/90 p-2 rounded-lg border border-slate-800/80 shadow-inner select-none"
                onMouseDown={() => setIsMouseDown(true)}
                onMouseUp={() => setIsMouseDown(false)}
              >
                {grid.map((row, r) =>
                  row.map((cell, c) => {
                    const isStart = r === startPos[0] && c === startPos[1];
                    const isEnd = r === endPos[0] && c === endPos[1];
                    const key = `${r},${c}`;
                    const threadId = visited.get(key);
                    const isPath = path.some(([pr, pc]) => pr === r && pc === c);

                    let style = 'bg-slate-950/60 border-slate-800/60 hover:border-emerald-500/40';

                    if (isStart) style = 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/20';
                    else if (isEnd) style = 'bg-indigo-500 text-white font-bold border-indigo-400 shadow-md shadow-indigo-500/20';
                    else if (isPath) style = 'bg-emerald-400 text-slate-950 font-bold border-emerald-300 z-10 transition-all duration-300';
                    else if (threadId !== undefined) style = THREAD_COLORS[threadId];
                    else if (cell === 1) style = 'bg-slate-800 border-slate-700 shadow-inner';

                    return (
                      <button
                        key={key}
                        type="button"
                        onMouseDown={() => toggleWall(r, c)}
                        onMouseEnter={() => isMouseDown && toggleWall(r, c)}
                        className={`aspect-square rounded-[3px] border flex items-center justify-center text-[9px] transition-all duration-150 ${style}`}
                      >
                        {isStart ? 'S' : isEnd ? 'E' : ''}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Real-time Telemetry Bar */}
              <div className="grid grid-cols-3 gap-1.5 text-center py-1.5 px-2 bg-slate-900/50 rounded-lg border border-slate-800/60 text-[11px]">
                <div>
                  <div className="text-slate-400 text-[10px]">Explored</div>
                  <div className="font-bold text-emerald-400">{stats.nodesExplored}</div>
                </div>
                <div className="border-x border-slate-800/60">
                  <div className="text-slate-400 text-[10px]">Path Length</div>
                  <div className="font-bold text-indigo-400">{stats.pathLength}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px]">Simulated Time</div>
                  <div className="font-bold text-emerald-400">{stats.executionTimeMs}ms</div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={runParallelAStar}
                  disabled={isSearching}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isSearching ? 'Executing Parallel Search...' : 'Run OpenMP Search'}
                </button>
                <button
                  onClick={resetGrid}
                  className="w-full sm:w-auto py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Project 3: Enterprise Resource Management */}
          <div className="p-4 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-400 mb-3">
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">Enterprise Backend</span>
              <span>ASP.NET Core - EF Core - MS SQL Server</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">Enterprise Resource Management REST API</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 max-w-3xl">
              Engineered a .NET Core REST API featuring 12 endpoints for resource allocation and user authentication. Decoupled data access using repository patterns to enable isolated testing, reaching <strong className="text-slate-200">85% business logic coverage across 35 xUnit tests</strong>.
            </p>
            <div className="flex flex-wrap gap-2">
              {['C#', 'ASP.NET Core', '.NET Core Web API', 'Entity Framework Core', 'MS SQL Server', 'xUnit', 'Repository Pattern'].map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 text-xs font-mono border border-slate-700/50">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Project 4: SocioStruct Platform */}
          <div className="p-4 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-emerald-400 mb-3">
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">Full-Stack & WebSockets</span>
              <span>PERN Stack - Docker</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100 mb-2">SocioStruct: Society Management Platform</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4 max-w-3xl">
              Full-stack event management platform for FAST University with JWT authentication, venue scheduling, and live WebSocket updates tracking 200+ participants. Reduced key database query latency from <strong className="text-slate-200">~320ms to under 50ms</strong> via indexing.
            </p>
            <div className="flex flex-wrap gap-2">
              {['PostgreSQL', 'Express.js', 'React', 'Node.js', 'WebSockets', 'Docker', 'JWT'].map((tech) => (
                <span key={tech} className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 text-xs font-mono border border-slate-700/50">
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Technical Skills Overview */}
      <section id="skills" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">Technical Proficiency</h2>
          <p className="text-slate-400 text-sm">A structured breakdown of languages, frameworks, and developer tools.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 sm:p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <Code2 className="w-5 h-5" />
              <h3 className="font-semibold text-slate-200">Languages</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-400 font-mono">
              <li>• C# / .NET</li>
              <li>• C++ / C</li>
              <li>• Python</li>
              <li>• TypeScript / JavaScript</li>
              <li>• SQL</li>
            </ul>
          </div>

          <div className="p-4 sm:p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <Server className="w-5 h-5" />
              <h3 className="font-semibold text-slate-200">Backend & Web</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-400 font-mono">
              <li>• ASP.NET Core / Web API</li>
              <li>• Entity Framework Core</li>
              <li>• Node.js / Express.js</li>
              <li>• React / Next.js</li>
              <li>• REST API & WebSockets</li>
            </ul>
          </div>

          <div className="p-4 sm:p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <Database className="w-5 h-5" />
              <h3 className="font-semibold text-slate-200">Databases & DevOps</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-400 font-mono">
              <li>• Microsoft SQL Server</li>
              <li>• PostgreSQL</li>
              <li>• Docker Containerization</li>
              <li>• Git / GitHub / Postman</li>
              <li>• xUnit / Unit Testing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Leadership & Experience */}
      <section id="experience" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2 font-mono">Leadership & Industry Experience</h2>
          <p className="text-slate-400 text-sm">Professional software engineering roles, academic work, and leadership positions.</p>
        </div>

        <div className="space-y-6">
          <div className="p-4 sm:p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-100">Software Engineer Intern — 10Pearls</h3>
              <span className="text-xs font-mono text-emerald-400">Karachi, Pakistan - Sept 2026 - Present</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Engineered full-stack web application modules using ASP.NET Core Web API for scalable backend microservices and React.js for interactive frontend interfaces. Participated in daily Agile standups, code reviews, and RESTful API integrations across project sprints.
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-100">Teaching Assistant — Data Structures Lab (CL2001)</h3>
              <span className="text-xs font-mono text-emerald-400">FAST-NUCES Karachi — Fall 2025</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Managed weekly lab sessions for Section BDS-3A, evaluated student C++ implementations, graded course hackathons, and guided students in pointer arithmetic, memory management, and tree/graph traversal algorithms.
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-100">President & Director of PR — FAST Data Science Society</h3>
              <span className="text-xs font-mono text-emerald-400">FAST-NUCES Karachi - Fall 2023</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Led a 10-member team to plan and execute 3 technical workshops and competitions reaching over 200 students across campus.
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-100">Deputy Head Boy — Student Council (A levels)</h3>
              <span className="text-xs font-mono text-emerald-400">The City School — Aug 2021 to Jul 2022</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Spearheaded student life and community initiatives, including a beach cleanup drive with 50+ student volunteers and a food distribution drive serving 200+ families. Won Mindstorm Robotics Competition, placed 1st in the 100m sports day race, and served as Room President at ContestOne debating event.
            </p>
          </div>

          <div className="p-4 sm:p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-100">Head Boy — Student Council (O levels)</h3>
              <span className="text-xs font-mono text-emerald-400">The City School — Aug 2019 to Jul 2020</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Led student body representation and organized campus events including Teacher&apos;s Day, Qawwali Night, and conceptualized &quot;InspireII&quot; Science Olympiad. Led the school debate team to multiple victories, secured 2nd place as runners-up in inter-branch robotics, and earned High-Achiever recognition on the school honor wall.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Contact */}
      <footer id="contact" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-800/60 text-center">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Let&apos;s Connect</h2>
        <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
          Currently open to software development opportunities, backend engineering roles, and collaborative projects.
        </p>
        <div className="flex justify-center items-center gap-6 mb-12">
          <a
            href="mailto:aliansari224135@gmail.com"
            title="Email Me"
            className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all flex items-center justify-center"
          >
            <Mail className="w-5 h-5" />
          </a>
          <a href="https://github.com/aliansari07" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
            <GithubIcon />
          </a>
          <a href="https://linkedin.com/in/aliansari63224135" target="_blank" rel="noreferrer" className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all">
            <LinkedinIcon />
          </a>
        </div>
        <p className="text-xs text-slate-600 font-mono">
          © 2026 Muhammad Ali Ansari • Built with Next.js & Tailwind CSS
        </p>
      </footer>

    </div>
  );
}