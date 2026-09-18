import React from 'react';
import { motion } from 'motion/react';
import { Flame, ShieldCheck, ArrowRight, Phone, MessageCircle, MapPin } from 'lucide-react';
import { useGymSettings } from '../context/GymSettingsContext';
import { getTelUrl, getWhatsAppUrl } from '../utils/contactUtils';

interface HeroSectionProps {
  onExplorePlans: () => void;
  onMeetOwner: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplorePlans, onMeetOwner }) => {
  const { settings } = useGymSettings();

  return (
    <section id="hero-section" className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-neutral-950 pt-8 pb-16">
      {/* Background with athletic image and dark graded overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80"
          alt="Sawan Fitness Club Gym Arena"
          className="w-full h-full object-cover object-center opacity-25 filter grayscale contrast-125"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Location & Authority Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold mb-6 shadow-lg"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Gargoti, Bhudargad, Kolhapur</span>
          <span className="w-1 h-1 rounded-full bg-amber-400/60" />
          <span className="text-neutral-300">Near Gotne Petrol Pump</span>
        </motion.div>

        {/* Official Gym Name & Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white leading-none font-['Teko']"
        >
          {settings.gymName}
        </motion.h1>

        {/* Motivational Slogan */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-400 tracking-wider uppercase"
        >
          &ldquo;{settings.gymTagline}&rdquo;
        </motion.p>

        {/* Owner Credit Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-3 text-sm sm:text-base text-neutral-300 font-medium"
        >
          Founded & Headed by <span className="text-white font-bold">{settings.ownerName}</span>
        </motion.div>

        {/* Gym Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 max-w-2xl mx-auto text-neutral-300 text-sm sm:text-base leading-relaxed"
        >
          {settings.gymDescription}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto"
        >
          {/* WhatsApp CTA */}
          <a
            id="hero-whatsapp-btn"
            href={getWhatsAppUrl(settings.whatsappNumber, 'Hello Sohel Sir, I want to join Sawan Fitness Club!')}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-600/25 hover:scale-105 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Call Now CTA */}
          <a
            id="hero-call-btn"
            href={getTelUrl(settings.contactNumber)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-amber-500/25 hover:scale-105 cursor-pointer"
          >
            <Phone className="w-5 h-5 fill-current" />
            <span>Call Now</span>
          </a>

          {/* Membership CTA */}
          <button
            id="hero-plans-btn"
            onClick={onExplorePlans}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-105"
          >
            <span>View Plans</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </motion.div>

        {/* Feature Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-6 border-t border-neutral-800/80"
        >
          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
            <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <div className="text-white font-bold text-sm">Heavy Iron Gym</div>
            <div className="text-neutral-400 text-xs">Olympic Barbells & Racks</div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
            <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <div className="text-white font-bold text-sm">Certified Mentorship</div>
            <div className="text-neutral-400 text-xs">Direct Owner Guidance</div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
            <Flame className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <div className="text-white font-bold text-sm">Custom Nutrition</div>
            <div className="text-neutral-400 text-xs">Indian Home Diet Plans</div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-center">
            <MapPin className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
            <div className="text-white font-bold text-sm">Gargoti Center</div>
            <div className="text-neutral-400 text-xs">Near Gotne Petrol Pump</div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
