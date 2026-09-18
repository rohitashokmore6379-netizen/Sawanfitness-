import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Utensils, CheckCircle2, ChevronRight, Calculator, MessageCircle } from 'lucide-react';
import { useGymSettings } from '../context/GymSettingsContext';
import { getWhatsAppUrl } from '../utils/contactUtils';

export const WorkoutAndDietSection: React.FC = () => {
  const { settings } = useGymSettings();
  const [activeTab, setActiveTab] = useState<'workout' | 'diet'>('workout');

  // Simple interactive macro/calorie estimator
  const [weightKg, setWeightKg] = useState<number>(70);
  const [goal, setGoal] = useState<'fatloss' | 'muscle' | 'strength'>('muscle');

  const calculatedCalories = Math.round(
    goal === 'fatloss' ? weightKg * 24 : goal === 'muscle' ? weightKg * 34 : weightKg * 30
  );
  const calculatedProtein = Math.round(
    goal === 'fatloss' ? weightKg * 2.0 : goal === 'muscle' ? weightKg * 2.2 : weightKg * 1.8
  );

  return (
    <section id="workout-diet-section" className="py-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
            Tailored Just For You
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-['Teko'] tracking-wide">
            Personalized Workout & Diet
          </h2>
          <p className="mt-4 text-neutral-300 text-sm sm:text-base">
            No generic copy-paste charts. At {settings.gymName}, training and nutrition are customized to your height, weight, daily lifestyle, and local food availability.
          </p>

          {/* Tab Switcher */}
          <div className="mt-8 inline-flex p-1 rounded-xl bg-neutral-900 border border-neutral-800">
            <button
              onClick={() => setActiveTab('workout')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'workout'
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Personalized Workout</span>
            </button>
            <button
              onClick={() => setActiveTab('diet')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'diet'
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Personalized Diet</span>
            </button>
          </div>
        </div>

        {activeTab === 'workout' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-black mb-4">
                01
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Push - Pull - Legs (PPL)</h3>
              <p className="text-neutral-400 text-xs mb-4">
                The gold standard frequency for building symmetrical chest, wide lats, and powerhouse quadriceps.
              </p>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Push: Incline Press, Dips, Overhead Press</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Pull: Deadlifts, T-Bar Rows, Bicep Curls</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Legs: Barbell Squats, Roman Stiff Legs, Calves</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-black mb-4">
                02
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Targeted Fat Loss Split</h3>
              <p className="text-neutral-400 text-xs mb-4">
                Metabolic conditioning combining compound lifting with short rest periods to burn calories all day.
              </p>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Giant Sets & Super-sets for high heart rate</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Targeted core & obliques tightening</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Post-workout low impact cardio protocols</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-black mb-4">
                03
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Posture & Strength Base</h3>
              <p className="text-neutral-400 text-xs mb-4">
                Ideal for beginners or desk job workers needing spine strengthening and posterior chain alignment.
              </p>
              <ul className="space-y-2 text-xs text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Rotator cuff and rear delt mobility</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Hip flexor opening and glute activation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Progression logging verified by Sohel Sir</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Diet Philosophy */}
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
                <h3 className="text-xl font-bold text-white mb-2">
                  Real Indian Foods, Maximum Protein
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-4">
                  We formulate practical diet charts featuring wholesome ingredients you already enjoy at home: eggs, paneer, sprouts, chicken breast, sattu, roasted chana, dal, and fresh green vegetables.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                    <span className="text-amber-400 font-bold text-xs uppercase block mb-1">
                      Vegetarian Muscle Blueprint
                    </span>
                    <span className="text-neutral-400 text-xs">
                      Paneer, curd, tofu, soya chunks, whey & lentil pairings for complete amino acid profile.
                    </span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800">
                    <span className="text-amber-400 font-bold text-xs uppercase block mb-1">
                      Non-Veg Fat Shred Plan
                    </span>
                    <span className="text-neutral-400 text-xs">
                      Egg whites, lean boiled chicken breast, fish, brown rice & steamed vegetable salads.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Macro Estimator Card */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-neutral-900/90 border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-400 mb-3">
                <Calculator className="w-5 h-5" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                  Quick Macro Calculator
                </h4>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-neutral-300 block mb-1.5 font-medium">
                    Your Body Weight: <strong className="text-amber-400">{weightKg} kg</strong>
                  </label>
                  <input
                    type="range"
                    min={45}
                    max={130}
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-300 block mb-1.5 font-medium">
                    Select Your Main Goal
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['fatloss', 'muscle', 'strength'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setGoal(g)}
                        className={`py-1.5 text-xs font-bold rounded-lg border uppercase transition-all ${
                          goal === g
                            ? 'bg-amber-500 text-neutral-950 border-amber-500'
                            : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                        }`}
                      >
                        {g === 'fatloss' ? 'Fat Loss' : g === 'muscle' ? 'Muscle' : 'Power'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-800 text-center">
                  <div className="p-3 rounded-xl bg-neutral-950">
                    <span className="text-2xl font-black text-white font-['Teko'] block">
                      ~{calculatedCalories} kcal
                    </span>
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wide">
                      Daily Calories
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-950">
                    <span className="text-2xl font-black text-amber-400 font-['Teko'] block">
                      ~{calculatedProtein} grams
                    </span>
                    <span className="text-[11px] text-neutral-400 uppercase tracking-wide">
                      Target Protein
                    </span>
                  </div>
                </div>

                <a
                  href={getWhatsAppUrl(
                    settings.whatsappNumber,
                    `Hello Sohel Sir, I used the calculator (Weight: ${weightKg}kg, Goal: ${goal}). Please prepare my customized diet chart!`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Request Full Diet Chart via WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
