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
    title: "Bahamian Curriculum — Universal Design for Learning",
    subtitle: "Inclusive by design",
    pillar: "id",
    grade: "Bahamas",
    status: "planned",
    url: "",
    icon: "🌈",
    tags: ["UDL", "Inclusion", "Accessibility", "National Curriculum"],
    summary: "An inclusive instructional design model applying UDL so every learner — across abilities, languages, and needs — can access rigorous content."
  },
  {
    id: "bahamas-data",
    title: "Bahamian Curriculum — Data-Driven Instruction",
    subtitle: "Analytics that guide teaching",
    pillar: "il",
    grade: "Bahamas",
    status: "planned",
    url: "",
    icon: "📊",
    tags: ["Learning Analytics", "Data-Driven", "Leadership"],
    summary: "A learning-analytics and instructional decision-making system that turns student data into timely, actionable teaching moves and leadership insight."
  },
  {
    id: "bahamas-career",
    title: "Bahamian Curriculum — Career & Future Skills",
    subtitle: "Future-ready learning",
    pillar: "id",
    grade: "Bahamas",
    status: "planned",
    url: "",
    icon: "🚀",
    tags: ["Future Skills", "Career Readiness", "PBL"],
    summary: "A future-ready curriculum building durable skills, career awareness, and real-world competencies through project-based learning."
  },
  {
    id: "bahamas-ai",
    title: "Bahamian Curriculum — AI-Powered Personalized Learning",
    subtitle: "AI integration at national scale",
    pillar: "id",
    grade: "Bahamas",
    status: "planned",
    url: "",
    icon: "✨",
    tags: ["AI", "Personalized Learning", "National Curriculum"],
    summary: "Applies AI-driven personalization within the Bahamian curriculum to scale tailored instruction across a national system."
  }
];
