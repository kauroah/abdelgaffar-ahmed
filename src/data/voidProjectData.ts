export interface VoidEngineeringColumn {
  number: string;
  title: string;
  summary: string;
  technicalPoints: string[];
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
  specs: { label: string; value: string; }[];
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
  subtitle: "Real-time voice assistant",
  description: "A voice interface connecting speech recognition, language-model responses and streamed audio.",
  contributionLabel: "MY CONTRIBUTION",
  contributionText: "Interface, orchestration and audio pipeline.",
  sourceUrl: "https://github.com/kauroah/void",
  recordingUrl: "/assets/videos/void-demo.mp4",
  posterUrl: "/assets/images/void_interface_poster.png",
  captionsUrl: "/assets/captions/void-demo.vtt",
  specs: [
    { label: "Audio Ingress", value: "Web Audio API (48kHz PCM)" },
    { label: "Transport", value: "Full-Duplex Streaming Sockets" },
    { label: "Interface", value: "Real-Time Particle Soundwave" },
    { label: "Interruption", value: "Zero-Latency Barge-in Drop" }
  ],
  columnsHeading: "Behind the interaction",
  columns: [
    {
      number: "01",
      title: "Capture & transcribe",
      summary: "Microphone input to recognized speech.",
      technicalPoints: [
        "Client-side Web Audio API capture sampled at 16kHz/48kHz PCM",
        "Voice Activity Detection (VAD) to delimit utterance boundaries",
        "Low-latency streaming chunks dispatched over bidirectional WebSocket"
      ]
    },
    {
      number: "02",
      title: "Process & respond",
      summary: "Request orchestration and model response.",
      technicalPoints: [
        "Full-duplex orchestration layer routing user intent tokens",
        "Language-model prompt grounding with structured system context",
        "Streaming response generation with early chunk pipeline handover"
      ]
    },
    {
      number: "03",
      title: "Stream & play",
      summary: "Generated speech delivered to the interface.",
      technicalPoints: [
        "Streaming text-to-speech audio chunks buffered for uninterrupted playback",
        "Real-time audio frequency visualization synchronized with canvas particles",
        "Interruption handling allowing user voice barge-in to cancel active streams"
      ]
    }
  ],
  architectureSummary: {
    overview: "VOID decouples synchronous UI rendering from the asynchronous multi-stage audio processing pipeline. The architecture is built around event-driven streaming sockets to minimize time-to-first-audible-byte.",
    pipelineSteps: [
      {
        phase: "Ingress",
        role: "Audio Buffer & VAD",
        implementationNote: "Standardized AudioContext processing node feeding continuous raw PCM audio frames into a speech boundary detector."
      },
      {
        phase: "Orchestration",
        role: "Duplex WebSocket Gateway",
        implementationNote: "Bidirectional stream multiplexing transcription tokens, model generation, and audio synthesis without HTTP handshake overhead."
      },
      {
        phase: "Synthesis & Egress",
        role: "Buffered Audio Playback",
        implementationNote: "Streaming chunks decode progressively via Web Audio API AudioBufferSourceNode with backpressure management."
      }
    ],
    designDecisions: [
      {
        topic: "Barge-in cancellation",
        rationale: "When incoming mic energy indicates user speech during active assistant playback, the client immediately drops the downstream audio buffer and notifies the orchestrator to abort generation."
      },
      {
        topic: "Configurable model providers",
        rationale: "Speech-to-text, reasoning, and speech synthesis services are abstracted behind provider-agnostic interfaces to permit pluggable backend configurations."
      }
    ]
  }
};
