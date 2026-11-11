/* =====================================================================
   PUBLIC SECTOR AI PORTFOLIO: SINGLE SOURCE OF CONTENT
   ---------------------------------------------------------------------
   Every word on the /public-sector-ai/ pages and in the PDF capability
   portfolio comes from this file. Edit here, then run:

       node public-sector-ai/_src/build.mjs          (web pages only)
       node public-sector-ai/_src/build.mjs --pdf    (web pages + PDF)

   EVIDENCE CATEGORIES (field `ev`), never blur them:
     A = Verified professional achievement   (source: CV / approved docs)
     B = Verified Ministry / government item (source: sources[] register)
     C = Proposed consulting capability
     D = Illustrative concept or demonstration

   `src` on category-A items says which document verifies the claim.
   PENDING marks a figure supplied by Dr. Franks in the project brief that
   is not in the July 2026 CV PDF and must be confirmed against the
   09.2026 CV (.docx) before publishing. Run with --strict to fail the
   build while any PENDING item remains.
   ===================================================================== */

export const PENDING = "PENDING: confirm against CV 09.2026";
const CV = "CV (07.2026 PDF)";

export const meta = {
  version: "1.0",
  versionDate: "2026-11-11",
  versionDateLong: "11 November 2026",
  baseUrl: "https://bzafranks.github.io/public-sector-ai/",
  siteUrl: "https://bzafranks.github.io/",
  pdfFile: "Franks-Public-Sector-AI-Workforce-Capability-Portfolio-v1.0.pdf",
  title: "AI Workforce Development & Digital Transformation Portfolio",
  seoDescription:
    "Dr. Barbara Zá Franks, EdD: AI learning architect and workforce development strategist. Learning systems, AI capability frameworks and evaluation for public service digital transformation.",
};

export const person = {
  name: "Dr. Barbara Zá Franks, EdD",
  shortName: "Dr. Barbara Zá Franks",
  title: "AI Learning Architect · Workforce Development Strategist · Digital Transformation Consultant",
  supporting: "Education Executive · Learning Experience Designer · AI-Enabled Learning Systems Specialist",
  location: "Freeport, Grand Bahama, The Bahamas",
  email: "barbara.franks@mydreamedu.org",
  linkedin: "https://www.linkedin.com/in/barbara-franks/",
  portrait: "../assets/img/barbara-franks.jpg",
  cvPdf: "../assets/docs/Dr-Barbara-Z-Franks-CV.pdf",
  company: "D.R.E.A.M. Learning Solutions LLC",
  companyRole: "Founder & Principal Consultant",
};

export const valueProposition =
  "Helping organizations translate AI innovation into workforce capability, measurable learning outcomes, and sustainable institutional transformation.";

export const centralMessage =
  "AI transformation succeeds when technology, people, learning, and organizational systems are developed together.";

/* ---------------- SECTION 1: HERO ---------------- */
export const hero = {
  eyebrow: "Public Sector AI Workforce Development",
  headline: "Building AI-Ready Workforces. Designing Learning Systems That Deliver Results.",
  sub: "Strategic learning design, AI workforce development, and digital transformation support for institutions navigating the future of work.",
  positioning:
    "I design, build and evaluate learning systems at scale, and I have led institutions through change. My work joins learning science, assessment architecture, analytics and executive leadership. That combination helps public institutions turn AI tools into real workforce capability.",
  credentials: [
    { label: "Doctor of Education in Leadership", ev: "A", src: CV },
    { label: "18 years in education & learning leadership", ev: "A", src: CV },
    { label: "Former Chief Academic Officer, multi-campus network", ev: "A", src: CV },
    { label: "Bahamian professional based in Freeport", ev: "A", src: CV },
  ],
  /* 30-second facts strip */
  facts: [
    { num: "50+", label: "campuses served by AI-enabled language arts programming I lead", ev: "A", src: CV },
    { num: "~35,490", label: "assessment items architected across five intervention courses", ev: "A", src: PENDING },
    { num: "1,200+", label: "students across four campuses under my regional leadership", ev: "A", src: CV },
    { num: "18 yrs", label: "of education, training and institutional leadership", ev: "A", src: CV },
  ],
};

/* ---------------- SECTION 2: WHY THIS WORK MATTERS ---------------- */
export const why = {
  label: "Proposed strategic perspective. This describes my professional view, not an existing Ministry programme.",
  intro:
    "Digital transformation is usually funded as a technology project. In practice, it succeeds or stalls on human capability. When people do not know when, how and why to use a tool, it does not change how work gets done.",
  points: [
    { h: "Technology needs workforce readiness", p: "Licences and platforms create opportunity. Results come only when staff can use them confidently in their own roles." },
    { h: "AI tools alone do not guarantee productivity", p: "Gains depend on good task selection, verifying outputs, and redesigning workflows. Access alone does not deliver them." },
    { h: "Role-specific pathways matter", p: "A finance officer, an HR officer and a policy analyst use AI differently. One generic course cannot serve them all." },
    { h: "Training must be measurable", p: "Effective programmes combine assessment, practical application, ongoing support and outcome indicators. Attendance is not enough." },
    { h: "Responsible use is a skill", p: "Human judgement, privacy safeguards and awareness of governance must be taught and checked. They cannot be assumed." },
  ],
};

