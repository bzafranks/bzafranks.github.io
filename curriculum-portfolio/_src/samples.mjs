/* Work-sample registry: one source for cards on the section home and the
   pathway pages. Card copy describes what each sample contains, never results. */
export const SAMPLES = {
  ws1: {
    n: "WS1", file: "ws1-unit.html", label: "rep",
    title: "Nature's Engineers: A Grade 4 Knowledge-Building Unit",
    hook: "How do beavers, termites and coral change the places they live?",
    card: "A Grade 4 unit built on a sequenced text set about animals that reshape their environments. Students build knowledge text by text, read closely, discuss, and write an explanatory piece that cites evidence. Includes the unit plan, knowledge progression, five fully written lessons, a culminating task with rubric, and a rights log for every text. All texts are original.",
    tags: ["Knowledge-building units", "Text sets", "Comprehension", "Permissions"],
  },
  ws2: {
    n: "WS2", file: "ws2-texts.html", label: "rep",
    title: "Six Original Texts for Grades 3–5",
    hook: "New passages, each with its complexity analysis shown.",
    card: "Six original literary and informational texts for readers in Grades 3–5, several set in The Bahamas. Each comes with a qualitative analysis, a quantitative readability estimate, and reader-and-task notes explaining where it fits and why. It shows writing for young readers and the judgment behind placing a text in a grade band, without relying on a single score.",
    tags: ["Original texts", "Text complexity", "Literary and informational", "Culturally relevant"],
  },
  ws3: {
    n: "WS3", file: "ws3-vocabulary.html", label: "rep",
    title: "Words That Unlock Words: A Grade 4 Vocabulary Module",
    hook: "Teaching word parts so students can work out the next word themselves.",
    card: "A Grade 4 vocabulary module drawn from the unit texts: a word selection rationale, explicit routines for Tier 2 words, morphology lessons on high-utility prefixes, suffixes and roots, and practice with corrective feedback. It connects word knowledge to comprehension, the language strands of the Reading Rope, and shows how each word earned its place.",
    tags: ["Vocabulary", "Morphology", "Structured literacy"],
  },
  ws4: {
    n: "WS4", file: "ws4-writing.html", label: "rep",
    title: "From Sentence to Essay: A Grade 5 Writing Sequence",
    hook: "One strong sentence at a time, toward an evidence-based opinion essay.",
    card: "A Grade 5 sequence that moves students from sentence-level work to paragraphs to a short opinion essay, grounded in paired texts. Includes modeled writing, graphic organizers, sentence expansion and combining, annotation and cross-text tasks, and an analytic rubric with scored examples. Sentence-level techniques are described in my own words, not borrowed from any program.",
    tags: ["Writing instruction", "Sentence-level work", "Text-based writing", "Rubrics"],
  },
  ws5: {
    n: "WS5", file: "ws5-intervention.html", label: "rep",
    title: "Breaking Big Words: A Grade 3 Intervention",
    hook: "For third graders who read short words well but stall on long ones.",
    card: "A small-group intervention for Grade 3 students who struggle with multisyllabic words. Includes entry criteria, a scope and sequence for syllable types and division, explicit scripted lessons with corrective feedback, connected-text practice, and progress-monitoring decision rules for when to adjust or exit. Built on structured literacy principles. It uses no student data.",
    tags: ["Structured literacy", "Decoding intervention", "Progress monitoring"],
  },
  ws6: {
    n: "WS6", file: "ws6-assessment.html", label: "rep",
    title: "Measuring What the Unit Teaches: Assessment and Rubrics",
    hook: "Every item mapped to a standard, every wrong answer explained.",
    card: "An end-of-unit assessment for Nature's Engineers: a blueprint, 22 items across selected-response, evidence-based and constructed-response formats, answer keys, distractor rationales, scoring rubrics and an item review checklist. It shows how each item measures the standard it claims, what each wrong answer reveals, and how teachers can read the results.",
    tags: ["Item writing", "Blueprints", "Rubrics", "Alignment"],
  },
  ws7: {
    n: "WS7", file: "ws7-editorial-qa.html", label: "ai",
    title: "Editing an AI-Drafted Lesson: An Editorial QA Case Study",
    hook: "A real AI draft, every issue logged, and the clean final side by side.",
    card: "An AI model was given a lesson brief, and its unedited draft was reviewed as a curriculum editor would: accuracy, alignment, accessibility, style consistency, bias and sources. The case study shows the redline, the issue log by category and severity, the revision cycle, the clean final and a print proofing pass. Every issue is one the draft really had.",
    tags: ["Editorial QA", "Copyediting", "Accessibility review", "Print proofing"],
  },
  ws8: {
    n: "WS8", file: "ws8-editorial-operations.html", label: "sim",
    title: "Running a Curriculum Release: An Editorial Operations Simulation",
    hook: "How I would run QA for a team of contract editors.",
    card: "A simulated curriculum release run end to end: an editorial brief, a QA workflow with checkpoints, a tracker, a reviewer calibration guide, vendor query templates, a change request, a decision log, status updates and a quality scorecard. Team members, timelines and data are simulated and labeled, so it shows method, not track record.",
    tags: ["QA process design", "Contractor coordination", "Quality metrics"],
  },
  ws9: {
    n: "WS9", file: "ws9-adult-module.html", label: "rep",
    title: "Mentoring New Teachers Through Feedback Conversations",
    hook: "An online and blended course for the people who help new teachers stay.",
    card: "A short online course with a live session for school leaders and mentors who support teachers in their first three years. Learners study a worked feedback conversation, practice in a branching scenario, check their understanding and plan a real conversation. Includes the design document, LMS structure, storyboard, facilitator guide, usability plan and evaluation plan.",
    tags: ["Adult learning", "ADDIE", "Scenario design", "LMS", "Evaluation"],
  },
  ws10: {
    n: "WS10", file: "ws10-ai-evaluation.html", label: "ai",
    title: "Scoring AI-Generated Classroom Materials",
    hook: "Three AI outputs, a rubric, and feedback that says what to fix.",
    card: "Three education artifacts generated by an AI model, a Grade 5 slide deck, a reading passage with questions and feedback on a student essay, each scored against an analytic rubric. Every score cites evidence from the artifact, and each written evaluation says what to change and why. It covers accuracy, pedagogy, alignment, visual presentation, accessibility and bias.",
    tags: ["AI evaluation", "Rubric scoring", "Written feedback", "Slide review"],
  },
  ws11: {
    n: "WS11", file: "ws11-codesign-pd.html", label: "ill",
    title: "Adapting a Unit With a Community, Then Supporting Teachers",
    hook: "Co-design and a 90-minute implementation workshop.",
    card: "A process for adapting curriculum with community input, shown on the Grade 4 unit and Grand Bahama ecosystems: a stakeholder map, a consultation guide and a feedback-to-decision log. Paired with a 90-minute workshop: facilitator guide, slide outline, participant materials, classroom look-fors and follow-up coaching. Example feedback is labeled illustrative, and no community voices are invented.",
    tags: ["Co-design", "Culturally responsive curriculum", "Teacher PD"],
  },
};

export const LABELS = {
  rep: "Representative sample",
  sim: "Simulated scenario",
  ai: "Reviews real AI output",
  ill: "Process sample, illustrative feedback",
  new: "New",
};

export const PATHWAYS = [
  { file: "path-curriculum.html", name: "Curriculum & ELA", for: "Core ELA and K–12 curriculum development roles",
    first: ["ws2", "ws1", "ws6"], also: ["ws3", "ws4", "ws5", "ws11"] },
  { file: "path-editorial-qa.html", name: "Editorial QA", for: "Curriculum editorial QA and review roles",
    first: ["ws7", "ws6", "ws1"], also: ["ws10", "ws2"] },
  { file: "path-qa-leadership.html", name: "QA leadership", for: "Editorial QA lead and content operations roles",
    first: ["ws8", "ws7", "ws9"], also: ["ws6"] },
  { file: "path-instructional-design.html", name: "Instructional design", for: "Adult, online and blended learning design roles",
    first: ["ws9", "ws11", "ws7"], also: ["ws10"] },
  { file: "path-ai-evaluation.html", name: "AI evaluation", for: "Education evaluator and AI-output review roles",
    first: ["ws10", "ws7", "ws6"], also: ["ws4"] },
];
