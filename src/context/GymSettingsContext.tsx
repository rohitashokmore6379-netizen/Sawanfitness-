import React, { createContext, useContext, useState, useEffect } from 'react';
import { GymSettings } from '../types';
import { DEFAULT_GYM_SETTINGS } from '../data/defaultSettings';

interface GymSettingsContextType {
  settings: GymSettings;
  isLoading: boolean;
  isAdminLoggedIn: boolean;
  adminToken: string | null;
  updateSettings: (newSettings: Partial<GymSettings>) => Promise<{ success: boolean; error?: string }>;
  resetSettings: () => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (token: string) => void;
  logoutAdmin: () => void;
}

const LOCAL_STORAGE_KEY = 'sawan_fitness_settings_v1';
const AUTH_TOKEN_KEY = 'sawan_admin_token_v1';

const GymSettingsContext = createContext<GymSettingsContextType | undefined>(undefined);

export const GymSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GymSettings>(() => {
    // Try local storage first for instant hydration
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_GYM_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed reading settings from localStorage', e);
    }
    return DEFAULT_GYM_SETTINGS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY);
    } catch {
      return null;
    }
  });

  const isAdminLoggedIn = Boolean(adminToken);

  // Fetch settings from server on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchServerSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings && isMounted) {
            setSettings(data.settings);
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.settings));
            } catch (e) {
              console.error(e);
            }
          }
        }
      } catch (err) {
        console.warn('API fetch failed, utilizing cached settings:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchServerSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  const loginAdmin = (token: string) => {
    setAdminToken(token);
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } catch (e) {
      console.error(e);
    }
  };

  const logoutAdmin = () => {
    setAdminToken(null);
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const updateSettings = async (
    newSettings: Partial<GymSettings>
  ): Promise<{ success: boolean; error?: string }> => {
    const merged: GymSettings = {
      ...settings,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };

    // Optimistically update local state & localStorage
    setSettings(merged);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    } catch (e) {
      console.error(e);
    }

    // If server is available and admin token exists, persist to server
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (adminToken) {
        headers['Authorization'] = `Bearer ${adminToken}`;
      }

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers,
        body: JSON.stringify(merged),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        return { success: false, error: errData.error || 'Server error updating settings' };
      }

      const data = await res.json();
      if (data.settings) {
        setSettings(data.settings);
      }
      return { success: true };
    } catch (err: any) {
      console.warn('Persisted locally. Note: Server endpoint unreachable or running in mock mode.', err);
      return { success: true };
    }
  };

  const resetSettings = async (): Promise<{ success: boolean; error?: string }> => {
    setSettings(DEFAULT_GYM_SETTINGS);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_GYM_SETTINGS));
    } catch (e) {
      console.error(e);
    }

    try {
      if (adminToken) {
        await fetch('/api/settings/reset', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
      }
    } catch (e) {
      console.error(e);
    }

    return { success: true };
  };

  return (
    <GymSettingsContext.Provider
      value={{
        settings,
        isLoading,
        isAdminLoggedIn,
        adminToken,
        updateSettings,
        resetSettings,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </GymSettingsContext.Provider>
  );
};

export function useGymSettings() {
  const context = useContext(GymSettingsContext);
  if (!context) {
    throw new Error('useGymSettings must be used within GymSettingsProvider');
  }
  return context;
}
