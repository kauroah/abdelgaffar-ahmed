import { jsPDF } from 'jspdf';
import { TargetRole } from '../components/CvStudioModal';
import { PROFILE_DATA } from '../data/portfolioData';

interface RoleConfig {
  title: string;
  subtitle: string;
  summary: string;
  primarySkills: string;
}

export function generateAndDownloadPdf(
  targetRole: TargetRole,
  roleConfig: RoleConfig,
  includeBadges: boolean,
  bulletStyle: 'xyz' | 'concise'
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4', // 595.28 x 841.89 pt
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 36; // 0.5 inch margins
  const contentWidth = pageWidth - margin * 2;
  let y = margin + 10;

  // Helper to check page break
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin) {
      doc.addPage();
      y = margin + 15;
    }
  };

  // 1. Header: Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('AHMED ABDELGAFFAR', pageWidth / 2, y, { align: 'center' });
  y += 18;

  // Header: Target Role Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229); // indigo-600
  doc.text(roleConfig.title.toUpperCase(), pageWidth / 2, y, { align: 'center' });
  y += 14;

  // Header: Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(roleConfig.subtitle, pageWidth / 2, y, { align: 'center' });
  y += 13;

  // Header: Contact Details
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  const contactLine = 'Moscow, Russia  |  kauroah@gmail.com  |  +7 (996) 846-9573  |  github.com/kauroah  |  credly.com/users/ahmed-abdelgaffar';
  doc.text(contactLine, pageWidth / 2, y, { align: 'center' });
  y += 10;

  // Horizontal Divider Line
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.setLineWidth(0.8);
  doc.line(margin, y, pageWidth - margin, y);
  y += 14;

  // Section Header Generator
  const renderSectionHeader = (title: string) => {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin, y);
    y += 4;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
  };

  // 2. PROFESSIONAL SUMMARY
  renderSectionHeader('Professional Summary');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(roleConfig.summary, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 11 + 6;

  // 3. TECHNICAL COMPETENCIES
  renderSectionHeader('Technical Competencies');
  const skillsList = [
    { label: 'Core Focus:', text: roleConfig.primarySkills },
    { label: 'Backend & Distributed:', text: 'Java 21, Spring Boot 3, Spring Batch, Spring Security, Node.js, Express, Apache Kafka, RabbitMQ.' },
    { label: 'Databases & Vector:', text: 'PostgreSQL, PostGIS, MongoDB (Atlas Vector Search), Redis, Firebase Firestore, Prisma.' },
    { label: 'AI & Architecture:', text: 'Google AI Studio, Gemini API, MongoDB RAG, ONNX Runtime, Clean Architecture, Docker Compose.' },
  ];

  skillsList.forEach(s => {
    checkPageBreak(12);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`• ${s.label} `, margin + 4, y);
    const labelWidth = doc.getTextWidth(`• ${s.label} `);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const textLines = doc.splitTextToSize(s.text, contentWidth - labelWidth - 4);
    doc.text(textLines, margin + 4 + labelWidth, y);
    y += textLines.length * 10 + 2;
  });
  y += 4;

  // 4. VERIFIED CERTIFICATIONS & BADGES
  if (includeBadges) {
    renderSectionHeader('Verified Industry Certifications & Badges');
    const badges = [
      'Develop AI-Powered Prototypes in Google AI Studio — Google Cloud Skill Badge (Credly: C34mJTu0) | Nov 2026',
      'Create Your First Gemini Enterprise Application — Google Cloud Skill Badge | Nov 2026',
      'Building RAG Apps Using MongoDB — MongoDB Skill Badge & Proof of Completion (Credly: 0ca8c49e) | Nov 2026',
      'AI and Innovation: How MongoDB Enables a Resilient AI Strategy — MongoDB Skill Badge (Credly: ukc2g4FK) | Nov 2026',
      'MongoDB Schema Design Optimization — MongoDB Skill Badge (Credly: 8e30ce61) | Nov 2026',
    ];

    badges.forEach(b => {
      checkPageBreak(12);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const bLines = doc.splitTextToSize(`• ${b}`, contentWidth - 4);
      doc.text(bLines, margin + 4, y);
      y += bLines.length * 10 + 2;
    });
    y += 4;
  }

  // 5. PROFESSIONAL EXPERIENCE
  renderSectionHeader('Professional Experience');

  const experiences = [
    {
      company: 'Founders',
      period: 'June 2025 – August 2026',
      role: 'Mobile & Full-Stack Engineer · Moscow, Russia',
      bullets: bulletStyle === 'xyz' ? [
        'Architected core mobile investment application from ground up using Flutter, Dart, BLoC/Cubit, and Clean Architecture, separating presentation, domain, and data layers into testable modular features.',
        'Accelerated client application rendering and scrolling performance by 30% by refactoring state trees, preventing redundant widget rebuilds, and caching network payloads.',
        'Integrated secure REST APIs and Firebase Firestore services to achieve real-time synchronization of dynamic deal rooms, investment portfolios, and investor verification.',
        'Engineered encrypted user session management using Flutter Secure Storage and JWT token rotation, eliminating unauthorized session hijacking vectors.',
        'Delivered production MVP on schedule, implementing reusable component libraries, form validation pipelines, and offline-resilient local storage.',
      ] : [
        'Led mobile architecture for investment platform using Flutter and Clean Architecture.',
        'Boosted app performance by 30% through state optimization and widget tree refactoring.',
        'Connected REST APIs and Firebase Firestore for real-time portfolio updates and investor workflows.',
        'Implemented secure session management and JWT authentication.',
      ],
    },
    {
      company: 'Independent Project Development',
      period: 'June 2026 – September 2026',
      role: 'Distributed Systems & Java Backend Developer · Moscow, Russia',
      bullets: bulletStyle === 'xyz' ? [
        'Constructed a distributed task processing engine using Java 21, Spring Boot, and RabbitMQ, handling multi-threaded job dispatching via ExecutorService and CompletableFuture.',
        'Guaranteed 100% execution consistency across multi-node clusters by engineering distributed locking via Redis and database unique constraint idempotency keys.',
        'Designed stateful recovery workers in PostgreSQL that automatically restore and resume uncompleted task pipelines after sudden container termination.',
        'Decreased system diagnosis time by 40% by implementing comprehensive Micrometer instrumentation and Prometheus dashboards monitoring queue backlogs and consumer latency.',
        'Developed exhaustive integration test suites utilizing Testcontainers and JUnit 5 to validate database transactional rollbacks and RabbitMQ dead-letter retry workflows.',
      ] : [
        'Engineered distributed background job execution platform using Java 21, Spring Boot, and RabbitMQ.',
        'Prevented duplicate job executions across distributed nodes with Redis locks and DB constraints.',
        'Built zero-data-loss recovery mechanisms to resume interrupted tasks upon service restart.',
        'Configured queue metrics and latency telemetry via Micrometer and Prometheus.',
      ],
    },
    {
      company: 'Kazan Federal University (Enterprise Academic Projects)',
      period: 'January 2023 – June 2024',
      role: 'Java Backend Engineer · Kazan, Russia',
      bullets: [
        'Centralized IAM Server: Engineered OAuth 2.0 / OIDC identity provider with Spring Authorization Server, multi-tenant RBAC, and Redis token blacklist caching (-50% verification latency).',
        'Event-Driven Logistics: Built asynchronous Kafka pipeline with PostGIS geospatial routing reducing courier assignment delays by 35% with live WebSocket status feeds.',
        'Transactional Outbox Payments: Microservices eliminating dual-write hazards with Kafka Dead Letter Topics and Testcontainers.',
      ],
    },
  ];

  experiences.forEach(exp => {
    checkPageBreak(35);
    // Company and Period
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(exp.company, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(exp.period, pageWidth - margin, y, { align: 'right' });
    y += 11;

    // Role
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(79, 70, 229);
    doc.text(exp.role, margin, y);
    y += 11;

    // Bullets
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    exp.bullets.forEach(bullet => {
      const bLines = doc.splitTextToSize(`• ${bullet}`, contentWidth - 8);
      checkPageBreak(bLines.length * 10 + 2);
      doc.text(bLines, margin + 4, y);
      y += bLines.length * 10 + 2;
    });
    y += 4;
  });

  // 6. EDUCATION
  renderSectionHeader('Education');

  const edu = [
    {
      inst: 'RTU MIREA (Russian Technological University)',
      period: '2026 – 2028 (Year 1)',
      degree: "Master's Degree in Software Engineering (Information Systems Architecture) · Moscow, Russia",
      note: 'State Scholarship Quota winner awarded by Ministry of Science and Higher Education of Russia.',
    },
    {
      inst: 'Kazan Federal University (KFU)',
      period: '2022 – 2026',
      degree: "Bachelor's Degree in Software Engineering · Higher Institute of ITIS · Kazan, Russia",
      note: 'Focus: Concurrent Programming, Distributed Systems, Relational Theory, System Design.',
    },
  ];

  edu.forEach(e => {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(e.inst, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(e.period, pageWidth - margin, y, { align: 'right' });
    y += 11;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(e.degree, margin, y);
    y += 10;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(e.note, margin, y);
    y += 12;
  });

  // 7. LANGUAGES
  renderSectionHeader('Languages');
  checkPageBreak(15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Arabic: Native proficiency  |  English: C1 (Advanced / Professional)  |  Russian: C1 (Advanced / Professional)', margin, y);

  // Direct Browser Download
  const filename = `Ahmed_Abdelgaffar_CV_${targetRole}.pdf`;
  doc.save(filename);
}