/* ---------------- SECTION 3: CAPABILITY MATRIX ---------------- */
export const capabilities = [
  {
    id: "workforce",
    name: "AI Workforce Capability Development",
    involves: "Defining what AI-capable performance looks like by role, then building the pathways, practice and support to get there.",
    challenge: "Staff receive AI tools without clear expectations, safe-use guidance or role relevance.",
    deliverables: ["Role-based AI capability profiles", "Tiered learning pathways", "Manager and champion toolkits"],
    evidence: "I lead AI-enabled learning pathways in which each learner progresses on demonstrated mastery, across 50+ campuses (2 Hour Learning / Alpha Schools).",
    evidenceSrc: CV,
  },
  {
    id: "lxd",
    name: "Learning Experience & Curriculum Architecture",
    involves: "Designing complete learning systems, from competency maps and course structures to lessons, practice and media.",
    challenge: "Training is built course by course, so quality is uneven and nothing can be reused at scale.",
    deliverables: ["Curriculum architecture and blueprints", "Specification-driven content standards", "Prototype modules"],
    evidence: "I built full standards-aligned courses and narrated video lessons, each component mapped to sub-standards and calibrated for rigour.",
    evidenceSrc: CV,
  },
  {
    id: "products",
    name: "AI-Supported Learning Products",
    involves: "Shaping AI-enabled learning products with engineering and product teams: requirements, content models, quality rules and evaluation.",
    challenge: "Vendors and developers need a learning lead who can translate pedagogy into specifications they can build.",
    deliverables: ["Product and content specifications", "AI-use and quality rules", "Vendor evaluation criteria"],
    evidence: "I work cross-functionally with learning science, engineering, product and academic leadership on AI-powered adaptive platforms.",
    evidenceSrc: CV,
  },
  {
    id: "assessment",
    name: "Competency & Assessment Frameworks",
    involves: "Designing competency frameworks, mastery rules and assessment item banks that measure real capability, including scenario-based tasks.",
    challenge: "Completion rates do not show whether staff can actually apply a skill safely and well.",
    deliverables: ["Competency framework", "Scenario-based assessment banks", "Mastery and certification rules"],
    evidence: "I develop and quality-control standards-aligned assessment content. I use item-level analysis to redesign tests for construct validity.",
    evidenceSrc: CV,
  },
  {
    id: "analytics",
    name: "Learning Analytics & Evaluation",
    involves: "Defining indicators, dashboards and evaluation designs that show leaders who is progressing, who is at risk and what is working.",
    challenge: "Leaders cannot see whether an investment in training is changing practice.",
    deliverables: ["Indicator framework", "Dashboard specifications", "Pilot evaluation report"],
    evidence: "I review placement and performance using assessment scores, accuracy and time-on-task data, and I lead mixed-methods applied research.",
    evidenceSrc: CV,
  },
  {
    id: "implementation",
    name: "Institutional Implementation & Capacity Building",
    involves: "Leading rollout across sites and teams: policy, quality assurance, training of trainers, coaching and change management.",
    challenge: "Good programmes fail in implementation when leadership, policy and support are not aligned.",
    deliverables: ["Implementation and change plan", "Training-of-trainers programme", "Quality assurance protocols"],
    evidence: "As Regional Dean and Chief Academic Officer, I directed operations, policy, faculty development and quality assurance across a multi-campus network.",
    evidenceSrc: CV,
  },
];

/* ---------------- SECTION 4: CASE STUDIES ----------------
   documented[] = category A (what happened).
   application[] = category C (proposed public-sector transfer).
   diagram = conceptual only, never organizational data.            */
