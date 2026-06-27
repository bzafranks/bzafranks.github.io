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
  }
];
