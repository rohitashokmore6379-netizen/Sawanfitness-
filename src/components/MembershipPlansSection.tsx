import React from 'react';
import { motion } from 'motion/react';
import { Check, Flame, MessageCircle } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '../data/defaultSettings';
import { useGymSettings } from '../context/GymSettingsContext';
import { getWhatsAppUrl } from '../utils/contactUtils';

export const MembershipPlansSection: React.FC = () => {
  const { settings } = useGymSettings();

  return (
    <section id="membership-plans-section" className="py-20 bg-neutral-900/40 border-y border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
            Affordable & Result-Oriented
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-['Teko'] tracking-wide">
            Membership Plans
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base">
            Honest, competitive gym fees in Gargoti with zero hidden charges. Choose the duration that matches your personal fitness target.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MEMBERSHIP_PLANS.map((plan, idx) => {
            const isPopular = plan.popular;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`relative rounded-2xl flex flex-col justify-between p-6 transition-all ${
                  isPopular
                    ? 'bg-neutral-900 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 scale-105 z-10'
                    : 'bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-neutral-950 text-[11px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Flame className="w-3 h-3 fill-current" />
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    {plan.duration}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-xs text-neutral-400 mb-4 italic">
                    Best for: {plan.recommendedFor}
                  </div>

                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-neutral-800">
                    <span className="text-3xl sm:text-4xl font-black text-white font-['Teko']">
                      ₹{plan.price}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-sm text-neutral-500 line-through">
                        ₹{plan.originalPrice}
                      </span>
                    )}
                    <span className="text-xs text-neutral-400">/ plan</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-300">
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={getWhatsAppUrl(
                    settings.whatsappNumber,
                    `Hello Sohel Sir, I want to book the ${plan.name} (₹${plan.price}) at Sawan Fitness Club.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isPopular
                      ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Join via WhatsApp</span>
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Student / Special discount banner */}
        <div className="mt-12 p-6 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white">
              Student & Annual Group Concessions Available
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
              College students from Gargoti & Bhudargad get special seasonal discounts with valid ID card.
            </p>
          </div>
          <a
            href={getWhatsAppUrl(settings.whatsappNumber, 'Hello Sohel Sir, I am a student enquiring about gym concessions.')}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-neutral-900 border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 text-xs font-bold shrink-0 transition-colors"
          >
            Inquire Concession
          </a>
        </div>

      </div>
    </section>
  );
};