export const caseStudies = [
  {
    id: "curriculum-architecture",
    num: "01",
    title: "Scalable AI-Enabled Curriculum and Assessment Architecture",
    org: "2 Hour Learning / Alpha Schools",
    role: "AI-Driven English Language Arts Learning Strategist & Curriculum DRI · 12/2025 to present",
    summary: "I architected specification-driven courses and assessment banks that power AI-enabled, mastery-based learning across a 50+ campus network.",
    context: "A national network of 50+ campuses uses AI-powered adaptive platforms. Each learner advances at their own demonstrated level rather than by age or grade.",
    challenge: "Content had to be built at very high volume and still be rigorous, consistent, mapped to standards and usable by adaptive software. That could not be done one lesson at a time.",
    responsibilities: [
      "Directly Responsible Individual for Grades 3–8 Language Arts and PreK–12 Vocabulary across the system",
      "Course and program architecture, standards mapping and rigour calibration",
      "Assessment design and quality control, including item-level analysis and redesign",
      "Cross-functional work with learning science, engineering, product and academic leadership",
    ],
    approach: [
      "Defined a layered architecture: standards → components → subskill lessons → assessment items → mastery rules",
      "Calibrated item difficulty to external benchmarks (NWEA MAP RIT bands, Bloom's taxonomy distributions)",
      "Wrote reusable specifications so content and structured data could be produced consistently and consumed by software",
      "Designed AI-graded open-response assessment alongside selected-response items",
    ],
    evidence: [
      { num: "50+", label: "campuses in scope", src: CV },
      { num: "5", label: "language intervention courses", src: PENDING },
      { num: "209", label: "course components", src: PENDING },
      { num: "974", label: "subskill lessons", src: PENDING },
      { num: "~35,490", label: "assessment items", src: PENDING },
      { num: "1,800", label: "words in a Grades 7–12 vocabulary program", src: PENDING },
    ],
    competencies: ["Curriculum architecture", "Assessment design", "Specification writing", "AI-enabled product collaboration", "Quality assurance"],
    application: [
      "A public service AI curriculum built once as a modular architecture, then reused across ministries and roles",
      "Scenario-based item banks that test safe, correct AI use in realistic government tasks",
      "Specifications that let the Ministry, DICT or an external vendor build learning content to one quality standard",
    ],
    caution: "This experience comes from K–12 education. It shows I can design and scale learning systems. It is not evidence of public service workforce outcomes.",
    diagram: { kind: "flow", caption: "Conceptual architecture (illustrative, not organizational data)", steps: ["Standards & competencies", "Course components", "Subskill lessons", "Assessment items", "Mastery rules", "Progress analytics"] },
  },
  {
    id: "analytics-intervention",
    num: "02",
    title: "Analytics-Driven Learning Performance and Intervention Systems",
    org: "2 Hour Learning / Alpha Schools",
    role: "AI-Driven English Language Arts Learning Strategist & Curriculum DRI",
    summary: "I used learning data to find mis-placed and at-risk learners, close enrolment gaps and drive targeted interventions across campuses.",
    context: "Adaptive learning produces rich data on each learner: assessment scores, accuracy, experience points and time-on-task. It is only useful if someone turns it into action.",
    challenge: "Some learners were on the wrong level, some assessments were mis-calibrated, and some students had no active course assignment. All of these were hidden in system-wide data.",
    responsibilities: [
      "Individual placement and performance reviews using MAP RIT scores, XP, accuracy and time-on-task data",
      "Querying student data across all campuses to identify and resolve enrolment gaps",
      "Item-level analysis to surface mis-calibrated, low-rigour or decontextualised questions",
      "Translating data insights into classroom interventions with campus leads and guides",
    ],
    approach: [
      "Combined several indicators to decide whether each learner was correctly placed, at risk or ready to advance",
      "Ran system-wide queries so every eligible learner had an active Language and Vocabulary assignment",
      "Redesigned weak tests with passage-based items and balanced answer keys",
      "Built analytics dashboards that track learning performance and progression",
    ],
    evidence: [
      { num: "Grades 3–8", label: "Language placement reviews across the system", src: CV },
      { num: "All campuses", label: "queried for enrolment gaps", src: CV },
      { num: "Dashboards", label: "tracking performance & progression", src: PENDING },
    ],
    competencies: ["Learning analytics", "Data-informed decision-making", "Assessment validity", "Intervention design", "Stakeholder coordination"],
    application: [
      "An adoption and capability dashboard showing participation, competency and confidence by department",
      "Early identification of teams that need coaching or follow-up support",
      "Assessment quality review, so pilot results reflect real capability and not test artefacts",
    ],
    caution: "No student data, internal dashboards or proprietary content are shown. The diagram is a generic reconstruction.",
    diagram: { kind: "cycle", caption: "Generic data-to-intervention cycle (illustrative)", steps: ["Collect performance data", "Diagnose placement & risk", "Intervene with targeted support", "Re-assess & adjust"] },
  },
  {
    id: "multi-campus",
    num: "03",
    title: "Multi-Campus Institutional Learning and Professional Development",
    org: "KnowledgeLink · Barstow Schools in China · St. Mary's Online Academy",
    role: "Chief Academic Officer · Regional Dean · Principal & Academic Dean · Dean of Faculty · 2019–2025",
    summary: "I led academic operations, policy, quality assurance and faculty development across an international multi-campus network and an online diploma program.",
    context: "KnowledgeLink operates American international schools and an online U.S. high school diploma program for international students. They work across campuses, regulators and accreditation bodies.",
    challenge: "Teaching quality, policies and standards had to be consistent across several campuses and an online program. Each site was growing and had its own staff, culture and regulatory needs.",
    responsibilities: [
      "Directed academic operations for a multi-campus network of American international schools (Chief Academic Officer)",
      "Directed academic and operational management across four campuses serving over 1,200 students (Regional Dean)",
      "Standardised academic policies, handbooks and course catalogues; led curriculum alignment and audits",
      "Designed onboarding, in-service training, coaching and performance evaluation for faculty",
    ],
    approach: [
      "Cross-campus quality assurance and continuous-improvement initiatives",
      "Data-driven discussions to guide academic policy decisions",
      "Blended learning models for the online diploma program",
      "Mentoring of academic leaders, plus faculty recruitment and development",
    ],
    evidence: [
      { num: "4", label: "campuses under regional leadership", src: CV },
      { num: "1,200+", label: "students across those campuses", src: CV },
      { num: "900+", label: "students in one middle & high school I led", src: CV },
      { num: "2019–25", label: "progression from Dean of Faculty to Chief Academic Officer", src: CV },
    ],
    competencies: ["Executive leadership", "Policy development", "Professional development", "Quality assurance", "Change management"],
    application: [
      "Consistent AI training standards and quality assurance across ministries, departments and agencies",
      "Training-of-trainers and departmental AI champion networks",
      "Policy-aligned onboarding so new public officers learn approved AI practice from day one",
    ],
    caution: "These results are institutional leadership responsibilities in education. They are not government engagements.",
    diagram: { kind: "hub", caption: "Conceptual model: one standard, many sites (illustrative)", center: "Shared standards, policy & QA", steps: ["Campus / department A", "Campus / department B", "Campus / department C", "Online program"] },
  },
  {
    id: "workforce-research",
    num: "04",
    title: "Applied Workforce Research and Evaluation",
    org: "Virtuous Sea Corporation",
    role: "Chief Research Officer (fractional / consulting) · 04/2025 to present",
    summary: "I lead an applied research agenda on workforce readiness, labour-market trends and education outcomes, and I turn the evidence into recommendations.",
    context: "An international education and workforce intelligence organization needed rigorous research to inform the decisions of institutions, employers and policymakers.",
    challenge: "Turning mixed qualitative and quantitative evidence into findings that are credible, ethical and useful to decision-makers.",
    responsibilities: [
      "Lead applied research strategy and a multi-year research agenda, including workforce readiness and career outcomes",
      "Direct survey design, interview protocols, mixed-methods studies and data analysis",
      "Supervise research staff and collaborators for methodological rigour, data integrity and ethical compliance",
      "Author and oversee reports, white papers and presentations for institutions, employers and policymakers",
    ],
    approach: [
      "Mixed-methods designs that pair survey data with interviews",
      "Ethics and data-integrity controls built into each study",
      "Plain-language translation of findings into actionable recommendations",
      "Proprietary research frameworks for workforce intelligence",
    ],
    evidence: [
      { num: "Multi-year", label: "research agenda on workforce readiness & outcomes", src: CV },
      { num: "Mixed-methods", label: "survey, interview & data-analysis studies", src: CV },
      { num: "EdD", label: "doctoral qualitative research on leadership & retention", src: CV },
    ],
    competencies: ["Training needs assessment", "Evaluation design", "Survey & interview methods", "Research ethics", "Evidence-based recommendations"],
    application: [
      "A formal training needs assessment and AI capability baseline for public officers",
      "Pre- and post-pilot evaluation design with ethical data handling",
      "Evidence-based scale-up recommendations for Ministry leadership",
    ],
    caution: "No client data or unpublished findings are disclosed.",
    diagram: { kind: "flow", caption: "Generic applied research cycle (illustrative)", steps: ["Define questions", "Design instruments", "Collect & analyse", "Interpret with stakeholders", "Recommend & report"] },
  },
];

