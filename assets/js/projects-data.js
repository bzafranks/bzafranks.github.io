/* =====================================================================
   PORTFOLIO PROJECT REGISTRY  —  single source of truth
   ---------------------------------------------------------------------
   To add a new project to the portfolio homepage, add ONE object here.
   No other file needs to change. Fields:
     id, title, subtitle, pillar ('id' | 'il'), grade, status
     ('done' | 'progress' | 'planned'), url, icon, tags[], summary
   pillar: 'id' = Instructional Design · 'il' = Instructional Leadership
   ===================================================================== */
window.PORTFOLIO_PROJECTS = [
  {
    id: "grade3",
    title: "Grade 3 Asynchronous Learning System",
    subtitle: "Self-paced ELA for independent learners",
    pillar: "id",
    grade: "Grade 3",
    status: "done",
    url: "projects/grade3/index.html",
    icon: "✏️",
    tags: ["Asynchronous Learning", "ELA", "Interactive", "Elementary"],
    summary: "A complete self-paced online curriculum with interactive lessons, embedded videos, and progress tracking — built for independent students, supportive parents, and reviewing teachers."
  },
  {
    id: "grade5",
    title: "Grade 5 Hybrid Learning System",
    subtitle: "Instructional continuity during teacher shortages",
    pillar: "id",
    grade: "Grade 5",
    status: "done",
    url: "projects/grade5/index.html",
    icon: "🔄",
    tags: ["Hybrid Learning", "ELA", "AI Video", "Continuity"],
    summary: "A delivery-model-agnostic ELA ecosystem with AI-generated instructional video, that keeps rigorous instruction continuous whether led by a teacher, a substitute, or the student independently."
  },
  {
    id: "grade7-ai",
    title: "Grade 7 ELA — AI-Powered Personalized Learning",
    subtitle: "Adaptive, learner-tailored instruction",
    pillar: "id",
    grade: "Grade 7",
    status: "done",
    url: "projects/grade7-ai/index.html",
    icon: "🤖",
    tags: ["AI", "Personalized Learning", "ELA", "Middle School"],
    summary: "Demonstrates AI-enhanced personalization: adaptive pathways, intelligent feedback, and data-informed recommendations tailored to each learner."
  },
  {
    id: "bahamas-cbe",
    title: "Grade 4 Social Studies — Competency-Based Learning",
    subtitle: "Reimagining the Bahamas National Curriculum through mastery",
    pillar: "id",
    grade: "Bahamas · Gr 4",
    status: "done",
    url: "projects/grade4-cbe/index.html",
    icon: "🎯",
    tags: ["Competency-Based", "Mastery Learning", "Bahamas National Curriculum", "Social Studies"],
    summary: "Transforms the official Bahamas Grade 4 Social Studies curriculum into a mastery-based digital system — competencies, learning progressions, performance assessments, badges, and portfolios — with full curriculum fidelity."
  },
  {
    id: "bahamas-udl",
    title: "Grade 10 Biology — Universal Design for Learning",
    subtitle: "Making the Bahamas curriculum accessible to every learner",
    pillar: "id",
    grade: "Bahamas · Gr 10",
    status: "done",
    url: "projects/grade10-bio-udl/index.html",
    icon: "🧬",
    tags: ["UDL", "Inclusion", "Accessibility", "Biology", "Bahamas National Curriculum", "Virtual Lab"],
    summary: "Transforms the official Bahamas Grade 10 Biology curriculum into an inclusive digital system using Universal Design for Learning — multiple means of engagement, representation, and expression, a virtual lab, and a built-in accessibility toolbar."
  },
  {
    id: "bahamas-data",
    title: "Bahamas Educational Intelligence Platform",
    subtitle: "A data-driven instruction & school improvement system",
    pillar: "il",
    grade: "Bahamas · System",
    status: "done",
    url: "projects/edu-intelligence/index.html",
    icon: "📊",
    tags: ["Learning Analytics", "Data-Driven", "Dashboards", "AI Decision Support", "Educational Leadership"],
    summary: "A commercial-grade educational intelligence platform: role-based dashboards (teacher → ministry), learning analytics, an AI recommendation engine, curriculum monitoring, and AI executive briefings — turning Bahamian education data into action."
  },
  {
    id: "bahamas-career",
    title: "Bahamas Career & Future Skills Academy",
    subtitle: "A digital ecosystem for Technical High School Diploma pathways",
    pillar: "id",
    grade: "Bahamas · Secondary",
    status: "done",
    url: "projects/career-skills/index.html",
    icon: "🚀",
    tags: ["Career & Technical Education", "Future Skills", "Workforce", "PBL", "AI Literacy", "Micro-credentials"],
    summary: "A career-connected learning ecosystem supporting the new Bahamas Technical High School Diploma pathways — a future-skills framework, 12 career pathways, a PBL studio, AI & entrepreneurship hubs, a digital portfolio, micro-credentials, and employer connections."
  },
  {
    id: "bahamas-ai",
    title: "Bahamas National AI Strategy for Education",
    subtitle: "A national vision for responsible, equitable, transformative AI",
    pillar: "il",
    grade: "Bahamas · National",
    status: "done",
    url: "projects/ai-strategy/index.html",
    icon: "🧠",
    tags: ["AI Strategy", "Education Policy", "Governance", "Digital Transformation", "Educational Leadership", "Systems Design"],
    summary: "A world-class national AI-in-education strategy: vision, 9 strategic pillars, a governance & ethics framework, digital infrastructure, teacher capacity, equity, an interactive implementation roadmap, funding, risk, and M&E — system-level transformation for The Bahamas."
  },
  {
    id: "ai-teacher-assistant",
    title: "AI Teacher Assistant Platform",
    subtitle: "An AI productivity & instructional support system for K–12 educators",
    pillar: "id",
    grade: "K–12 · Product",
    status: "done",
    url: "projects/ai-teacher-assistant/index.html",
    icon: "✨",
    tags: ["AI Product", "Teacher Productivity", "Human-Centered AI", "SaaS Design", "Prompt Engineering", "EdTech"],
    summary: "A commercial-grade AI productivity platform for teachers — an AI workspace plus 14 tools (lesson planner, assessment & rubric generators, differentiation, parent communication, feedback, behavior docs, classroom management, PD coach, prompt & resource libraries, dashboard) with a command palette, dark mode, and human-in-the-loop design. First product in the AI for Education Innovation Suite."
  },
  {
    id: "ai-leadership-dashboard",
    title: "AI School Leadership Dashboard",
    subtitle: "An AI-powered decision intelligence platform for school leaders",
    pillar: "il",
    grade: "K–12 · Enterprise",
    status: "done",
    url: "projects/ai-leadership-dashboard/index.html",
    icon: "📊",
    tags: ["AI Decision Support", "Educational Leadership", "Learning Analytics", "Executive Dashboards", "Explainable AI", "School Improvement"],
    summary: "An enterprise executive decision-support platform for principals, leadership teams, and district administrators — 14 dashboards (executive, school health, instructional leadership, curriculum, teacher coaching, achievement, attendance, behavior, staffing, PD, improvement planning), an explainable AI executive assistant, and a board-ready report generator, with command palette, notification center, and dark mode. Part of the AI for Education Innovation Suite."
  },
  {
    id: "ai-curriculum-studio",
    title: "AI Curriculum Authoring Studio",
    subtitle: "Design curriculum, learning experiences & digital instruction with AI",
    pillar: "id",
    grade: "K–12 · Enterprise",
    status: "done",
    url: "projects/ai-curriculum-studio/index.html",
    icon: "🏗️",
    tags: ["AI Product", "Curriculum Development", "Learning Experience Design", "Authoring Platform", "Workflow Automation", "EdTech"],
    summary: "A complete concept-to-publication curriculum authoring platform — 16 tools (workspace, curriculum builder, scope & sequence, standards alignment, unit & lesson builders, assessment & rubric studios, interactive-learning & AI-video studios, resource generator, publishing center, collaboration hub, templates, analytics) with drag-and-drop building, a publishing wizard, command palette, and dark mode. Part of the AI for Education Innovation Suite."
  },
  {
    id: "ai-student-success",
    title: "AI Student Success Early Warning System",
    subtitle: "Responsible predictive analytics & intervention for K–12",
    pillar: "il",
    grade: "K–12 · Enterprise",
    status: "done",
    url: "projects/ai-student-success/index.html",
    icon: "🚦",
    tags: ["Predictive Analytics", "MTSS / RTI", "Explainable AI", "Student Success", "Learning Analytics", "Responsible AI"],
    summary: "An enterprise early-warning & intervention platform that helps educators identify students needing support earlier and coordinate MTSS interventions — executive & risk dashboards, whole-child student profiles, an explainable AI risk engine, MTSS tiers, intervention planning & monitoring, attendance/academic/behavior/well-being analytics, family engagement, and a report generator, with command palette, notification center, and dark mode. Responsible, educator-led, human-in-the-loop. Part of the AI for Education Innovation Suite."
  },
  {
    id: "ai-ilp-generator",
    title: "AI Individual Learning Plan Generator",
    subtitle: "Personalized learning pathways through responsible AI",
    pillar: "id",
    grade: "K–12 · Personalized",
    status: "done",
    url: "projects/ai-ilp-generator/index.html",
    icon: "🎯",
    tags: ["Personalized Learning", "Individual Learning Plans", "MTSS / UDL", "Explainable AI", "Differentiation", "Responsible AI"],
    summary: "An AI-powered personalized-learning platform that drafts Individual Learning Plans from learner evidence — 16 tools: student profile, strengths & interests, assessment review, learning-plan generator, SMART goals, pathways, AI recommendations (with rationale), accommodations & supports, intervention & enrichment planners, career connections, parent portal, teacher dashboard, progress monitoring, reports. The AI is a planning assistant; educators review and approve every plan. Command palette, dark mode. Part of the AI for Education Innovation Suite."
  },
  {
    id: "ai-content-factory",
    title: "AI Educational Content Factory",
    subtitle: "Turn one prompt into a complete instructional package",
    pillar: "id",
    grade: "K–12 · Enterprise",
    status: "done",
    url: "projects/ai-content-factory/index.html",
    icon: "🏭",
    tags: ["AI Product", "Educational Publishing", "Workflow Automation", "Content Production", "Multimedia Learning", "Enterprise Software"],
    summary: "An enterprise AI content-production platform that turns a single prompt into a complete instructional package (lesson, workbook, slides, video, assessment, rubric, interactive activity, teacher/student/parent guides, LMS package). 17 tools: content factory, wizard, lesson/assessment/video/interactive/presentation/workbook/teacher-guide/parent generators, LMS builder, publishing center, content library, an animated workflow-automation pipeline, analytics, and enterprise admin — with a human editorial gate. Command palette, dark mode. Part of the AI for Education Innovation Suite."
  },
  {
    id: "principal-leadership",
    title: "Principal Leadership Excellence Framework",
    subtitle: "An evidence-based system for building exceptional school leaders",
    pillar: "il",
    grade: "Leadership · System",
    status: "done",
    url: "projects/principal-leadership/index.html",
    icon: "🧭",
    tags: ["Educational Leadership", "School Improvement", "Leadership Development", "Teacher Retention", "Research-Based", "Executive Coaching"],
    summary: "A comprehensive leadership development system built on six integrated domains (Visionary, Instructional, People, Organizational, Community, Ethical) — with an interactive competency model, an 18-item scored leadership self-assessment (profile, readiness score, action plan), a development planner with saved reflection journal, instructional-leadership & observation toolkits, a culture dashboard, and leadership analytics. Grounded in leadership theory and Dr. Franks' doctoral research on leadership behaviors that influence teacher retention. First project in the Educational Leadership & School Improvement Suite."
  },
  {
    id: "teacher-retention",
    title: "Teacher Retention & Workforce Excellence System",
    subtitle: "Translating doctoral research into a teacher-retention leadership system",
    pillar: "il",
    grade: "Leadership · System",
    status: "done",
    url: "projects/teacher-retention/index.html",
    icon: "🎓",
    tags: ["Teacher Retention", "Educational Leadership", "Human Capital", "People Analytics", "Organizational Development", "Research-Based"],
    summary: "An evidence-based workforce-excellence system that translates Dr. Franks' doctoral research, 'The Influence of Leadership Behaviors on Teacher Retention,' into practice — a 10-pillar retention framework, a dissertation research showcase, leadership-behavior guides with a retention-leadership pulse self-assessment, teacher wellbeing/voice/recognition/growth toolkits, people-analytics dashboards, an early-warning retention-risk calculator, and a saved 90-day leadership action planner. Second project in the Educational Leadership & School Improvement Suite."
  }
];
