import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle, ExternalLink, ShieldCheck, Sparkles, Navigation } from 'lucide-react';
import { useGymSettings } from '../context/GymSettingsContext';
import { getTelUrl, getMailtoUrl, getGoogleMapsDirectionsUrl, getWhatsAppUrl } from '../utils/contactUtils';

export const OwnerContactSection: React.FC = () => {
  const { settings } = useGymSettings();

  // Quick message form state that sends directly to WhatsApp or Mail
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [messageText, setMessageText] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  const handleQuickInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim()) return;

    const formattedMessage = `Hello Sohel Sir, my name is ${senderName}${
      senderPhone ? ` (${senderPhone})` : ''
    }. ${messageText || 'I would like to inquire about membership and training at Sawan Fitness Club.'}`;

    const waUrl = getWhatsAppUrl(settings.whatsappNumber, formattedMessage);
    window.open(waUrl, '_blank');
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 5000);
  };

  return (
    <section id="owner-contact-section" className="py-24 bg-neutral-950 relative overflow-hidden">
      
      {/* Background ambient lighting accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 bg-amber-600/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest mb-3"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Owner & Direct Contact</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl font-black uppercase text-white font-['Teko'] tracking-wider"
          >
            Meet the Owner & Get in Touch
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-3 text-neutral-300 text-sm sm:text-base"
          >
            Direct connection to gym founder <strong className="text-white">{settings.ownerName}</strong>. Reach out for training guidance, fees, or visit us in Gargoti today.
          </motion.p>
        </div>

        {/* Two-Column Responsive Layout (Stacks vertically on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: Premium Glassmorphism Owner Profile Card */}
          <motion.div
            id="owner-profile-card"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 relative rounded-3xl bg-neutral-900/80 backdrop-blur-xl border-2 border-amber-500/40 p-6 sm:p-10 shadow-2xl shadow-amber-500/10 flex flex-col justify-between"
          >
            {/* Top header block */}
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-neutral-800">
                
                {/* Avatar / Portrait Badge */}
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 p-1 shadow-xl shadow-amber-500/20">
                    <div className="w-full h-full rounded-[14px] bg-neutral-950 flex flex-col items-center justify-center text-center p-2">
                      <span className="text-3xl sm:text-4xl font-black text-amber-400 font-['Teko'] leading-none">
                        SM
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-300 mt-1">
                        Sawan Club
                      </span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-emerald-500 text-neutral-950 shadow-md">
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </div>

                {/* Owner Identity */}
                <div className="text-center sm:text-left flex-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                    {settings.gymName}
                  </span>
                  
                  <div className="mt-1">
                    <span className="text-xs text-neutral-400 uppercase font-semibold block">
                      Owner
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-black text-white font-['Teko'] tracking-wider leading-none mt-0.5">
                      {settings.ownerName}
                    </h3>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-amber-300/90 italic">
                    &ldquo;{settings.gymTagline}&rdquo;
                  </p>
                </div>
              </div>

              {/* Official Contact Details List - Clickable Elements */}
              <div className="mt-8 space-y-5">
                
                {/* 1. Phone Number */}
                <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 hover:border-amber-500/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <Phone className="w-5 h-5 fill-current" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                        Official Phone / Call Now
                      </span>
                      <a
                        id="owner-phone-link"
                        href={getTelUrl(settings.contactNumber)}
                        className="text-lg sm:text-xl font-bold text-white hover:text-amber-400 transition-colors inline-block mt-0.5"
                      >
                        {settings.contactNumber}
                      </a>
                      <span className="text-[11px] text-neutral-400 block mt-0.5">
                        Available during morning & evening shifts
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Email Address */}
                <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 hover:border-amber-500/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                        Official Email Address
                      </span>
                      <a
                        id="owner-email-link"
                        href={getMailtoUrl(settings.email)}
                        className="text-base sm:text-lg font-bold text-white hover:text-amber-400 transition-colors break-all inline-block mt-0.5"
                      >
                        {settings.email}
                      </a>
                      <span className="text-[11px] text-neutral-400 block mt-0.5">
                        Click to launch email app
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Address */}
                <div className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800 hover:border-amber-500/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                        Gym Address & Location
                      </span>
                      <a
                        id="owner-address-link"
                        href={getGoogleMapsDirectionsUrl(settings.address, settings.googleMapsUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-white hover:text-amber-400 transition-colors block mt-0.5 leading-relaxed"
                      >
                        {settings.address}
                      </a>
                      <span className="text-[11px] text-amber-400 font-medium block mt-1 flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        PIN Code: {settings.pinCode} • Tap address to open Google Maps
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Required Action Buttons Grid */}
            <div className="mt-8 pt-6 border-t border-neutral-800">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* CALL NOW BUTTON */}
                <a
                  id="btn-call-now"
                  href={getTelUrl(settings.contactNumber)}
                  className="py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-current" />
                  <span>CALL NOW</span>
                </a>

                {/* EMAIL US BUTTON */}
                <a
                  id="btn-email-us"
                  href={getMailtoUrl(settings.email)}
                  className="py-3.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm flex items-center justify-center gap-2 border border-neutral-700 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>EMAIL US</span>
                </a>

                {/* GET DIRECTIONS BUTTON */}
                <a
                  id="btn-get-directions"
                  href={getGoogleMapsDirectionsUrl(settings.address, settings.googleMapsUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-amber-500/40 font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />
                  <span>GET DIRECTIONS</span>
                </a>
              </div>

              {/* Dynamic WhatsApp Button (Section 53) */}
              <div className="mt-3">
                <a
                  id="btn-chat-whatsapp"
                  href={getWhatsAppUrl(settings.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-emerald-600/20 hover:scale-[1.01] cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>CHAT ON WHATSAPP (+91 84089 00786)</span>
                </a>
              </div>
            </div>

          </motion.div>

          {/* RIGHT: Quick Instant Inquiry Form & Working Hours */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 rounded-3xl bg-neutral-900/60 border border-neutral-800 p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Send className="w-4 h-4" />
                <span>Instant Inquiry to Sohel Sir</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Send a Direct Message
              </h3>
              <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                Have a question about personal training, membership packages, or gym timing? Drop your details below to connect right away.
              </p>

              <form onSubmit={handleQuickInquiry} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Your Phone Number
                  </label>
                  <input
                    type="tel"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Message / Fitness Goal
                  </label>
                  <textarea
                    rows={3}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="I would like to start gym from next week for weight loss..."
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </button>
              </form>

              {formSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Redirecting your message to WhatsApp chat...</span>
                </div>
              )}
            </div>

            {/* Gym Timings Box */}
            <div className="mt-8 pt-6 border-t border-neutral-800/80">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wide block mb-2">
                Gym Working Hours
              </span>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                {settings.gymTimings}
              </p>
              <span className="text-[11px] text-neutral-400 block mt-1">
                Sunday Morning Special Session available for all active members.
              </span>
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
