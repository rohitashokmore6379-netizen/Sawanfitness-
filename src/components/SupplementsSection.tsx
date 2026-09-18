import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Check, Sparkles, AlertCircle, MessageCircle } from 'lucide-react';
import { SUPPLEMENT_LIST } from '../data/defaultSettings';
import { useGymSettings } from '../context/GymSettingsContext';
import { getWhatsAppUrl } from '../utils/contactUtils';

export const SupplementsSection: React.FC = () => {
  const { settings } = useGymSettings();

  return (
    <section id="supplements-section" className="py-20 bg-neutral-900/50 border-y border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
            100% Authentic Nutrition
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-['Teko'] tracking-wide">
            Authentic Supplements & Guidance
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base">
            Don’t risk your kidneys and health with fake market supplements. At {settings.gymName}, owner <strong className="text-white">{settings.ownerName}</strong> provides lab-tested, genuine supplement guidance with direct importer verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUPPLEMENT_LIST.map((sup, idx) => (
            <motion.div
              key={sup.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/40 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-bold uppercase tracking-wide border border-amber-500/20">
                    {sup.category}
                  </span>
                  {sup.certified && (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      100% Lab Tested
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">
                  {sup.name}
                </h3>
                <p className="text-neutral-400 text-xs leading-relaxed mb-4">
                  {sup.benefit}
                </p>

                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800/80 mb-6">
                  <span className="text-[11px] text-neutral-400 block mb-1 uppercase tracking-wide">
                    Suggested Dosage:
                  </span>
                  <span className="text-xs text-white font-medium">
                    {sup.dosage}
                  </span>
                </div>
              </div>

              <a
                href={getWhatsAppUrl(
                  settings.whatsappNumber,
                  `Hello Sohel Sir, I want to consult about genuine ${sup.name} at Sawan Fitness Club.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-amber-500 hover:text-neutral-950 text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Consult on WhatsApp</span>
              </a>
            </motion.div>
          ))}
        </div>

        {/* Safety Note */}
        <div className="mt-10 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 max-w-3xl mx-auto">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong>Coach Advice from Sohel Mullani:</strong> Supplements are only 10-15% of your fitness success. Consistent gym attendance, good sleep, and clean daily food form the other 85%. Never buy cheap unverified powders from unauthorized local shops.
          </p>
        </div>

      </div>
    </section>
  );
};
