export interface Coordinator {
  role: string;
  name: string;
  email: string;
  phone: string;
  type: 'general' | 'full-stack' | 'drone';
  tag: string;
  description: string;
  theme?: string;
  eventTitle?: string;
}

export const coordinators: Coordinator[] = [
  {
    role: "Whole Event Coordinator",
    name: "Rukumpeth Sushant Shivkumar",
    email: "sushantsrukumpeth25@coep.sveri.ac.in",
    phone: "8766442198",
    type: "general",
    tag: "CHIEF CONVENER",
    description: "For general queries related to the OLYMPUS event, registration, schedule and overall event coordination."
  },
  {
    role: "Full Stack Development with AI Coordinator",
    eventTitle: "FULL STACK DEVELOPMENT WITH AI",
    name: "Potalkar Om Uttam",
    email: "omupotalkar25@coep.sveri.ac.in",
    phone: "9075118929",
    type: "full-stack",
    tag: "ARENA 01 HEAD",
    description: "For queries related to Full Stack Development with AI, frontend, backend/API, database, AI integration, deployment, evaluation and presentation."
  },
  {
    role: "Engineer's Got Talent Coordinator",
    eventTitle: "ENGINEER'S GOT TALENT",
    theme: "DRONE TECHNOLOGY",
    name: "Labade Yash Tanaji",
    email: "yashtlabade25@coep.sveri.ac.in",
    phone: "9226478308",
    type: "drone",
    tag: "ARENA 02 HEAD",
    description: "For queries related to Engineer's Got Talent, Drone Technology, Video Making and Poster Making."
  }
];
