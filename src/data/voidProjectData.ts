export interface VoidEngineeringColumn {
  number: string;
  title: string;
  summary: string;
  technicalPoints: string[];
}

export type VoidSpeaker = 'Ahmed' | 'VOID';

export interface VoidDialogueTurn {
  id: string;
  speaker: VoidSpeaker;
  roleLabel: string;
  text: string;
  speechStyle?: string;
  /** Tool calls executed right before or during this assistant response */
  toolCalls?: Array<{
    command: string;
    result: string;
  }>;
  /** Marks a live barge-in interruption where the user cuts off active assistant speech */
  isBargeIn?: boolean;
  /** Fallback estimated duration in seconds when calculating timeline scrubbing */
  estimatedSec: number;
}

export interface VoidTaskScenario {
  id: string;
  index: string;
  title: string;
  shortLabel: string;
  complexityTag: string;
  summary: string;
  turns: VoidDialogueTurn[];
}

export interface VoidProjectData {
  eyebrow: string;
  headline: string;
  title: string;
  subtitle: string;
  description: string;
  contributionLabel: string;
  contributionText: string;
  sourceUrl?: string;
  recordingUrl?: string;
  posterUrl: string;
  captionsUrl?: string;
  specs: { label: string; value: string }[];
  scenarios: VoidTaskScenario[];
  columnsHeading: string;
  columns: VoidEngineeringColumn[];
  architectureSummary: {
    overview: string;
    pipelineSteps: {
      phase: string;
      role: string;
      implementationNote: string;
    }[];
    designDecisions: {
      topic: string;
      rationale: string;
    }[];
  };
}

