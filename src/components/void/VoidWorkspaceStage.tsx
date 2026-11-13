import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Terminal,
  Folder,
  FileCode2,
  GitBranch,
  Check,
  BellOff,
  Hash,
  Send,
  Play,
  AlertTriangle,
  Search,
} from 'lucide-react';
import { VoidDialogueTurn } from '../../data/voidProjectData';
import { VoidSphereState } from './VoidParticleSphere';

interface VoidWorkspaceStageProps {
  scenarioId: string;
  activeTurnIdx: number;
  inToolPhase: boolean;
  isPlaying: boolean;
  speakerState: VoidSphereState;
  displayedTurn?: VoidDialogueTurn;
}

interface TerminalLine {
  id: string;
  kind: 'listen' | 'cmd' | 'output' | 'abort' | 'success';
  text: string;
}

// Typewriter component that smoothly types new shell commands character by character
const TypedLine: React.FC<{ line: TerminalLine; animate: boolean; isPlaying: boolean }> = ({
  line,
  animate,
  isPlaying,
}) => {
  const [charCount, setCharCount] = useState(animate ? 0 : line.text.length);

  useEffect(() => {
    if (!animate) {
      setCharCount(line.text.length);
      return;
    }
    setCharCount(0);
  }, [line.id, line.text, animate]);

  useEffect(() => {
    if (!animate || !isPlaying || charCount >= line.text.length) return;
    const speedMs = line.kind === 'cmd' ? 16 : 8;
    const id = globalThis.setInterval(() => {
      setCharCount((prev) => {
        if (prev >= line.text.length) {
          globalThis.clearInterval(id);
          return prev;
        }
        return prev + 1;
      });
    }, speedMs);
    return () => globalThis.clearInterval(id);
  }, [line.id, line.text, line.kind, animate, isPlaying, charCount]);

  const colorClass =
    line.kind === 'abort'
      ? 'text-amber-300'
      : line.kind === 'success'
      ? 'text-emerald-400'
      : line.kind === 'cmd'
      ? 'text-white'
      : line.kind === 'listen'
      ? 'text-sky-300/85'
      : 'text-white/60';

  const displayed = line.text.slice(0, charCount);
  const isTyping = animate && isPlaying && charCount < line.text.length;

  return (
    <div className={`font-mono text-[10px] sm:text-[11px] leading-[1.45] whitespace-pre-wrap break-all ${colorClass}`}>
      {displayed}
      {isTyping && <span className="inline-block w-1.5 h-3 bg-white/80 align-middle ml-0.5 animate-pulse" />}
    </div>
  );
};

