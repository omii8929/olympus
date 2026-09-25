import React, { useState } from 'react';
import { ShieldCheck, Code2, Video, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { SectionHeader } from '../components/common/SectionHeader';
import { HUDFrame } from '../components/common/HUDFrame';
import { EVENT_CONFIG } from '../config/eventConfig';

export const RulesPage: React.FC = () => {
  const [openSection, setOpenSection] = useState<string>('general');

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? '' : id);
  };

  const sections = [
    {
      id: 'general',
      title: 'GENERAL RULES & ELIGIBILITY',
      icon: <ShieldCheck className="w-5 h-5 text-olympus-cyan" />,
      content: [
        { label: 'Participation Eligibility', text: 'Open for all engineering branches and academic years.' },
        { label: 'Official Team Size', text: 'Teams must strictly consist of 2 to 4 members. Individual entries are not allowed.' },
        { label: 'Registration Fee', text: '₹100 per participant. Total team fee = Number of members × ₹100.' },
        { label: 'Originality & Academic Integrity', text: 'All submitted projects and media must be original. Plagiarism, direct copying, or uncredited reproduction will result in immediate disqualification.' },
        { label: 'Code of Conduct', text: 'All participants must exhibit professional engineering conduct and respect judges, mentors, and fellow competitors.' },
        { label: 'Prizes & Scoring Matrix', text: 'To be announced by the organizers during the valedictory session.' },
      ],
    },
    {
      id: 'fullstack',
      title: 'ARENA 01: FULL STACK DEVELOPMENT WITH AI',
      icon: <Code2 className="w-5 h-5 text-olympus-cyan" />,
      content: [
        { label: 'Event Objective', text: 'Develop an innovative and functional web application using Full Stack Development and AI.' },
        { label: 'Problem Statement', text: 'Projects must strictly follow the official problem statement released at the commencement of the event.' },
        { label: 'Round 01: Frontend', text: 'Teams will architect user interfaces, responsive layouts, component hierarchies, and interactive states.' },
        { label: 'Round 02: Backend / API', text: 'Teams will implement server logic, API endpoints, database schemas, and AI integrations.' },
        { label: 'Round 03: Deployment & Presentation', text: 'Live production cloud deployment and architectural presentation defense before the jury panel.' },
        { label: 'Input Validation', text: 'Proper client-side and server-side input validation and error handling are mandatory.' },
        { label: 'AI Tools Policy', text: 'AI tools and assistants are permitted, but participants must thoroughly understand, explain, and defend their implementation during judge Q&A.' },
        { label: 'Plagiarism Rule', text: 'Plagiarism or copying from existing codebases without substantial original work is strictly prohibited.' },
      ],
    },
    {
      id: 'drone',
      title: "ARENA 02: ENGINEER'S GOT TALENT (DRONE TECHNOLOGY)",
      icon: <Video className="w-5 h-5 text-olympus-cyan" />,
      content: [
        { label: 'Event Objective', text: 'Showcase creativity, technical knowledge and innovative ideas related to Drone Technology.' },
        { label: 'Central Theme', text: 'Drone Technology (Unmanned Aerial Vehicles, autonomous aerial robotics, flight mechanics, and payload applications).' },
        { label: 'Category 01: Video Making', text: 'Create a creative or informative video based on Drone Technology. Focus on cinematography, technical depth, and impactful delivery.' },
        { label: 'Category 02: Poster Making', text: 'Create an innovative poster based on Drone Technology. Focus on high-clarity technical infographics, UAV schematics, and aerospace concepts.' },
        { label: 'Originality Standard', text: 'All video footage, graphic designs, and technical concepts must be original work created by the registered team members.' },
        { label: 'Jury Explanation', text: 'Participants must stand before the jury panel and articulately explain their idea, technical rationale, and creative approach.' },
        { label: 'Copyright Prohibition', text: 'Copied or copyrighted video clips, soundtracks without rights, or plagiarized poster artwork are strictly not allowed.' },
      ],
    },
  ];

  return (
    <div className="pt-28 pb-20 bg-olympus-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="REGULATORY MANUAL"
          title="OFFICIAL"
          highlight="RULE BOOK"
          subtitle="Direct rules, standards, and evaluation protocols established by the ECE Department."
          align="center"
        />

        {/* Informative Rulebook Disclaimer */}
        <div className="mb-10 p-4 rounded-xl bg-olympus-card border border-olympus-border flex items-start gap-3 text-xs text-slate-300">
          <AlertCircle className="w-5 h-5 text-olympus-cyan shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white font-mono uppercase block mb-1">
              AUTHORITATIVE NOTICE
            </span>
            <span>
              All guidelines presented here are derived strictly from the official OLYMPUS ECE Department Event Rule Book. Unannounced timings, specific jury panels, and prize distributions will be announced directly by the organizers.
            </span>
          </div>
        </div>

        {/* Interactive Accordion Cards */}
        <div className="space-y-6">
          {sections.map((section) => {
            const isOpen = openSection === section.id;
            return (
              <HUDFrame
                key={section.id}
                tag={section.id.toUpperCase()}
                className={`transition-all ${isOpen ? 'border-olympus-cyan/50 shadow-cyan-glow' : ''}`}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between text-left py-2 focus:outline-none"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-olympus-bg border border-olympus-border">
                      {section.icon}
                    </div>
                    <h3 className="font-tech text-xl sm:text-2xl font-bold text-white">
                      {section.title}
                    </h3>
                  </div>

                  <div className="p-1 text-olympus-cyan">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="mt-6 pt-6 border-t border-olympus-border/70 space-y-4">
                    {section.content.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-lg bg-olympus-bg/80 border border-olympus-border/50 text-xs sm:text-sm"
                      >
                        <span className="font-mono text-olympus-cyan font-bold block mb-1 uppercase tracking-wide">
                          {idx + 1}. {item.label}
                        </span>
                        <p className="text-slate-300 leading-relaxed font-light">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </HUDFrame>
            );
          })}
        </div>
      </div>
    </div>
  );
};