/* ---------------- SECTION 5: CAPABILITY FRAMEWORK (ev D) ---------------- */
export const framework = {
  name: "Public Service AI Capability Framework",
  label: "This is an illustrative consulting framework, offered for possible adaptation by the Ministry. It is not an adopted government framework.",
  note: "A final framework would be built through stakeholder consultation and aligned with existing Ministry initiatives, such as the National AI Literacy Initiative. It would also be based on a formal training needs assessment.",
  levels: [
    { n: 1, name: "AI Foundations", focus: "Understand", items: ["AI literacy", "Capabilities & limitations", "Responsible use", "Data privacy", "Human oversight"], outcome: "Explains what AI can and cannot do, and when not to use it." },
    { n: 2, name: "AI Productivity", focus: "Use", items: ["Drafting", "Summarisation", "Research support", "Communication", "Everyday knowledge work"], outcome: "Uses approved tools safely for routine tasks and verifies every output." },
    { n: 3, name: "Role-Specific Application", focus: "Apply", items: ["Administrative staff", "Human resources", "Finance", "Policy development", "Managers & departments"], outcome: "Applies AI to the real tasks and rules of their own role." },
    { n: 4, name: "Advanced AI-Enabled Workflows", focus: "Improve", items: ["Workflow redesign", "AI-assisted analysis", "Automation concepts", "Evaluation", "Responsible implementation"], outcome: "Redesigns team processes and evaluates AI use against risks and benefits." },
    { n: 5, name: "Sustainable Adoption & Performance", focus: "Sustain", items: ["Competency validation", "Performance support", "Coaching", "Analytics & adoption monitoring", "Continuous improvement"], outcome: "Capability is validated, supported and improved over time." },
  ],
  crossCutting: ["Privacy & data protection", "Accuracy & verification", "Confidentiality", "Human accountability"],
};

