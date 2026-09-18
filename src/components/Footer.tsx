import React from 'react';
import { Dumbbell, Phone, Mail, MapPin, Instagram, Facebook, MessageCircle, Shield, ArrowUp, ExternalLink } from 'lucide-react';
import { useGymSettings } from '../context/GymSettingsContext';
import { getTelUrl, getMailtoUrl, getGoogleMapsDirectionsUrl, getWhatsAppUrl } from '../utils/contactUtils';

interface FooterProps {
  onNavClick: (tab: 'home' | 'about' | 'plans' | 'transformations' | 'contact') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onOpenAdmin }) => {
  const { settings } = useGymSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-neutral-950 border-t border-neutral-800 text-neutral-300 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-neutral-800/80">
          
          {/* Gym & Owner Brand (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 shadow-md">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-wider text-white font-['Teko'] leading-none">
                  {settings.gymName}
                </h3>
                <span className="text-xs text-amber-400 font-semibold block mt-0.5">
                  Gargoti, Tal. Bhudargad, Dist. Kolhapur
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm">
              &ldquo;{settings.gymTagline}&rdquo; — Gargoti's premier training club equipped with certified coaching, heavy weights, and guaranteed results.
            </p>

            {/* Official Owner Attribution Card */}
            <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 max-w-sm">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
                Gym Leadership
              </div>
              <div className="text-base font-bold text-amber-400 mt-0.5">
                Owner: {settings.ownerName}
              </div>
              <div className="text-xs text-neutral-300 mt-1">
                Committed to bringing elite fitness standards to Bhudargad.
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {settings.whatsappNumber && (
                <a
                  href={getWhatsAppUrl(settings.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-emerald-600 hover:text-white border border-neutral-800 flex items-center justify-center text-neutral-400 transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-pink-600 hover:text-white border border-neutral-800 flex items-center justify-center text-neutral-400 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-neutral-900 hover:bg-blue-600 hover:text-white border border-neutral-800 flex items-center justify-center text-neutral-400 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  id="footer-link-home"
                  onClick={() => onNavClick('home')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  id="footer-link-about"
                  onClick={() => onNavClick('about')}
                  className="hover:text-amber-400 transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  id="footer-link-plans"
                  onClick={() => onNavClick('plans')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Membership Plans
                </button>
              </li>
              <li>
                <button
                  id="footer-link-transformations"
                  onClick={() => onNavClick('transformations')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Transformations
                </button>
              </li>
              <li>
                <button
                  id="footer-link-contact"
                  onClick={() => onNavClick('contact')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Contact
                </button>
              </li>
              <li className="pt-2">
                <button
                  id="footer-link-login"
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Login (Admin Settings)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Official Contact & Address Details (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Official Gym Address & Contact
            </h4>
            
            <div className="space-y-3 text-xs sm:text-sm text-neutral-300">
              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-neutral-500 uppercase block font-semibold">Phone:</span>
                  <a
                    id="footer-phone"
                    href={getTelUrl(settings.contactNumber)}
                    className="font-bold text-white hover:text-amber-400 transition-colors inline-block"
                  >
                    {settings.contactNumber}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-neutral-500 uppercase block font-semibold">Email:</span>
                  <a
                    id="footer-email"
                    href={getMailtoUrl(settings.email)}
                    className="font-bold text-white hover:text-amber-400 transition-colors break-all inline-block"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-neutral-500 uppercase block font-semibold">Address:</span>
                  <a
                    id="footer-address"
                    href={getGoogleMapsDirectionsUrl(settings.address, settings.googleMapsUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-300 hover:text-amber-400 transition-colors block leading-relaxed"
                  >
                    {settings.gymName},<br />
                    {settings.landmark},<br />
                    {settings.road}, {settings.city},<br />
                    Tal. {settings.taluka}, Dist. {settings.district},<br />
                    {settings.state} – {settings.pinCode}
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom copyright & Scroll to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} {settings.gymName}. All rights reserved. Managed by {settings.ownerName}.
          </div>

          <button
            id="scroll-to-top-btn"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-neutral-400 hover:text-amber-400 transition-colors"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
