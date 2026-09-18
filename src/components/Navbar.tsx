import React, { useState } from 'react';
import { Dumbbell, Phone, Menu, X, Shield, MessageCircle } from 'lucide-react';
import { useGymSettings } from '../context/GymSettingsContext';
import { getTelUrl, getWhatsAppUrl } from '../utils/contactUtils';

interface NavbarProps {
  activeTab: 'home' | 'about' | 'plans' | 'transformations' | 'contact';
  setActiveTab: (tab: 'home' | 'about' | 'plans' | 'transformations' | 'contact') => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAdmin }) => {
  const { settings, isAdminLoggedIn } = useGymSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: 'home' | 'about' | 'plans' | 'transformations' | 'contact'; label: string }[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Club' },
    { id: 'plans', label: 'Membership Plans' },
    { id: 'transformations', label: 'Transformations' },
    { id: 'contact', label: 'Contact & Owner' },
  ];

  const handleNavClick = (id: 'home' | 'about' | 'plans' | 'transformations' | 'contact') => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            id="nav-brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Dumbbell className="w-6 h-6 text-neutral-950" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white block uppercase leading-none font-['Teko'] tracking-wider">
                {settings.gymName}
              </span>
              <span className="text-xs text-amber-400 font-medium tracking-wide block mt-0.5">
                Gargoti • Kolhapur
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-neutral-800 text-amber-400 shadow-inner'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* WhatsApp Quick Link */}
            <a
              id="nav-quick-whatsapp"
              href={getWhatsAppUrl(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-xs font-bold border border-emerald-500/30 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Direct Call Button */}
            <a
              id="nav-quick-call"
              href={getTelUrl(settings.contactNumber)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
            >
              <Phone className="w-3.5 h-3.5 fill-current" />
              <span>{settings.contactNumber}</span>
            </a>

            {/* Admin Settings Button */}
            <button
              id="nav-admin-btn"
              onClick={onOpenAdmin}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium ${
                isAdminLoggedIn
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-600'
              }`}
              title="Admin Business Settings"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden xl:inline">{isAdminLoggedIn ? 'Admin (Active)' : 'Admin'}</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-admin-btn"
              onClick={onOpenAdmin}
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300"
              aria-label="Admin settings"
            >
              <Shield className="w-4 h-4" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg bg-neutral-900 text-neutral-300 hover:text-white border border-neutral-800"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="md:hidden bg-neutral-950 border-b border-neutral-800 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              id={`mobile-nav-${link.id}`}
              onClick={() => handleNavClick(link.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-base font-semibold ${
                activeTab === link.id
                  ? 'bg-neutral-800 text-amber-400'
                  : 'text-neutral-300 hover:bg-neutral-900'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-4 border-t border-neutral-800 space-y-2.5">
            <a
              id="mobile-drawer-call"
              href={getTelUrl(settings.contactNumber)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-amber-500 text-neutral-950 font-bold text-sm"
            >
              <Phone className="w-4 h-4" />
              Call {settings.contactNumber}
            </a>

            <a
              id="mobile-drawer-whatsapp"
              href={getWhatsAppUrl(settings.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-emerald-600 text-white font-bold text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