/* ---------------- SECTION 6: SAMPLE LEARNING EXPERIENCE (ev D) ---------------- */
export const module = {
  title: "AI for Public Service Productivity: Responsible Use in Everyday Work",
  minutes: "5–7 minutes",
  level: "Framework Levels 1–2 (Foundations & Productivity)",
  disclaimer: "This is an illustrative demonstration. The organisation, people and documents are fictional, and the data is synthetic. Nothing you enter is stored or sent anywhere. It is a scripted simulation and does not use a live AI service.",
  objectives: [
    { id: "o1", text: "Classify common work tasks as appropriate, appropriate with safeguards, or not appropriate for an approved AI assistant, based on data sensitivity and accountability." },
    { id: "o2", text: "Identify at least three errors or risks in an AI-generated draft before it is released." },
    { id: "o3", text: "Apply four safeguards to an AI-assisted task: protect personal data, verify, disclose, and keep human sign-off." },
  ],
  scenario: {
    who: "You are Jordan Pinder, a Senior Officer in the fictional Department of Licensing Services.",
    situation: "Your department has just been given an approved, organisation-licensed AI assistant. This morning you have 40 public enquiries about the (fictional) Small Business Licence Renewal. Your Director also wants a one-page briefing by 3:00 p.m.",
    tension: "The AI assistant could save you hours, but only if you use it well. Here are five tasks on your list today.",
  },
  sortTasks: [
    {
      id: "t1",
      task: "Summarise the department's publicly published renewal guidelines into a plain-language FAQ.",
      answer: "ok",
      fb: "Appropriate. The source is public and the task is low-risk. Still check every fact in the FAQ against the published guidelines before you share it.",
    },
    {
      id: "t2",
      task: "Paste a member of the public's email, which includes their full name, National Insurance number and a medical condition, into a free public chatbot to draft a reply.",
      answer: "no",
      fb: "Not appropriate. This is personal and sensitive data, and a public tool is not approved. Use approved tools only, and remove personal details first, or don't use AI at all.",
    },
    {
      id: "t3",
      task: "Ask the AI assistant to decide which applicants should receive a fee waiver.",
      answer: "no",
      fb: "Not appropriate. Decisions that affect a person's rights or entitlements need human judgement and accountability. AI may help organise information, but it must not make the decision.",
    },
    {
      id: "t4",
      task: "Use the approved assistant to summarise your team's internal meeting notes for the Director's briefing.",
      answer: "safe",
      fb: "Appropriate with safeguards. Use only the approved tool and remove any confidential items. Check that the summary reflects what was actually decided, then review it before you send it.",
    },
    {
      id: "t5",
      task: "Use the approved assistant to draft a courteous reply template with placeholders such as [Name] and [Reference No.].",
      answer: "safe",
      fb: "Appropriate with safeguards. Templates without personal data are a good use. Review the tone and accuracy, and follow your department's guidance on disclosing AI assistance.",
    },
  ],
  sortOptions: [
    { v: "ok", label: "Appropriate" },
    { v: "safe", label: "Appropriate with safeguards" },
    { v: "no", label: "Not appropriate" },
  ],
  draft: {
    intro: "You asked the approved assistant to draft a reply to a business owner whose renewal is late. Review the draft and select every sentence that must be corrected before it is sent.",
    sentences: [
      { id: "s1", text: "Dear [Name], thank you for contacting the Department of Licensing Services about your Small Business Licence renewal.", flaw: false, fb: "This sentence is fine. It uses a placeholder and the tone is courteous." },
      { id: "s2", text: "Under Section 14(3) of the Business Licence Act, 2019, a late fee of $250 has been applied to your account.", flaw: true, fb: "Correct this. The AI has invented a legal reference and a fee. Check every citation and amount against the official source." },
      { id: "s3", text: "You can submit your renewal and supporting documents through the department's online portal.", flaw: false, fb: "This sentence is fine, as long as the portal is the correct channel. It is consistent with the published guidelines." },
      { id: "s4", text: "Good news: your request for a fee waiver has been approved.", flaw: true, fb: "Correct this. No officer has made that decision. AI must never state or imply an outcome that a person has not authorised." },
      { id: "s5", text: "Please note that all renewals must be completed by 30 June or your business will be closed.", flaw: true, fb: "Correct this. The deadline and the consequence are not in the source material. Unverified, alarming statements can mislead the public." },
      { id: "s6", text: "If you have any questions, please reply to this message or call our office during business hours.", flaw: false, fb: "This sentence is fine. It is a standard, accurate closing." },
    ],
  },
  quiz: [
    {
      q: "The approved AI assistant gives you a statistic for your Director's briefing. What should you do first?",
      options: ["Include it, since the tool is approved", "Verify it against an authoritative source", "Round it to make it simpler", "Ask the AI if it is sure"],
      correct: 1, obj: "o2",
      fb: "Approval tells you the tool is permitted. It does not make every output accurate. Always verify facts, figures and citations against an authoritative source.",
    },
    {
      q: "Which information should never be entered into an AI tool that is not approved?",
      options: ["A public press release", "A generic email template", "A member of the public's personal and health details", "The department's opening hours"],
      correct: 2, obj: "o1",
      fb: "Personal and sensitive data must be protected. Use approved tools only, and remove personal details wherever you can.",
    },
    {
      q: "Who is accountable for a letter you send that was drafted with AI?",
      options: ["The AI vendor", "The IT department", "You, the officer who approves and sends it", "No one, if a disclaimer is added"],
      correct: 2, obj: "o3",
      fb: "Human accountability stays with the officer and the organisation. AI assists, and people decide and sign off.",
    },
    {
      q: "An AI draft cites a regulation you do not recognise. What is the best response?",
      options: ["Keep it, since it sounds authoritative", "Delete the whole draft", "Check the official source, and remove or correct it if you cannot confirm it", "Replace it with a similar-sounding regulation"],
      correct: 2, obj: "o2",
      fb: "AI tools can produce confident but invented references. Confirm them against the official source or take them out.",
    },
    {
      q: "Which combination best describes responsible AI use in everyday public service work?",
      options: ["Speed, automation and minimal review", "Protect data, verify outputs, disclose appropriately, keep human sign-off", "Use any tool that produces good results", "Avoid AI entirely to remove all risk"],
      correct: 1, obj: "o3",
      fb: "The four safeguards are to protect data, verify, disclose and keep human sign-off. They let staff gain productivity without losing trust.",
    },
  ],
  safeguardsCheck: {
    q: "Before you send any AI-assisted work, which of these safeguards apply? Select all that apply.",
    options: [
      { text: "Remove or protect personal and sensitive data", correct: true },
      { text: "Verify facts, figures and references against authoritative sources", correct: true },
      { text: "Disclose AI assistance where your department's policy requires it", correct: true },
      { text: "Keep a named officer's review and sign-off before release", correct: true },
      { text: "Let the AI make final eligibility decisions to ensure consistency", correct: false },
      { text: "Use any free AI tool if it is faster than the approved one", correct: false },
    ],
    fb: "The four safeguards are to protect data, verify, disclose and sign off. AI should not make decisions about people's entitlements, and unapproved tools put data at risk.",
  },
  considerations: [
    { h: "Privacy", p: "Use only approved tools. Remove names, ID numbers, health details and other personal data unless policy explicitly allows otherwise." },
    { h: "Accuracy", p: "Treat AI output as a first draft. Verify facts, figures, dates and legal references against authoritative sources." },
    { h: "Confidentiality", p: "Keep Cabinet, procurement, personnel and other restricted material out of AI tools unless they are specifically authorised for it." },
    { h: "Human oversight", p: "Decisions about people's rights, benefits or obligations stay with accountable officers. Review before you release anything." },
  ],
  competencyRule: "Competency is demonstrated at 80% or higher overall, with at least 60% on each objective.",
};

