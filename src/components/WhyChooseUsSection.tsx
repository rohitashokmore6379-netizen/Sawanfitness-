import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Users, HeartPulse, Trophy, Sparkles, Clock } from 'lucide-react';
import { useGymSettings } from '../context/GymSettingsContext';

export const WhyChooseUsSection: React.FC = () => {
  const { settings } = useGymSettings();

  const reasons = [
    {
      icon: Dumbbell,
      title: 'Heavy Duty Equipment',
      description: 'Imported Olympic bars, heavy dumbbells, multi-gym stations, and biomechanical machines engineered for peak muscle tension without joint strain.',
    },
    {
      icon: Trophy,
      title: 'Proven Track Record',
      description: 'Dozens of real transformations across Gargoti, Bhudargad, and Kolhapur—from extreme fat loss to championship powerlifting.',
    },
    {
      icon: Users,
      title: 'Brotherhood & High Energy',
      description: 'A motivating, respectful, and electric gym environment where beginners and seasoned lifters push each other to break personal records.',
    },
    {
      icon: HeartPulse,
      title: 'Posture & Injury Prevention',
      description: 'Strict emphasis on proper lifting technique, spinal alignment, warm-ups, and mobility so you grow strong safely.',
    },
    {
      icon: Sparkles,
      title: 'Personal Diet Alignment',
      description: 'No unrealistic starvation diets. We calibrate macros using local Maharashtrian vegetarian and non-vegetarian staple foods.',
    },
    {
      icon: Clock,
      title: 'Flexible Morning & Evening Shifts',
      description: `Open daily to suit college students, farmers, and working professionals. Timings: ${settings.gymTimings}`,
    },
  ];

  return (
    <section id="why-choose-us-section" className="py-20 bg-neutral-900/60 border-y border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
            Why We Stand Out
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-['Teko'] tracking-wide">
            Why Choose {settings.gymName}?
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base">
            Under the active leadership of <strong className="text-white">{settings.ownerName}</strong>, our gym is more than just iron—it is a disciplined sanctuary for personal excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-amber-500/50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-neutral-950 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
