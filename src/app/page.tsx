"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Github,
  ExternalLink,
  Copy,
  Check,
  Terminal,
  Database,
  Search,
  MessageSquare,
  FileJson,
  Wifi,
  WifiOff,
  Youtube,
  Menu,
  X,
  Bot,
  Mail,
} from "lucide-react";

/* ─── Constants ─── */

const GITHUB_URL = "https://github.com/PixelML/av";
const PYPI_URL = "https://pypi.org/project/pixelml-av/";
const INSTALL_CMD = "pip install pixelml-av";

/* ─── Animation variants ─── */

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Animated Section wrapper ─── */

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={stagger}
    >
      {children}
    </motion.section>
  );
}

/* ─── Terminal Block ─── */

function TerminalBlock({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="terminal">
      <div className="terminal-header">
        <div className="terminal-dot" style={{ background: "#ff5f57" }} />
        <div className="terminal-dot" style={{ background: "#febc2e" }} />
        <div className="terminal-dot" style={{ background: "#28c840" }} />
        {title && (
          <span className="ml-3 text-xs text-[hsl(215,20%,50%)]">{title}</span>
        )}
      </div>
      <div className="terminal-body">{children}</div>
    </div>
  );
}

/* ─── Agent Onboarding ─── */

const AGENT_INSTRUCTION = "Read https://agentic.video/skill.md and follow the instructions to set up video memory.";

function AgentOnboarding() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(AGENT_INSTRUCTION);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section
      className="section-spacing px-6 border-t border-[hsl(var(--border))]"
      id="agents"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div variants={fadeInUp} className="text-center mb-4">
          <Bot size={28} className="mx-auto mb-4 text-[hsl(var(--primary))]" />
        </motion.div>

        <motion.h2 variants={fadeInUp} className="section-h2 text-center mb-4">
          Give your agent video memory
        </motion.h2>

        <motion.p variants={fadeInUp} className="body-text text-center mb-10">
          Paste this to your AI agent — Claude, GPT, Cursor, or any agent with
          tool use.
        </motion.p>

        {/* Copy-paste box */}
        <motion.div variants={fadeInUp} className="mb-12">
          <div
            className="border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 flex items-center justify-between gap-4 cursor-pointer hover:border-[hsl(var(--primary)/0.4)] transition-colors"
            onClick={handleCopy}
          >
            <code className="text-sm text-[hsl(var(--foreground))] break-all leading-relaxed">
              {AGENT_INSTRUCTION}
            </code>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopy();
              }}
              className="shrink-0 p-2 hover:text-[hsl(var(--primary))] transition-colors cursor-pointer"
              aria-label="Copy to clipboard"
            >
              {copied ? (
                <Check size={18} className="text-[hsl(var(--terminal-green))]" />
              ) : (
                <Copy size={18} />
              )}
            </button>
          </div>
        </motion.div>

        {/* 3-step flow */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              step: "1",
              title: "Paste to your agent",
              desc: "Copy the instruction above and paste it into any AI agent chat.",
            },
            {
              step: "2",
              title: "Agent sets up av",
              desc: "Your agent installs pixelml-av, configures a provider, and ingests video.",
            },
            {
              step: "3",
              title: "Search and ask",
              desc: "Start querying your videos. Your agent can search, ask questions, and get citations.",
            },
          ].map((item) => (
            <motion.div key={item.step} variants={fadeInUp} className="text-center">
              <div className="step-number mx-auto mb-4">{item.step}</div>
              <h3 className="text-base font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Enterprise callout */}
        <motion.div
          variants={fadeInUp}
          className="text-center text-sm text-[hsl(var(--muted-foreground))]"
        >
          <Mail size={14} className="inline mr-2 -mt-0.5" />
          Need managed infrastructure?{" "}
          <a
            href="mailto:hello@pixelml.com"
            className="text-[hsl(var(--primary))] hover:underline"
          >
            hello@pixelml.com
          </a>
        </motion.div>
      </div>
    </Section>
  );
}