/* ---------------- SECTION 7: 90-DAY PILOT (ev C) ---------------- */
export const pilot = {
  name: "Public Service AI Workforce Readiness and Learning Design Pilot",
  label: "This is an illustrative proposal. The scope, staffing, systems access and schedule would all need to be agreed with the Ministry.",
  phases: [
    {
      n: 1, days: "Days 1–20", name: "Discover",
      focus: "Discovery, stakeholder engagement, training needs assessment and capability baseline.",
      deliverables: ["Stakeholder map and interview summary", "Training needs assessment instrument and findings", "AI capability baseline for pilot cohorts"],
    },
    {
      n: 2, days: "Days 21–45", name: "Design",
      focus: "Competency framework, role-specific pathways, curriculum prototypes and assessment design.",
      deliverables: ["Draft competency framework (adapted Levels 1–5)", "Two or three role-specific pathway outlines", "Prototype modules and scenario-based assessments"],
    },
    {
      n: 3, days: "Days 46–70", name: "Deliver",
      focus: "Training delivery, user testing, performance support and feedback.",
      deliverables: ["Pilot delivery to agreed cohorts", "Job aids and performance-support resources", "Mid-pilot feedback and usability findings"],
    },
    {
      n: 4, days: "Days 71–90", name: "Evaluate",
      focus: "Evaluation, adoption analysis, refinement and scale-up recommendations.",
      deliverables: ["Pilot evaluation report", "Refined modules and framework", "Scale-up roadmap and recommendations"],
    },
  ],
  indicators: [
    { h: "Participation & completion", p: "Enrolment, attendance and module completion by cohort" },
    { h: "Competency gain", p: "Pre- and post-training competency against the framework" },
    { h: "Scenario performance", p: "Results on realistic, role-based assessment tasks" },
    { h: "Appropriate AI use", p: "Correct task selection and safeguard application" },
    { h: "Employee confidence", p: "Self-reported confidence before and after" },
    { h: "Tool adoption", p: "Use of approved tools, where data is available" },
    { h: "Workflow proficiency", p: "Observed or self-reported proficiency on target workflows" },
    { h: "Participant feedback", p: "Relevance, quality and usefulness ratings" },
    { h: "Scaling readiness", p: "Evidence-based recommendations for the next phase" },
  ],
  indicatorsLabel: "These are proposed indicators, not achieved results. Targets would be set with the Ministry after the baseline.",
};

/* ---------------- SECTION 8: ENGAGEMENT (ev C) ---------------- */
export const engagement = {
  intro: "I am flexible about the form of engagement. It could be a defined project, an advisory role, an institutional partnership or another suitable arrangement. Work can be delivered personally or through D.R.E.A.M. Learning Solutions LLC.",
  label: "These are possible arrangements only. No engagement with the Ministry exists or is implied.",
  roles: [
    { h: "AI Workforce Learning Design Consultant", p: "Designs the end-to-end AI learning architecture for public officers." },
    { h: "AI Literacy & Capacity Building Specialist", p: "Builds foundations and productivity programmes, and trains trainers." },
    { h: "Learning Experience & Curriculum Architect", p: "Designs pathways, modules, media and content standards." },
    { h: "Digital Transformation Training & Adoption Adviser", p: "Aligns training with tool rollout, change management and support." },
    { h: "Learning Systems & Assessment Consultant", p: "Builds competency frameworks, item banks and certification rules." },
    { h: "Program Evaluation & Learning Analytics Specialist", p: "Designs needs assessments, indicators, dashboards and evaluation." },
  ],
  worksWith: "I work alongside AI engineers, software developers, Ministry departments, external technology vendors and government leadership. My role is learning, assessment and implementation lead. I am not a provider of infrastructure, cybersecurity or AI models.",
};