export const VOID_PROJECT_DATA: VoidProjectData = {
  eyebrow: "01 / INDEPENDENT PROJECT",
  headline: "Voice, turned into action.",
  title: "VOID",
  subtitle: "Real-time voice agent & orchestration interface",
  description:
    "A full-duplex voice interface that turns spoken developer commands into real actions—app launching, codebase searches, git workflows, and live barge-in interruption.",
  contributionLabel: "MY CONTRIBUTION",
  contributionText: "Interface, full-duplex orchestration, tool-execution router, and audio pipeline.",
  sourceUrl: "https://github.com/kauroah/void",
  recordingUrl: "/assets/videos/void-demo.mp4",
  posterUrl: "/assets/images/void_interface_poster.png",
  captionsUrl: "/assets/captions/void-demo.vtt",
  specs: [
    { label: "Audio Ingress", value: "Web Audio API (PCM + VAD)" },
    { label: "Transport", value: "Full-Duplex Streaming Sockets" },
    { label: "Persona", value: "Custom Voice Reference (Heisenberg)" },
    { label: "Interruption", value: "Deterministic Barge-in Drop" }
  ],
  scenarios: [
    {
      id: "workspace-setup-barge-in",
      index: "01",
      title: "Morning Workspace Boot & Mid-Sentence Barge-In",
      shortLabel: "01 · Workspace Setup & Barge-In",
      complexityTag: "Tool Execution + Mid-Stream Interrupt",
      summary:
        "Ahmed asks VOID to open his project workspace and check Git changes, then interrupts VOID mid-sentence before it accidentally commits unfinished files.",
      turns: [
        {
          id: "s1-t1",
          speaker: "Ahmed",
          roleLabel: "Ahmed (User)",
          text: "Hey VOID, open my portfolio project in VS Code, start the local dev server, and check my uncommitted changes.",
          speechStyle: "Natural, friendly young software engineer speaking conversationally",
          estimatedSec: 6.5,
        },
        {
          id: "s1-t2",
          speaker: "VOID",
          roleLabel: "VOID (Assistant)",
          toolCalls: [
            { command: "workspace.open('portfolio', app='vscode')", result: "Opened" },
            { command: "server.start(port=3000)", result: "Listening :3000" },
            { command: "git.status()", result: "3 modified files" }
          ],
          text: "Heisenberg online. What are we cooking today? Your workspace is open on port 3000. You have three modified files ready—let me go ahead and commit those to main—",
          speechStyle: "Deep, gravelly, calm, deliberate Heisenberg voice with dry confidence",
          estimatedSec: 9.0,
        },
        {
          id: "s1-t3",
          speaker: "Ahmed",
          roleLabel: "Ahmed (User · Barge-In)",
          isBargeIn: true,
          text: "Wait, hold on! Do not commit yet—just run the TypeScript check first.",
          speechStyle: "Quick, firm interruption",
          estimatedSec: 4.5,
        },
        {
          id: "s1-t4",
          speaker: "VOID",
          roleLabel: "VOID (Assistant)",
          toolCalls: [
            { command: "stream.abort('git.commit')", result: "Aborted in 12ms" },
            { command: "shell.run('npm run lint')", result: "0 errors (tsc)" }
          ],
          text: "Stopped. Commit cancelled. Running TypeScript check instead. All clean—zero errors. Ready when you are.",
          speechStyle: "Calm, gravelly, measured confirmation tone",
          estimatedSec: 6.5,
        }
      ]
    },
    {
      id: "commit-summary-slack",
      index: "02",
      title: "Git Summary & Team Slack Update",
      shortLabel: "02 · Git Summary & Slack Update",
      complexityTag: "Commit Summary + Confirmation Flow",
      summary:
        "Ahmed asks VOID to summarize recent commits on a feature branch, draft a quick team update, and send it only after verbal confirmation.",
      turns: [
        {
          id: "s2-t1",
          speaker: "Ahmed",
          roleLabel: "Ahmed (User)",
          text: "VOID, summarize my last three commits on the payments branch and draft a quick update for the engineering Slack.",
          speechStyle: "Clear, casual developer request",
          estimatedSec: 6.5,
        },
        {
          id: "s2-t2",
          speaker: "VOID",
          roleLabel: "VOID (Assistant)",
          toolCalls: [
            { command: "git.log(branch='payments', limit=3)", result: "3 commits found" },
            { command: "slack.draft('#engineering')", result: "Draft staged" }
          ],
          text: "Three commits since yesterday: fixed duplicate webhook retries, added Redis rate limiting, and updated unit tests. Draft is waiting in engineering Slack. Send it?",
          speechStyle: "Deep, gravelly, concise Heisenberg-inspired delivery",
          estimatedSec: 9.0,
        },
        {
          id: "s2-t3",
          speaker: "Ahmed",
          roleLabel: "Ahmed (User)",
          text: "Yes, send it, and move the ticket to Ready for Review.",
          speechStyle: "Short verbal confirmation",
          estimatedSec: 3.5,
        },
        {
          id: "s2-t4",
          speaker: "VOID",
          roleLabel: "VOID (Assistant)",
          toolCalls: [
            { command: "slack.post('#engineering')", result: "Posted" },
            { command: "jira.move('PAY-104', 'In Review')", result: "Updated" }
          ],
          text: "Sent. Ticket PAY-104 is now in review.",
          speechStyle: "Crisp, understated gravelly confirmation",
          estimatedSec: 3.5,
        }
      ]
    },
    {
      id: "focus-mode-code-jump",
      index: "03",
      title: "Focus Mode, File Search & Quick Test",
      shortLabel: "03 · Focus Timer & Code Search",
      complexityTag: "OS Control + Codebase Navigation",
      summary:
        "Ahmed puts his desktop into deep work mode, locates an auth token handler by voice, and jumps straight to the file and unit tests.",
      turns: [
        {
          id: "s3-t1",
          speaker: "Ahmed",
          roleLabel: "Ahmed (User)",
          text: "VOID, mute my notifications for 45 minutes and find where we check JWT expiration in the auth service.",
          speechStyle: "Direct, focused developer tone",
          estimatedSec: 6.0,
        },
        {
          id: "s3-t2",
          speaker: "VOID",
          roleLabel: "VOID (Assistant)",
          toolCalls: [
            { command: "os.set_dnd(minutes=45)", result: "Active (45m)" },
            { command: "code.search('verifyToken', 'auth-service')", result: "TokenVerifier.java:64" }
          ],
          text: "Notifications muted for 45 minutes. Token expiration is checked in TokenVerifier at line 64, currently using a 15-minute window.",
          speechStyle: "Calm, resonant, gravelly mentor voice",
          estimatedSec: 8.0,
        },
        {
          id: "s3-t3",
          speaker: "Ahmed",
          roleLabel: "Ahmed (User)",
          text: "Jump me to line 64 and run the auth unit tests.",
          speechStyle: "Quick command",
          estimatedSec: 3.5,
        },
        {
          id: "s3-t4",
          speaker: "VOID",
          roleLabel: "VOID (Assistant)",
          toolCalls: [
            { command: "editor.goto('TokenVerifier.java', line=64)", result: "Focused" },
            { command: "tests.run('TokenVerifierTest')", result: "12/12 passed" }
          ],
          text: "Opened line 64. All 12 auth tests passed cleanly. Keep cooking.",
          speechStyle: "Dry, calm Heisenberg signature closing",
          estimatedSec: 5.0,
        }
      ]
    }
  ],
  columnsHeading: "Behind the interaction",
  columns: [
    {
      number: "01",
      title: "Capture & barge-in",
      summary: "Microphone input with live interruption detection.",
      technicalPoints: [
        "Client-side Web Audio API capture sampled via AudioWorklet / PCM buffers",
        "Voice Activity Detection (VAD) to separate speech onset from ambient noise",
        "Immediate barge-in signal aborts active TTS playback when the user speaks"
      ]
    },
    {
      number: "02",
      title: "Orchestrate & execute",
      summary: "Tool-calling router and stateful model handoff.",
      technicalPoints: [
        "Full-duplex WebSocket session coordinating transcript turns and tool calls",
        "Structured function-calling boundaries guarding read vs. mutating operations",
        "Incremental context updates streamed directly without HTTP polling delays"
      ]
    },
    {
      number: "03",
      title: "Stream & visualize",
      summary: "Synchronized speech delivery and spatial feedback.",
      technicalPoints: [
        "Pluggable TTS synthesis (Fish Audio custom voice reference / multi-speaker TTS)",
        "Real-time FFT energy mapped into the 3D Fibonacci particle sphere posture",
        "Distinct visual states for listening, tool execution, speaking, and interrupt"
      ]
    }
  ],
  architectureSummary: {
    overview:
      "VOID decouples the deterministic visual renderer from an asynchronous full-duplex voice orchestration pipeline. Instead of treating voice as a turn-based text prompt with audio tacked on, every state—user speech intake, tool execution, assistant audio streaming, and mid-stream interruption—is modeled as a first-class transition.",
    pipelineSteps: [
      {
        phase: "Ingress & VAD",
        role: "Speech Capture & Interrupt Gate",
        implementationNote:
          "Continuous PCM frames enter a local energy gate. Detecting user vocal onset during active assistant output immediately trips the client barge-in cancel signal."
      },
      {
        phase: "Orchestration & Tools",
        role: "Duplex WebSocket Router",
        implementationNote:
          "Multiplexes partial speech transcripts, structured tool-call invocations, and cancellation tokens over a single persistent bidirectional socket."
      },
      {
        phase: "Synthesis & Sphere UI",
        role: "FFT-Driven Audio Output",
        implementationNote:
          "Spoken audio from custom voice references (Fish Audio / Gemini TTS) routes through an AnalyserNode so sphere wave displacement matches real vocal cadence."
      }
    ],
    designDecisions: [
      {
        topic: "Deterministic barge-in cancellation",
        rationale:
          "Real conversation overlaps. When incoming speech crosses the VAD threshold during assistant playback, the client immediately silences downstream audio buffers and dispatches an abort token so the agent pivots instead of finishing stale output."
      },
      {
        topic: "Pluggable voice synthesis personas",
        rationale:
          "Speech synthesis sits behind a clean provider contract—supporting custom Fish Audio voice cloning references alongside Gemini TTS and browser SpeechSynthesis fallback."
      }
    ]
  }
};
