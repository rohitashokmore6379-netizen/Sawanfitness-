import React, { useState } from 'react';
import { GymSettingsProvider, useGymSettings } from './context/GymSettingsContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { TrainingProgramsSection } from './components/TrainingProgramsSection';
import { MembershipPlansSection } from './components/MembershipPlansSection';
import { WorkoutAndDietSection } from './components/WorkoutAndDietSection';
import { SupplementsSection } from './components/SupplementsSection';
import { TransformationsSection } from './components/TransformationsSection';
import { AboutSection } from './components/AboutSection';
import { OwnerContactSection } from './components/OwnerContactSection';
import { LocationMapSection } from './components/LocationMapSection';
import { Footer } from './components/Footer';
import { AdminSettingsModal } from './components/AdminSettingsModal';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from './utils/contactUtils';

function MainContent() {
  const { settings } = useGymSettings();
  const [activeTab, setActiveTab] = useState<'home' | 'about' | 'plans' | 'transformations' | 'contact'>('home');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveTab('home');
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950">
      
      {/* Primary Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* 1. Hero */}
            <HeroSection
              onExplorePlans={() => scrollToSection('membership-plans-section')}
              onMeetOwner={() => scrollToSection('owner-contact-section')}
            />

            {/* 2. Why Choose Sawan Fitness Club */}
            <WhyChooseUsSection />

            {/* 3. Training Programs */}
            <TrainingProgramsSection />

            {/* 4. Membership Plans */}
            <MembershipPlansSection />

            {/* 5. Personalized Workout & 6. Personalized Diet */}
            <WorkoutAndDietSection />

            {/* 7. Supplements */}
            <SupplementsSection />

            {/* 8. Client Transformations */}
            <TransformationsSection />

            {/* 9. About Sawan Fitness Club */}
            <AboutSection />

            {/* 10. Owner / Contact Section */}
            <OwnerContactSection />

            {/* 11. Location / Map */}
            <LocationMapSection />
          </>
        )}

        {activeTab === 'about' && (
          <div className="pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
                About Our Club
              </span>
              <h1 className="mt-2 text-4xl sm:text-6xl font-black uppercase text-white font-['Teko'] tracking-wider">
                About Sawan Fitness Club
              </h1>
              <p className="mt-2 text-neutral-400 text-sm max-w-xl mx-auto">
                Founded & owned by Sohel Abaso Mullani in Gargoti, Maharashtra.
              </p>
            </div>
            <AboutSection />
            <OwnerContactSection />
            <LocationMapSection />
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
                Pricing & Packages
              </span>
              <h1 className="mt-2 text-4xl sm:text-6xl font-black uppercase text-white font-['Teko'] tracking-wider">
                Membership Plans
              </h1>
              <p className="mt-2 text-neutral-400 text-sm max-w-xl mx-auto">
                Simple, transparent pricing with direct coaching from Sohel Sir.
              </p>
            </div>
            <MembershipPlansSection />
            <OwnerContactSection />
          </div>
        )}

        {activeTab === 'transformations' && (
          <div className="pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
                Real Members, Real Results
              </span>
              <h1 className="mt-2 text-4xl sm:text-6xl font-black uppercase text-white font-['Teko'] tracking-wider">
                Hall of Transformations
              </h1>
              <p className="mt-2 text-neutral-400 text-sm max-w-xl mx-auto">
                Check out the incredible progress of lifters right here at Sawan Fitness Club.
              </p>
            </div>
            <TransformationsSection />
            <OwnerContactSection />
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 text-center">
              <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
                Connect Directly
              </span>
              <h1 className="mt-2 text-4xl sm:text-6xl font-black uppercase text-white font-['Teko'] tracking-wider">
                Contact & Owner Profile
              </h1>
            </div>
            <OwnerContactSection />
            <LocationMapSection />
          </div>
        )}
      </main>

      {/* Floating WhatsApp Action Button */}
      <aside aria-label="Quick Actions">
        <a
          id="floating-whatsapp-btn"
          href={getWhatsAppUrl(settings.whatsappNumber)}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white shadow-2xl shadow-emerald-500/40 hover:scale-110 transition-all flex items-center justify-center cursor-pointer"
          title="Chat directly on WhatsApp"
        >
          <MessageCircle className="w-7 h-7 fill-current" />
        </a>
      </aside>

      {/* 12. Footer */}
      <Footer
        onNavClick={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Admin Settings Modal */}
      <AdminSettingsModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <GymSettingsProvider>
      <MainContent />
    </GymSettingsProvider>
  );
}
