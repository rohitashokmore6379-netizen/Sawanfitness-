import React from 'react';
import { motion } from 'motion/react';
import { Trophy, Star, ArrowRight, Quote, MessageCircle } from 'lucide-react';
import { CLIENT_TRANSFORMATIONS } from '../data/defaultSettings';
import { useGymSettings } from '../context/GymSettingsContext';
import { getWhatsAppUrl } from '../utils/contactUtils';

export const TransformationsSection: React.FC = () => {
  const { settings } = useGymSettings();

  return (
    <section id="transformations-section" className="py-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
            Real People, Real Grit
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-['Teko'] tracking-wide">
            Client Transformations
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base">
            Witness the discipline of our members at {settings.gymName}. With consistent effort and coach <strong className="text-white">{settings.ownerName}</strong>’s direction, goals become reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CLIENT_TRANSFORMATIONS.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all group"
            >
              {/* Images Grid */}
              <div className="relative h-60 overflow-hidden bg-neutral-950">
                <img
                  src={item.afterImage}
                  alt={`${item.clientName} Transformation`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-neutral-950/80 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {item.duration}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-base font-bold text-white">
                    {item.clientName}
                  </span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-sm font-bold text-amber-400 mb-4 flex items-center gap-1.5">
                    <span>{item.achievement}</span>
                  </div>

                  {/* Stats Badges */}
                  <div className="grid grid-cols-3 gap-2 mb-5 text-center">
                    {item.stats.weightLost && item.stats.weightLost !== 'N/A (Bulk)' && (
                      <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                        <span className="text-xs text-neutral-400 block text-[10px] uppercase">Lost</span>
                        <span className="text-xs font-bold text-white">{item.stats.weightLost}</span>
                      </div>
                    )}
                    {item.stats.muscleGain && (
                      <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                        <span className="text-xs text-neutral-400 block text-[10px] uppercase">Muscle</span>
                        <span className="text-xs font-bold text-white">{item.stats.muscleGain}</span>
                      </div>
                    )}
                    {item.stats.bodyFat && (
                      <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800">
                        <span className="text-xs text-neutral-400 block text-[10px] uppercase">Body Fat</span>
                        <span className="text-xs font-bold text-amber-400">{item.stats.bodyFat}</span>
                      </div>
                    )}
                  </div>

                  <div className="relative pl-4 border-l-2 border-amber-500/50 mb-6 italic text-neutral-300 text-xs leading-relaxed">
                    &ldquo;{item.testimonial}&rdquo;
                  </div>
                </div>

                <a
                  href={getWhatsAppUrl(
                    settings.whatsappNumber,
                    `Hello Sohel Sir, I saw ${item.clientName}'s transformation. I want to start my journey too!`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Start Your Transformation</span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