/* ---------------- SECTION 9: PROFILE ---------------- */
export const profile = {
  bio: [
    "Dr. Barbara Zá Franks is a Bahamian education executive and AI learning architect based in Freeport, Grand Bahama. Over 18 years she has worked across K–12, online and international education, moving from the classroom to Chief Academic Officer of a multi-campus international school network.",
    "She currently directs AI-enabled Language Arts and Vocabulary programming for a 50+ campus network at 2 Hour Learning / Alpha Schools. There she architects mastery-based courses, assessment systems and learning analytics alongside engineering and product teams. As Chief Research Officer (consulting) at Virtuous Sea Corporation, she leads applied research on workforce readiness and labour-market trends.",
    "Earlier, she held executive roles with KnowledgeLink, including Chief Academic Officer, Regional Dean and Academic Dean. In those roles she led policy, quality assurance and faculty development across campuses in China and an online U.S. diploma program, and she later served as Head of School in Anguilla. She holds a Doctor of Education in Leadership.",
    "She is committed to contributing her experience to national development: helping Bahamian institutions prepare their people for AI-driven change, responsibly and measurably.",
  ],
  education: [
    { deg: "Doctor of Education (EdD) in Leadership", inst: "American College of Education", yr: "2025" },
    { deg: "Master of Education (MEd) in Educational Leadership", inst: "American College of Education", yr: "2014" },
    { deg: "Bachelor of Arts in International Relations", inst: "Lynn University", yr: "2004" },
    { deg: "Teacher & educational administration credentials: DC Elementary Education; DC Administrative Services (K–12 Principal / Assistant Principal)", inst: "Incl. Post-Baccalaureate Teaching Certification, Moreland University (2016)", yr: "2014–2016" },
  ],
  /* Technical fluency: deliberately described as working knowledge. */
  tech: {
    note: "Working knowledge and AI-assisted development, applied to learning products. These are not advanced software-engineering credentials.",
    groups: [
      { h: "Learning standards", items: ["QTI 3 (assessment)", "OneRoster (rostering)", "CASE (competency frameworks)"], src: PENDING },
      { h: "Data & analytics", items: ["SQL / PostgreSQL", "Structured learning data", "Learning analytics & dashboards"], src: PENDING },
      { h: "Prototyping", items: ["Python & Flask", "REST APIs & OAuth", "Vercel deployment", "AI-assisted product development"], src: PENDING },
    ],
  },
};

/* ---------------- REFERENCE REGISTER (ev B) ----------------
   status: confirmed | in-progress | planned | proposed | reported
   Only items with status confirmed come from official .gov.bs sources
   AND describe something that already exists.                         */
