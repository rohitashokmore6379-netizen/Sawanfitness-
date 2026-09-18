import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Target, Heart, Award, Phone, Mail, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { useGymSettings } from '../context/GymSettingsContext';
import { getTelUrl, getMailtoUrl, getGoogleMapsDirectionsUrl, getWhatsAppUrl } from '../utils/contactUtils';

export const AboutSection: React.FC = () => {
  const { settings } = useGymSettings();

  return (
    <section id="about-section" className="py-20 bg-neutral-900/40 border-y border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Story & Vision */}
          <div className="lg:col-span-7">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
              Our Legacy & Mission
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-['Teko'] tracking-wide">
              About {settings.gymName}
            </h2>
            <p className="mt-4 text-base text-neutral-300 leading-relaxed">
              Founded with the conviction that true health is built through sweat, patience, and unwavering discipline, <strong className="text-white">{settings.gymName}</strong> is Gargoti’s leading fitness establishment.
            </p>
            <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
              Under the visionary direction of owner <strong className="text-white">{settings.ownerName}</strong>, our gym has grown into a powerhouse training arena for students, athletes, business owners, and fitness enthusiasts across Bhudargad and Kolhapur district.
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                  <Target className="w-4 h-4" />
                  <span>Uncompromising Quality</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Heavy calibrated plates, safe spotters, and biomechanically safe angle stations.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-1">
                  <Heart className="w-4 h-4" />
                  <span>Inclusive Brotherhood</span>
                </div>
                <p className="text-xs text-neutral-400">
                  Every newcomer is warmly guided with zero judgment and strict anti-ego lifting culture.
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 text-xs text-neutral-300">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>Official Timings:</strong> {settings.gymTimings}</span>
            </div>
          </div>

          {/* Right Column: Required Official Owner Details Card */}
          <div className="lg:col-span-5">
            <div className="p-7 rounded-2xl bg-neutral-950 border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase mb-4">
                <Award className="w-3.5 h-3.5" />
                Official Gym Leadership
              </div>

              <h3 className="text-2xl font-black text-white uppercase font-['Teko'] tracking-wider">
                {settings.gymName}
              </h3>
              
              <div className="mt-2 pb-4 border-b border-neutral-800">
                <div className="text-xs text-neutral-400 uppercase tracking-wider">Owner</div>
                <div className="text-xl font-bold text-amber-400">
                  {settings.ownerName}
                </div>
                <div className="text-xs text-neutral-300 italic mt-1">
                  &ldquo;{settings.gymTagline}&rdquo;
                </div>
              </div>

              {/* Official Details List */}
              <div className="mt-5 space-y-4">
                {/* Contact */}
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase font-semibold">Contact:</div>
                  <a
                    href={getTelUrl(settings.contactNumber)}
                    className="text-sm font-bold text-white hover:text-amber-400 transition-colors flex items-center gap-2 mt-0.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>{settings.contactNumber}</span>
                  </a>
                </div>

                {/* Email */}
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase font-semibold">Email:</div>
                  <a
                    href={getMailtoUrl(settings.email)}
                    className="text-sm font-bold text-white hover:text-amber-400 transition-colors flex items-center gap-2 mt-0.5 break-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{settings.email}</span>
                  </a>
                </div>

                {/* Address */}
                <div>
                  <div className="text-[11px] text-neutral-400 uppercase font-semibold">Address:</div>
                  <a
                    href={getGoogleMapsDirectionsUrl(settings.address, settings.googleMapsUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-neutral-300 hover:text-amber-400 transition-colors flex items-start gap-2 mt-0.5 leading-relaxed"
                  >
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      {settings.gymName}, {settings.landmark}, {settings.road}, {settings.city}, Tal. {settings.taluka}, Dist. {settings.district}, {settings.state} – {settings.pinCode}
                    </span>
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-neutral-800 grid grid-cols-2 gap-3">
                <a
                  href={getTelUrl(settings.contactNumber)}
                  className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>Call Owner</span>
                </a>

                <a
                  href={getGoogleMapsDirectionsUrl(settings.address, settings.googleMapsUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs border border-neutral-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Get Directions</span>
                </a>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