/* ─── Main Page ─── */

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen">
      {/* ─── Nav ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 glass-nav transition-shadow ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="text-xl font-bold tracking-tight">
            av
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#sentinel"
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              Sentinel
            </a>
            <a
              href="#features"
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              Features
            </a>
            <a
              href="#providers"
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              Providers
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              Docs
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors inline-flex items-center gap-1"
            >
              <Github size={16} />
              GitHub
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(INSTALL_CMD)}
              className="btn-primary text-xs py-2 px-4 cursor-pointer"
            >
              <Terminal size={14} />
              pip install pixelml-av
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] px-6 py-4 space-y-3">
            <a href="#sentinel" className="block text-sm" onClick={() => setMobileMenuOpen(false)}>
              Sentinel
            </a>
            <a href="#features" className="block text-sm" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#providers" className="block text-sm" onClick={() => setMobileMenuOpen(false)}>
              Providers
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="block text-sm">
              Docs
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="block text-sm inline-flex items-center gap-1">
              <Github size={14} /> GitHub
            </a>
            <button
              onClick={() => navigator.clipboard.writeText(INSTALL_CMD)}
              className="btn-primary text-xs py-2 px-4 w-full cursor-pointer"
            >
              pip install pixelml-av
            </button>
          </div>
        )}
      </nav>

      {/* ─── Hero ─── */}
      <Section className="section-spacing px-6 pt-32" id="hero">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="badge">v0.1.0 — Apache 2.0</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="hero-h1 mb-6">
            Index. Search. Detect.
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="body-text max-w-xl mx-auto mb-10"
          >
            Video intelligence toolkit for AI agents.{" "}
            <strong>Video Memory</strong> — ingest, search, and ask questions with RAG citations.{" "}
            <strong>Sentinel</strong> — detect falls, queues, and crowd events in CCTV footage.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16"
          >
            <button
              onClick={() => navigator.clipboard.writeText(INSTALL_CMD)}
              className="btn-primary cursor-pointer"
            >
              <Terminal size={16} />
              pip install pixelml-av
              <Copy size={14} className="opacity-50" />
            </button>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Github size={16} />
              View on GitHub
            </a>
          </motion.div>

          {/* Terminal demo */}
          <motion.div variants={fadeInUp} className="max-w-2xl mx-auto">
            <TerminalBlock title="~/project">
              <div className="space-y-1">
                <div>
                  <span className="terminal-prompt">$</span>{" "}
                  <span className="terminal-command">av ingest</span>{" "}
                  <span className="terminal-string">meeting.mp4</span>
                </div>
                <div className="terminal-output">
                  {"{"}&quot;status&quot;: &quot;complete&quot;, &quot;video_id&quot;: &quot;a1b2c3&quot;, &quot;duration_sec&quot;: 3600, &quot;artifacts_count&quot;: 847{"}"}
                </div>
                <div className="mt-3">
                  <span className="terminal-prompt">$</span>{" "}
                  <span className="terminal-command">av search</span>{" "}
                  <span className="terminal-string">&quot;what was discussed about pricing&quot;</span>
                </div>
                <div className="terminal-output">
                  {"{"}&quot;results&quot;: [{"{"}&quot;rank&quot;: 1, &quot;score&quot;: 0.87, &quot;timestamp&quot;: &quot;00:24:15&quot;, &quot;text&quot;: &quot;...&quot;{"}"}]{"}"}
                </div>
                <div className="mt-3">
                  <span className="terminal-prompt">$</span>{" "}
                  <span className="terminal-command">av ask</span>{" "}
                  <span className="terminal-string">&quot;what were the key decisions?&quot;</span>
                </div>
                <div className="terminal-output">
                  {"{"}&quot;answer&quot;: &quot;Three key decisions were made...&quot;, &quot;citations&quot;: [{"{"}&quot;timestamp&quot;: &quot;00:24:15&quot;{"}"}]{"}"}
                </div>
              </div>
            </TerminalBlock>
          </motion.div>
        </div>
      </Section>

      {/* ─── Agents ─── */}
      <AgentOnboarding />

      {/* ─── How It Works ─── */}
      <Section className="section-spacing px-6 border-t border-[hsl(var(--border))]" id="how-it-works">
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeInUp} className="section-h2 text-center mb-16">
            How it works
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Ingest",
                desc: "ffmpeg extracts audio. Whisper transcribes. Embeddings are generated. Everything lands in a single SQLite file.",
                icon: <Database size={20} />,
              },
              {
                step: "2",
                title: "Search",
                desc: "FTS5 full-text search as primary. Cosine similarity reranking when embeddings are available. Fast, local, no network needed.",
                icon: <Search size={20} />,
              },
              {
                step: "3",
                title: "Ask",
                desc: "RAG Q&A over your indexed videos. Get answers with timestamped citations pointing back to the source.",
                icon: <MessageSquare size={20} />,
              },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeInUp} className="feature-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="step-number">{item.step}</div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <div className="text-[hsl(var(--primary))] mb-4">{item.icon}</div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Architecture diagram */}
          <motion.div variants={fadeInUp} className="mt-16">
            <TerminalBlock title="architecture">
              <pre className="text-xs leading-relaxed">
{`video file / URL
       │
       ▼
┌─────────────────────────────────┐
│  av ingest                      │
│  ├─ ffmpeg → audio → Whisper    │
│  ├─ ffmpeg → frames → Vision    │
│  ├─ Embeddings (batch)          │
│  └─ SQLite (FTS5 + vectors)     │
└─────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  av search / av ask             │
│  ├─ FTS5 full-text match        │
│  ├─ Cosine reranking            │
│  └─ RAG Q&A with citations      │
└─────────────────────────────────┘`}
              </pre>
            </TerminalBlock>
          </motion.div>
        </div>
      </Section>

      {/* ─── Sentinel ─── */}
      <Section className="section-spacing px-6 border-t border-[hsl(var(--border))]" id="sentinel">
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeInUp} className="section-h2 text-center mb-4">
            Sentinel — Surveillance Intelligence
          </motion.h2>
          <motion.p variants={fadeInUp} className="body-text text-center mb-12">
            Detect events using temporal reasoning over VLM observations. Built on 107 experiments across 21 vision models.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {[
              {
                title: "FALL",
                desc: "Position tracking — standing→lying transition across frames (F1=0.944)",
              },
              {
                title: "LONG_QUEUE",
                desc: "Temporal persistence — queue detected in 3+ consecutive chunks (90s)",
              },
              {
                title: "CROWD_GATHERING",
                desc: "Density + growth — sustained crowd or rapid person count increase",
              },
              {
                title: "WHEELCHAIR_COMPLIANCE",
                desc: "Service timing — wheelchair user unattended > threshold",
              },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeInUp} className="feature-card">
                <h3 className="text-base font-semibold mb-2 text-[hsl(var(--primary))]">{item.title}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp}>
            <TerminalBlock title="sentinel">
              <div className="space-y-1">
                <div className="terminal-comment"># Cloud (quick start — Gemini free tier)</div>
                <div>
                  <span className="terminal-prompt">$</span>{" "}
                  <span className="terminal-command">export AV_API_KEY=</span>
                  <span className="terminal-string">your-gemini-key</span>
                </div>
                <div>
                  <span className="terminal-prompt">$</span>{" "}
                  <span className="terminal-command">av sentinel</span>{" "}
                  <span className="terminal-string">video.mp4</span>
                </div>
                <div className="mt-3 terminal-comment"># Local (free, private — runs on your Mac/GPU)</div>
                <div>
                  <span className="terminal-prompt">$</span>{" "}
                  <span className="terminal-command">ollama pull mistral-small3.2</span>
                </div>
                <div>
                  <span className="terminal-prompt">$</span>{" "}
                  <span className="terminal-command">av sentinel</span>{" "}
                  <span className="terminal-string">video.mp4</span>{" "}
                  <span className="terminal-flag">--provider ollama</span>
                </div>
                <div className="mt-3 terminal-comment"># Specific alerts</div>
                <div>
                  <span className="terminal-prompt">$</span>{" "}
                  <span className="terminal-command">av sentinel</span>{" "}
                  <span className="terminal-string">video.mp4</span>{" "}
                  <span className="terminal-flag">--alerts FALL,LONG_QUEUE</span>
                </div>
              </div>
            </TerminalBlock>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-8 overflow-x-auto">
            <table className="provider-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Setup</th>
                  <th>Cost</th>
                  <th>Speed</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Gemini", "export AV_API_KEY=key", "Free tier available", "~5s/chunk"],
                  ["OpenRouter", "export OPENROUTER_API_KEY=key", "$0.04-0.14/1M tokens", "~10s/chunk"],
                  ["Ollama (local)", "ollama pull mistral-small3.2", "Free", "~25s/chunk"],
                  ["OpenAI", "export AV_API_KEY=key", "$$$", "~5s/chunk"],
                ].map(([provider, setup, cost, speed], i) => (
                  <tr key={i}>
                    <td className="font-semibold">{provider}</td>
                    <td><code className="text-xs">{setup}</code></td>
                    <td className="text-[hsl(var(--muted-foreground))]">{cost}</td>
                    <td className="text-[hsl(var(--muted-foreground))]">{speed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-xs text-[hsl(var(--muted-foreground))] mt-4 text-center"
          >
            Auto-detection: if no provider specified, av tries Gemini → OpenRouter → ollama → OpenAI.
          </motion.p>
        </div>
      </Section>

      {/* ─── Features Grid ─── */}
      <Section className="section-spacing px-6 border-t border-[hsl(var(--border))]" id="features">
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeInUp} className="section-h2 text-center mb-16">
            Built for agents
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                icon: <FileJson size={20} />,
                title: "JSON to stdout",
                desc: "Structured output on stdout, progress on stderr. Agents parse one, humans read the other.",
              },
              {
                icon: <Database size={20} />,
                title: "Single SQLite file",
                desc: "No Postgres, no Redis, no external dependencies. One file at ~/.config/av/av.db.",
              },
              {
                icon: <Search size={20} />,
                title: "FTS5 primary search",
                desc: "Full-text search works without embeddings. Cosine reranking is optional — works offline.",
              },
              {
                icon: <Wifi size={20} />,
                title: "Provider-agnostic",
                desc: "OpenAI, Anthropic, Gemini. Switch providers with av config setup. One interface.",
              },
              {
                icon: <WifiOff size={20} />,
                title: "Best-effort pipeline",
                desc: "If a stage fails (auth, model access), the pipeline continues and warns. No hard crashes.",
              },
              {
                icon: <Youtube size={20} />,
                title: "YouTube URL support",
                desc: "Pass a YouTube URL to av ingest. Uses yt-dlp under the hood to download and index.",
              },
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeInUp} className="feature-card">
                <div className="text-[hsl(var(--primary))] mb-3">{feature.icon}</div>
                <h3 className="text-base font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Command Reference ─── */}
      <Section className="section-spacing px-6 border-t border-[hsl(var(--border))]" id="commands">
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeInUp} className="section-h2 text-center mb-16">
            Command reference
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Config */}
            <motion.div variants={fadeInUp}>
              <TerminalBlock title="config">
                <div className="space-y-1">
                  <div className="terminal-comment"># Interactive setup wizard</div>
                  <div>
                    <span className="terminal-prompt">$</span>{" "}
                    <span className="terminal-command">av config setup</span>
                  </div>
                  <div className="mt-3 terminal-comment"># Show current config</div>
                  <div>
                    <span className="terminal-prompt">$</span>{" "}
                    <span className="terminal-command">av config show</span>
                  </div>
                  <div className="terminal-output text-xs mt-1">
                    {"{"}<span className="terminal-json-key">&quot;provider&quot;</span>: <span className="terminal-json-string">&quot;openai&quot;</span>, <span className="terminal-json-key">&quot;transcribe_model&quot;</span>: <span className="terminal-json-string">&quot;whisper-1&quot;</span>{"}"}
                  </div>
                </div>
              </TerminalBlock>
            </motion.div>

            {/* Ingest */}
            <motion.div variants={fadeInUp}>
              <TerminalBlock title="ingest">
                <div className="space-y-1">
                  <div className="terminal-comment"># Ingest a video file</div>
                  <div>
                    <span className="terminal-prompt">$</span>{" "}
                    <span className="terminal-command">av ingest</span>{" "}
                    <span className="terminal-string">video.mp4</span>
                  </div>
                  <div className="mt-3 terminal-comment"># With frame captions</div>
                  <div>
                    <span className="terminal-prompt">$</span>{" "}
                    <span className="terminal-command">av ingest</span>{" "}
                    <span className="terminal-string">video.mp4</span>{" "}
                    <span className="terminal-flag">--captions</span>
                  </div>
                  <div className="mt-3 terminal-comment"># YouTube URL</div>
                  <div>
                    <span className="terminal-prompt">$</span>{" "}
                    <span className="terminal-command">av ingest</span>{" "}
                    <span className="terminal-string">&quot;https://youtu.be/...&quot;</span>
                  </div>
                </div>
              </TerminalBlock>
            </motion.div>

            {/* Search */}
            <motion.div variants={fadeInUp}>
              <TerminalBlock title="search">
                <div className="space-y-1">
                  <div>
                    <span className="terminal-prompt">$</span>{" "}
                    <span className="terminal-command">av search</span>{" "}
                    <span className="terminal-string">&quot;pricing discussion&quot;</span>
                  </div>
                  <div className="terminal-output text-xs mt-1">
                    {"{"}
                    <br />
                    {"  "}<span className="terminal-json-key">&quot;results&quot;</span>: [{"{"}<br />
                    {"    "}<span className="terminal-json-key">&quot;rank&quot;</span>: <span className="terminal-json-number">1</span>,<br />
                    {"    "}<span className="terminal-json-key">&quot;score&quot;</span>: <span className="terminal-json-number">0.87</span>,<br />
                    {"    "}<span className="terminal-json-key">&quot;timestamp&quot;</span>: <span className="terminal-json-string">&quot;00:24:15&quot;</span>,<br />
                    {"    "}<span className="terminal-json-key">&quot;text&quot;</span>: <span className="terminal-json-string">&quot;We agreed on the $49/mo tier...&quot;</span><br />
                    {"  "}{"}"}]<br />
                    {"}"}
                  </div>
                </div>
              </TerminalBlock>
            </motion.div>

            {/* Ask */}
            <motion.div variants={fadeInUp}>
              <TerminalBlock title="ask">
                <div className="space-y-1">
                  <div>
                    <span className="terminal-prompt">$</span>{" "}
                    <span className="terminal-command">av ask</span>{" "}
                    <span className="terminal-string">&quot;what were the key decisions?&quot;</span>
                  </div>
                  <div className="terminal-output text-xs mt-1">
                    {"{"}
                    <br />
                    {"  "}<span className="terminal-json-key">&quot;answer&quot;</span>: <span className="terminal-json-string">&quot;Three key decisions...&quot;</span>,<br />
                    {"  "}<span className="terminal-json-key">&quot;citations&quot;</span>: [{"{"}<br />
                    {"    "}<span className="terminal-json-key">&quot;timestamp&quot;</span>: <span className="terminal-json-string">&quot;00:24:15&quot;</span>,<br />
                    {"    "}<span className="terminal-json-key">&quot;score&quot;</span>: <span className="terminal-json-number">0.91</span><br />
                    {"  "}{"}"}],<br />
                    {"  "}<span className="terminal-json-key">&quot;confidence&quot;</span>: <span className="terminal-json-number">0.85</span><br />
                    {"}"}
                  </div>
                </div>
              </TerminalBlock>
            </motion.div>
          </div>

          {/* Full command table */}
          <motion.div variants={fadeInUp} className="mt-12 overflow-x-auto">
            <table className="provider-table">
              <thead>
                <tr>
                  <th>Command</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["av config setup", "Interactive provider setup wizard"],
                  ["av config show", "Show current configuration"],
                  ["av ingest <path>", "Ingest video file(s) into the index"],
                  ["av search <query>", "Full-text + semantic search"],
                  ["av ask <question>", "RAG Q&A with citations"],
                  ["av sentinel <path>", "Detect events (FALL, LONG_QUEUE, CROWD, WHEELCHAIR)"],
                  ["av list", "List all indexed videos"],
                  ["av info <video_id>", "Detailed video metadata"],
                  ["av transcript <id>", "Output transcript (VTT/SRT/text)"],
                  ["av export", "Export as JSONL/VTT/SRT"],
                  ["av open <id> --at <sec>", "Open video at timestamp"],
                ].map(([cmd, desc], i) => (
                  <tr key={i}>
                    <td>
                      <code className="text-[hsl(var(--primary))]">{cmd}</code>
                    </td>
                    <td className="text-[hsl(var(--muted-foreground))]">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </Section>

      {/* ─── Provider Compatibility ─── */}
      <Section className="section-spacing px-6 border-t border-[hsl(var(--border))]" id="providers">
        <div className="max-w-4xl mx-auto">
          <motion.h2 variants={fadeInUp} className="section-h2 text-center mb-4">
            Provider compatibility
          </motion.h2>
          <motion.p variants={fadeInUp} className="body-text text-center mb-12">
            Switch providers with <code className="text-[hsl(var(--foreground))] font-semibold">av config setup</code>. The pipeline adapts automatically.
          </motion.p>

          <motion.div variants={fadeInUp} className="overflow-x-auto">
            <table className="provider-table">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Transcription</th>
                  <th>Vision / Chat</th>
                  <th>Embeddings</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["OpenAI (OAuth)", "whisper-1", "gpt-4-1", "text-embedding-3-small"],
                  ["OpenAI (API key)", "whisper-1", "gpt-4-1", "text-embedding-3-small"],
                  ["Anthropic", "—", "claude-sonnet-4-5", "—"],
                  ["Gemini", "—", "gemini-2.5-flash", "text-embedding-004"],
                ].map(([provider, transcription, vision, embeddings], i) => (
                  <tr key={i}>
                    <td className="font-semibold">{provider}</td>
                    <td>
                      {transcription === "—" ? (
                        <span className="text-[hsl(var(--muted-foreground))]">—</span>
                      ) : (
                        <code className="text-xs">{transcription}</code>
                      )}
                    </td>
                    <td>
                      <code className="text-xs">{vision}</code>
                    </td>
                    <td>
                      {embeddings === "—" ? (
                        <span className="text-[hsl(var(--muted-foreground))]">—</span>
                      ) : (
                        <code className="text-xs">{embeddings}</code>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="text-xs text-[hsl(var(--muted-foreground))] mt-4"
          >
            When a capability is unavailable, the pipeline skips that stage and
            warns. Use <code>AV_OPENAI_API_KEY</code> as a transcription
            fallback for non-OpenAI providers.
          </motion.p>
        </div>
      </Section>

      {/* ─── Install CTA ─── */}
      <Section className="section-spacing px-6 border-t border-[hsl(var(--border))]" id="install">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2 variants={fadeInUp} className="section-h2 mb-4">
            Get started
          </motion.h2>
          <motion.p variants={fadeInUp} className="body-text mb-10">
            Three commands to searchable video.
          </motion.p>

          <motion.div variants={fadeInUp} className="mb-10">
            <TerminalBlock title="quickstart">
              <div className="space-y-1 text-left">
                <div className="terminal-comment"># Install</div>
                <div>
                  <span className="terminal-prompt">$</span>{" "}
                  <span className="terminal-command">pip install pixelml-av</span>
                </div>
                <div className="mt-3 terminal-comment"># Configure your provider</div>
                <div>
                  <span className="terminal-prompt">$</span>{" "}
                  <span className="terminal-command">av config setup</span>
                </div>
                <div className="mt-3 terminal-comment"># Index a video</div>
                <div>
                  <span className="terminal-prompt">$</span>{" "}
                  <span className="terminal-command">av ingest</span>{" "}
                  <span className="terminal-string">meeting.mp4</span>
                </div>
                <div className="mt-3 terminal-comment"># Search it</div>
                <div>
                  <span className="terminal-prompt">$</span>{" "}
                  <span className="terminal-command">av search</span>{" "}
                  <span className="terminal-string">&quot;action items&quot;</span>
                </div>
              </div>
            </TerminalBlock>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center"
          >
            <button
              onClick={() => navigator.clipboard.writeText(INSTALL_CMD)}
              className="btn-primary cursor-pointer"
            >
              <Terminal size={16} />
              pip install pixelml-av
              <Copy size={14} className="opacity-50" />
            </button>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <Github size={16} />
              GitHub
              <ExternalLink size={14} className="opacity-50" />
            </a>
            <a
              href={PYPI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              PyPI
              <ExternalLink size={14} className="opacity-50" />
            </a>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="mt-6 text-xs text-[hsl(var(--muted-foreground))]"
          >
            Requires Python 3.11+ and FFmpeg
          </motion.div>
        </div>
      </Section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-[hsl(var(--border))] px-6 py-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-[hsl(var(--muted-foreground))]">
            <span className="font-semibold text-[hsl(var(--foreground))]">av</span>{" "}
            by{" "}
            <a
              href="https://pixelml.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Pixel ML
            </a>{" "}
            — Apache 2.0
          </div>

          <div className="flex items-center gap-6 text-sm text-[hsl(var(--muted-foreground))]">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[hsl(var(--foreground))] transition-colors inline-flex items-center gap-1"
            >
              <Github size={14} />
              GitHub
            </a>
            <a
              href={PYPI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[hsl(var(--foreground))] transition-colors"
            >
              PyPI
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