export const VoidWorkspaceStage: React.FC<VoidWorkspaceStageProps> = ({
  scenarioId,
  activeTurnIdx,
  inToolPhase,
  isPlaying,
  speakerState,
}) => {
  const terminalScrollRef = useRef<HTMLDivElement | null>(null);
  // Derive live terminal command log up to the current turn
  const terminalLines: TerminalLine[] = useMemo(() => {
    const lines: TerminalLine[] = [];

    if (scenarioId === 'workspace-setup-barge-in') {
      if (activeTurnIdx >= 0) {
        lines.push({
          id: 's1-l0',
          kind: 'listen',
          text: '[vad] voice detected · streaming 16kHz PCM -> intent parser',
        });
      }
      if (activeTurnIdx >= 1) {
        lines.push({ id: 's1-l1', kind: 'cmd', text: '$ code ~/Developer/portfolio' });
        lines.push({ id: 's1-l2', kind: 'success', text: '  -> VS Code opened workspace (portfolio)' });
        lines.push({ id: 's1-l3', kind: 'cmd', text: '$ npm run dev -- --port 3000' });
        lines.push({ id: 's1-l4', kind: 'output', text: '  -> VITE ready in 184ms · http://localhost:3000' });
        lines.push({ id: 's1-l5', kind: 'cmd', text: '$ git status -s' });
        lines.push({
          id: 's1-l6',
          kind: 'output',
          text: '  M src/App.tsx · M server.ts · M voidProjectData.ts',
        });
        if (activeTurnIdx === 1 && !inToolPhase) {
          lines.push({ id: 's1-l7', kind: 'cmd', text: '$ git commit -m "wip: voice updates"' });
        }
      }
      if (activeTurnIdx >= 2) {
        lines.push({
          id: 's1-l8',
          kind: 'abort',
          text: '^C [BARGE-IN] user speech interrupt -> commit aborted (12ms)',
        });
      }
      if (activeTurnIdx >= 3) {
        lines.push({ id: 's1-l9', kind: 'cmd', text: '$ npm run lint' });
        lines.push({
          id: 's1-l10',
          kind: 'success',
          text: '  > tsc --noEmit -> 0 errors found',
        });
      }
    } else if (scenarioId === 'commit-summary-slack') {
      if (activeTurnIdx >= 0) {
        lines.push({
          id: 's2-l0',
          kind: 'listen',
          text: '[vad] listening · "summarize payments commits & draft slack"',
        });
      }
      if (activeTurnIdx >= 1) {
        lines.push({ id: 's2-l1', kind: 'cmd', text: '$ git log -n 3 --oneline payments' });
        lines.push({
          id: 's2-l2',
          kind: 'output',
          text: '  8f4a21c fix: deduplicate webhook retries\n  3b910e4 feat: Redis rate limiting · a12c88d test: error boundary',
        });
        lines.push({ id: 's2-l3', kind: 'cmd', text: '$ slack draft --channel "#engineering"' });
        lines.push({ id: 's2-l4', kind: 'success', text: '  -> Slack composer populated (awaiting confirmation)' });
      }
      if (activeTurnIdx >= 2) {
        lines.push({ id: 's2-l5', kind: 'listen', text: '[vad] confirmation heard -> executing mutations' });
      }
      if (activeTurnIdx >= 3) {
        lines.push({ id: 's2-l6', kind: 'cmd', text: '$ slack post --channel "#engineering"' });
        lines.push({ id: 's2-l7', kind: 'success', text: '  -> Posted to #engineering (200 OK)' });
        lines.push({ id: 's2-l8', kind: 'cmd', text: '$ jira transition PAY-104 "In Review"' });
        lines.push({ id: 's2-l9', kind: 'success', text: '  -> PAY-104 moved to In Review' });
      }
    } else {
      // focus-mode-code-jump
      if (activeTurnIdx >= 0) {
        lines.push({
          id: 's3-l0',
          kind: 'listen',
          text: '[vad] listening · "mute notifications 45m & find JWT check"',
        });
      }
      if (activeTurnIdx >= 1) {
        lines.push({ id: 's3-l1', kind: 'cmd', text: '$ dndctl enable --minutes 45' });
        lines.push({ id: 's3-l2', kind: 'success', text: '  -> Desktop Focus mode active (45:00)' });
        lines.push({ id: 's3-l3', kind: 'cmd', text: '$ rg -n "verifyToken" auth-service/' });
        lines.push({ id: 's3-l4', kind: 'output', text: '  -> src/security/TokenVerifier.java:64' });
      }
      if (activeTurnIdx >= 2) {
        lines.push({ id: 's3-l5', kind: 'listen', text: '[vad] directive -> "jump to line 64 & run auth tests"' });
      }
      if (activeTurnIdx >= 3) {
        lines.push({ id: 's3-l6', kind: 'cmd', text: '$ code -g TokenVerifier.java:64' });
        lines.push({ id: 's3-l7', kind: 'cmd', text: '$ ./mvnw test -Dtest=TokenVerifierTest' });
        lines.push({ id: 's3-l8', kind: 'success', text: '  -> Tests run: 12, Failures: 0 · PASSED (0.8s)' });
      }
    }

    return lines;
  }, [scenarioId, activeTurnIdx, inToolPhase]);

  // Keep background terminal scrolled to latest typed line
  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalLines.length]);

  // Determine which OS windows are open based on scenario & active turn
  const showVsCode =
    (scenarioId === 'workspace-setup-barge-in' && activeTurnIdx >= 1) ||
    (scenarioId === 'focus-mode-code-jump' && activeTurnIdx >= 1);

  const showSlackAndJira = scenarioId === 'commit-summary-slack' && activeTurnIdx >= 1;
  const showDndBanner = scenarioId === 'focus-mode-code-jump' && activeTurnIdx >= 1;

  return (
    <div className="absolute inset-0 z-10 flex flex-col justify-between bg-[#090A0D] pt-14 sm:pt-16 pb-20 sm:pb-24 px-3 sm:px-6 overflow-hidden">
      {/* Subtle architectural desktop grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Top-Right OS Focus Notification Banner (Scenario 3) */}
      {showDndBanner && (
        <div className="absolute top-13 right-4 sm:right-6 z-30 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#16181F] border border-white/15 shadow-xl text-[11px] text-white transition-all duration-200">
          <BellOff className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span className="font-medium">Focus Active</span>
          <span className="text-white/50 font-mono">&middot; 45:00</span>
        </div>
      )}

      {/* Main Split Desktop Area: Left = Target App Window(s) Opening Live | Bottom/Side = Background Listening Terminal */}
      <div className="relative z-20 flex-1 grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3 min-h-0">
        {/* LEFT/MAIN PANE (7 cols): Live OS App Window that opens in response to commands */}
        <div className="md:col-span-7 flex flex-col min-h-0">
          {/* Case A: Empty Desktop Waiting for First Command (Turn 0) */}
          {!showVsCode && !showSlackAndJira && (
            <div className="flex-1 rounded-xl border border-white/10 bg-[#101216]/75 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center transition-opacity duration-200">
              <div className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center mb-2.5 text-white/60">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="text-xs font-medium text-white/85">
                Desktop Workspace Standby
              </div>
              <div className="text-[11px] font-mono text-white/45 mt-1 max-w-xs">
                Waiting for voice intent to launch target tools &amp; windows...
              </div>
            </div>
          )}

          {/* Case B: VS Code Window Opening Live (Scenarios 1 & 3) */}
          {showVsCode && (
            <div className="flex-1 rounded-xl border border-white/15 bg-[#12141A] shadow-2xl overflow-hidden flex flex-col transition-all duration-200">
              {/* macOS / VS Code Title Bar */}
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#181A22] border-b border-white/10 text-[10px] font-mono text-white/70 shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white/25" />
                  <span className="w-2 h-2 rounded-full bg-white/25" />
                  <span className="w-2 h-2 rounded-full bg-white/25" />
                  <span className="ml-2 text-white/85 font-medium">
                    Visual Studio Code — {scenarioId === 'workspace-setup-barge-in' ? 'portfolio' : 'auth-service'}
                  </span>
                </div>
                <span className="text-white/45 hidden sm:inline">
                  {scenarioId === 'workspace-setup-barge-in' ? 'port :3000 live' : 'TokenVerifier.java:64'}
                </span>
              </div>

              {/* VS Code Body: Sidebar + Editor */}
              <div className="flex-1 grid grid-cols-12 min-h-0">
                {/* Explorer Sidebar */}
                <div className="hidden sm:flex col-span-4 border-r border-white/10 bg-[#0F1116] p-2 flex-col gap-1 text-[10px] font-mono text-white/65 overflow-hidden">
                  <div className="text-[9px] uppercase tracking-wider text-white/40 mb-1">Explorer</div>
                  {scenarioId === 'workspace-setup-barge-in' ? (
                    <>
                      <div className="flex items-center justify-between text-white/85">
                        <span className="flex items-center gap-1.5 truncate"><Folder className="w-3 h-3 text-sky-300/80" /> src</span>
                      </div>
                      <div className="flex items-center justify-between pl-3 text-amber-200/90">
                        <span className="flex items-center gap-1 truncate"><FileCode2 className="w-3 h-3" /> App.tsx</span>
                        <span className="text-[9px]">M</span>
                      </div>
                      <div className="flex items-center justify-between pl-3 text-amber-200/90">
                        <span className="flex items-center gap-1 truncate"><FileCode2 className="w-3 h-3" /> voidData.ts</span>
                        <span className="text-[9px]">M</span>
                      </div>
                      <div className="flex items-center justify-between pl-1 text-amber-200/90">
                        <span className="flex items-center gap-1 truncate"><FileCode2 className="w-3 h-3" /> server.ts</span>
                        <span className="text-[9px]">M</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 text-white/80"><Folder className="w-3 h-3 text-sky-300/80" /> src/security</div>
                      <div className="flex items-center gap-1.5 pl-3 text-white bg-white/10 rounded px-1 py-0.5">
                        <FileCode2 className="w-3 h-3 text-sky-300 shrink-0" />
                        <span className="truncate">TokenVerifier.java</span>
                      </div>
                      <div className="flex items-center gap-1.5 pl-3 text-white/55">
                        <FileCode2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">TokenVerifierTest.java</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Active Code Editor Pane */}
                <div className="col-span-12 sm:col-span-8 p-2.5 sm:p-3 font-mono text-[10px] sm:text-[11px] text-white/80 flex flex-col justify-between overflow-hidden">
                  {scenarioId === 'workspace-setup-barge-in' ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] text-white/50 pb-1 border-b border-white/10">
                        <GitBranch className="w-3 h-3" />
                        <span>main</span>
                        <span>&middot;</span>
                        <span className="text-amber-300">3 modified files</span>
                      </div>
                      <div className="pt-1 space-y-0.5 text-white/70">
                        <div><span className="text-white/30 mr-2">12</span>export const VoidProjectSection = () =&gt; &#123;</div>
                        <div><span className="text-white/30 mr-2">13</span>  const [activeTurn, setActiveTurn] = useState(0);</div>
                        <div className="bg-white/[0.06] -mx-1 px-1 rounded text-white">
                          <span className="text-white/30 mr-2">14</span>  return &lt;VoidVideoPlayer scenarios=&#123;scenarios&#125; /&gt;;
                        </div>
                        <div><span className="text-white/30 mr-2">15</span>&#125;;</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-white/50 pb-1 border-b border-white/10 mb-1">
                        <span className="flex items-center gap-1.5"><Search className="w-3 h-3" /> TokenVerifier.java</span>
                        <span>Ln 64, Col 9</span>
                      </div>
                      <div className="text-white/50"><span className="text-white/25 mr-2">62</span>public Claims verifyToken(String jwt) &#123;</div>
                      <div className="text-white/50"><span className="text-white/25 mr-2">63</span>  Claims claims = parser.parseSignedClaims(jwt);</div>
                      <div className="bg-amber-400/15 border-l-2 border-amber-300 -mx-1 px-1.5 py-0.5 text-white">
                        <span className="text-amber-300/80 mr-2">64</span>  if (claims.getExpiration().before(Instant.now())) &#123;
                      </div>
                      <div className="text-white/50"><span className="text-white/25 mr-2">65</span>    throw new ExpiredJwtException(&quot;15m TTL expired&quot;);</div>
                      <div className="text-white/50"><span className="text-white/25 mr-2">66</span>  &#125;</div>
                    </div>
                  )}

                  {/* Bottom VS Code Integrated Action Status Bar */}
                  <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                    {scenarioId === 'workspace-setup-barge-in' ? (
                      <>
                        {activeTurnIdx === 1 && (
                          <span className="text-amber-300 flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3" /> Preparing auto-commit to main...
                          </span>
                        )}
                        {activeTurnIdx === 2 && (
                          <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                            <AlertTriangle className="w-3 h-3" /> Commit aborted by voice barge-in
                          </span>
                        )}
                        {activeTurnIdx >= 3 && (
                          <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" /> tsc --noEmit: 0 errors
                          </span>
                        )}
                        <span className="text-white/45">Port 3000</span>
                      </>
                    ) : (
                      <>
                        {activeTurnIdx >= 3 ? (
                          <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" /> TokenVerifierTest: 12/12 passed
                          </span>
                        ) : (
                          <span className="text-white/60 flex items-center gap-1.5">
                            <Play className="w-3 h-3" /> Positioned at line 64 (15m JWT TTL)
                          </span>
                        )}
                        <span className="text-white/45">Java 21</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Case C: Slack + Jira Windows Opening Live (Scenario 2) */}
          {showSlackAndJira && (
            <div className="flex-1 rounded-xl border border-white/15 bg-[#12141A] shadow-2xl overflow-hidden flex flex-col transition-all duration-200">
              <div className="flex items-center justify-between px-3 py-1.5 bg-[#181A22] border-b border-white/10 text-[10px] font-mono text-white/75 shrink-0">
                <div className="flex items-center gap-2">
                  <Hash className="w-3 h-3 text-white/60" />
                  <span className="font-semibold text-white">Slack — #engineering</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono border ${
                    activeTurnIdx >= 3
                      ? 'border-emerald-400/40 bg-emerald-400/15 text-emerald-300'
                      : 'border-white/15 bg-white/5 text-white/60'
                  }`}
                >
                  PAY-104: {activeTurnIdx >= 3 ? 'In Review ✓' : 'In Progress'}
                </span>
              </div>

              <div className="flex-1 p-3 flex flex-col justify-between gap-2 text-[11px] overflow-hidden">
                <div className="space-y-2">
                  <div className="text-white/55 text-[10px] font-mono">
                    Recent channel messages
                  </div>
                  {activeTurnIdx >= 3 ? (
                    <div className="p-2.5 rounded-lg bg-white/[0.06] border border-emerald-400/30 text-white/90 space-y-1 transition-all duration-200">
                      <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300">
                        <span>Ahmed (via VOID)</span>
                        <span>Sent just now ✓</span>
                      </div>
                      <p className="leading-snug text-white/85">
                        Payments update: fixed duplicate webhook retries, added Redis rate limiting, and updated error boundary tests. PAY-104 ready for review.
                      </p>
                    </div>
                  ) : (
                    <div className="p-2 rounded-lg bg-white/[0.03] border border-white/10 text-white/50 text-[10px] italic">
                      Draft staged in composer below — waiting for voice confirmation...
                    </div>
                  )}
                </div>

                {/* Slack Composer Box */}
                <div className="rounded-lg border border-white/15 bg-[#0D0F14] p-2 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-white/75 truncate">
                    {activeTurnIdx >= 3
                      ? 'Message #engineering...'
                      : 'Draft: Payments branch — webhook retries fixed, Redis rate limit added...'}
                  </span>
                  <Send className={`w-3.5 h-3.5 shrink-0 ${activeTurnIdx >= 3 ? 'text-white/30' : 'text-sky-300'}`} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANE (5 cols): Always-On Background Listening Terminal */}
        <div className="md:col-span-5 rounded-xl border border-white/15 bg-[#0B0C10]/95 shadow-2xl overflow-hidden flex flex-col min-h-0">
          {/* Terminal Top Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#15171E] border-b border-white/10 text-[10px] font-mono text-white/70 shrink-0">
            <div className="flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-white/60" />
              <span className="text-white/90">void-daemon — zsh</span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-white/55">
              {speakerState === 'user'
                ? 'LISTENING'
                : speakerState === 'barge-in'
                ? 'ABORT SIG'
                : speakerState === 'thinking'
                ? 'EXEC'
                : 'STREAM'}
            </span>
          </div>

          {/* Live Typed Command Stream */}
          <div ref={terminalScrollRef} className="flex-1 p-2.5 sm:p-3 space-y-1.5 overflow-y-auto">
            {terminalLines.map((line, index) => (
              <TypedLine
                key={line.id}
                line={line}
                animate={index >= terminalLines.length - 2}
                isPlaying={isPlaying}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
