import React, { useState } from 'react';
import { X, Printer, Sliders, FileText, Code2, FileDown, Loader2 } from 'lucide-react';
import { PROFILE_DATA } from '../data/portfolioData';
import { generateAndDownloadPdf } from '../utils/pdfGenerator';

interface CvStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type TargetRole = 'fullstack' | 'java' | 'flutter' | 'ai';

export const CvStudioModal: React.FC<CvStudioModalProps> = ({ isOpen, onClose }) => {
  const [targetRole, setTargetRole] = useState<TargetRole>('fullstack');
  const [bulletStyle, setBulletStyle] = useState<'xyz' | 'concise'>('xyz');
  const [includeBadges, setIncludeBadges] = useState(true);
  const [activeTab, setActiveTab] = useState<'preview' | 'markdown'>('preview');
  const [showExportDialog, setShowExportDialog] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);

  if (!isOpen) return null;

  const roleConfigs = {
    fullstack: {
      title: "Senior Full-Stack Developer",
      subtitle: "TypeScript · Next.js · Node.js · Java 21 / Spring Boot · PostgreSQL · REST APIs",
      summary: "Full-Stack Software Engineer with 2+ years of production experience implementing client-side architectures, distributed backend services, and automated CI/CD pipelines. Core proficiency across TypeScript/Next.js, Java 21/Spring Boot, Node.js, and PostgreSQL. Engineered high-concurrency microservices, multi-tenant RBAC with Spring Authorization Server, and mobile cross-platform applications released on Apple App Store, Google Play, and RuStore. Certified by Google Cloud in AI Studio Prototyping and MongoDB in Schema Optimization and RAG Vector Search.",
      primarySkills: "TypeScript, JavaScript (ES6+), React 19, Next.js 15, Node.js, Express, Java 21, Spring Boot 3, PostgreSQL, MongoDB Atlas, Redis, Docker, RESTful APIs, Git.",
    },
    java: {
      title: "Java & Distributed Systems Developer",
      subtitle: "Java 21 · Spring Boot 3 · Apache Kafka · RabbitMQ · PostgreSQL · Redis · Testcontainers",
      summary: "Backend Software Engineer specializing in resilient, distributed server applications using Java 21, Spring Boot, Apache Kafka, RabbitMQ, and PostgreSQL. Experienced in high-concurrency architecture, idempotent event processing, and multi-tenant security (RBAC/OAuth 2.0). Demonstrated experience cutting system bottlenecks by 30% through connection pooling, database query indexing, and caching with Redis. Holds verified credentials in MongoDB Schema Optimization and Google Cloud AI.",
      primarySkills: "Java 21, Spring Boot 3, Spring Batch, Spring Security, Spring Data JPA, Hibernate, Apache Kafka, RabbitMQ, PostgreSQL, PostGIS, Redis, Docker, JUnit 5, Testcontainers, Micrometer, Prometheus, Gatling.",
    },
    flutter: {
      title: "Lead Mobile & Flutter Systems Engineer",
      subtitle: "Flutter SDK · Dart · BLoC / Cubit · Clean Architecture · Firebase · Published Apps",
      summary: "Mobile Software Engineer specializing in scalable client architecture using Flutter SDK, Dart, BLoC/Cubit, and Clean Architecture. Shipped commercial applications approved on Apple App Store, Google Play, and RuStore. Measured 30% rendering performance improvement through widget tree virtualization, memory caching, and immutable state isolation. Full-stack proficiency in Node.js and Firebase backend integrations.",
      primarySkills: "Flutter SDK, Dart, BLoC, Cubit, Clean Architecture, Riverpod, Provider, REST APIs, Dio, Firebase Firestore, Push Notifications (FCM), Flutter Secure Storage, App Store / Google Play / RuStore Publishing, Node.js, PostgreSQL.",
    },
    ai: {
      title: "AI Systems & Full-Stack Software Engineer",
      subtitle: "MongoDB RAG · Vector Search · Google AI Studio · Gemini API · ONNX Runtime · Next.js",
      summary: "Software Engineer specializing in applied generative AI systems, Retrieval-Augmented Generation (RAG) pipelines, and autonomous agent integration. Certified by Google Cloud in AI Studio Prototyping and MongoDB in Vector Search and Resilient Data Strategy. Production experience executing sub-3s model inference via ONNX Runtime and engineering end-to-end full-stack diagnostic and developer tools.",
      primarySkills: "MongoDB Atlas Vector Search, RAG Pipelines, Google AI Studio, Gemini API, OpenAI API, ONNX Runtime, Autonomous Code Agents, Next.js, TypeScript, Node.js, PostgreSQL, Docker.",
    }
  };

  const currentConfig = roleConfigs[targetRole];

  const generateMarkdown = () => {
    return `# AHMED ABDELGAFFAR
**${currentConfig.title.toUpperCase()}**  
Moscow, Russia | kauroah@gmail.com | +7 (996) 846-9573  
[GitHub: github.com/kauroah](https://github.com/kauroah) | [Telegram: @xrotw](https://t.me/xrotw) | [Credly Badges](https://www.credly.com/users/ahmed-abdelgaffar)

---

## PROFESSIONAL SUMMARY
${currentConfig.summary}

---

## CORE TECHNICAL COMPETENCIES
* **Primary Stack:** ${currentConfig.primarySkills}
* **Backend & Distributed Systems:** Java 21, Spring Boot 3, Spring Batch, Spring Security, Node.js, Express, Apache Kafka, RabbitMQ, WebSocket.
* **Frontend & Web:** TypeScript, JavaScript, React 19, Next.js 15, Vue.js, Tailwind CSS, Responsive UI.
* **Mobile Engineering:** Flutter SDK, Dart, BLoC, Cubit, Clean Architecture, App Store / Google Play / RuStore Publishing.
* **Databases & Vector:** PostgreSQL, PostGIS, MongoDB (Atlas Vector Search), Redis, Firebase Firestore, Prisma, Spring Data JPA.
* **AI & Applied ML:** Google AI Studio, Gemini API, MongoDB RAG Architecture, ONNX Runtime, Autonomous Code Agents.
* **DevOps, Testing & Observability:** Docker, Docker Compose, Linux, Git, JUnit 5, Testcontainers, Gatling, Micrometer, Prometheus.

${includeBadges ? `---

## VERIFIED CERTIFICATIONS & SKILL BADGES
* **Develop AI-Powered Prototypes in Google AI Studio** — Google Cloud Skill Badge (Credly: https://www.credly.com/go/C34mJTu0) | Nov 2026
* **Create Your First Gemini Enterprise Application** — Google Cloud Skill Badge | Nov 2026
* **Building RAG Apps Using MongoDB** — MongoDB Skill Badge & Proof of Completion (Credly: https://www.credly.com/badges/0ca8c49e-ba32-4458-bec8-26c4810ec69f) | Nov 2026
* **AI and Innovation: How MongoDB Enables a Resilient AI Strategy** — MongoDB Skill Badge (Credly: https://www.credly.com/go/ukc2g4FK) | Nov 2026
* **MongoDB Schema Design Optimization** — MongoDB Skill Badge (Credly: https://www.credly.com/badges/8e30ce61-6851-4b23-87b0-b84a634ffa1f) | Nov 2026
* **Building an App with Code Agents and MongoDB** — MongoDB Skill Badge | Nov 2026` : ''}

---

## PROFESSIONAL EXPERIENCE

### **Founders** | Moscow, Russia
**Mobile & Full-Stack Engineer** | June 2025 – August 2026
* ${bulletStyle === 'xyz' 
  ? 'Architected core mobile investment application from ground up using Flutter, Dart, BLoC/Cubit, and Clean Architecture, separating presentation, domain, and data layers into testable modular features.' 
  : 'Led mobile architecture for investment platform using Flutter and Clean Architecture.'}
* ${bulletStyle === 'xyz' 
  ? 'Accelerated client application rendering and scrolling performance by 30% by refactoring state trees, preventing redundant widget rebuilds, and caching network payloads.' 
  : 'Boosted app performance by 30% through state optimization and widget tree refactoring.'}
* ${bulletStyle === 'xyz' 
  ? 'Integrated secure REST APIs and Firebase Firestore services to achieve real-time synchronization of dynamic deal rooms, investment portfolios, and investor verification.' 
  : 'Connected REST APIs and Firebase Firestore for real-time portfolio updates and investor workflows.'}
* ${bulletStyle === 'xyz' 
  ? 'Engineered encrypted user session management using Flutter Secure Storage and JWT token rotation, eliminating unauthorized session hijacking vectors.' 
  : 'Implemented secure session management and JWT authentication.'}
* ${bulletStyle === 'xyz' 
  ? 'Contributed to on-schedule MVP launch, delivering reusable design-system widgets, form validation pipelines, and offline-resilient local storage.' 
  : 'Delivered production MVP components and modular UI architecture.'}

### **Independent Project Development** | Moscow, Russia
**Distributed Systems & Java Backend Developer** | June 2026 – September 2026
* ${bulletStyle === 'xyz' 
  ? 'Constructed a distributed task processing engine using Java 21, Spring Boot, and RabbitMQ, handling multi-threaded job dispatching via ExecutorService and CompletableFuture.' 
  : 'Engineered distributed background job execution platform using Java 21, Spring Boot, and RabbitMQ.'}
* ${bulletStyle === 'xyz' 
  ? 'Guaranteed 100% execution consistency across multi-node clusters by engineering distributed locking via Redis and database unique constraint idempotency keys.' 
  : 'Prevented duplicate job executions across distributed nodes with Redis locks and DB constraints.'}
* ${bulletStyle === 'xyz' 
  ? 'Designed stateful recovery workers in PostgreSQL that automatically restore and resume uncompleted task pipelines after sudden container termination.' 
  : 'Built zero-data-loss recovery mechanisms to resume interrupted tasks upon service restart.'}
* ${bulletStyle === 'xyz' 
  ? 'Decreased system diagnosis time by 40% by implementing comprehensive Micrometer instrumentation and Prometheus dashboards monitoring queue backlogs and consumer latency.' 
  : 'Configured queue metrics and latency telemetry via Micrometer and Prometheus.'}
* ${bulletStyle === 'xyz' 
  ? 'Developed exhaustive integration test suites utilizing Testcontainers and JUnit 5 to validate database transactional rollbacks and RabbitMQ dead-letter retry workflows.' 
  : 'Achieved robust test coverage using JUnit 5 and Testcontainers.'}

### **Kazan Federal University (Enterprise Academic Projects)** | Kazan, Russia
**Java Backend Engineer** | January 2023 – June 2024
* **Centralized IAM & Auth Service (March 2024 – June 2024):** Architected centralized OAuth 2.0 / OIDC identity provider using Spring Authorization Server and Spring Security. Enforced multi-tenant data isolation and RBAC. Cut token verification overhead by 50% via Redis distributed blacklist caching.
* **Event-Driven Logistics Platform (October 2023 – January 2024):** Built asynchronous order streaming with Apache Kafka. Improved courier dispatch latency by 35% with PostGIS spatial indexing. Replaced polling with live WebSocket status feeds.
* **High-Concurrency Ticket Reservation (May 2023 – August 2023):** Prevented seat double-booking under heavy spikes with PostgreSQL pessimistic locking and serializable isolation. Validated resilience up to 2,500 req/sec via Gatling load tests.
* **Transactional Outbox Payments (January 2023 – March 2023):** Guaranteed zero dual-write message loss by implementing Transactional Outbox pattern with Apache Kafka. Handled transient failures with Dead Letter Topics (DLT).

---

## SELECTED PROJECTS

### **PneumoAI — Medical Image Analysis & Diagnostic Platform**
*Next.js 15, TypeScript, Node.js, ONNX Runtime, LLM Integration, PostgreSQL, Docker*
* Engineered full-stack diagnostic prototype performing deep learning inference on radiographic scans within 3 seconds.
* Integrated LLM-based assistant translating statistical probabilities into clinician-ready contextual explanations.
* Containerized full microservice pipeline with Docker Compose.

### **Adam & Eve — Commercial Dessert Ordering Mobile Platform**
*Flutter, Dart, Node.js, PostgreSQL, REST APIs, Push Notifications, Payment Gateways*
* Built production mobile application approved and published on **Apple App Store**, **Google Play**, and **RuStore**.
* Integrated payment processing, database schemas, and Firebase Cloud Messaging for order tracking push alerts.

### **AI Code Review Assistant — Automated Static & Semantic Analysis Tool**
*Next.js, TypeScript, Node.js, REST APIs, LLM APIs, Docker*
* Full-stack code analysis application generating automated refactoring and security recommendations.
* Implemented streaming LLM prompt preparation and JWT authentication.

---

## EDUCATION

* **Master’s Degree in Software Engineering (Information Systems Architecture)**  
  **RTU MIREA (Russian Technological University)** | Moscow, Russia | 2026 – 2028 (Year 1)  
  *Honors:* Awarded competitive Russian Federation State Quota Scholarship by the Ministry of Science and Higher Education for exceptional academic record. Focus: High-Load Distributed Architecture.

* **Bachelor’s Degree in Software Engineering**  
  **Kazan Federal University (Higher Institute of ITIS)** | Kazan, Russia | 2022 – 2026  
  *Focus:* Concurrent Programming, System Design, Relational Theory, Computer Science Fundamentals.

---

## LANGUAGES
* **Arabic:** Native proficiency  
* **English:** C1 — Advanced / Full Professional Proficiency  
* **Russian:** C1 — Advanced / Full Professional Proficiency
`;
  };

  // Direct Client-Side Vector PDF Generation & Instant Download (No printer required)
  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      generateAndDownloadPdf(targetRole, currentConfig, includeBadges, bulletStyle);
      setShowExportDialog(false);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleTriggerPrint = () => {
    setShowExportDialog(false);
    setActiveTab('preview');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 cv-modal-overlay animate-in fade-in duration-150">
        <div className="relative w-full max-w-4xl lg:max-w-5xl 2xl:max-w-6xl bg-[var(--card-bg)] text-[var(--foreground)] rounded-3xl border border-[var(--border)] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden cv-modal-card">
          
          {/* Modal Header */}
          <div className="px-6 py-4.5 border-b border-[var(--border)] flex items-center justify-between gap-4 bg-[var(--card-bg)] modal-controls-bar">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[var(--muted)] font-medium mb-0.5">
                Adjustable Resume Generator
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[var(--foreground)] tracking-tight">
                Curriculum Vitae <span className="italic font-serif">Studio</span>
              </h2>
            </div>

            <button
              onClick={onClose}
              aria-label="Close CV studio"
              className="p-2 rounded-full text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Studio Controls Strip */}
          <div className="p-4 sm:px-6 bg-[var(--surface)] border-b border-[var(--border)] flex flex-wrap items-center justify-between gap-4 modal-controls-bar">
            
            {/* Target Role Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-[var(--muted)] mr-1">
                Role Focus:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    { id: 'fullstack', label: 'Full-Stack' },
                    { id: 'java', label: 'Java / Backend' },
                    { id: 'flutter', label: 'Flutter / Mobile' },
                    { id: 'ai', label: 'AI & Full-Stack' },
                  ] as const
                ).map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setTargetRole(role.id)}
                    className={`px-3.5 py-1 text-xs rounded-full transition-all cursor-pointer ${
                      targetRole === role.id
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium shadow-xs'
                        : 'border border-[var(--border)] bg-[var(--card-bg)] text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Configuration Toggles & Print Button */}
            <div className="flex items-center gap-3 text-xs">
              {/* X-Y-Z vs Concise */}
              <div className="flex items-center gap-1 p-0.5 bg-[var(--card-bg)] border border-[var(--border)] rounded-full">
                <button
                  onClick={() => setBulletStyle('xyz')}
                  className={`px-3 py-0.5 rounded-full text-xs transition-colors cursor-pointer ${
                    bulletStyle === 'xyz' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium' : 'text-[var(--muted)]'
                  }`}
                >
                  X-Y-Z Formula
                </button>
                <button
                  onClick={() => setBulletStyle('concise')}
                  className={`px-3 py-0.5 rounded-full text-xs transition-colors cursor-pointer ${
                    bulletStyle === 'concise' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium' : 'text-[var(--muted)]'
                  }`}
                >
                  Concise
                </button>
              </div>

              {/* Badges Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer text-[var(--muted)] hover:text-[var(--foreground)]">
                <input
                  type="checkbox"
                  checked={includeBadges}
                  onChange={(e) => setIncludeBadges(e.target.checked)}
                  className="rounded accent-neutral-900 dark:accent-white"
                />
                <span>Include Badges</span>
              </label>

              {/* PRINT / PDF Trigger Button */}
              <button
                onClick={() => setShowExportDialog(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 hover:opacity-90 rounded-full transition-all shadow-xs cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>

          </div>

          {/* View Switcher: Document vs Raw Markdown */}
          <div className="px-6 pt-3 flex items-center gap-6 border-b border-[var(--border)] text-xs modal-controls-bar bg-[var(--card-bg)]">
            <button
              onClick={() => setActiveTab('preview')}
              className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'preview'
                  ? 'border-[var(--foreground)] text-[var(--foreground)] font-medium'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Document Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('markdown')}
              className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'markdown'
                  ? 'border-[var(--foreground)] text-[var(--foreground)] font-medium'
                  : 'border-transparent text-[var(--muted)] hover:text-[var(--foreground)]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Markdown Source</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[var(--surface)]">
            
            {activeTab === 'preview' ? (
              /* Rendered Clean Editorial ATS Document */
              <div 
                id="ats-printable-cv" 
                className="max-w-3xl lg:max-w-4xl mx-auto bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 sm:p-10 shadow-sm space-y-7 text-[var(--foreground)] text-xs sm:text-sm"
              >
                {/* ATS Header */}
                <div className="text-center pb-5 border-b border-[var(--border)]">
                  <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[var(--foreground)] tracking-tight">
                    Ahmed Abdelgaffar
                  </h1>
                  <div className="text-sm font-serif italic text-[var(--foreground)] mt-1">
                    {currentConfig.title}
                  </div>
                  <div className="text-xs text-[var(--muted)] font-mono mt-1">
                    {currentConfig.subtitle}
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[var(--muted)] mt-3">
                    <span>Moscow, Russia</span>
                    <span>·</span>
                    <span>kauroah@gmail.com</span>
                    <span>·</span>
                    <span>+7 (996) 846-9573</span>
                    <span>·</span>
                    <a href={PROFILE_DATA.contact.githubUrl} target="_blank" rel="noreferrer" className="text-[var(--foreground)] underline hover:opacity-80">
                      github.com/kauroah
                    </a>
                    <span>·</span>
                    <a href={PROFILE_DATA.contact.credlyUrl} target="_blank" rel="noreferrer" className="text-[var(--foreground)] underline hover:opacity-80">
                      Credly Badges
                    </a>
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-1 mb-2.5">
                    <h2 className="font-serif text-base sm:text-lg font-normal text-[var(--foreground)]">
                      Professional Summary
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--muted)]">01</span>
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--muted)]">
                    {currentConfig.summary}
                  </p>
                </div>

                {/* Technical Skills */}
                <div>
                  <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-1 mb-2.5">
                    <h2 className="font-serif text-base sm:text-lg font-normal text-[var(--foreground)]">
                      Technical Competencies
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--muted)]">02</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-[var(--muted)] leading-relaxed">
                    <div>
                      <strong className="text-[var(--foreground)] font-medium">Core Stack: </strong>
                      <span>{currentConfig.primarySkills}</span>
                    </div>
                    <div>
                      <strong className="text-[var(--foreground)] font-medium">Backend & Distributed: </strong>
                      <span>Java 21, Spring Boot 3, Spring Batch, Spring Security, Node.js, Express, Apache Kafka, RabbitMQ.</span>
                    </div>
                    <div>
                      <strong className="text-[var(--foreground)] font-medium">Databases & Vector: </strong>
                      <span>PostgreSQL, PostGIS, MongoDB (Atlas Vector Search), Redis, Firebase Firestore, Prisma.</span>
                    </div>
                    <div>
                      <strong className="text-[var(--foreground)] font-medium">Architecture & DevOps: </strong>
                      <span>Docker Compose, Clean Architecture, REST APIs, Microservices, Git, JUnit 5, Testcontainers.</span>
                    </div>
                  </div>
                </div>

                {/* Badges Section */}
                {includeBadges && (
                  <div>
                    <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-1 mb-2.5">
                      <h2 className="font-serif text-base sm:text-lg font-normal text-[var(--foreground)]">
                        Verified Credentials & Skill Badges
                      </h2>
                      <span className="text-[11px] font-mono text-[var(--muted)]">03</span>
                    </div>
                    <div className="space-y-1 text-xs text-[var(--muted)] leading-relaxed">
                      <div>
                        • <span className="font-medium text-[var(--foreground)]">Develop AI-Powered Prototypes in Google AI Studio</span> — Google Cloud Skill Badge (Nov 2026)
                      </div>
                      <div>
                        • <span className="font-medium text-[var(--foreground)]">Create Your First Gemini Enterprise Application</span> — Google Cloud Skill Badge (Nov 2026)
                      </div>
                      <div>
                        • <span className="font-medium text-[var(--foreground)]">Building RAG Apps Using MongoDB</span> — MongoDB Skill Badge & Proof of Completion (Nov 2026)
                      </div>
                      <div>
                        • <span className="font-medium text-[var(--foreground)]">AI and Innovation: How MongoDB Enables a Resilient AI Strategy</span> — MongoDB Skill Badge (Nov 2026)
                      </div>
                      <div>
                        • <span className="font-medium text-[var(--foreground)]">MongoDB Schema Design Optimization</span> — MongoDB Skill Badge (Nov 2026)
                      </div>
                    </div>
                  </div>
                )}

                {/* Experience */}
                <div>
                  <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-1 mb-3">
                    <h2 className="font-serif text-base sm:text-lg font-normal text-[var(--foreground)]">
                      Engineering Experience
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--muted)]">{includeBadges ? '04' : '03'}</span>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-sm text-[var(--foreground)]">Founders</span>
                        <span className="text-xs font-mono text-[var(--muted)]">June 2025 – August 2026</span>
                      </div>
                      <div className="text-xs font-serif italic text-[var(--foreground)] mb-1.5">
                        Mobile & Full-Stack Engineer · Moscow, Russia
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs text-[var(--muted)] leading-relaxed">
                        <li>Architected mobile investment application using Flutter, Dart, BLoC/Cubit, and Clean Architecture.</li>
                        <li>Accelerated client application rendering and scrolling performance by 30% through widget tree refactoring and state isolation.</li>
                        <li>Integrated REST APIs and Firebase Firestore services for real-time portfolio tracking and deal-room sync.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-sm text-[var(--foreground)]">Independent Project Development</span>
                        <span className="text-xs font-mono text-[var(--muted)]">June 2026 – September 2026</span>
                      </div>
                      <div className="text-xs font-serif italic text-[var(--foreground)] mb-1.5">
                        Distributed Systems & Java Backend Developer · Moscow, Russia
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs text-[var(--muted)] leading-relaxed">
                        <li>Constructed distributed task processing platform using Java 21, Spring Boot, Spring Batch, and RabbitMQ message broker.</li>
                        <li>Guaranteed 100% execution consistency across distributed nodes via Redis distributed locks and unique PostgreSQL execution constraints.</li>
                        <li>Reduced MTTD by 40% through Micrometer instrumentation and Prometheus dashboards monitoring queue depths.</li>
                      </ul>
                    </div>

                    <div>
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-sm text-[var(--foreground)]">Kazan Federal University (Enterprise Academic Projects)</span>
                        <span className="text-xs font-mono text-[var(--muted)]">Jan 2023 – June 2024</span>
                      </div>
                      <div className="text-xs font-serif italic text-[var(--foreground)] mb-1.5">
                        Java Backend Engineer · Kazan, Russia
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-xs text-[var(--muted)] leading-relaxed">
                        <li><strong className="font-medium text-[var(--foreground)]">Centralized IAM Server:</strong> OAuth 2.0 / OIDC identity provider with Spring Authorization Server and multi-tenant RBAC.</li>
                        <li><strong className="font-medium text-[var(--foreground)]">Event-Driven Logistics:</strong> Asynchronous Kafka pipeline with PostGIS geospatial routing reducing assignment latency by 35%.</li>
                        <li><strong className="font-medium text-[var(--foreground)]">Transactional Outbox Payments:</strong> Microservices eliminating dual-write hazards with Kafka Dead Letter Topics.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div>
                  <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-1 mb-2.5">
                    <h2 className="font-serif text-base sm:text-lg font-normal text-[var(--foreground)]">
                      Education & Scholarships
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--muted)]">{includeBadges ? '05' : '04'}</span>
                  </div>
                  <div className="space-y-3 text-xs leading-relaxed">
                    <div>
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-[var(--foreground)]">RTU MIREA (Russian Technological University)</span>
                        <span className="font-mono text-[var(--muted)]">2026 – 2028</span>
                      </div>
                      <div className="text-[var(--muted)] font-serif italic">
                        Master's Degree in Software Engineering (Information Systems Architecture) · Moscow, Russia
                      </div>
                      <div className="text-[11px] text-[var(--muted)] mt-0.5">
                        Russian Federation Government Quota Scholarship for exceptional academic record.
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-[var(--foreground)]">Kazan Federal University (Higher Institute of ITIS)</span>
                        <span className="font-mono text-[var(--muted)]">2022 – 2026</span>
                      </div>
                      <div className="text-[var(--muted)] font-serif italic">
                        Bachelor's Degree in Software Engineering · Kazan, Russia
                      </div>
                    </div>
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <div className="flex items-baseline justify-between border-b border-[var(--border)] pb-1 mb-2">
                    <h2 className="font-serif text-base sm:text-lg font-normal text-[var(--foreground)]">
                      Languages
                    </h2>
                    <span className="text-[11px] font-mono text-[var(--muted)]">{includeBadges ? '06' : '05'}</span>
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    Arabic (Native) · English (C1 — Advanced / Fluent) · Russian (C1 — Advanced / Fluent)
                  </div>
                </div>

              </div>
            ) : (
              /* Raw Markdown View */
              <div className="max-w-3xl mx-auto">
                <pre className="p-6 rounded-2xl bg-[var(--card-bg)] text-[var(--foreground)] font-mono text-xs leading-relaxed overflow-x-auto border border-[var(--border)] shadow-xs">
                  {generateMarkdown()}
                </pre>
              </div>
            )}

          </div>

          {/* Modal Footer */}
          <div className="p-4 px-6 border-t border-[var(--border)] bg-[var(--card-bg)] flex items-center justify-between gap-4 text-xs modal-controls-bar">
            <div className="text-[var(--muted)]">
              ATS-Standard Single-Column Format
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 font-medium rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>

        </div>
      </div>

      {/* Confirmation & Export Dialog Modal */}
      {showExportDialog && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-100">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[var(--card-bg)] text-[var(--foreground)] rounded-3xl border border-[var(--border)] shadow-2xl p-6"
          >
            {/* Dialog Header */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-2xl font-serif font-normal text-[var(--foreground)]">
                  Export Resume
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Target profile: {currentConfig.title}
                </p>
              </div>

              <button
                onClick={() => setShowExportDialog(false)}
                className="p-1 rounded-full text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--muted)] mb-5 leading-relaxed">
              Choose your preferred export method. Direct download compiles a vector PDF directly to your device without requiring printer hardware:
            </p>

            {/* Action Choices */}
            <div className="space-y-3 mb-5">
              {/* Option 1: Direct PDF Download */}
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] transition-all text-left flex items-start gap-3.5 shadow-xs disabled:opacity-60 cursor-pointer"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-5 h-5 text-[var(--foreground)] animate-spin mt-0.5 shrink-0" />
                ) : (
                  <FileDown className="w-5 h-5 text-[var(--foreground)] mt-0.5 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-2">
                    <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Directly'}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium">
                      Direct Download
                    </span>
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                    Instantly generates and downloads an ATS-compliant <span className="font-semibold text-[var(--foreground)]">.pdf</span> file directly to your device.
                  </div>
                </div>
              </button>

              {/* Option 2: Print System Dialog */}
              <button
                onClick={handleTriggerPrint}
                className="w-full p-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--surface-hover)] transition-all text-left flex items-start gap-3.5 cursor-pointer"
              >
                <Printer className="w-5 h-5 text-[var(--muted)] mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-[var(--foreground)]">
                    Print / System PDF Dialog
                  </div>
                  <div className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                    Opens the browser's print preview for sending to a physical printer or custom print driver.
                  </div>
                </div>
              </button>
            </div>

            {/* Cancel Footer */}
            <div className="flex justify-end pt-2 border-t border-[var(--border)]">
              <button
                onClick={() => setShowExportDialog(false)}
                className="px-4 py-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
