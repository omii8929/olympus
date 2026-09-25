import React from 'react';
import { Hero } from '../components/home/Hero';
import { Stats } from '../components/home/Stats';
import { AboutSection } from '../components/home/AboutSection';
import { ArenaCards } from '../components/home/ArenaCards';
import { MissionJourney } from '../components/home/MissionJourney';
import { ScheduleSection } from '../components/home/ScheduleSection';
import { PartnersSection } from '../components/home/PartnersSection';
import { FinalCTA } from '../components/home/FinalCTA';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Stats />
      <AboutSection />
      <ArenaCards />
      <MissionJourney />
      <ScheduleSection />
      <PartnersSection />
      <FinalCTA />
    </div>
  );
};
