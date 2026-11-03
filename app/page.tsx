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

const INITIAL_GRID = [
  [0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0],
  [0, 1, 0, 0, 0],
  [0, 0, 1, 1, 0],
  [0, 0, 0, 0, 0],
];

const ASTAR_STEPS = [
  [0, 0], [0, 1], [0, 2],
  [1, 2], [2, 2], [2, 3],
  [2, 4], [3, 4], [4, 4]
];

export default function Home() {
  const [visitedNodes, setVisitedNodes] = useState<number[][]>([]);
  const [activePath, setActivePath] = useState<number[][]>([]);
  const [isPathfinding, setIsPathfinding] = useState(false);
  const [showSpectral, setShowSpectral] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showGradcam, setShowGradcam] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const runIdRef = useRef(0);

  const handleVideoClick = () => {
    setShowScanner(true);
    setTimeout(() => {
      setShowScanner(false);
      setShowGradcam(true);
    }, 400);
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scanner-updown-leftright {
        0%   { transform: translate(0, 0); }
        25%  { transform: translate(100vw, 0); }
        50%  { transform: translate(100vw, 100vh); }
        75%  { transform: translate(0, 100vh); }
        100% { transform: translate(0, 0); }
      }
      .scanner-anim {
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, #00ff00, #00aa00);
        animation: scanner-updown-leftright 400ms ease-in-out forwards;
        pointer-events: none;
      }
      .gradcam-img {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: none;
      }
      .gradcam-img.visible { display: block; }
      video { width: 100%; height: auto; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const runAStarDemo = async () => {
    const runId = ++runIdRef.current;
    setIsPathfinding(true);
    setVisitedNodes([]);
    setActivePath([]);

    for (let i = 0; i < ASTAR_STEPS.length; i++) {
      await new Promise((res) => setTimeout(res, 120));
      if (runIdRef.current !== runId) return;
      setVisitedNodes((prev) => [...prev, ASTAR_STEPS[i]]);
    }

    setActivePath(ASTAR_STEPS);
    setIsPathfinding(false);
  };

  const resetGrid = () => {
    runIdRef.current++;
    setVisitedNodes([]);
    setActivePath([]);
    setIsPathfinding(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
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
          <div className="md:hidden bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-col gap-4 text-sm font-medium text-slate-300">
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-400">About</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-400">Projects</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-400">Skills</a>
            <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-400">Experience</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-emerald-400">Contact</a>
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
      <section id="about" className="relative pt-20 pb-16 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FAST-NUCES &apos;26 - BS Computer Science (CGPA 3.51)</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-slate-100 mb-6 max-w-3xl leading-[1.1]">
              Muhammad Ali Ansari
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed mb-8">
              Backend & Full-Stack Engineer specializing in resilient <span className="text-slate-200 font-semibold">.NET Core microservices</span>, high-performance <span className="text-slate-200 font-semibold">C++ algorithms</span>, and <span className="text-slate-200 font-semibold">PyTorch deep learning pipelines</span>.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a 
                href="#projects" 
                className="px-6 py-3 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-sm hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/10"
              >
                View Projects <ChevronRight className="w-4 h-4" />
              </a>
              <a 
  href="/Muhammad_Ali_Ansari_Resume.pdf" 
  download="Muhammad_Ali_Ansari_Resume.pdf"
  target="_blank"
  rel="noopener noreferrer"
  className="px-6 py-3 rounded-lg bg-slate-900 border border-emerald-500/30 text-emerald-400 font-medium text-sm hover:bg-emerald-500/10 transition-all flex items-center gap-2"
>
  <Download className="w-4 h-4" /> Resume
</a>
              <a 
                href="https://github.com/aliansari07" 
                target="_blank" 
                rel="noreferrer"
                className="px-5 py-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium text-sm hover:border-slate-700 hover:text-slate-100 transition-all flex items-center gap-2"
              >
                <GithubIcon /> GitHub
              </a>
              <a 
                href="https://linkedin.com/in/aliansari63224135" 
                target="_blank" 
                rel="noreferrer"
                className="px-5 py-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium text-sm hover:border-slate-700 hover:text-slate-100 transition-all flex items-center gap-2"
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
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <span className="text-xs font-mono text-emerald-400 bg-slate-950/80 border border-emerald-500/20 px-3 py-1 rounded-full backdrop-blur-md">
                    Karachi, Pakistan 🇵🇰
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
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
      <section id="projects" className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">Featured Engineering Works</h2>
          <p className="text-slate-400 text-sm">Interactive showpieces highlighting AI systems, low-level algorithms, and microservices.</p>
        </div>

        <div className="space-y-10">

          {/* Project 1: Deepfake Detection */}
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
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
            <div className="lg:col-span-5 p-5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-4 h-[400px] min-h-[300px] overflow-hidden">
  {/* Brad Pitt video – keeps playing, muted for autoplay */}
  <video
    ref={videoRef}
    playsInline
    autoPlay
    muted
    className="w-full h-48 object-cover"
    onClick={handleVideoClick}
  />
  <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                <span>Interactive Visualizer</span>
                <span className="text-emerald-400 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Live Preview</span>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center border border-slate-800">
                <div 
                  className={`absolute inset-0 transition-all duration-500 ${
                    showSpectral 
                      ? 'bg-linear-to-tr from-indigo-600/40 via-purple-600/40 to-pink-500/40 backdrop-contrast-125' 
                      : 'bg-slate-900/80'
                  }`} 
                />
                <div className="z-10 text-center p-4">
                  <div className="text-xs font-mono text-slate-300 mb-1">
                    {showSpectral ? 'Frequency Domain (FFT Spectral Anomalies)' : 'Spatial Frame Feature Extraction'}
                  </div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {showSpectral ? 'FFT Anomaly Heatmap' : 'Spatial RGB Frame'}
                  </div>
                </div>
              </div>
<button
                onClick={() => setShowSpectral(!showSpectral)}
                className="w-full py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors border border-slate-700 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Toggle {showSpectral ? 'Spatial View' : 'Spectral FFT View'}
              </button>
            </div>
            {showScanner && <div className="scanner-anim" />}
            {showGradcam && (<img src="/id1_0009_gradcam.png" alt="GradCAM" className="gradcam-img visible" />)}
          </div>
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
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

            {/* Step-by-step Interactive Grid Sandbox */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>5x5 Mini Grid Visualizer</span>
                <span>{activePath.length > 0 ? 'Path Solved' : isPathfinding ? 'Exploring...' : 'A* Idle'}</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 justify-center py-2">
                {INITIAL_GRID.map((row, rIdx) => 
                  row.map((cell, cIdx) => {
                    const isStart = rIdx === 0 && cIdx === 0;
                    const isEnd = rIdx === 4 && cIdx === 4;
                    const isVisited = visitedNodes.some(([r, c]) => r === rIdx && c === cIdx);
                    const isFinalPath = activePath.some(([r, c]) => r === rIdx && c === cIdx);
                    
                    let cellStyle = 'bg-slate-900 text-slate-700 border border-slate-800';
                    if (isStart) cellStyle = 'bg-emerald-500 text-slate-950 font-bold';
                    else if (isEnd) cellStyle = 'bg-indigo-500 text-white font-bold';
                    else if (cell === 1) cellStyle = 'bg-slate-800 text-slate-600';
                    else if (isFinalPath) cellStyle = 'bg-emerald-400 text-slate-950 font-bold scale-105';
                    else if (isVisited) cellStyle = 'bg-indigo-900/60 text-indigo-300 border-indigo-700/50';

                    return (
                      <div 
                        key={`${rIdx}-${cIdx}`}
                        className={`aspect-square rounded flex items-center justify-center text-[10px] font-mono transition-all duration-200 ${cellStyle}`}
                      >
                        {isStart ? 'S' : isEnd ? 'E' : cell === 1 ? 'X' : ''}
                      </div>
                    );
                  })
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={runAStarDemo}
                  disabled={isPathfinding}
                  className="flex-1 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" /> {isPathfinding ? 'Searching...' : 'Run Parallel Search'}
                </button>
                <button
                  onClick={resetGrid}
                  className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                >
                  Reset
                </button>
              </div>
</div>
           </div>
          {/* Brad Pitt video – keeps playing, muted for autoplay */}
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="w-full h-48 object-cover"
            onClick={handleVideoClick}
          />
           {/* Project 3: Enterprise Resource Management */}
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-3">
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
          <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-3">
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
      <section id="skills" className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">Technical Proficiency</h2>
          <p className="text-slate-400 text-sm">A structured breakdown of languages, frameworks, and developer tools.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
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

          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
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

          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
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
      <section id="experience" className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/60">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2 font-mono">Leadership & Industry Experience</h2>
          <p className="text-slate-400 text-sm">Professional software engineering roles, academic work, and leadership positions.</p>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-100">Software Engineer Intern — 10Pearls</h3>
              <span className="text-xs font-mono text-emerald-400">Karachi, Pakistan - Sept 2026 - Present</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Engineered full-stack web application modules using ASP.NET Core Web API for scalable backend microservices and React.js for interactive frontend interfaces. Participated in daily Agile standups, code reviews, and RESTful API integrations across project sprints.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-100">Teaching Assistant — Data Structures Lab (CL2001)</h3>
              <span className="text-xs font-mono text-emerald-400">FAST-NUCES Karachi — Fall 2025</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Managed weekly lab sessions for Section BDS-3A, evaluated student C++ implementations, graded course hackathons, and guided students in pointer arithmetic, memory management, and tree/graph traversal algorithms.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-100">President & Director of PR — FAST Data Science Society</h3>
              <span className="text-xs font-mono text-emerald-400">FAST-NUCES Karachi - Fall 2023</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Led a 10-member team to plan and execute 3 technical workshops and competitions reaching over 200 students across campus.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold text-slate-100">Deputy Head Boy — Student Council (A levels)</h3>
              <span className="text-xs font-mono text-emerald-400">The City School — Aug 2021 to Jul 2022</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Spearheaded student life and community initiatives, including a beach cleanup drive with 50+ student volunteers and a food distribution drive serving 200+ families. Won Mindstorm Robotics Competition, placed 1st in the 100m sports day race, and served as Room President at ContestOne debating event.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
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
      <footer id="contact" className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-800/60 text-center">
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