import React, { useState } from 'react';
import { SectionHeader } from '../components/common/SectionHeader';
import { HUDFrame } from '../components/common/HUDFrame';
import { Camera, Code, Cpu, Plane, Sparkles, Filter } from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: 'Technology' | 'Coding' | 'Drone' | 'Creativity' | 'Event Moments';
  tag: string;
  icon: React.ReactNode;
  aspect: string;
}

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Technology', 'Coding', 'Drone', 'Creativity', 'Event Moments'];

  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: 'Circuit Matrix & Embedded Nodes',
      category: 'Technology',
      tag: 'TECH_01',
      icon: <Cpu className="w-12 h-12 text-olympus-cyan" />,
      aspect: 'h-64',
    },
    {
      id: 2,
      title: 'Full Stack Algorithm Workspace',
      category: 'Coding',
      tag: 'CODE_01',
      icon: <Code className="w-12 h-12 text-olympus-blue-light" />,
      aspect: 'h-72',
    },
    {
      id: 3,
      title: 'Quadcopter Avionics & Sensor Arrays',
      category: 'Drone',
      tag: 'DRONE_01',
      icon: <Plane className="w-12 h-12 text-cyan-400" />,
      aspect: 'h-64',
    },
    {
      id: 4,
      title: 'Cinematography & Visual Narrative',
      category: 'Creativity',
      tag: 'CREATIVE_01',
      icon: <Sparkles className="w-12 h-12 text-indigo-400" />,
      aspect: 'h-80',
    },
    {
      id: 5,
      title: 'ECE Symposium Inaugural Hall',
      category: 'Event Moments',
      tag: 'MOMENT_01',
      icon: <Camera className="w-12 h-12 text-emerald-400" />,
      aspect: 'h-64',
    },
    {
      id: 6,
      title: 'Neural Network Architecture Defense',
      category: 'Coding',
      tag: 'CODE_02',
      icon: <Code className="w-12 h-12 text-olympus-cyan" />,
      aspect: 'h-72',
    },
    {
      id: 7,
      title: 'Autonomous UAV Airframe Design',
      category: 'Drone',
      tag: 'DRONE_02',
      icon: <Plane className="w-12 h-12 text-sky-400" />,
      aspect: 'h-64',
    },
    {
      id: 8,
      title: 'Technical Poster Infographic Showcase',
      category: 'Creativity',
      tag: 'CREATIVE_02',
      icon: <Sparkles className="w-12 h-12 text-violet-400" />,
      aspect: 'h-64',
    },
  ];

  const filteredItems =
    activeCategory === 'ALL'
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="pt-28 pb-20 bg-olympus-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="VISUAL ARCHIVE"
          title="OLYMPUS"
          highlight="GALLERY"
          subtitle="A glimpse into the engineering, code development, and drone showcases of OLYMPUS."
          align="center"
        />

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cyber-button px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-olympus-blue text-white shadow-blue-glow font-bold'
                  : 'bg-olympus-card text-slate-400 hover:text-white border border-olympus-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <HUDFrame
              key={item.id}
              tag={item.tag}
              className="p-6 flex flex-col justify-between hover:border-olympus-cyan/60 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center justify-center min-h-[160px] rounded-lg bg-olympus-bg/80 border border-olympus-border/70 group-hover:border-olympus-cyan/40 transition-colors p-6 text-center">
                <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="text-[10px] font-mono text-olympus-cyan uppercase tracking-widest">
                  {item.category}
                </span>
              </div>

              <div className="pt-4">
                <h4 className="font-tech text-base font-bold text-white group-hover:text-olympus-cyan transition-colors">
                  {item.title}
                </h4>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">
                  ARCHIVE // OLYMPUS 2026
                </span>
              </div>
            </HUDFrame>
          ))}
        </div>
      </div>
    </div>
  );
};
