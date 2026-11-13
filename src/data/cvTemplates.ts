export type TargetRole = 'flutter_ai' | 'flutter' | 'ai' | 'fullstack' | 'java';
export type BulletStyle = 'xyz' | 'concise';

export interface ResumeCompetencyRow {
  label: string;
  value: string;
}

export interface ResumeExperienceEntry {
  company: string;
  period: string;
  roleLocation: string;
  bullets: string[];
}

export interface ResumeProjectEntry {
  title: string;
  stack: string;
  bullets: string[];
}

export interface StructuredResumeData {
  roleTitle: string;
  subtitle: string;
  summary: string;
  competencies: ResumeCompetencyRow[];
  badges: string[];
  experiences: ResumeExperienceEntry[];
  projects: ResumeProjectEntry[];
  education: {
    institution: string;
    period: string;
    degree: string;
    note: string;
  }[];
  languages: string;
}

const ROLE_SUMMARIES: Record<
  TargetRole,
  { title: string; subtitle: string; summary: string; primarySkills: string }
> = {
  flutter_ai: {
    title: 'Flutter & Applied AI Engineer',
    subtitle:
      'Flutter SDK · Dart · BLoC / Clean Architecture · Gemini / LLM APIs · Voice Agents · MongoDB RAG · ONNX',
    summary:
      'Software Engineer specializing in cross-platform Flutter mobile systems and Applied Generative AI integration. Shipped production mobile apps published on Apple App Store, Google Play, and RuStore while accelerating Flutter rendering efficiency by 30% via BLoC state isolation. Built full-duplex AI voice agents (VOID), quantized ONNX medical imaging pipelines (<3s latency with Grad-CAM & local LLMs), and MongoDB Vector Search RAG architectures. Verified by 13 credentials from Google Cloud, MongoDB, and FreeAcademy AI.',
    primarySkills:
      'Flutter SDK, Dart, BLoC / Cubit, Clean Architecture, Gemini API, Real-Time Voice / VAD / TTS, MongoDB Atlas Vector Search (RAG), ONNX Runtime, Python, Firebase Firestore, TypeScript, Next.js, Node.js, PostgreSQL.',
  },
  flutter: {
    title: 'Lead Mobile & Flutter Systems Engineer',
    subtitle: 'Flutter SDK · Dart · BLoC / Cubit · Clean Architecture · Firebase · Published Apps',
    summary:
      'Mobile Software Engineer specializing in scalable client architecture using Flutter SDK, Dart, BLoC/Cubit, and Clean Architecture. Shipped commercial applications approved on Apple App Store, Google Play, and RuStore. Measured 30% rendering performance improvement through widget tree virtualization, memory caching, and immutable state isolation. Full-stack proficiency in Node.js, REST APIs, and Firebase backend integrations.',
    primarySkills:
      'Flutter SDK, Dart, BLoC, Cubit, Clean Architecture, Riverpod, REST APIs, Dio, Firebase Firestore, Push Notifications (FCM), Flutter Secure Storage, App Store / Google Play / RuStore Publishing, Node.js, PostgreSQL.',
  },
  ai: {
    title: 'Applied AI & Full-Stack Software Engineer',
    subtitle:
      'Gemini API · Voice Agents · MongoDB RAG · Vector Search · ONNX Runtime · Python · Next.js',
    summary:
      'Software Engineer specializing in applied generative AI systems, real-time voice agent orchestration, Retrieval-Augmented Generation (RAG) pipelines, and quantized model inference. Certified by Google Cloud in AI Studio Prototyping, MongoDB in Vector Search and Code Agents, and FreeAcademy AI in How LLMs Work and Prompt Engineering. Built VOID full-duplex voice agent and PneumoAI sub-3s ONNX diagnostic platform.',
    primarySkills:
      'Gemini API, Google AI Studio, Full-Duplex Voice / VAD / TTS, MongoDB Atlas Vector Search, RAG Pipelines, ONNX Runtime, Ollama (Qwen-2.5), Python, Next.js, TypeScript, Node.js, PostgreSQL, Docker.',
  },
  fullstack: {
    title: 'Senior Full-Stack & Mobile Developer',
    subtitle: 'Flutter · TypeScript · Next.js · Node.js · Java 21 / Spring Boot · PostgreSQL',
    summary:
      'Full-Stack & Mobile Software Engineer with production experience shipping cross-platform Flutter apps (Apple App Store, Google Play, RuStore), TypeScript/Next.js web applications, Applied AI integrations, and Java 21 / Spring Boot distributed services. Certified by Google Cloud, MongoDB, and FreeAcademy AI across 13 technical credentials.',
    primarySkills:
      'Flutter SDK, Dart, TypeScript, React 19, Next.js 15, Node.js, Express, Java 21, Spring Boot 3, PostgreSQL, MongoDB Atlas, Redis, Docker, RESTful APIs.',
  },
  java: {
    title: 'Java & Distributed Systems Developer',
    subtitle: 'Java 21 · Spring Boot 3 · Apache Kafka · RabbitMQ · PostgreSQL · Redis · Testcontainers',
    summary:
      'Backend Software Engineer experienced in resilient distributed server applications using Java 21, Spring Boot, Apache Kafka, RabbitMQ, and PostgreSQL alongside Flutter mobile client integration. Proven track record enforcing idempotent event processing, OAuth 2.0 / OIDC multi-tenant security, and Redis distributed locking.',
    primarySkills:
      'Java 21, Spring Boot 3, Spring Batch, Spring Security, Spring Data JPA, Hibernate, Apache Kafka, RabbitMQ, PostgreSQL, PostGIS, Redis, Docker, JUnit 5, Testcontainers, Micrometer, Prometheus, Gatling.',
  },
};

