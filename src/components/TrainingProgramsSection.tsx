import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Flame, Award, Zap, Check, ArrowUpRight } from 'lucide-react';
import { TRAINING_PROGRAMS } from '../data/defaultSettings';
import { useGymSettings } from '../context/GymSettingsContext';
import { getWhatsAppUrl } from '../utils/contactUtils';

export const TrainingProgramsSection: React.FC = () => {
  const { settings } = useGymSettings();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Dumbbell': return <Dumbbell className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Award': return <Award className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      default: return <Dumbbell className="w-5 h-5" />;
    }
  };

  return (
    <section id="training-programs-section" className="py-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
              Scientific Training
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-['Teko'] tracking-wide">
              Training Programs
            </h2>
          </div>
          <p className="mt-3 md:mt-0 text-neutral-400 text-sm max-w-md">
            Whether you want to build raw strength, torch body fat, or prepare for competition, our programs are tested and supervised directly by <strong className="text-white">{settings.ownerName}</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRAINING_PROGRAMS.map((program, idx) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex flex-col rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden hover:border-amber-500/50 transition-all group"
            >
              {/* Program Photo */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={program.image}
                  alt={program.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-neutral-950/80 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-amber-500/30">
                  {program.level}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                    {getIcon(program.icon)}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {program.title}
                  </h3>
                  <p className="text-neutral-400 text-xs leading-relaxed mb-4">
                    {program.description}
                  </p>

                  <ul className="space-y-1.5 mb-6">
                    {program.highlights.map((h, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={getWhatsAppUrl(
                    settings.whatsappNumber,
                    `Hello Sohel Sir, I am interested in the ${program.title} program at Sawan Fitness Club.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Enquire on WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
