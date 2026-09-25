// Central configuration for OLYMPUS 2026 - ECE DEPARTMENT
// Authoritative source: Official Rule Book

export const EVENT_CONFIG = {
  name: "OLYMPUS",
  year: "2026",
  department: "ECE DEPARTMENT",
  fullDepartment: "Department of Electronics and Computer Engineering",
  institution: "SVERI'S COLLEGE OF ENGINEERING",
  venue: "Idea Lab, SVERI's College of Engineering",
  tagline: "BUILD. CREATE. CONQUER.",
  supportingText: "Where Ideas Meet Engineering.",
  heroSubtext: "An Electronics and Computer Engineering Department technology and creativity event where students build, innovate and showcase their skills at Idea Lab, SVERI's College of Engineering.",
  
  // Single central configurable target event date
  // Event Date: 2 October 2026, 09:00 AM IST
  eventDate: "2 October 2026",
  eventTime: "09:00 AM IST",
  eventTargetDate: "2026-10-02T09:00:00+05:30",
  isLiveText: "OLYMPUS IS LIVE",

  // Default event schedule for 2 October 2026
  defaultSchedule: [
    {
      id: "sched-1",
      title: "Reporting & Digital Pass Verification",
      description: "Team check-in, participant kit allocation, and welcome orientation briefing.",
      date: "02 October 2026",
      time: "09:00 AM – 10:00 AM",
      venue: "Idea Lab, SVERI's College of Engineering",
      round: "CHECK-IN",
      order: 1,
    },
    {
      id: "sched-2",
      title: "Arena 01 — Round 1: Frontend Engineering",
      description: "UI/UX component design, responsive wireframe implementation, and state architecture.",
      date: "02 October 2026",
      time: "10:00 AM – 12:30 PM",
      venue: "Idea Lab, SVERI's College of Engineering",
      round: "ROUND 01",
      order: 2,
    },
    {
      id: "sched-3",
      title: "Arena 02 — Drone Technology Exhibition",
      description: "Screening of Drone Video Making and Technical Poster Making exhibits before the panel.",
      date: "02 October 2026",
      time: "11:00 AM – 04:00 PM",
      venue: "Idea Lab, SVERI's College of Engineering",
      round: "ARENA 02",
      order: 3,
    },
    {
      id: "sched-4",
      title: "Arena 01 — Round 2: Backend & AI Integration",
      description: "Server architecture, API endpoints, database schema, and GenAI pipeline integration.",
      date: "02 October 2026",
      time: "01:30 PM – 03:30 PM",
      venue: "Idea Lab, SVERI's College of Engineering",
      round: "ROUND 02",
      order: 4,
    },
    {
      id: "sched-5",
      title: "Arena 01 — Round 3: Live Deployment & Defense",
      description: "Cloud deployment demonstration, live system walkthrough, and technical jury defense.",
      date: "02 October 2026",
      time: "03:45 PM – 05:00 PM",
      venue: "Idea Lab, SVERI's College of Engineering",
      round: "ROUND 03",
      order: 5,
    },
    {
      id: "sched-6",
      title: "Grand Valedictory & Prize Distribution",
      description: "Jury announcement of winners, felicitation of teams, and certificate presentation.",
      date: "02 October 2026",
      time: "05:15 PM – 06:00 PM",
      venue: "Idea Lab, SVERI's College of Engineering",
      round: "FINALE",
      order: 6,
    },
  ],

  // Official event quick statistics
  stats: [
    { label: "ARENAS", value: "2", subtext: "Full Stack AI & Drone Tech" },
    { label: "TEAM SIZE", value: "2–4", subtext: "Members / Team" },
    { label: "FEE", value: "₹100", subtext: "Per Participant" },
    { label: "ELIGIBILITY", value: "OPEN", subtext: "Open to All Branches" },
  ],

  // Mission Journey
  journeySteps: [
    { step: "01", title: "REGISTER", desc: "Form your squad and enroll online" },
    { step: "02", title: "BUILD YOUR TEAM", desc: "Collaborate with 2–4 members" },
    { step: "03", title: "CHOOSE YOUR ARENA", desc: "Select Full Stack AI or Drone Tech" },
    { step: "04", title: "CREATE", desc: "Design, build code or visual media" },
    { step: "05", title: "PRESENT", desc: "Defend your engineering before the jury" },
    { step: "06", title: "CONQUER", desc: "Rise to victory and claim honors" },
  ],

  // Arena 01: Full Stack Development with AI
  arena01: {
    id: "full-stack-ai",
    typeCode: "FULL_STACK_AI",
    number: "01",
    title: "FULL STACK DEVELOPMENT WITH AI",
    shortTitle: "Full Stack with AI",
    badge: "ENGINEERING ARENA",
    tagline: "Develop an innovative and functional web application using Full Stack Development and AI.",
    eligibility: "Open to All Branches",
    teamSize: "2–4 Members",
    fee: "₹100 / Participant",
    payment: {
      registrationFee: 100,
      paymentMobile: "9876543210",
      upiId: "olympus.fullstack@upi",
      qrCodeUrl: "/uploads/qr/qr-event-1.svg",
      paymentInstructions: "Complete payment using the QR code, UPI ID, or mobile number for Arena 01. Then submit your UTR number and payment screenshot.",
      paymentEnabled: true,
    },
    rounds: [
      {
        number: "ROUND 01",
        name: "Frontend",
        desc: "UI/UX engineering, intuitive wireframing, responsive layouts, and user interactions.",
        focus: ["Component Architecture", "State Management", "Visual Polish & Responsiveness"],
      },
      {
        number: "ROUND 02",
        name: "Backend / API",
        desc: "Robust API construction, database modeling, schema validation, and AI integration.",
        focus: ["REST/GraphQL APIs", "Data Integrity", "AI Model / GenAI Pipelines"],
      },
      {
        number: "ROUND 03",
        name: "Deployment & Presentation",
        desc: "Live production hosting, performance metrics, code walk-through, and judge evaluation.",
        focus: ["Cloud / Edge Deployment", "System Architecture Defense", "Judge Q&A"],
      },
    ],
    rules: [
      "Project must strictly follow the designated problem statement provided at kickoff.",
      "Proper input validation and server-side safety checks are mandatory.",
      "AI tools and libraries are permitted, but participants must understand and be able to defend their implementation.",
      "Plagiarism or direct uncredited copying of existing repositories is strictly prohibited.",
    ],
  },

  // Arena 02: Engineer's Got Talent (Drone Technology)
  arena02: {
    id: "engineers-got-talent",
    typeCode: "DRONE_EVENT",
    number: "02",
    title: "ENGINEER'S GOT TALENT",
    shortTitle: "Drone Technology",
    theme: "DRONE TECHNOLOGY",
    badge: "CREATIVE & TECH ARENA",
    tagline: "Showcase creativity, technical knowledge and innovative ideas related to Drone Technology.",
    eligibility: "Open to All Branches",
    teamSize: "2–4 Members",
    fee: "₹100 / Participant",
    payment: {
      registrationFee: 100,
      paymentMobile: "9123456789",
      upiId: "olympus.drone@upi",
      qrCodeUrl: "/uploads/qr/qr-event-2.svg",
      paymentInstructions: "Complete payment using the Drone Technology QR code, UPI ID, or mobile number for Arena 02. Then submit your UTR number and payment screenshot.",
      paymentEnabled: true,
    },
    categories: [
      {
        id: "video-making",
        typeCode: "DRONE_VIDEO",
        icon: "🎬",
        name: "VIDEO MAKING",
        desc: "Create a creative or informative video based on Drone Technology.",
        focus: ["Cinematography & Visual Editing", "Technical Depth on Drone Systems", "Storytelling & Impact"],
      },
      {
        id: "poster-making",
        typeCode: "DRONE_POSTER",
        icon: "🎨",
        name: "POSTER MAKING",
        desc: "Create an innovative poster based on Drone Technology.",
        focus: ["Infographic & Visual Design", "Aero/UAV Concepts & Schematics", "Clarity of Technical Idea"],
      },
    ],
    rules: [
      "All submitted content must strictly be related to Drone Technology (UAVs, autonomous flight, sensor payloads, applications).",
      "Work must be 100% original and crafted by registered team members.",
      "Participants must thoroughly explain and justify their idea and technical rationale to the judges.",
      "Copied, copyrighted or plagiarized content is not allowed and will lead to immediate disqualification.",
    ],
  },

  // Official FAQ questions faithfully derived from rulebook
  faq: [
    {
      q: "Who can participate in OLYMPUS?",
      a: "Participation is open to students from all engineering branches and years. Any student with enthusiasm for technology and creativity is welcome.",
    },
    {
      q: "What is the team size requirement?",
      a: "Teams must consist of 2 to 4 members. Solo entries and teams exceeding 4 members are not permitted.",
    },
    {
      q: "What is the registration fee?",
      a: "The registration fee is ₹100 per participant (e.g. ₹200 for a 2-person team, ₹300 for 3 persons, ₹400 for 4 persons).",
    },
    {
      q: "What are the rounds in Full Stack Development with AI?",
      a: "Arena 01 consists of three official rounds: Round 01 — Frontend, Round 02 — Backend / API, and Round 03 — Deployment & Presentation.",
    },
    {
      q: "What is the theme for Engineer's Got Talent?",
      a: "The central theme is Drone Technology. All submissions must directly reflect drone applications, flight principles, aerial robotics, or related innovations.",
    },
    {
      q: "What are the categories under Engineer's Got Talent?",
      a: "There are two official categories: 1) Video Making (creative or informative video) and 2) Poster Making (innovative technical poster).",
    },
    {
      q: "Are AI tools allowed during development?",
      a: "AI tools are permitted for Full Stack Development, but participants must understand their full implementation and be ready to explain the code and system architecture to the judges.",
    },
    {
      q: "Can copied or pre-existing templates be submitted?",
      a: "No. Plagiarism and copying are strictly prohibited. All code and creative materials must be original work developed for the event.",
    },
    {
      q: "What should participants explain to the judges?",
      a: "Participants must articulate their problem solving methodology, architecture, AI/drone concepts utilized, and answer technical questions during live evaluation.",
    },
  ],
};