export const sources = [
  {
    id: "mind-created",
    finding: "The Ministry of Innovation and National Development was created, with Hon. Sebastian Bastian sworn in as Minister and Hon. Wayde Watson as Minister of State.",
    source: "ZNS Bahamas: \"Bastian Leads Innovation Ministry\"", url: "https://znsbahamas.com/bastian-leads-innovation-ministry/",
    date: "18 May 2026", type: "National broadcaster", status: "confirmed",
    relevance: "Establishes the Ministry's leadership and its mandate to execute the National Development Plan.",
  },
  {
    id: "mind-pillars",
    finding: "The Ministry's four pillars are Modernize Government, Build Future Readiness, Develop Bahamian Talent and Drive National Development. It brings together DICT, the Digital Transformation Unit, BNSI and the National Development Plan Secretariat.",
    source: "ZNS Bahamas: \"Innovation and National Development Ministry Created to Prepare the Country for the Future\"", url: "https://znsbahamas.com/innovation-and-national-development-ministry-created-to-prepare-the-country-for-the-future/",
    date: "18 June 2026 (speech of 15 June 2026)", type: "National broadcaster", status: "confirmed",
    relevance: "\"Develop Bahamian Talent\" and \"Build Future Readiness\" align directly with workforce capability work.",
  },
  {
    id: "ai-literacy-bis",
    finding: "The Minister stated the Government will establish a National AI Literacy Initiative, with online and in-person training to be made available across the public service.",
    source: "Bahamas Information Services: \"This Government Administration to Prepare Bahamians for Emerging Technologies\"", url: "https://www.bahamas.gov.bs/news-press-release/this-government-administration-to-prepare-bahamians-for-emerging-technologies",
    date: "16 June 2026", type: "Official government (.gov.bs)", status: "planned",
    relevance: "Public service AI training is a stated priority, and capability frameworks, pathways and evaluation support it.",
  },
  {
    id: "ai-literacy-mind",
    finding: "The National AI Literacy Initiative is described as \"currently being developed\". Planned topics are AI fundamentals, responsible use, practical applications and digital skills, with government employees among the intended audience.",
    source: "Ministry website (mindbahamas.com): \"National AI Literacy Initiative: What it is and how to get involved\"", url: "https://mindbahamas.com/updates/national-ai-literacy-initiative",
    date: "21 June 2026", type: "Ministry website (not a .gov.bs domain)", status: "in-progress",
    relevance: "Framework Levels 1–2 map to these topics. Any engagement would complement the initiative, not duplicate it.",
  },
  {
    id: "m365",
    finding: "The site lists a Microsoft 365 rollout (Teams, SharePoint, Copilot, OneDrive) across the public service as \"in progress\".",
    source: "Ministry website (mindbahamas.com): Progress page", url: "https://mindbahamas.com/progress",
    date: "Undated (accessed 11 Nov 2026)", type: "Ministry website (not a .gov.bs domain)", status: "reported",
    relevance: "Rolling out tools creates an immediate need for role-specific adoption training. This could not be confirmed on a .gov.bs source.",
  },
  {
    id: "future-skills",
    finding: "The Bahamas Future Skills Academy (\"a national platform, online and in-person\"), a Bahamas AI Skills Initiative and a Smart Government Portal of AI tools for the public service are listed as \"planned\".",
    source: "Ministry website (mindbahamas.com): Progress page", url: "https://mindbahamas.com/progress",
    date: "Undated (accessed 11 Nov 2026)", type: "Ministry website (not a .gov.bs domain)", status: "planned",
    relevance: "These are proposed national learning platforms that would need curriculum, assessment and evaluation design.",
  },
  {
    id: "ai-committee",
    finding: "The Minister announced plans to establish a National Artificial Intelligence Committee to draft the country's first AI legislation, and plans for a national ID card with privacy and security protections.",
    source: "The Tribune: \"Bastian pledges new national ID card to reduce red tape\"", url: "https://www.tribune242.com/news/2026/jun/16/bastian-pledges-new-national-id-card-to-reduce-red-tape/",
    date: "16 June 2026", type: "External reporting", status: "planned",
    relevance: "Responsible-use content would need to align with emerging AI governance and legislation.",
  },
  {
    id: "mous",
    finding: "The Ministry reported agreements in principle with Estonia and Singapore, with MOUs expected. Topics include digital government, AI governance and public service capacity building.",
    source: "Bahamas Trade Info (gov.bs): \"Minister signs MOUs with tech-forward nations\"", url: "https://www.bahamastradeinfo.gov.bs/minister-signs-mous-with-tech-forward-nations/",
    date: "13 July 2026", type: "Official government (.gov.bs), reposted news", status: "proposed",
    relevance: "Public service capacity building is named as a cooperation area.",
  },
  {
    id: "data-protection",
    finding: "A draft Data Protection Bill, 2025, was described as modernising data protection, including for AI use.",
    source: "Bahamas Information Services: \"The Bahamas Government Seeking to Advance Strategies to Take Advantage of the Benefits of AI\"", url: "https://www.bahamas.gov.bs/news-press-release/the-bahamas-government-seeking-to-advance-strategies-to-take-advantage-of-the-benefits-of-ai",
    date: "22 October 2025", type: "Official government (.gov.bs)", status: "proposed",
    relevance: "Privacy safeguards in training must reflect the current law. Its status should be re-checked before any engagement.",
  },
  {
    id: "upskill",
    finding: "The Labour Minister reported more than 14,000 Bahamians enrolled in the free Upskill Bahamas platform, which includes AI training, and said plans for a Bahamas AI Academy are advancing.",
    source: "The Tribune: \"Minister: Bahamas ready for AI age\"", url: "https://www.tribune242.com/news/2026/jun/10/minister-bahamas-ready-for-ai-age/",
    date: "10 June 2026", type: "External reporting", status: "reported",
    relevance: "Shows national investment in AI skills across government. Coordination with existing platforms would matter.",
  },
  {
    id: "dict-m365",
    finding: "DICT operates a Microsoft Office 365 Unit and has run Microsoft Office training classes.",
    source: "Department of Information & Communications Technology", url: "https://www.dict.gov.bs/microsoft-office-365-unit",
    date: "Accessed 11 Nov 2026 (class announcement 20 Jul 2026)", type: "Official government (.gov.bs)", status: "confirmed",
    relevance: "Existing public service M365 training capacity, which any AI productivity pathway should build on.",
  },
];

export const statusLabels = {
  confirmed: "Confirmed",
  "in-progress": "In progress (as reported)",
  planned: "Planned / announced",
  proposed: "Proposed / draft",
  reported: "Reported, not independently confirmed",
};

export const evidenceKey = [
  { k: "A", h: "Verified professional achievement", p: "Drawn from Dr. Franks' CV or approved project documentation." },
  { k: "B", h: "Verified Ministry initiative", p: "Linked to a public source in the reference register, with its stated status." },
  { k: "C", h: "Proposed consulting capability", p: "What could be offered. It is not a description of past work for the Ministry." },
  { k: "D", h: "Illustrative concept or demonstration", p: "An original framework, sample module or diagram. It contains no organizational data." },
];

export const disclaimer =
  "This is an independent professional portfolio. It does not represent, and is not endorsed by, the Government of The Bahamas or the Ministry of Innovation and National Development. No existing relationship, vacancy, budget or contract is implied. References to government initiatives are drawn from public sources listed in the reference register.";
