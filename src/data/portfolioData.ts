export interface BadgeItem {
  id: string;
  title: string;
  issuer: 'Google Cloud' | 'MongoDB' | 'FreeAcademy AI';
  category:
    | 'AI & Generative Models'
    | 'Database Architecture'
    | 'Cloud & Systems'
    | 'Programming & Development'
    | 'AI & Design Tools'
    | 'AI in Engineering';
  date: string;
  badgeImage: string;
  pdfPath?: string;
  verifyUrl: string;
  credentialId?: string;
  description: string;
  keySkills: string[];
  highlight: boolean;
}

export interface EducationItem {
  degree: string;
  major: string;
  institution: string;
  location: string;
  period: string;
  status: string;
  honors?: string;
  highlights: string[];
}

export interface CaseStudyProject {
  id: string;
  title: string;
  category: 'Distributed Systems' | 'Mobile Architecture' | 'Applied AI / RAG' | 'Microservices';
  domain: string;
  role: string;
  architecturePattern: string;
  problemStatement: string;
  systemDecisions: string[];
  concurrencyAndConsistency: string;
  technologies: string[];
  benchmarkedMetrics: {
    metric: string;
    impact: string;
    baselineComparison?: string;
  }[];
  links: {
    github?: string;
    gitlab?: string;
    demo?: string;
    appStore?: string;
    googlePlay?: string;
    ruStore?: string;
    thesisPdf?: string;
    pitchDeckPdf?: string;
    specPdf?: string;
  };
  icon?: string;
  screenshots?: {
    url: string;
    caption?: string;
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  summary: string;
  stack: string[];
  achievements: string[]; // Strict X-Y-Z formula bullets
}

export interface EcosystemNode {
  id: string;
  layer: 'Client Ingress' | 'Security & Ingress Gateway' | 'Async Event & Queue Broker' | 'Persistence & Vector Search' | 'Observability & Testing Harness';
  title: string;
  primaryTech: string[];
  roleInProduction: string;
  upstreamConnections: string[];
  downstreamConnections: string[];
  architecturalGuarantees: string;
}

export const PROFILE_DATA = {
  firstName: "Ahmed",
  lastName: "Abdelgaffar",
  fullName: "Ahmed Abdelhady Mohamed Abdelgaffar",
  systemIdentity: "Flutter & Applied AI Systems Engineer",
  technicalHeadline: "Engineering production Flutter mobile apps, real-time voice agents, and applied AI systems backed by scalable APIs.",
  location: "Moscow, Russia",
  citizenship: "Egypt, Russia (Work permit: Russian Federation)",
  photoUrl: "/assets/aistudio/id_image_with_glasses_c91ad6c5.jpg",
  contact: {
    email: "kauroah@gmail.com",
    secondaryEmail: "ahmedabdelhady0246@gmail.com",
    phone: "+7 (996) 846-9573",
    telegram: "@xrotw",
    telegramUrl: "https://t.me/xrotw",
    github: "kauroah",
    githubUrl: "https://github.com/kauroah",
    credly: "ahmed-abdelgaffar",
    credlyUrl: "https://www.credly.com/users/ahmed-abdelgaffar",
    setkaUrl: "https://set.ki/account/gZJdg6m",
  },
  metrics: [
    { label: "Mobile Render Efficiency", value: "+30%", detail: "Heap allocation & rebuild reduction via BLoC isolation" },
    { label: "Industry Credentials", value: "13", detail: "MongoDB, Google Cloud & FreeAcademy AI verified" },
    { label: "App Store Deployments", value: "3", detail: "Apple App Store, Google Play, RuStore releases" },
    { label: "Language Proficiencies", value: "3", detail: "Arabic (Native), English (C1), Russian (C1)" },
  ],
  languages: [
    { name: "Arabic", level: "Native proficiency", code: "AR", detail: "Native speaker" },
    { name: "English", level: "C1 — Advanced", code: "EN", detail: "Full professional & technical communication" },
    { name: "Russian", level: "C1 — Advanced", code: "RU", detail: "Full professional & technical communication" },
  ],
  education: [
    {
      degree: "Master's Degree in Software Engineering",
      major: "Information Systems Architecture",
      institution: "RTU MIREA (Russian Technological University)",
      location: "Moscow, Russia",
      period: "2026 – 2028 (Year 1)",
      status: "Currently Enrolled (Master's Degree Candidate)",
      honors: "Awarded a state-funded quota under the Russian Federation government allocation for international academic merit (Ministry of Science and Higher Education of Russia).",
      highlights: [
        "Distributed systems consensus protocols, transaction isolation models, and distributed state machines.",
        "High-throughput asynchronous event topologies (Kafka partition balancing, broker fault tolerance).",
        "Integration patterns between enterprise relational backends and vector similarity stores (MongoDB Vector Search, RAG)."
      ]
    },
    {
      degree: "Bachelor's Degree in Software Engineering",
      major: "Software Engineering & Intelligent Systems",
      institution: "Kazan Federal University (KFU)",
      location: "Kazan, Russia",
      period: "2022 – 2026",
      status: "Graduated with High Academic Standing",
      honors: "Higher Institute of Information Technologies and Intelligent Systems (ITIS)",
      highlights: [
        "Bachelor's Thesis (ВКР): 'Development of a Web Service for Diagnosis and Risk Assessment of Pneumonia from Chest X-Rays and Clinical Data Using Machine Learning (PneumoAI)' — Defended with distinction (Supervised by Ph.D. A.I. Mukhamedzhanov).",
        "Core computer science curriculum: operating system concurrency, lock-free structures, compiler internals, relational database normal forms.",
        "Engineering enterprise microservice prototypes with Spring Authorization Server, Kafka event coordination, and PostGIS geospatial indexing.",
        "Automated software quality workflows: integration testing with Testcontainers, load simulation via Gatling, and CI/CD pipelines."
      ]
    }
  ] as EducationItem[],
  badges: [
    {
      id: "google-ai-studio",
      title: "Develop AI-Powered Prototypes in Google AI Studio",
      issuer: "Google Cloud",
      category: "AI & Generative Models",
      date: "Nov 07, 2026",
      badgeImage: "/assets/aistudio/develop-ai-powered-prototypes-in-google-ai-studio_0312b366.png",
      pdfPath: "/assets/aistudio/DevelopAI-PoweredPrototypesinGoogleAIStudio_Badge20261108-20-39f0j5_e15d90d2.pdf",
      verifyUrl: "https://www.credly.com/go/C34mJTu0",
      credentialId: "C34mJTu0",
      description: "Validation of generative AI prototyping using Google AI Studio and Gemini multimodal models, prompt engineering, structured JSON schemas, and API integration.",
      keySkills: ["Google AI Studio", "Gemini API", "Prompt Engineering", "Multimodal Reasoning", "API Prototyping"],
      highlight: true
    },
    {
      id: "google-gemini-enterprise",
      title: "Create Your First Gemini Enterprise Application",
      issuer: "Google Cloud",
      category: "AI & Generative Models",
      date: "Nov 2026",
      badgeImage: "/assets/aistudio/create-your-first-gemini-enterprise-application_871c6260.png",
      verifyUrl: "https://www.credly.com/users/ahmed-abdelgaffar",
      description: "Validation of enterprise generative system design using Google Cloud Gemini models, enterprise data grounding, and vector integration.",
      keySkills: ["Gemini Enterprise", "Cloud Architecture", "Enterprise AI Workflows", "Vector Grounding"],
      highlight: true
    },
    {
      id: "mongodb-rag",
      title: "Building RAG Apps Using MongoDB",
      issuer: "MongoDB",
      category: "AI & Generative Models",
      date: "Nov 08, 2026",
      badgeImage: "/assets/aistudio/building-rag-apps-using-mongodb_6db742c5.png",
      pdfPath: "/assets/aistudio/SkillsCert20261108-20-7qqxcp_54238565.pdf",
      verifyUrl: "https://www.credly.com/badges/0ca8c49e-ba32-4458-bec8-26c4810ec69f",
      credentialId: "0ca8c49e-ba32-4458-bec8-26c4810ec69f",
      description: "Hands-on implementation of Retrieval-Augmented Generation (RAG) using MongoDB Atlas Vector Search, semantic chunking, vector embeddings, and context-window injection.",
      keySkills: ["MongoDB Vector Search", "RAG Architecture", "Semantic Search", "LLM Embeddings", "Context Pipelines"],
      highlight: true
    },
    {
      id: "mongodb-ai-strategy",
      title: "AI and Innovation: How MongoDB Enables a Resilient AI Strategy",
      issuer: "MongoDB",
      category: "Database Architecture",
      date: "Nov 08, 2026",
      badgeImage: "/assets/aistudio/ai-and-innovation-how-mongodb-enables-a-resilient-a_ca788c97.png",
      pdfPath: "/assets/aistudio/AIandInnovationHowMongoDBEnablesaResilientAIStrategy_Badge20261108-20-wvu1ps_a644e4e3.pdf",
      verifyUrl: "https://www.credly.com/go/ukc2g4FK",
      credentialId: "ukc2g4FK",
      description: "Architectural qualification in structuring unified, high-availability operational data architectures for enterprise AI systems and live streaming ingestion.",
      keySkills: ["Resilient AI Architecture", "Unified Data Strategy", "High Availability", "Real-time Operations"],
      highlight: true
    },
    {
      id: "mongodb-schema-opt",
      title: "MongoDB Schema Design Optimization",
      issuer: "MongoDB",
      category: "Database Architecture",
      date: "Nov 08, 2026",
      badgeImage: "/assets/aistudio/mongodb-schema-design-optimization-skill-badge_bb9d7b54.png",
      pdfPath: "/assets/aistudio/SkillsCert20261108-20-avms7k_599a63e3.pdf",
      verifyUrl: "https://www.credly.com/badges/8e30ce61-6851-4b23-87b0-b84a634ffa1f",
      credentialId: "8e30ce61-6851-4b23-87b0-b84a634ffa1f",
      description: "Advanced validation of document modeling design patterns, compound index strategies, aggregation pipeline stages, and query plan profiling.",
      keySkills: ["Schema Design Patterns", "Index Optimization", "Aggregation Pipelines", "Query Profiling", "Document Modeling"],
      highlight: true
    },
    {
      id: "mongodb-code-agents",
      title: "Building an App with Code Agents and MongoDB",
      issuer: "MongoDB",
      category: "AI & Generative Models",
      date: "Nov 2026",
      badgeImage: "/assets/aistudio/building-an-app-with-code-agents-and-mongodb_ac6bcf0a.png",
      verifyUrl: "https://www.credly.com/users/ahmed-abdelgaffar",
      description: "Designing autonomous agent systems that leverage tool-use protocols, schema introspection, and automated verification loops over database operational layers.",
      keySkills: ["AI Code Agents", "Tool Calling / Function Calling", "Atlas Data API", "Autonomous Workflows"],
      highlight: false
    },
    {
      id: "freeacademy-advanced-python",
      title: "Advanced Python Programming",
      issuer: "FreeAcademy AI",
      category: "Programming & Development",
      date: "Nov 13, 2026",
      badgeImage: "/assets/certificates/freeacademy-advanced-python.jpg",
      pdfPath: "/assets/aistudio/Advanced_Python_Programming_-_Certificate_d990c942.pdf",
      verifyUrl: "https://freeacademy.ai/verify/FA-2026-APP-PW1QHX",
      credentialId: "FA-2026-APP-PW1QHX",
      description: "Certificate in advanced Python programming, covering language features and practical software development.",
      keySkills: ["Python", "Object-Oriented Programming", "Data Structures", "Debugging", "Software Development"],
      highlight: true
    },
    {
      id: "freeacademy-how-llms-work",
      title: "How LLMs Actually Work",
      issuer: "FreeAcademy AI",
      category: "AI & Generative Models",
      date: "Nov 13, 2026",
      badgeImage: "/assets/certificates/freeacademy-how-llms-work.jpg",
      pdfPath: "/assets/aistudio/How_LLMs_Work_-_Certificate_3950364a.pdf",
      verifyUrl: "https://freeacademy.ai/verify/FA-2026-MHLW-27M17O",
      credentialId: "FA-2026-MHLW-27M17O",
      description: "Course certificate covering the core concepts behind large language models and how they generate text.",
      keySkills: ["Large Language Models", "Tokenization", "Transformer Architecture", "Text Generation", "Generative AI"],
      highlight: true
    },
    {
      id: "freeacademy-figma-ai",
      title: "Figma AI: Design Faster",
      issuer: "FreeAcademy AI",
      category: "AI & Design Tools",
      date: "Nov 12, 2026",
      badgeImage: "/assets/certificates/freeacademy-figma-ai.jpg",
      pdfPath: "/assets/aistudio/Figma_AI_Features_-_Certificate_43583b8e.pdf",
      verifyUrl: "https://freeacademy.ai/verify/FA-2026-MFAF-JK0NIM",
      credentialId: "FA-2026-MFAF-JK0NIM",
      description: "Course certificate on using Figma AI features to accelerate interface design and prototyping workflows.",
      keySkills: ["Figma", "AI-Assisted Design", "UI Design", "Prototyping", "Design Workflow"],
      highlight: false
    },
    {
      id: "freeacademy-canva-ai",
      title: "Canva AI for Non-Designers",
      issuer: "FreeAcademy AI",
      category: "AI & Design Tools",
      date: "Nov 12, 2026",
      badgeImage: "/assets/certificates/freeacademy-canva-ai.jpg",
      pdfPath: "/assets/aistudio/Canva_AI_For_Non_Designers_-_Certificate_6bd27ca3.pdf",
      verifyUrl: "https://freeacademy.ai/verify/FA-2026-MCAF-DA1STY",
      credentialId: "FA-2026-MCAF-DA1STY",
      description: "Course certificate on using Canva AI tools to create and refine visual content without a professional design background.",
      keySkills: ["Canva", "AI-Assisted Design", "Visual Content", "Graphic Design", "Generative AI"],
      highlight: false
    },
    {
      id: "freeacademy-debug-code-ai",
      title: "Debug Any Code with AI",
      issuer: "FreeAcademy AI",
      category: "Programming & Development",
      date: "Nov 12, 2026",
      badgeImage: "/assets/certificates/freeacademy-debug-code-ai.jpg",
      pdfPath: "/assets/aistudio/Debug_Code_With_AI_-_Certificate_e4edea94.pdf",
      verifyUrl: "https://freeacademy.ai/verify/FA-2026-MDCW-L9E6KS",
      credentialId: "FA-2026-MDCW-L9E6KS",
      description: "Course certificate on applying AI tools to investigate software defects and support debugging workflows.",
      keySkills: ["AI-Assisted Debugging", "Root Cause Analysis", "Prompting", "Code Review", "Software Troubleshooting"],
      highlight: true
    },
    {
      id: "freeacademy-aerospace-ai",
      title: "AI for Aerospace Mechanical Engineers",
      issuer: "FreeAcademy AI",
      category: "AI in Engineering",
      date: "Nov 12, 2026",
      badgeImage: "/assets/certificates/freeacademy-aerospace-ai.jpg",
      pdfPath: "/assets/aistudio/AI_For_Aerospace_Mechanical_Engineers_-_Certificate_bf095b4b.pdf",
      verifyUrl: "https://freeacademy.ai/verify/FA-2026-AFAM-79GNLW",
      credentialId: "FA-2026-AFAM-79GNLW",
      description: "Course certificate exploring applications of artificial intelligence in aerospace and mechanical engineering contexts.",
      keySkills: ["Artificial Intelligence", "Aerospace Engineering", "Mechanical Engineering", "Engineering Applications", "Applied AI"],
      highlight: false
    },
    {
      id: "freeacademy-prompt-engineering",
      title: "Prompt Engineering Course",
      issuer: "FreeAcademy AI",
      category: "AI & Generative Models",
      date: "Nov 08, 2026",
      badgeImage: "/assets/certificates/freeacademy-prompt-engineering.jpg",
      pdfPath: "/assets/aistudio/Prompt_Engineering_-_Certificate_b1c5d7d4.pdf",
      verifyUrl: "https://freeacademy.ai/verify/FA-2026-PE-AOE5VO",
      credentialId: "FA-2026-PE-AOE5VO",
      description: "Course certificate in writing and refining prompts for clearer, more useful outputs from generative AI systems.",
      keySkills: ["Prompt Engineering", "Generative AI", "Instruction Design", "LLM Interaction", "Output Evaluation"],
      highlight: true
    }
  ] as BadgeItem[],

  // Ecosystem Topology: How the components interconnect in a production environment
  ecosystemTopology: [
    {
      id: "node-client",
      layer: "Client Ingress",
      title: "Client Application Tier",
      primaryTech: ["Flutter SDK (Dart)", "Next.js 15 (React 19, TypeScript)", "Tailwind CSS"],
      roleInProduction: "Executes client-side business logic, optimistic UI mutations, and state management. Flutter provides cross-platform mobile binaries compiled for iOS and Android with BLoC/Cubit state stores; Next.js handles server-rendered dashboards and client-side data streaming.",
      upstreamConnections: ["External Mobile Users", "Web Browser Clients"],
      downstreamConnections: ["Security & Ingress Gateway (REST / WebSocket)"],
      architecturalGuarantees: "Sub-16ms frame render targets (60fps), offline-first memory caching, secure token persistence via platform-native keychains."
    },
    {
      id: "node-gateway",
      layer: "Security & Ingress Gateway",
      title: "Identity Provider & Edge Gateway",
      primaryTech: ["Spring Boot 3", "Spring Security", "Spring Authorization Server", "OAuth 2.0 / OIDC", "JWT"],
      roleInProduction: "Terminates client requests, enforces cryptographic JWT signature validation, issues scoped access tokens, and validates tenant boundaries and role-based permissions (RBAC) before dispatching to downstream business services.",
      upstreamConnections: ["Client Application Tier"],
      downstreamConnections: ["Async Event & Queue Broker", "Persistence & Vector Search", "Distributed Caching"],
      architecturalGuarantees: "Stateless horizontal scaling, cryptographic token revocation via Redis blacklist verification in <2ms, strict multi-tenant boundary checks."
    },
    {
      id: "node-messaging",
      layer: "Async Event & Queue Broker",
      title: "Event Streaming & Background Dispatch",
      primaryTech: ["Apache Kafka", "RabbitMQ", "Spring Batch", "Spring Boot Workers"],
      roleInProduction: "Decouples synchronous HTTP ingress from heavy background computation. RabbitMQ manages job distribution and worker retries with TTLs; Kafka acts as an append-only distributed event log for order lifecycles and payment transitions.",
      upstreamConnections: ["Security & Ingress Gateway", "Core Java Microservices"],
      downstreamConnections: ["Batch Processing Workers", "Persistence Layer", "Dead Letter Topics"],
      architecturalGuarantees: "At-least-once message delivery via Transactional Outbox pattern, consumer idempotency keys, poison message isolation into Dead Letter Topics."
    },
    {
      id: "node-storage",
      layer: "Persistence & Vector Search",
      title: "Relational, Document & Vector Storage",
      primaryTech: ["PostgreSQL (ACID, PostGIS)", "MongoDB Atlas (Vector Search)", "Redis (Cluster)"],
      roleInProduction: "PostgreSQL manages relational integrity, financial ledgers, and geospatial indexing with PostGIS. MongoDB Atlas manages document catalogs and high-dimensional vector embeddings for RAG retrieval. Redis serves as distributed lock manager and L2 query cache.",
      upstreamConnections: ["Security Gateway", "Worker Nodes", "Async Event Brokers"],
      downstreamConnections: ["Prometheus Exporters", "Backup Replicas"],
      architecturalGuarantees: "Strict serializable isolation for transactional booking/payments, Redlock distributed locking for horizontal worker concurrency, indexed sub-10ms query execution."
    },
    {
      id: "node-observability",
      layer: "Observability & Testing Harness",
      title: "Telemetry & Automated Verification",
      primaryTech: ["Micrometer", "Prometheus", "Docker Compose", "JUnit 5", "Testcontainers", "Gatling"],
      roleInProduction: "Instruments business microservices with application metrics, scrapes queue backlog depths and response latencies, and provides isolated containerized test environments that spin up PostgreSQL and RabbitMQ instances during CI pipelines.",
      upstreamConnections: ["All Microservices & Message Brokers"],
      downstreamConnections: ["Grafana Dashboards", "CI/CD Deployment Gateways"],
      architecturalGuarantees: "Real-time queue depth and error rate alerting; 100% reproducible integration tests preventing regression leaks into production."
    }
  ] as EcosystemNode[],

  // Architectural Case Studies & System Design Overviews (Flutter & AI prioritized first)
  caseStudies: [
    {
      id: "case-founders-mobile",
      title: "Founders — Social Network & Syndicate Deal-Flow Platform",
      category: "Mobile Architecture",
      domain: "Venture Capital & Entrepreneur Social Network",
      role: "Lead Flutter Architect & Full-Stack Engineer",
      architecturePattern: "Clean Architecture (Domain/Data/Presentation) with Reactive BLoC State Management",
      problemStatement: "Entrepreneurs and international syndicate investors require vetted partnerships and deal syndication without spam or unqualified cold outreach, while requiring strict pre-registration KYC screening, encrypted anonymity options, and high-performance mobile deal-flow synchronization.",
      systemDecisions: [
        "Architected strict Clean Architecture boundaries with independent Domain (Entities, Use Cases), Data (Repositories, Data Sources), and Presentation (BLoC, Cubits, Screens) layers across Flutter SDK.",
        "Built two-tier community feed architecture dividing real-time business requests (partnerships, distributors, business sales) from moderated investment project syndications.",
        "Designed multi-tag partner search engine with color-coded industry taxonomy (Real Estate, Finance, IT, Manufacturing, Legal) with sub-16ms scrolling across member directories.",
        "Implemented pre-onboarding KYC verification pipeline with 10-minute administrative callback loop and privacy-preserving profile encryption allowing founders to conceal sensitive identity while verified.",
        "Constructed group messaging architecture supporting up to 30 participants with real-time delivery status tracking and encrypted local session storage via Flutter Secure Storage."
      ],
      concurrencyAndConsistency: "Unidirectional data flow enforcing immutable state objects. Network requests debounced via RxDart switchMap operators to prevent out-of-order race conditions on search and filter operations.",
      technologies: ["Flutter SDK", "Dart", "BLoC/Cubit", "Clean Architecture", "Firebase Firestore", "REST APIs", "Dio", "JWT", "Flutter Secure Storage"],
      benchmarkedMetrics: [
        { metric: "Application Rendering Performance", impact: "+30%", baselineComparison: "Reduced frame drops and GPU memory footprint across deal lists" },
        { metric: "Session Crash-Free Rate", impact: "99.5%", baselineComparison: "Maintained through global exception boundaries and offline fallbacks" },
        { metric: "MVP Delivery Timeline", impact: "Shipped on schedule", baselineComparison: "Accelerated development by 3 weeks using modular feature modules" }
      ],
      links: {
        github: "https://github.com/kauroah"
      },
      icon: "/assets/images/founders_logo.png",
      screenshots: [
        { url: "/assets/projects/founders/screen1_feed.jpg", caption: "Business Requests & Deal Flow Feed (Лента деловых запросов)" },
        { url: "/assets/projects/founders/screen2_search.jpg", caption: "Verified Founder & Partner Search (Поиск людей с фильтрами)" },
        { url: "/assets/projects/founders/screen3_syndicate_detail.jpg", caption: "Syndicate Deal & Request Details (Категории и классификация)" }
      ]
    },
    {
      id: "case-pneumo-ai",
      title: "PneumoAI — Medical Image Inference & Diagnostic Platform",
      category: "Applied AI / RAG",
      domain: "Healthcare Technology / Clinical Radiographic Intelligence",
      role: "Applied AI & Full-Stack Engineer (Bachelor's Thesis, KFU)",
      architecturePattern: "DenseNet121 ONNX Inference + Grad-CAM XAI + CURB-65 Risk Stratification + Offline Qwen-2.5-7B (Ollama)",
      problemStatement: "Early-stage pneumonia detection on chest radiographs presents diagnostic ambiguity under clinical workloads, risks critical false negatives, and requires explainable anatomical localization and physiological severity scoring without leaking sensitive patient data to external clouds.",
      systemDecisions: [
        "Trained and benchmarked 5 neural architectures (DenseNet121, EfficientNetB0, ResNet50, MobileNetV2, and custom 7.7M-param CNN) on the Kaggle Kermany Chest X-Ray dataset (5,856 studies); DenseNet121 achieved top performance (0.96 Accuracy, 0.96 Precision, 0.95 Recall, 0.97 F1-score).",
        "Exported the trained Keras model to ONNX via tf2onnx, engineering sub-3-second CPU-quantized inference with ONNX Runtime and Sharp image preprocessing, eliminating GPU infrastructure overhead.",
        "Implemented Grad-CAM (Gradient-Weighted Class Activation Mapping) on DenseNet121 convolutional feature maps, rendering JET-colormap heatmaps directly onto radiographs to localize inflammatory lung consolidations.",
        "Engineered an automated CURB-65 clinical severity calculator (Confusion, Urea > 7mmol/L, Respiratory Rate >= 30, Blood Pressure < 90/60, Age >= 65) stratifying patient mortality risks into Low, Moderate, and High/ICU tiers.",
        "Integrated local Qwen-2.5-7B-Instruct LLM via Ollama (temperature=0.3) for generating automated, privacy-preserving clinical explanations and interactive second-opinion doctor consultations without third-party cloud data transmission.",
        "Architected full-stack Next.js 15, TypeScript, Tailwind CSS, and PostgreSQL relational schema (8 normalized tables for users, sessions, patients, analyses, medical records, second-opinion consultations, and follow-ups), alongside an ElectronJS desktop application installer."
      ],
      concurrencyAndConsistency: "Stateless ONNX model execution with non-blocking child processes for Grad-CAM. Relational PostgreSQL schema with foreign-key referential integrity across patients, analyses, second opinions, and medical records.",
      technologies: ["DenseNet121", "ONNX Runtime", "Grad-CAM", "CURB-65", "Qwen-2.5-7B (Ollama)", "Next.js 15", "TypeScript", "Python", "TensorFlow / Keras", "PostgreSQL", "ElectronJS", "Sharp", "jsPDF"],
      benchmarkedMetrics: [
        { metric: "Classification F1-Score", impact: "0.97", baselineComparison: "DenseNet121: 96% Accuracy, 95% Recall, 96% Precision on Kermany benchmark" },
        { metric: "Inference Latency", impact: "<3.0s", baselineComparison: "Quantized CPU ONNX Runtime execution with zero GPU dependency" },
        { metric: "Clinical Stratification & XAI", impact: "CURB-65 + Grad-CAM", baselineComparison: "Objective mortality risk calculation paired with JET activation heatmaps" },
        { metric: "Data Privacy Compliance", impact: "100% Local", baselineComparison: "Offline Qwen-2.5-7B via Ollama eliminating cloud medical data transmission" }
      ],
      links: {
        github: "https://github.com/kauroah",
        gitlab: "https://git.kpfu.ru/AkhAbdelgaffar/pneumonia-detection"
      },
      icon: "/assets/images/pneumo_brand_logo_1794321181955.jpg",
      screenshots: [
        { url: "/assets/projects/pneumo-ai/gradcam_heatmap.png", caption: "Grad-CAM Neural Heatmap Localization (Original vs JET Activation)" },
        { url: "/assets/projects/pneumo-ai/analysis_result.png", caption: "Diagnostic Inference (95.0% Pneumonia) & CURB-65 Severity Risk (3/5)" },
        { url: "/assets/projects/pneumo-ai/new_analysis_dashboard.png", caption: "Clinical Workstation — Patient Demographics & X-Ray Drag & Drop Upload" },
        { url: "/assets/projects/pneumo-ai/ai_explanation_report.png", caption: "Automated LLM-Grounded Radiographic Findings & Physician Approval Workflow" }
      ]
    },
    {
      id: "case-adam-eve-mobile",
      title: "Adam & Eve — Production Mobile Commerce Platform",
      category: "Mobile Architecture",
      domain: "Commercial Food Service / Multi-Platform Mobile",
      role: "Flutter & Full-Stack Mobile Engineer",
      architecturePattern: "Multi-Platform Flutter Client with Node.js Backend & Payment Gateway Integration",
      problemStatement: "Launching a multi-store bakery ordering and delivery tracking service required simultaneously compliant releases on Apple App Store, Google Play, and RuStore, coupled with transactional order placement.",
      systemDecisions: [
        "Engineered cross-platform Flutter application maintaining unified codebase compliance for Apple App Store, Google Play, and RuStore guidelines.",
        "Designed normalized PostgreSQL schemas and Node.js REST endpoints handling inventory reserves, customer order flows, and dynamic catalog pricing.",
        "Integrated third-party payment gateways with webhook signature validation to ensure idempotent order confirmation.",
        "Configured Firebase Cloud Messaging (FCM) topics for delivery dispatch notifications and real-time order state updates."
      ],
      concurrencyAndConsistency: "ACID database transactions prevent negative stock quantities during concurrent orders. Idempotent webhook processing prevents duplicate charges.",
      technologies: ["Flutter", "Dart", "Node.js", "PostgreSQL", "REST APIs", "JWT", "Push Notifications (FCM)", "Payment Integration"],
      benchmarkedMetrics: [
        { metric: "Production Store Approvals", impact: "3 Stores", baselineComparison: "Simultaneously verified and published on App Store, Google Play, RuStore" },
        { metric: "Order Processing Reliability", impact: "99.8%", baselineComparison: "Verified payment webhook confirmation and delivery routing" },
        { metric: "Client Startup Latency", impact: "<1.2s", baselineComparison: "Optimized asset bundling and deferred package initialization" }
      ],
      links: {
        github: "https://github.com/kauroah",
        appStore: "https://apps.apple.com/ru/app/%D0%B0%D0%B4%D0%B0%D0%BC-%D0%B8-%D0%B5%D0%B2%D0%B0/id6761149171?l=en-GB",
        googlePlay: "https://play.google.com/store/apps/details?id=com.adamandeve.foodapp&pcampaignid=web_share",
        ruStore: "https://www.rustore.ru/catalog/app/com.adamandeve.foodapp"
      },
      icon: "/assets/projects/adam-and-eve/icon.png",
      screenshots: [
        { url: "/assets/projects/adam-and-eve/screenshot-1.png", caption: "Menu Catalog & Bakery Categories" },
        { url: "/assets/projects/adam-and-eve/screenshot-2.png", caption: "Product Details & Customization" },
        { url: "/assets/projects/adam-and-eve/screenshot-3.png", caption: "Cart Management & Express Pickup Order" },
        { url: "/assets/projects/adam-and-eve/screenshot-4.png", caption: "Special Offers, Promos & Discounts" },
        { url: "/assets/projects/adam-and-eve/screenshot-5.png", caption: "Bonus Points Loyalty Program" }
      ]
    },
    {
      id: "case-distributed-orchestrator",
      title: "Distributed Background Job Engine & Task Orchestrator",
      category: "Distributed Systems",
      domain: "High-Load Infrastructure / Asynchronous Computing",
      role: "Backend Systems Architect",
      architecturePattern: "Distributed Worker Pool with Distributed Lock Coordination & State Recovery",
      problemStatement: "Orchestrating long-running computational jobs, cron-scheduled operations, and large data batches across distributed nodes caused duplicate execution hazards during network partitions, and unhandled container restarts led to orphaned incomplete jobs.",
      systemDecisions: [
        "Implemented distributed lock coordination via Redis key leases with automatic TTL refresh, paired with unique database constraints on (job_id, execution_id) to guarantee idempotency across multiple worker nodes.",
        "Engineered an asynchronous worker dispatch engine using Java 21 CompletableFuture and bounded ThreadPoolExecutor, decoupling HTTP intake from heavy CPU tasks.",
        "Constructed a persistent PostgreSQL state machine tracking job stages (SUBMITTED, RUNNING, COMPLETED, FAILED, RETRYING) that automatically identifies and restarts interrupted jobs upon container lifecycle reboot.",
        "Deployed RabbitMQ with dedicated Dead Letter Exchanges (DLX) and exponential backoff retry intervals to handle transient downstream failures without blocking the main worker queue."
      ],
      concurrencyAndConsistency: "Guaranteed exactly-once business execution semantics using Redis Redlock distributed synchronization combined with database row-level locking. Thread pool backpressure enforced via fixed-size queue capacity rejecting overflow with HTTP 429.",
      technologies: ["Java 21", "Spring Boot 3", "Spring Batch", "RabbitMQ", "Redis", "PostgreSQL", "Docker", "Prometheus", "Micrometer", "Testcontainers"],
      benchmarkedMetrics: [
        { metric: "Duplicate Execution Rate", impact: "0%", baselineComparison: "Eliminated race condition duplicates across 5 horizontal nodes" },
        { metric: "Task State Recovery", impact: "100%", baselineComparison: "Zero task loss during forced container SIGTERM termination" },
        { metric: "Mean Time to Detect (MTTD)", impact: "-40%", baselineComparison: "Queue backlog telemetry exposed via Micrometer & Prometheus" },
      ],
      links: {
        github: "https://github.com/kauroah"
      },
      icon: "/assets/images/orch_logo_1794319504623.jpg",
      screenshots: [
        { url: "/assets/images/orch_screen1_telemetry_1794338673598.jpg", caption: "Cluster Telemetry — Node Pool Status & Concurrency" },
        { url: "/assets/images/orch_screen2_dag_1794338698592.jpg", caption: "DAG State Machine — Execution Pipeline & Trace Logs" },
        { url: "/assets/images/orch_screen3_dlx_1794338699326.jpg", caption: "Queue & DLX Engine — Dead Letter Exchange Backpressure" }
      ]
    },
    {
      id: "case-transactional-outbox",
      title: "Transactional Outbox & Resilient Payment Microservices",
      category: "Microservices",
      domain: "Financial Technology / Distributed Transactions",
      role: "Backend Systems Engineer",
      architecturePattern: "Transactional Outbox Pattern with Kafka Event Streaming & Dead Letter Topics",
      problemStatement: "Dual-write vulnerabilities between relational database commits and message broker publishing created data inconsistency risks: if the database committed but the Kafka broker failed, events were permanently lost.",
      systemDecisions: [
        "Implemented the Transactional Outbox pattern: payment records and event payloads are atomically committed in a single local PostgreSQL database transaction.",
        "Built a dedicated CDC poller that safely publishes pending outbox records to Apache Kafka, confirming broker ACKs before marking outbox records as dispatched.",
        "Implemented idempotent consumer handlers utilizing unique transaction keys in Redis to reject duplicate processing attempts.",
        "Configured Kafka Dead Letter Topics (DLT) with automated retry counts and backoff intervals to isolate toxic payloads without stalling the partition consumer."
      ],
      concurrencyAndConsistency: "Guaranteed at-least-once message delivery without distributed 2-Phase Commit (2PC) protocol overhead. Idempotent consumer logic ensures exactly-once processing semantics.",
      technologies: ["Java", "Spring Boot", "Spring Data JPA", "Apache Kafka", "PostgreSQL", "Redis", "Testcontainers", "JUnit 5"],
      benchmarkedMetrics: [
        { metric: "Dual-Write Data Loss", impact: "0%", baselineComparison: "Eliminated transaction-to-broker desynchronization failures" },
        { metric: "Duplicate Payment Executions", impact: "0", baselineComparison: "Idempotency validation verified under simulated retry spikes" },
        { metric: "Integration Test Coverage", impact: ">90%", baselineComparison: "Simulated broker failure scenarios via Testcontainers" }
      ],
      links: {
        github: "https://github.com/kauroah"
      },
      icon: "/assets/images/outbox_logo_1794319506415.jpg",
      screenshots: [
        { url: "/assets/images/outbox_screen1_cdc_1794338720780.jpg", caption: "Outbox & CDC Poller — PostgreSQL Outbox Table & Kafka Stream" },
        { url: "/assets/images/outbox_screen2_kafka_1794338746481.jpg", caption: "Kafka Broker Topology — Partition Health & Consumer Group Lag" },
        { url: "/assets/images/outbox_screen3_ledger_1794338745904.jpg", caption: "Ledger Audit — Redis Idempotency Engine & Dead Letter Replay" }
      ]
    },
    {
      id: "case-centralized-iam",
      title: "Centralized Identity & Access Management (IAM) Service",
      category: "Microservices",
      domain: "Enterprise Security / Authentication Infrastructure",
      role: "Backend Security Engineer",
      architecturePattern: "Spring Authorization Server with Multi-Tenant RBAC & Distributed Token Blacklisting",
      problemStatement: "Multi-tenant academic and administrative applications suffered from fragmented authentication logic, lack of centralized session revocation, and risks of cross-tenant data leakage.",
      systemDecisions: [
        "Engineered centralized OAuth 2.0 and OpenID Connect identity provider using Spring Authorization Server and Spring Security.",
        "Enforced multi-tenant data isolation at the ORM and SQL layer, verifying tenant IDs and RBAC permissions on every inbound API request.",
        "Designed high-performance session lifecycle management with Redis, caching revoked token JTI claims to enable sub-millisecond blacklist lookups.",
        "Implemented structured security audit logging capturing failed login attempts, privilege escalation, and token refresh activities."
      ],
      concurrencyAndConsistency: "Stateless JWT verification with cryptographic RS256 signing; revocation checks performed in-memory via Redis L2 cache.",
      technologies: ["Java 21", "Spring Boot", "Spring Security", "Spring Authorization Server", "OAuth 2.0", "OpenID Connect", "PostgreSQL", "Redis"],
      benchmarkedMetrics: [
        { metric: "Token Verification Overhead", impact: "-50%", baselineComparison: "Redis blacklist caching cut latency compared to database session lookups" },
        { metric: "Cross-Tenant Leakage", impact: "0 Incidents", baselineComparison: "Enforced tenant schema isolation at database query layer" },
        { metric: "Session Revocation Propagation", impact: "<10ms", baselineComparison: "Instant cluster-wide token blacklisting upon sign-out" }
      ],
      links: {
        github: "https://github.com/kauroah"
      },
      icon: "/assets/images/iam_logo_1794319507114.jpg",
      screenshots: [
        { url: "/assets/images/iam_screen1_clients_1794338766495.jpg", caption: "OAuth 2.0 Clients — Spring Authorization Server Client Registry" },
        { url: "/assets/images/iam_screen2_rbac_1794338788765.jpg", caption: "Multi-Tenant RBAC — Enterprise Tenant Permission Matrix" },
        { url: "/assets/images/iam_screen3_blacklist_1794338791193.jpg", caption: "Session Audit & Blacklist — Real-Time Redis JTI Revocation Stream" }
      ]
    }
  ] as CaseStudyProject[],

  // Professional Experience strictly adhering to X-Y-Z formula
  experiences: [
    {
      id: "exp-founders",
      role: "Mobile & Full-Stack Engineer",
      company: "Founders",
      location: "Moscow, Russia",
      period: "June 2025 – August 2026",
      type: "Full-Time",
      summary: "Led mobile architecture and backend integrations for a production angel investment and syndicate deal-flow platform.",
      stack: ["Flutter", "Dart", "BLoC/Cubit", "Clean Architecture", "Firebase Firestore", "REST APIs", "Node.js", "Dio", "JWT"],
      achievements: [
        "Architected core mobile investment platform using Flutter and Clean Architecture, separating presentation, domain, and data layers into isolated, testable modules.",
        "Accelerated client application rendering and scrolling performance by 30% by refactoring state trees, preventing redundant widget rebuilds, and caching network payloads.",
        "Integrated secure REST APIs and Firebase Firestore services to achieve real-time synchronization of dynamic deal rooms, investment portfolios, and investor verification.",
        "Engineered encrypted user session management using Flutter Secure Storage and JWT token rotation, eliminating unauthorized session hijacking vectors.",
        "Delivered production MVP on schedule, implementing reusable component libraries, form validation pipelines, and offline-resilient local storage."
      ]
    },
    {
      id: "exp-distributed",
      role: "Distributed Systems & Java Backend Developer",
      company: "Independent Project Engineering",
      location: "Moscow, Russia",
      period: "June 2026 – September 2026",
      type: "Project Engineering",
      summary: "Architected and implemented a high-throughput distributed platform for background job orchestration, scheduled recurring operations, and fault-tolerant batch processing.",
      stack: ["Java 21", "Spring Boot", "Spring Batch", "RabbitMQ", "Redis", "PostgreSQL", "Docker", "JUnit 5", "Testcontainers", "Micrometer", "Prometheus"],
      achievements: [
        "Constructed a distributed task processing engine using Java 21, Spring Boot, and RabbitMQ, handling multi-threaded job dispatching via ExecutorService and CompletableFuture.",
        "Guaranteed 100% execution consistency across multi-node clusters by engineering distributed locking via Redis and database unique constraint idempotency keys.",
        "Designed stateful recovery workers in PostgreSQL that automatically restore and resume uncompleted task pipelines after sudden container termination.",
        "Decreased system diagnosis time by 40% by implementing comprehensive Micrometer instrumentation and Prometheus dashboards monitoring queue backlogs and consumer latency.",
        "Developed exhaustive integration test suites utilizing Testcontainers and JUnit 5 to validate database transactional rollbacks and RabbitMQ dead-letter retry workflows."
      ]
    },
    {
      id: "exp-kfu-iam",
      role: "Java Backend Engineer — Centralized IAM & Auth Platform",
      company: "Kazan Federal University (Enterprise Project)",
      location: "Kazan, Russia",
      period: "March 2024 – June 2024",
      type: "Academic Enterprise Project",
      summary: "Architected centralized single sign-on (SSO), OAuth 2.0 authorization, and RBAC security infrastructure for multi-tenant educational microservices.",
      stack: ["Java 21", "Spring Boot", "Spring Security", "Spring Authorization Server", "OAuth 2.0", "OpenID Connect", "JWT", "PostgreSQL", "Redis", "Docker"],
      achievements: [
        "Implemented enterprise OAuth 2.0 and OpenID Connect identity provider using Spring Authorization Server and Spring Security.",
        "Enforced strict multi-tenant data isolation and granular Role-Based Access Control (RBAC), verifying authorization claims at both HTTP filter and business domain layers.",
        "Designed high-performance session lifecycle management, cutting token verification latency by 50% through Redis distributed blacklist caching.",
        "Established security audit trail capturing authentication anomalies, permission mutations, and administrative operations.",
        "Authored end-to-end integration tests verifying tenant isolation boundaries and cryptographic JWT signing validity."
      ]
    },
    {
      id: "exp-kfu-logistics",
      role: "Java Backend Engineer — Event-Driven Logistics & Courier Dispatch",
      company: "Kazan Federal University (Enterprise Project)",
      location: "Kazan, Russia",
      period: "October 2023 – January 2024",
      type: "Academic Enterprise Project",
      summary: "Developed event-driven order lifecycle orchestration, geospatial courier dispatching, and real-time delivery tracking platform.",
      stack: ["Java", "Spring Boot", "Apache Kafka", "PostgreSQL", "PostGIS", "Redis", "WebSocket", "Docker", "Spring Data JPA"],
      achievements: [
        "Architected asynchronous order lifecycle event streaming utilizing Apache Kafka, ensuring decoupled microservice communication and zero order loss.",
        "Reduced courier assignment delays by 35% through developing a geospatial dispatch algorithm leveraging PostgreSQL with PostGIS spatial indexing.",
        "Eliminated REST polling overhead by delivering bidirectional live delivery tracking coordinates over low-latency WebSocket channels.",
        "Prevented duplicated financial and fulfillment actions by engineering idempotent Kafka consumers with persistent message deduplication keys.",
        "Containerized all platform services and dependencies with Docker Compose for deterministic local development and continuous integration."
      ]
    },
    {
      id: "exp-kfu-booking",
      role: "Java Backend Engineer — High-Concurrency Ticket Reservation",
      company: "Kazan Federal University (Enterprise Project)",
      location: "Kazan, Russia",
      period: "May 2023 – August 2023",
      type: "Academic Enterprise Project",
      summary: "Built high-throughput event ticket reservation backend resilient against race conditions and flash-crowd demand spikes.",
      stack: ["Java", "Spring Boot", "Spring Data JPA", "Hibernate", "PostgreSQL", "Redis", "Docker", "JUnit 5", "Gatling"],
      achievements: [
        "Prevented seat double-booking under extreme concurrent write pressure by enforcing pessimistic row-level locking and serializable transaction isolation in PostgreSQL.",
        "Created automatic reservation expiry workers that reliably release unconfirmed holds after 10 minutes, maximizing seat inventory availability.",
        "Accelerated seat availability lookups by 65% through compound SQL index tuning and multi-tier Redis caching.",
        "Verified system resilience under 2,500 requests/sec by engineering simulated flash-sale stress tests with Gatling."
      ]
    },
    {
      id: "exp-kfu-payments",
      role: "Java Backend Engineer — Resilient Payment Microservices",
      company: "Kazan Federal University (Enterprise Project)",
      location: "Kazan, Russia",
      period: "January 2023 – March 2023",
      type: "Academic Enterprise Project",
      summary: "Developed high-reliability financial transaction processing microservices with transactional consistency guarantees.",
      stack: ["Java", "Spring Boot", "Spring Data JPA", "PostgreSQL", "Apache Kafka", "Redis", "Spring Security", "Docker", "JUnit 5", "Testcontainers"],
      achievements: [
        "Implemented the Transactional Outbox pattern, guaranteeing atomic database mutations and reliable event publication to Apache Kafka without 2-phase commit overhead.",
        "Engineered idempotent transaction settlement workflows, preventing duplicate charges during client retries or network timeouts.",
        "Configured resilient Kafka consumer error handling with exponential backoff retries and routing of unprocessable messages to Dead Letter Topics (DLT).",
        "Constructed automated integration tests with Testcontainers to simulate real-world database deadlocks and broker partition failures."
      ]
    }
  ] as ExperienceItem[],

  // Clean, categorized technical matrix (Flutter & Applied AI prioritized first)
  techMatrix: [
    {
      category: "Flutter & Mobile Architecture",
      description: "Production cross-platform apps, state isolation, and native store deployments.",
      technologies: [
        { name: "Flutter SDK & Dart", role: "Cross-platform mobile apps for iOS & Android; custom render pipelines & native store releases." },
        { name: "BLoC & Cubit", role: "Predictable unidirectional state flow; RxDart debouncing, +30% render performance." },
        { name: "Clean Architecture", role: "Strict Domain, Data, and Presentation separation with testable use cases." },
        { name: "Firebase & Push (FCM)", role: "Firestore real-time deal rooms, auth, and transactional order push notifications." },
        { name: "App Store Publishing", role: "Verified production releases on Apple App Store, Google Play, and RuStore." },
        { name: "TypeScript & Next.js 15", role: "Type-safe full-stack client interfaces, Tailwind CSS, and component modularity." }
      ]
    },
    {
      category: "Applied AI, Voice & LLM Systems",
      description: "Real-time voice orchestration, RAG retrieval, and on-device model inference.",
      technologies: [
        { name: "Gemini API & Google AI Studio", role: "Certified: multimodal prompting, structured schemas, function calling, and dual-voice TTS." },
        { name: "Real-Time Voice Agents (VOID)", role: "Full-duplex VAD intake, deterministic barge-in cancel, and tool-execution routing." },
        { name: "MongoDB RAG & Vector Search", role: "Certified: semantic chunking, vector embeddings, and context-window injection." },
        { name: "ONNX Runtime & Grad-CAM", role: "CPU-quantized DenseNet121 inference (<3s) and explainable heatmap localization." },
        { name: "Offline LLMs & Prompting", role: "Local Qwen-2.5-7B via Ollama, instruction design, and AI-assisted code agents." },
        { name: "Python & ML Tooling", role: "Certified: OOP, TensorFlow/Keras export, and data preprocessing pipelines." }
      ]
    },
    {
      category: "Databases, Vector Stores & Caching",
      description: "Relational integrity, vector similarity indexing, and distributed in-memory state.",
      technologies: [
        { name: "MongoDB & Atlas Vector", role: "Certified: schema optimization, aggregation pipelines, and RAG vector search." },
        { name: "PostgreSQL & PostGIS", role: "ACID transactions, geospatial spatial indexing, and row-level concurrency locks." },
        { name: "Redis", role: "Distributed Redlock coordination, L2 caching, and sub-millisecond token blacklisting." },
        { name: "Firebase Firestore", role: "Real-time mobile document listeners, offline sync, and strict security rules." },
        { name: "Prisma & Hibernate", role: "Type-safe schema migrations, query profiling, and relational mapping." }
      ]
    },
    {
      category: "Backend APIs & Infrastructure",
      description: "Supporting server APIs, event brokers, containerization, and verification harnesses.",
      technologies: [
        { name: "Node.js & Express", role: "High-throughput APIs, webhooks, SSE/streaming audio routes, and commerce backends." },
        { name: "Java 21 & Spring Boot 3", role: "Enterprise microservices, Spring Security (OAuth 2.0 / OIDC), and Spring Batch." },
        { name: "Apache Kafka & RabbitMQ", role: "Transactional Outbox event streaming, worker pools, and Dead Letter Topics." },
        { name: "Docker & Docker Compose", role: "Multi-stage containerization and reproducible full-stack deployments." },
        { name: "Testcontainers & Prometheus", role: "Automated integration testbeds and queue/latency observability metrics." }
      ]
    }
  ]
};
