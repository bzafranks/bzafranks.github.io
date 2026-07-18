/* =====================================================================
   Inclusive Learning Hub — shared mock data layer
   ---------------------------------------------------------------------
   ONE source of truth for every portal (admin/teacher/parent/student/
   paraprofessional/therapist), the shared student profile, the course +
   lesson experience, and the scheduling demo. Loaded BEFORE script.js
   on every page. Pure client-side, no network calls, no backend.
   All figures are illustrative and clearly labeled as a demo.
   ===================================================================== */
(function (global) {
  "use strict";

  /* ---------------------------------------------------------------
     STAFF
     --------------------------------------------------------------- */
  var teachers = [
    { id: "T1", name: "Patricia Nguyen", role: "Teacher", subjects: ["ELA"], grades: [7], title: "Grade 7 ELA Teacher", email: "p.nguyen@ilh-demo.org", initials: "PN", color: "#3a6ea5" },
    { id: "T2", name: "Daniel Ortiz", role: "Teacher", subjects: ["Math"], grades: [6], title: "Grade 6 Mathematics Teacher", email: "d.ortiz@ilh-demo.org", initials: "DO", color: "#5b8c5a" },
    { id: "T3", name: "Angela Brooks", role: "Teacher", subjects: ["Science"], grades: [8], title: "Grade 8 Science Teacher", email: "a.brooks@ilh-demo.org", initials: "AB", color: "#8a5fb0" },
    { id: "T4", name: "Samuel Kim", role: "Teacher", subjects: ["Math"], grades: [9], title: "Grade 9 Algebra I Teacher", email: "s.kim@ilh-demo.org", initials: "SK", color: "#c07830" },
    { id: "T5", name: "Rachel Whitfield", role: "Teacher", subjects: ["Social Studies"], grades: [7], title: "Grade 7 Social Studies Teacher & Special Education Case Manager", email: "r.whitfield@ilh-demo.org", initials: "RW", color: "#b0507e" },
    { id: "T6", name: "Latoya Simmons", role: "Teacher", subjects: ["ELA"], grades: [6, 8], title: "Grade 6/8 ELA Teacher", email: "l.simmons@ilh-demo.org", initials: "LS", color: "#2f8f8a" }
  ];

  var paraprofessionals = [
    { id: "P1", name: "Priya Patel", title: "Instructional Paraprofessional", email: "p.patel@ilh-demo.org", initials: "PP", color: "#3a6ea5", assignedStudentIds: ["S01", "S07", "S13", "S19"] },
    { id: "P2", name: "Elijah Cross", title: "Instructional Paraprofessional", email: "e.cross@ilh-demo.org", initials: "EC", color: "#5b8c5a", assignedStudentIds: ["S03", "S11", "S22"] },
    { id: "P3", name: "Nadia Reyes", title: "1:1 Paraprofessional", email: "n.reyes@ilh-demo.org", initials: "NR", color: "#c07830", assignedStudentIds: ["S05", "S16"] },
    { id: "P4", name: "Corey Banks", title: "Instructional Paraprofessional", email: "c.banks@ilh-demo.org", initials: "CB", color: "#8a5fb0", assignedStudentIds: ["S09", "S14", "S20"] }
  ];

  var therapists = [
    { id: "TH1", name: "Emily Castillo", discipline: "Speech-Language Therapy", title: "Speech-Language Therapist, M.S. CCC-SLP", email: "e.castillo@ilh-demo.org", initials: "EC", color: "#3a6ea5", caseloadIds: ["S01", "S04", "S10", "S15", "S19", "S23"] },
    { id: "TH2", name: "Jason Whitfield", discipline: "Occupational Therapy", title: "Occupational Therapist, OTR/L", email: "j.whitfield@ilh-demo.org", initials: "JW", color: "#5b8c5a", caseloadIds: ["S03", "S07", "S13", "S21"] },
    { id: "TH3", name: "Renee Okafor", discipline: "Behavioral & Mental Health Counseling", title: "School Counselor, LPC", email: "r.okafor@ilh-demo.org", initials: "RO", color: "#b0507e", caseloadIds: ["S06", "S09", "S11", "S17", "S19"] }
  ];

  var admins = [
    { id: "A1", name: "Michael Torres", title: "Head of School", email: "m.torres@ilh-demo.org", initials: "MT", color: "#3a6ea5" },
    { id: "A2", name: "Denise Alvarado", title: "Director of Student Support", email: "d.alvarado@ilh-demo.org", initials: "DA", color: "#b0507e" }
  ];

  var parent = { id: "PAR1", name: "Maria Thompson", relationship: "Mother", email: "maria.thompson@familymail-demo.org", phone: "(555) 214-7788", studentIds: ["S01"] };

  /* ---------------------------------------------------------------
     STUDENTS — 24 across grades 6-9
     Programme: "General Education" | "Inclusive Learning Support"
     supportPlan.type: null | "IEP" | "504"
     --------------------------------------------------------------- */
  function stu(o) { return o; }
  var students = [
    stu({ id: "S01", first: "Jordan", last: "Thompson", grade: 7, homeroom: "7B", programme: "Inclusive Learning Support", initials: "JT", color: "#3a6ea5",
      attendanceRate: 93, academicStatus: "needs-support", supportPlan: { type: "IEP", status: "active", startDate: "2025-09-08", reviewDate: "2026-09-08", nextAnnualReview: "2027-01-15" },
      caseManagerId: "T5", paraId: "P1", therapistIds: ["TH1"], parentId: "PAR1",
      strengths: ["Creative storytelling", "Strong visual memory", "Kind to peers, natural collaborator"],
      interests: ["Graphic novels", "Basketball", "Building with LEGO", "Ocean animals"],
      alerts: ["Annual IEP review due in 6 months", "1 missed speech-language session this month"] }),
    stu({ id: "S02", first: "Ava", last: "Martinez", grade: 6, homeroom: "6A", programme: "General Education", initials: "AM", color: "#5b8c5a", attendanceRate: 97, academicStatus: "on-track", supportPlan: { type: null }, caseManagerId: null, paraId: null, therapistIds: [], parentId: null }),
    stu({ id: "S03", first: "Noah", last: "Bennett", grade: 8, homeroom: "8C", programme: "Inclusive Learning Support", initials: "NB", color: "#8a5fb0", attendanceRate: 88, academicStatus: "needs-support", supportPlan: { type: "IEP", status: "active", startDate: "2024-11-02", reviewDate: "2026-11-02" }, caseManagerId: "T3", paraId: "P2", therapistIds: ["TH2"], parentId: null }),
    stu({ id: "S04", first: "Sophia", last: "Chen", grade: 9, homeroom: "9D", programme: "Inclusive Learning Support", initials: "SC", color: "#c07830", attendanceRate: 91, academicStatus: "on-track", supportPlan: { type: "504", status: "active", startDate: "2025-01-20", reviewDate: "2026-08-20" }, caseManagerId: "T4", paraId: null, therapistIds: ["TH1"], parentId: null }),
    stu({ id: "S05", first: "Liam", last: "Osei", grade: 6, homeroom: "6B", programme: "Inclusive Learning Support", initials: "LO", color: "#2f8f8a", attendanceRate: 79, academicStatus: "at-risk", supportPlan: { type: "IEP", status: "active", startDate: "2024-09-15", reviewDate: "2026-09-15" }, caseManagerId: "T2", paraId: "P3", therapistIds: [], parentId: null,
      alerts: ["Chronic attendance concern — below 80% for 3 consecutive weeks"] }),
    stu({ id: "S06", first: "Isabella", last: "Rossi", grade: 7, homeroom: "7A", programme: "General Education", initials: "IR", color: "#b0507e", attendanceRate: 95, academicStatus: "on-track", supportPlan: { type: null }, caseManagerId: null, paraId: null, therapistIds: ["TH3"], parentId: null }),
    stu({ id: "S07", first: "Mason", last: "Delgado", grade: 8, homeroom: "8A", programme: "Inclusive Learning Support", initials: "MD", color: "#3a6ea5", attendanceRate: 90, academicStatus: "needs-support", supportPlan: { type: "IEP", status: "active", startDate: "2025-02-10", reviewDate: "2026-02-10" }, caseManagerId: "T3", paraId: "P1", therapistIds: ["TH2"], parentId: null }),
    stu({ id: "S08", first: "Mia", last: "Washington", grade: 9, homeroom: "9A", programme: "General Education", initials: "MW", color: "#5b8c5a", attendanceRate: 99, academicStatus: "on-track", supportPlan: { type: null }, caseManagerId: null, paraId: null, therapistIds: [], parentId: null }),
    stu({ id: "S09", first: "Ethan", last: "Park", grade: 6, homeroom: "6A", programme: "Inclusive Learning Support", initials: "EP", color: "#8a5fb0", attendanceRate: 85, academicStatus: "needs-support", supportPlan: { type: "504", status: "active", startDate: "2025-03-01", reviewDate: "2026-09-01" }, caseManagerId: "T2", paraId: "P4", therapistIds: ["TH3"], parentId: null,
      alerts: ["2 missed counseling sessions this month"] }),
    stu({ id: "S10", first: "Amara", last: "Johnson", grade: 7, homeroom: "7B", programme: "Inclusive Learning Support", initials: "AJ", color: "#c07830", attendanceRate: 94, academicStatus: "on-track", supportPlan: { type: "IEP", status: "active", startDate: "2024-10-05", reviewDate: "2026-10-05" }, caseManagerId: "T5", paraId: null, therapistIds: ["TH1"], parentId: null }),
    stu({ id: "S11", first: "Lucas", last: "Fernandez", grade: 8, homeroom: "8B", programme: "Inclusive Learning Support", initials: "LF", color: "#2f8f8a", attendanceRate: 82, academicStatus: "at-risk", supportPlan: { type: "IEP", status: "review-due", startDate: "2024-08-19", reviewDate: "2026-08-19" }, caseManagerId: "T3", paraId: "P2", therapistIds: ["TH3"], parentId: null,
      alerts: ["IEP annual review expires in 18 days", "Declining assignment completion — 3-week downward trend"] }),
    stu({ id: "S12", first: "Chloe", last: "Baptiste", grade: 9, homeroom: "9B", programme: "General Education", initials: "CB", color: "#b0507e", attendanceRate: 96, academicStatus: "on-track", supportPlan: { type: null }, caseManagerId: null, paraId: null, therapistIds: [], parentId: null }),
    stu({ id: "S13", first: "Elijah", last: "Ramirez", grade: 6, homeroom: "6B", programme: "Inclusive Learning Support", initials: "ER", color: "#3a6ea5", attendanceRate: 92, academicStatus: "needs-support", supportPlan: { type: "IEP", status: "active", startDate: "2025-05-12", reviewDate: "2026-05-12" }, caseManagerId: "T2", paraId: "P1", therapistIds: ["TH2"], parentId: null }),
    stu({ id: "S14", first: "Grace", last: "Okonkwo", grade: 7, homeroom: "7A", programme: "Inclusive Learning Support", initials: "GO", color: "#5b8c5a", attendanceRate: 89, academicStatus: "needs-support", supportPlan: { type: "504", status: "active", startDate: "2025-01-08", reviewDate: "2026-07-08" }, caseManagerId: "T5", paraId: "P4", therapistIds: [], parentId: null }),
    stu({ id: "S15", first: "Benjamin", last: "Wu", grade: 8, homeroom: "8C", programme: "General Education", initials: "BW", color: "#8a5fb0", attendanceRate: 98, academicStatus: "on-track", supportPlan: { type: null }, caseManagerId: null, paraId: null, therapistIds: ["TH1"], parentId: null }),
    stu({ id: "S16", first: "Zara", last: "Hassan", grade: 9, homeroom: "9C", programme: "Inclusive Learning Support", initials: "ZH", color: "#c07830", attendanceRate: 86, academicStatus: "needs-support", supportPlan: { type: "IEP", status: "active", startDate: "2024-09-22", reviewDate: "2026-09-22" }, caseManagerId: "T4", paraId: "P3", therapistIds: [], parentId: null }),
    stu({ id: "S17", first: "Nathaniel", last: "Brooks", grade: 6, homeroom: "6A", programme: "General Education", initials: "NB", color: "#2f8f8a", attendanceRate: 94, academicStatus: "on-track", supportPlan: { type: null }, caseManagerId: null, paraId: null, therapistIds: ["TH3"], parentId: null }),
    stu({ id: "S18", first: "Olivia", last: "Santos", grade: 7, homeroom: "7B", programme: "General Education", initials: "OS", color: "#b0507e", attendanceRate: 97, academicStatus: "on-track", supportPlan: { type: null }, caseManagerId: null, paraId: null, therapistIds: [], parentId: null }),
    stu({ id: "S19", first: "Jayden", last: "Mitchell", grade: 8, homeroom: "8A", programme: "Inclusive Learning Support", initials: "JM", color: "#3a6ea5", attendanceRate: 78, academicStatus: "at-risk", supportPlan: { type: "IEP", status: "active", startDate: "2024-12-01", reviewDate: "2026-12-01" }, caseManagerId: "T3", paraId: "P1", therapistIds: ["TH1", "TH3"], parentId: null,
      alerts: ["Chronic attendance concern", "2 missed speech-language sessions this month"] }),
    stu({ id: "S20", first: "Harper", last: "Lindqvist", grade: 9, homeroom: "9A", programme: "Inclusive Learning Support", initials: "HL", color: "#5b8c5a", attendanceRate: 90, academicStatus: "on-track", supportPlan: { type: "504", status: "active", startDate: "2025-04-14", reviewDate: "2026-10-14" }, caseManagerId: "T4", paraId: "P4", therapistIds: [], parentId: null }),
    stu({ id: "S21", first: "Sebastian", last: "Diallo", grade: 6, homeroom: "6B", programme: "Inclusive Learning Support", initials: "SD", color: "#8a5fb0", attendanceRate: 91, academicStatus: "needs-support", supportPlan: { type: "IEP", status: "active", startDate: "2025-02-27", reviewDate: "2026-02-27" }, caseManagerId: "T2", paraId: null, therapistIds: ["TH2"], parentId: null }),
    stu({ id: "S22", first: "Layla", last: "Haddad", grade: 7, homeroom: "7A", programme: "General Education", initials: "LH", color: "#c07830", attendanceRate: 95, academicStatus: "on-track", supportPlan: { type: null }, caseManagerId: null, paraId: "P2", therapistIds: [], parentId: null }),
    stu({ id: "S23", first: "Gabriel", last: "Moreau", grade: 8, homeroom: "8B", programme: "Inclusive Learning Support", initials: "GM", color: "#2f8f8a", attendanceRate: 93, academicStatus: "on-track", supportPlan: { type: "IEP", status: "active", startDate: "2024-10-30", reviewDate: "2026-10-30" }, caseManagerId: "T3", paraId: null, therapistIds: ["TH1"], parentId: null }),
    stu({ id: "S24", first: "Aaliyah", last: "Coleman", grade: 9, homeroom: "9D", programme: "General Education", initials: "AC", color: "#b0507e", attendanceRate: 92, academicStatus: "on-track", supportPlan: { type: null }, caseManagerId: null, paraId: null, therapistIds: [], parentId: null })
  ];
  students.forEach(function (s) { s.name = s.first + " " + s.last; if (!s.alerts) s.alerts = []; });

  /* ---------------------------------------------------------------
     COURSES  (8) + the flagship Grade 7 ELA class
     --------------------------------------------------------------- */
  var courses = [
    { id: "C1", title: "Grade 7 English Language Arts", subject: "ELA", grade: 7, teacherId: "T1", mode: "Blended", period: "Period 2", room: "Room 214", flagship: true },
    { id: "C2", title: "Grade 6 Mathematics", subject: "Math", grade: 6, teacherId: "T2", mode: "Blended", period: "Period 1", room: "Room 108" },
    { id: "C3", title: "Grade 8 Science", subject: "Science", grade: 8, teacherId: "T3", mode: "Blended", period: "Period 3", room: "Lab 2" },
    { id: "C4", title: "Grade 9 Algebra I", subject: "Math", grade: 9, teacherId: "T4", mode: "Blended", period: "Period 4", room: "Room 301" },
    { id: "C5", title: "Grade 7 Social Studies", subject: "Social Studies", grade: 7, teacherId: "T5", mode: "In-Person", period: "Period 5", room: "Room 210" },
    { id: "C6", title: "Grade 6 English Language Arts", subject: "ELA", grade: 6, teacherId: "T6", mode: "Blended", period: "Period 2", room: "Room 112" },
    { id: "C7", title: "Grade 9 Biology", subject: "Science", grade: 9, teacherId: "T3", mode: "Blended", period: "Period 6", room: "Lab 1" },
    { id: "C8", title: "Grade 8 English Language Arts", subject: "ELA", grade: 8, teacherId: "T6", mode: "Online", period: "Period 3", room: "Virtual" }
  ];

  // Grade 7 ELA roster — mixed ability, includes Jordan
  var g7elaRoster = ["S01", "S06", "S10", "S14", "S18", "S22"];

  var modules = [
    { id: "M1", courseId: "C1", title: "Understanding Narrative Perspective", order: 1,
      components: ["Video lesson", "Reading", "Interactive activity", "Printable worksheet", "Online assignment", "Discussion", "Assessment"],
      summary: "Students distinguish first-, second-, and third-person point of view and analyze how narrator perspective shapes meaning." },
    { id: "M2", courseId: "C1", title: "Character Development", order: 2,
      components: ["Video lesson", "Reading", "Interactive activity", "Printable worksheet", "Online assignment", "Discussion", "Assessment"],
      summary: "Students trace how authors reveal character through action, dialogue, and internal thought, then apply the technique to original writing.", lessonReady: true, lessonUrl: "lesson-m2.html" },
    { id: "M3", courseId: "C1", title: "Writing a Personal Narrative", order: 3,
      components: ["Video lesson", "Reading", "Interactive activity", "Printable worksheet", "Online assignment", "Discussion", "Assessment"],
      summary: "Students plan, draft, and revise a personal narrative with a clear sequence of events, sensory detail, and a reflective conclusion.", lessonReady: true, lessonUrl: "lesson.html" }
  ];

  /* ---------------------------------------------------------------
     ATTENDANCE — schoolwide trend + Jordan's detailed log
     --------------------------------------------------------------- */
  var attendanceTrend = [
    { week: "Wk 1", rate: 96 }, { week: "Wk 2", rate: 95 }, { week: "Wk 3", rate: 94 },
    { week: "Wk 4", rate: 93 }, { week: "Wk 5", rate: 95 }, { week: "Wk 6", rate: 92 },
    { week: "Wk 7", rate: 94 }, { week: "Wk 8", rate: 93 }
  ];
  var jordanAttendanceLog = [
    { date: "2026-06-29", status: "Present" }, { date: "2026-06-30", status: "Present" },
    { date: "2026-07-01", status: "Tardy" }, { date: "2026-07-02", status: "Present" },
    { date: "2026-07-03", status: "Present" }, { date: "2026-07-06", status: "Absent — Excused (medical)" },
    { date: "2026-07-07", status: "Present" }, { date: "2026-07-08", status: "Present" },
    { date: "2026-07-09", status: "Present" }, { date: "2026-07-10", status: "Present" }
  ];

  /* ---------------------------------------------------------------
     ASSESSMENTS + ASSIGNMENTS (Grade 7 ELA focus)
     --------------------------------------------------------------- */
  var assessments = [
    { id: "AS1", courseId: "C1", title: "Narrative Perspective Check", type: "Formative Quiz", date: "2026-06-18", classAvg: 82 },
    { id: "AS2", courseId: "C1", title: "Character Development Assessment", type: "Module Assessment", date: "2026-07-02", classAvg: 78 },
    { id: "AS3", courseId: "C1", title: "Reading Comprehension Benchmark", type: "Benchmark", date: "2026-05-14", classAvg: 76 }
  ];
  var jordanAssessmentScores = [
    { assessmentId: "AS1", score: 74 }, { assessmentId: "AS2", score: 71 }, { assessmentId: "AS3", score: 68 }
  ];

  var assignments = [
    { id: "AG1", courseId: "C1", moduleId: "M1", title: "Point-of-View Analysis Worksheet", due: "2026-07-14", status: "Assigned" },
    { id: "AG2", courseId: "C1", moduleId: "M2", title: "Character Trait Web (graphic organizer)", due: "2026-07-16", status: "Assigned" },
    { id: "AG3", courseId: "C1", moduleId: "M3", title: "Personal Narrative — First Draft", due: "2026-07-21", status: "Not Started" },
    { id: "AG4", courseId: "C5", title: "Community & Government Reading Response", due: "2026-07-15", status: "Assigned" }
  ];
  var jordanAssignmentStatus = { AG1: "In Progress", AG2: "Submitted", AG3: "Not Started", AG4: "In Progress" };

  var classCompletion = { onTrack: 4, needsSupport: 2 }; // out of 6 in g7elaRoster
  var standardsMastery = [
    { standard: "RL.7.1 Cite evidence", mastery: 74 },
    { standard: "RL.7.3 Analyze characters", mastery: 68 },
    { standard: "RL.7.6 Analyze point of view", mastery: 81 },
    { standard: "W.7.3 Write narratives", mastery: 70 }
  ];

  /* ---------------------------------------------------------------
     GOALS — Jordan's 4 IEP goals w/ progress history for charting
     --------------------------------------------------------------- */
  var goals = [
    { id: "G1", studentId: "S01", domain: "Reading Comprehension", baseline: 40, target: 80, current: 63,
      staff: "Rachel Whitfield (Case Manager)", lastUpdate: "2026-07-08",
      history: [40, 45, 48, 52, 55, 58, 60, 63], status: "on-track",
      description: "When given a grade-level narrative passage, Jordan will identify the main idea and 3 supporting details with 80% accuracy across 4 consecutive trials." },
    { id: "G2", studentId: "S01", domain: "Written Expression", baseline: 35, target: 75, current: 48,
      staff: "Patricia Nguyen (ELA Teacher)", lastUpdate: "2026-07-05",
      history: [35, 37, 39, 41, 43, 45, 46, 48], status: "needs-attention",
      description: "Jordan will independently produce a 3-paragraph narrative with a clear beginning, middle, and end, scoring 75% or higher on the writing rubric." },
    { id: "G3", studentId: "S01", domain: "Executive Functioning", baseline: 30, target: 85, current: 58,
      staff: "Priya Patel (Paraprofessional)", lastUpdate: "2026-07-09",
      history: [30, 34, 38, 42, 46, 50, 54, 58], status: "on-track",
      description: "Jordan will use a visual planner to independently sequence and complete a 3-step assignment in 4 of 5 opportunities." },
    { id: "G4", studentId: "S01", domain: "Communication", baseline: 45, target: 85, current: 66,
      staff: "Emily Castillo (Speech-Language Therapist)", lastUpdate: "2026-07-07",
      history: [45, 49, 52, 55, 58, 61, 63, 66], status: "on-track",
      description: "Jordan will initiate and maintain a 4-exchange conversation with a peer on a preferred topic in 4 of 5 structured opportunities." }
  ];

  /* ---------------------------------------------------------------
     ACCOMMODATIONS — Jordan's 8, w/ implementation tracking
     --------------------------------------------------------------- */
  var accommodations = [
    { id: "AC1", studentId: "S01", type: "Extended Time", setting: "All assessments", staff: "All teachers", frequency: "Every assessment", lastUse: "2026-07-02" },
    { id: "AC2", studentId: "S01", type: "Chunked Assignments", setting: "ELA, Social Studies", staff: "Patricia Nguyen, Rachel Whitfield", frequency: "Daily", lastUse: "2026-07-10" },
    { id: "AC3", studentId: "S01", type: "Visual Directions", setting: "All classes", staff: "All teachers, Priya Patel", frequency: "Daily", lastUse: "2026-07-10" },
    { id: "AC4", studentId: "S01", type: "Read-Aloud", setting: "ELA assessments", staff: "Patricia Nguyen", frequency: "Every assessment", lastUse: "2026-07-02" },
    { id: "AC5", studentId: "S01", type: "Reduced-Distraction Setting", setting: "Testing / independent work", staff: "Priya Patel", frequency: "As needed", lastUse: "2026-06-28" },
    { id: "AC6", studentId: "S01", type: "Alternative Response Options", setting: "ELA, Social Studies", staff: "Patricia Nguyen, Rachel Whitfield", frequency: "Weekly", lastUse: "2026-07-08" },
    { id: "AC7", studentId: "S01", type: "Graphic Organizers", setting: "ELA writing tasks", staff: "Patricia Nguyen", frequency: "Every writing task", lastUse: "2026-07-09" },
    { id: "AC8", studentId: "S01", type: "Frequent Check-Ins", setting: "All classes", staff: "Priya Patel", frequency: "Every class period", lastUse: "2026-07-10" }
  ];

  /* ---------------------------------------------------------------
     THERAPY SERVICES + SESSIONS
     --------------------------------------------------------------- */
  var therapyServices = [
    { id: "SV1", studentId: "S01", type: "Speech-Language Therapy", therapistId: "TH1", frequency: "2x weekly, 30 min", requiredMinutesMonthly: 240, deliveredMinutesMonthly: 210, goalIds: ["G4"] }
  ];
  var therapySessions = [
    { id: "SS1", studentId: "S01", therapistId: "TH1", type: "Speech-Language Therapy", date: "2026-07-08", time: "10:15 AM", mode: "In-Person", goalIds: ["G4"],
      activities: "Structured conversation practice using preferred-topic photo cards; peer role-play with visual turn-taking cue cards.",
      performanceData: "Initiated 4/5 conversational exchanges independently; needed 1 verbal prompt to maintain topic.",
      promptLevel: "Minimal verbal prompting", summary: "Jordan showed strong initiation skills today and is close to meeting the 4-of-5 independence criterion.",
      homeRecommendation: "Practice a 2-minute check-in conversation about Jordan's day at dinner, using open-ended questions.", status: "Completed" },
    { id: "SS2", studentId: "S01", therapistId: "TH1", type: "Speech-Language Therapy", date: "2026-07-01", time: "10:15 AM", mode: "Virtual", goalIds: ["G4"],
      activities: "Video-call conversation practice with digital conversation-starter cards.", performanceData: "Initiated 3/5 exchanges independently.",
      promptLevel: "Moderate verbal prompting", summary: "Session held virtually due to scheduling conflict; Jordan engaged well on camera.",
      homeRecommendation: "Continue preferred-topic conversation starters.", status: "Completed" },
    { id: "SS3", studentId: "S01", therapistId: "TH1", type: "Speech-Language Therapy", date: "2026-06-24", time: "10:15 AM", mode: "In-Person", goalIds: ["G4"],
      activities: "Missed — student was absent (excused).", performanceData: "—", promptLevel: "—", summary: "Session missed; rescheduled make-up completed 6/26.", homeRecommendation: "—", status: "Missed" },
    { id: "SS4", studentId: "S01", therapistId: "TH1", type: "Speech-Language Therapy", date: "2026-07-15", time: "10:15 AM", mode: "In-Person", status: "Scheduled" }
  ];

  var serviceMinuteCompliance = [
    { discipline: "Speech-Language Therapy", required: 1440, delivered: 1305 },
    { discipline: "Occupational Therapy", required: 960, delivered: 900 },
    { discipline: "Counseling", required: 720, delivered: 660 }
  ];

  /* ---------------------------------------------------------------
     BEHAVIOR
     --------------------------------------------------------------- */
  var behaviorIncidents = [
    { id: "B1", studentId: "S19", date: "2026-07-07", type: "Classroom disruption", response: "Redirect + break offered", staff: "Angela Brooks" },
    { id: "B2", studentId: "S09", date: "2026-07-03", type: "Difficulty with transition", response: "Visual schedule + counselor check-in", staff: "Renee Okafor" },
    { id: "B3", studentId: "S01", date: "2026-06-20", type: "Frustration during independent writing", response: "Break + graphic organizer offered", staff: "Priya Patel" }
  ];
  var behaviorTrend = [
    { month: "Feb", incidents: 14 }, { month: "Mar", incidents: 11 }, { month: "Apr", incidents: 9 },
    { month: "May", incidents: 8 }, { month: "Jun", incidents: 6 }, { month: "Jul", incidents: 5 }
  ];

  /* ---------------------------------------------------------------
     PARENT COMMUNICATION
     --------------------------------------------------------------- */
  var messages = [
    { id: "MS1", from: "Patricia Nguyen", to: "Maria Thompson", date: "2026-07-09", subject: "Great progress on the Character Web!",
      body: "Hi Ms. Thompson — Jordan completed the Character Trait Web independently today and shared a really thoughtful example during class discussion. Proud of the growth in confidence!" },
    { id: "MS2", from: "Emily Castillo", to: "Maria Thompson", date: "2026-07-08", subject: "Speech session update",
      body: "Jordan initiated 4 of 5 conversation exchanges today with only one prompt — this is right at goal criterion. Great carryover from the home practice you've been doing!" },
    { id: "MS3", from: "Maria Thompson", to: "Rachel Whitfield", date: "2026-07-06", subject: "Question about the upcoming IEP review",
      body: "Hi Ms. Whitfield, I wanted to confirm the date for Jordan's annual review meeting and ask whether we could add a discussion of extended time for the state assessment." }
  ];

  /* ---------------------------------------------------------------
     ADMIN DASHBOARD AGGREGATES
     --------------------------------------------------------------- */
  function count(pred) { return students.filter(pred).length; }
  var enrollmentByProgramme = [
    { label: "General Education", value: count(function (s) { return s.programme === "General Education"; }) },
    { label: "Inclusive Learning Support", value: count(function (s) { return s.programme === "Inclusive Learning Support"; }) }
  ];
  var onTrackVsSupport = [
    { label: "On Track", value: count(function (s) { return s.academicStatus === "on-track"; }) },
    { label: "Needs Support", value: count(function (s) { return s.academicStatus === "needs-support"; }) },
    { label: "At Risk", value: count(function (s) { return s.academicStatus === "at-risk"; }) }
  ];
  var academicPerformanceTrend = [
    { term: "Q1", avg: 74 }, { term: "Q2", avg: 76 }, { term: "Q3", avg: 75 }, { term: "Q4 (to date)", avg: 78 }
  ];
  var goalProgressByProgramme = [
    { label: "Reading", pct: 71 }, { label: "Writing", pct: 63 }, { label: "Executive Function", pct: 68 }, { label: "Communication", pct: 75 }
  ];
  var subgroupPerformance = [
    { label: "General Education", avg: 82 }, { label: "Inclusive Learning Support", avg: 71 }, { label: "English Learners", avg: 74 }
  ];
  var parentEngagement = [
    { week: "Wk 1", pct: 61 }, { week: "Wk 2", pct: 64 }, { week: "Wk 3", pct: 68 }, { week: "Wk 4", pct: 66 }, { week: "Wk 5", pct: 72 }, { week: "Wk 6", pct: 75 }
  ];
  var staffWorkload = [
    { name: "Patricia Nguyen", students: 96, caseload: 0 }, { name: "Rachel Whitfield", students: 88, caseload: 12 },
    { name: "Emily Castillo", students: 0, caseload: 6 }, { name: "Priya Patel", students: 0, caseload: 4 }
  ];

  var attentionRequired = {
    decliningPerformance: students.filter(function (s) { return s.id === "S11" || s.id === "S19"; }),
    missedTherapy: [
      { student: "Jordan Thompson", service: "Speech-Language Therapy", missed: "6/24 session (make-up completed)" },
      { student: "Ethan Park", service: "Counseling", missed: "2 sessions this month" },
      { student: "Jayden Mitchell", service: "Speech-Language & Counseling", missed: "2 sessions this month" }
    ],
    expiringPlans: [
      { student: "Lucas Fernandez", plan: "IEP", expires: "2026-08-19", daysLeft: 18 },
      { student: "Jordan Thompson", plan: "IEP Annual Review", expires: "2027-01-15", daysLeft: 187 }
    ],
    attendanceConcerns: students.filter(function (s) { return s.attendanceRate < 85; }),
    uncoveredAssignments: [
      { role: "Paraprofessional", period: "Period 6, Room 108", reason: "Corey Banks — approved leave 7/14" }
    ],
    overdueEvaluations: [
      { student: "Noah Bennett", evaluation: "Triennial Re-evaluation", due: "2026-06-30", status: "3 days overdue" }
    ]
  };

  /* ---------------------------------------------------------------
     SCHEDULING DEMO
     --------------------------------------------------------------- */
  var scheduleDay = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  var schedulePeriods = ["8:00", "8:50", "9:45", "10:40", "11:35", "12:55", "1:50", "2:45"];
  var scheduleEvents = [
    { id: "E1", day: "Mon", start: "8:00", end: "8:45", title: "Grade 7 ELA", type: "class", who: "Patricia Nguyen", where: "Room 214", studentIds: g7elaRoster },
    { id: "E2", day: "Mon", start: "10:15", end: "10:45", title: "Speech-Language Therapy — Jordan Thompson", type: "therapy", who: "Emily Castillo", where: "Therapy Room 3", studentIds: ["S01"], virtual: false },
    { id: "E3", day: "Mon", start: "10:15", end: "10:45", title: "Speech-Language Therapy — Sophia Chen", type: "therapy", who: "Emily Castillo", where: "Therapy Room 3", studentIds: ["S04"], virtual: false, conflict: true },
    { id: "E4", day: "Tue", start: "9:45", end: "10:30", title: "Grade 7 ELA", type: "class", who: "Patricia Nguyen", where: "Room 214", studentIds: g7elaRoster },
    { id: "E5", day: "Tue", start: "1:50", end: "2:20", title: "Occupational Therapy — Noah Bennett", type: "therapy", who: "Jason Whitfield", where: "Sensory Room", studentIds: ["S03"], virtual: false },
    { id: "E6", day: "Wed", start: "8:00", end: "8:45", title: "Grade 7 ELA", type: "class", who: "Patricia Nguyen", where: "Room 214", studentIds: g7elaRoster },
    { id: "E7", day: "Wed", start: "11:35", end: "12:05", title: "Counseling — Ethan Park", type: "therapy", who: "Renee Okafor", where: "Counseling Suite", studentIds: ["S09"], virtual: true, link: "meet.ilh-demo.org/okafor-park" },
    { id: "E8", day: "Thu", start: "10:15", end: "10:45", title: "Speech-Language Therapy — Jordan Thompson (make-up)", type: "therapy", who: "Emily Castillo", where: "Virtual", studentIds: ["S01"], virtual: true, link: "meet.ilh-demo.org/castillo-thompson" },
    { id: "E9", day: "Fri", start: "8:00", end: "8:45", title: "Grade 7 ELA", type: "class", who: "Patricia Nguyen", where: "Room 214", studentIds: g7elaRoster },
    { id: "E10", day: "Mon", start: "12:55", end: "1:40", title: "Paraprofessional Support — Priya Patel", type: "para", who: "Priya Patel", where: "Room 214", studentIds: ["S01", "S07", "S13", "S19"] },
    { id: "E11", day: "Fri", start: "9:45", end: "10:30", title: "Room 214 Booking — IEP Team Meeting", type: "room", who: "Rachel Whitfield", where: "Room 214", conflict: true },
    { id: "E12", day: "Fri", start: "9:45", end: "10:15", title: "Grade 7 ELA make-up support session", type: "class", who: "Patricia Nguyen", where: "Room 214", studentIds: ["S01"], conflict: true }
  ];

  /* ---------------------------------------------------------------
     FORMS / TASKS (parent + admin)
     --------------------------------------------------------------- */
  var forms = [
    { id: "F1", title: "Annual IEP Review — Parent Input Form", due: "2026-07-20", status: "Needs Attention" },
    { id: "F2", title: "Field Trip Permission — Regional Science Fair", due: "2026-07-25", status: "Not Started" },
    { id: "F3", title: "Emergency Contact Update", due: "2026-06-30", status: "Complete" }
  ];

  /* ---------------------------------------------------------------
     EXPORT
     --------------------------------------------------------------- */
  global.ILH = {
    meta: { productName: "Inclusive Learning Hub", subtitle: "A Unified LMS, SIS, CMS, and Student Support Platform", today: "2026-07-12" },
    parent: parent, admins: admins,
    teachers: teachers, paraprofessionals: paraprofessionals, therapists: therapists,
    students: students, courses: courses, modules: modules, g7elaRoster: g7elaRoster,
    attendanceTrend: attendanceTrend, jordanAttendanceLog: jordanAttendanceLog,
    assessments: assessments, jordanAssessmentScores: jordanAssessmentScores,
    assignments: assignments, jordanAssignmentStatus: jordanAssignmentStatus,
    classCompletion: classCompletion, standardsMastery: standardsMastery,
    goals: goals, accommodations: accommodations,
    therapyServices: therapyServices, therapySessions: therapySessions, serviceMinuteCompliance: serviceMinuteCompliance,
    behaviorIncidents: behaviorIncidents, behaviorTrend: behaviorTrend,
    messages: messages, forms: forms,
    enrollmentByProgramme: enrollmentByProgramme, onTrackVsSupport: onTrackVsSupport,
    academicPerformanceTrend: academicPerformanceTrend, goalProgressByProgramme: goalProgressByProgramme,
    subgroupPerformance: subgroupPerformance, parentEngagement: parentEngagement, staffWorkload: staffWorkload,
    attentionRequired: attentionRequired,
    scheduleDay: scheduleDay, schedulePeriods: schedulePeriods, scheduleEvents: scheduleEvents,

    /* ---------------- helpers ---------------- */
    getStudent: function (id) { return students.filter(function (s) { return s.id === id; })[0]; },
    getTeacher: function (id) { return teachers.filter(function (t) { return t.id === id; })[0]; },
    getPara: function (id) { return paraprofessionals.filter(function (p) { return p.id === id; })[0]; },
    getTherapist: function (id) { return therapists.filter(function (t) { return t.id === id; })[0]; },
    getCourse: function (id) { return courses.filter(function (c) { return c.id === id; })[0]; },
    jordan: function () { return students[0]; },
    avg: function (arr) { return arr.length ? Math.round(arr.reduce(function (a, b) { return a + b; }, 0) / arr.length) : 0; }
  };
})(window);
