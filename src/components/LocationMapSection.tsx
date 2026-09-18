import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, Compass, ExternalLink, ShieldCheck } from 'lucide-react';
import { useGymSettings } from '../context/GymSettingsContext';
import { getGoogleMapsDirectionsUrl } from '../utils/contactUtils';

export const LocationMapSection: React.FC = () => {
  const { settings } = useGymSettings();

  return (
    <section id="location-map-section" className="py-20 bg-neutral-900/30 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-amber-400 font-bold uppercase tracking-widest text-xs">
            Easy Accessibility in Gargoti
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white font-['Teko'] tracking-wide">
            Location & Route Directions
          </h2>
          <p className="mt-3 text-neutral-300 text-sm sm:text-base">
            Conveniently situated along Shindewadi Road near Gotne Petrol Pump, with spacious two-wheeler and four-wheeler parking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Landmark Details */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800">
              <div className="flex items-center gap-2 text-amber-400 mb-3">
                <Compass className="w-5 h-5" />
                <h3 className="text-base font-bold text-white uppercase tracking-wide">
                  Key Landmarks
                </h3>
              </div>

              <ul className="space-y-3 text-xs sm:text-sm text-neutral-300">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Gotne Petrol Pump:</strong> Just 100 meters away</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Shindewadi Road:</strong> Direct wide road access</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Gargoti Bus Stand:</strong> 3 minutes driving distance</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>PIN Code:</strong> {settings.pinCode}</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800">
              <h4 className="text-sm font-bold text-white mb-2">
                Need Help Finding Us?
              </h4>
              <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
                If you are coming from Kadgaon, Madilage, or Kolhapur city, give owner <strong className="text-white">{settings.ownerName}</strong> a quick call and we will guide your route.
              </p>
              <a
                href={getGoogleMapsDirectionsUrl(settings.address, settings.googleMapsUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold transition-all w-full justify-center"
              >
                <Navigation className="w-4 h-4" />
                <span>Open Google Maps Directions</span>
              </a>
            </div>

          </div>

          {/* Right Map Canvas / Embed */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-neutral-800 min-h-[360px] bg-neutral-950 relative flex flex-col">
            <iframe
              title="Sawan Fitness Club Map Location"
              src="https://maps.google.com/maps?q=Gargoti,+Kolhapur,+Maharashtra+416209&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full flex-1 border-0 filter invert contrast-125 opacity-80 hover:opacity-100 transition-opacity"
              loading="lazy"
            />
            <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-neutral-300">
                {settings.address}
              </span>
              <a
                href={getGoogleMapsDirectionsUrl(settings.address, settings.googleMapsUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:underline flex items-center gap-1 font-semibold shrink-0"
              >
                <span>Full Map View</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