export function buildResumeData(
  targetRole: TargetRole,
  bulletStyle: BulletStyle
): StructuredResumeData {
  const roleMeta = ROLE_SUMMARIES[targetRole];
  const isXyz = bulletStyle === 'xyz';
  const isMobileOrAi =
    targetRole === 'flutter_ai' || targetRole === 'flutter' || targetRole === 'ai';

  const competencies: ResumeCompetencyRow[] = isMobileOrAi
    ? [
        { label: 'Core Stack', value: roleMeta.primarySkills },
        {
          label: 'Flutter & Mobile',
          value:
            'Flutter SDK, Dart, BLoC / Cubit, Clean Architecture, RxDart, Firebase Firestore & FCM, Flutter Secure Storage, App Store / Google Play / RuStore.',
        },
        {
          label: 'Applied AI & LLMs',
          value:
            'Gemini API, Google AI Studio, Full-Duplex Voice (VAD/TTS), MongoDB Atlas Vector Search (RAG), ONNX Runtime, Grad-CAM, Ollama (Qwen-2.5), Python.',
        },
        {
          label: 'Backend & Infra',
          value:
            'Node.js, Express, TypeScript, Next.js 15, Java 21, Spring Boot 3, PostgreSQL, Redis, Docker Compose, Git.',
        },
      ]
    : [
        { label: 'Core Stack', value: roleMeta.primarySkills },
        {
          label: 'Backend & Distributed',
          value:
            'Java 21, Spring Boot 3, Spring Batch, Spring Security, Node.js, Express, Apache Kafka, RabbitMQ, WebSocket.',
        },
        {
          label: 'Mobile & Applied AI',
          value:
            'Flutter SDK, Dart, BLoC/Cubit, Clean Architecture, Gemini API, MongoDB Vector Search (RAG), ONNX Runtime.',
        },
        {
          label: 'Databases & DevOps',
          value:
            'PostgreSQL, PostGIS, MongoDB Atlas, Redis, Firebase Firestore, Docker Compose, JUnit 5, Testcontainers, Prometheus.',
        },
      ];

  const badges = [
    'Google Cloud Skill Badges (2): Develop AI-Powered Prototypes in Google AI Studio (Credly: C34mJTu0) & Create Your First Gemini Enterprise Application | Nov 2026',
    'MongoDB Skill Badges (4): Building RAG Apps Using MongoDB (0ca8c49e), Resilient AI Strategy (ukc2g4FK), Schema Design Optimization (8e30ce61) & Building an App with Code Agents | Nov 2026',
    'FreeAcademy AI Certificates (7): Advanced Python Programming, How LLMs Actually Work, Prompt Engineering, Debug Any Code with AI, Figma AI Features, Canva AI, AI for Aerospace Engineers | Nov 2026',
  ];

  const foundersExp: ResumeExperienceEntry = {
    company: 'Founders',
    period: 'June 2025 – August 2026',
    roleLocation: 'Mobile & Full-Stack Engineer · Moscow, Russia',
    bullets: isXyz
      ? [
          'Architected the core mobile investment platform from the ground up using Flutter, Dart, BLoC/Cubit, and Clean Architecture across isolated Domain, Data, and Presentation layers.',
          'Accelerated client rendering and feed scrolling performance by 30% by refactoring widget trees, debouncing network searches via RxDart, and caching API payloads.',
          'Integrated REST APIs and Firebase Firestore for real-time deal-room sync, pre-onboarding KYC verification, and 30-participant encrypted messaging.',
          'Secured persistent user sessions with Flutter Secure Storage and JWT token rotation while delivering the production MVP 3 weeks ahead of baseline.',
        ]
      : [
          'Led Flutter Clean Architecture and BLoC/Cubit state management for a venture syndicate mobile platform.',
          'Boosted mobile UI rendering performance by 30% and maintained a 99.5% crash-free session rate.',
          'Integrated Firebase Firestore real-time deal rooms, REST APIs, and encrypted JWT session storage.',
        ],
  };

  const independentExp: ResumeExperienceEntry = {
    company: 'Independent Project Engineering',
    period: 'June 2026 – September 2026',
    roleLocation:
      targetRole === 'java'
        ? 'Distributed Systems & Java Backend Developer · Moscow, Russia'
        : 'Applied AI & Distributed Systems Engineer · Moscow, Russia',
    bullets:
      targetRole === 'java'
        ? isXyz
          ? [
              'Constructed a distributed task processing engine using Java 21, Spring Boot, and RabbitMQ, handling multi-threaded job dispatching via ExecutorService and CompletableFuture.',
              'Guaranteed 100% execution consistency across multi-node clusters using Redis distributed locks and PostgreSQL unique execution constraints.',
              'Cut failure diagnosis time by 40% with Micrometer instrumentation and Prometheus queue backlog telemetry, backed by Testcontainers integration suites.',
            ]
          : [
              'Engineered a fault-tolerant distributed background job platform using Java 21, Spring Boot, and RabbitMQ.',
              'Prevented duplicate execution across worker nodes via Redis distributed locks and PostgreSQL state recovery.',
              'Added Micrometer/Prometheus telemetry (-40% diagnosis time) and Testcontainers integration tests.',
            ]
        : isXyz
          ? [
              'Engineered asynchronous AI and backend orchestration pipelines pairing streaming audio/tool-execution APIs in TypeScript & Node.js with fault-tolerant worker queues (Java 21, Spring Boot, RabbitMQ).',
              'Guaranteed 100% execution consistency across concurrent background workers via Redis distributed locks and PostgreSQL state recovery after container restarts.',
              'Reduced failure diagnosis time by 40% via Micrometer/Prometheus telemetry and automated Testcontainers integration verification.',
            ]
          : [
              'Built streaming TypeScript/Node.js AI orchestration APIs and fault-tolerant background worker pipelines.',
              'Ensured zero duplicate job execution with Redis distributed locks, PostgreSQL recovery, and Prometheus metrics.',
            ],
  };

  const kfuExp: ResumeExperienceEntry = {
    company: 'Kazan Federal University (Enterprise & Research Projects)',
    period: 'January 2023 – June 2024',
    roleLocation: 'Software Engineer · Kazan, Russia',
    bullets:
      targetRole === 'java' || targetRole === 'fullstack'
        ? [
            'Centralized IAM Server: Built OAuth 2.0 / OIDC identity provider with Spring Authorization Server, multi-tenant RBAC, and Redis blacklist caching (-50% verification latency).',
            'Event-Driven Logistics: Engineered Apache Kafka order streaming with PostGIS geospatial dispatch, cutting courier assignment delays by 35% alongside WebSocket live updates.',
            'Resilient Payments & Booking: Implemented Transactional Outbox with Kafka Dead Letter Topics and PostgreSQL serializable locking verified at 2,500 req/sec via Gatling.',
          ]
        : [
            'Engineered enterprise Spring Boot microservices featuring OAuth 2.0 / OIDC multi-tenant RBAC (-50% Redis token check latency), Apache Kafka event streaming, and Transactional Outbox reliability.',
          ],
  };

  const voidProject: ResumeProjectEntry = {
    title: 'VOID — Real-Time Voice Agent & Developer Action Orchestrator',
    stack: 'Web Audio API (PCM + VAD), Full-Duplex Streaming, Gemini / Fish Audio TTS, TypeScript, Node.js',
    bullets: isXyz
      ? [
          'Built a full-duplex voice orchestration pipeline translating spoken commands into live VS Code, Git, Slack, and test-runner executions with real-time FFT feedback on a 3D particle interface.',
          'Engineered deterministic mid-sentence barge-in cancellation (<12ms abort signal) and dual-speaker synthesis via Fish Audio custom voice reference and Gemini TTS.',
        ]
      : [
          'Full-duplex voice agent turning developer speech into live IDE, Git, Slack, and test actions with 12ms barge-in interruption and FFT particle visualization.',
        ],
  };

  const adamEveProject: ResumeProjectEntry = {
    title: 'Adam & Eve — Production Flutter Commerce Platform (3 Stores Live)',
    stack: 'Flutter SDK, Dart, Node.js, PostgreSQL, Firebase Cloud Messaging (FCM), Payment Gateways',
    bullets: isXyz
      ? [
          'Built and launched a multi-store Flutter mobile commerce application simultaneously verified and published on Apple App Store, Google Play, and RuStore (<1.2s cold start).',
          'Implemented ACID inventory reservations in PostgreSQL, idempotent payment webhooks (99.8% order reliability), and real-time FCM delivery status push alerts.',
        ]
      : [
          'Cross-platform Flutter commerce app published on Apple App Store, Google Play, and RuStore with PostgreSQL ACID inventory and FCM order tracking.',
        ],
  };

  const pneumoProject: ResumeProjectEntry = {
    title: 'PneumoAI — Medical Chest X-Ray Inference & Diagnostic Platform (B.Sc. Thesis)',
    stack: 'ONNX Runtime (DenseNet121), Grad-CAM, Qwen-2.5-7B (Ollama), Next.js 15, TypeScript, Python, PostgreSQL',
    bullets: isXyz
      ? [
          'Trained 5 CNN architectures on 5,856 Kermany radiographs; exported DenseNet121 (0.97 F1-score, 96% accuracy) to ONNX Runtime for sub-3-second CPU inference without GPU dependency.',
          'Integrated Grad-CAM heatmaps, automated CURB-65 severity scoring, and offline Qwen-2.5-7B diagnostic explanations keeping 100% of patient data on-premise.',
        ]
      : [
          'Clinical radiograph diagnosis achieving 0.97 F1-score in <3s on CPU via ONNX DenseNet121, Grad-CAM heatmaps, and local Qwen LLM clinical reports.',
        ],
  };

  const orchestratorProject: ResumeProjectEntry = {
    title: 'Distributed Background Job Engine & Transactional Outbox Microservices',
    stack: 'Java 21, Spring Boot 3, Apache Kafka, RabbitMQ, Redis, PostgreSQL, Testcontainers',
    bullets: isXyz
      ? [
          'Engineered multi-node background task orchestration with Redis Redlock and Transactional Outbox CDC polling, achieving 0% duplicate executions and 100% SIGTERM state recovery.',
        ]
      : [
          'Distributed Java 21 / Kafka / RabbitMQ worker engine guaranteeing zero duplicate execution and full crash recovery.',
        ],
  };

  const experiences =
    targetRole === 'java'
      ? [independentExp, foundersExp, kfuExp]
      : [foundersExp, independentExp, kfuExp];

  const projects =
    targetRole === 'flutter'
      ? [adamEveProject, voidProject, pneumoProject]
      : targetRole === 'ai'
        ? [voidProject, pneumoProject, adamEveProject]
        : targetRole === 'java'
          ? [orchestratorProject, pneumoProject, voidProject]
          : targetRole === 'fullstack'
            ? [voidProject, adamEveProject, pneumoProject]
            : [voidProject, adamEveProject, pneumoProject];

  return {
    roleTitle: roleMeta.title,
    subtitle: roleMeta.subtitle,
    summary: roleMeta.summary,
    competencies,
    badges,
    experiences,
    projects,
    education: [
      {
        institution: 'RTU MIREA (Russian Technological University)',
        period: '2026 – 2028 (Year 1)',
        degree:
          "Master's Degree in Software Engineering (Information Systems Architecture) · Moscow, Russia",
        note: 'Awarded competitive Russian Federation State Quota Scholarship for academic merit. Focus: Vector Search/RAG & Distributed Systems.',
      },
      {
        institution: 'Kazan Federal University (Higher Institute of ITIS)',
        period: '2022 – 2026',
        degree: "Bachelor's Degree in Software Engineering & Intelligent Systems · Kazan, Russia",
        note: 'Defended ML medical imaging thesis (PneumoAI) with distinction; core focus on mobile systems, concurrency, and relational theory.',
      },
    ],
    languages:
      'Arabic: Native proficiency  |  English: C1 (Advanced / Professional)  |  Russian: C1 (Advanced / Professional)',
  };
}
