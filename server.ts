import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'gym_settings.json');

// Default initial settings matching prompt requirements
const INITIAL_SETTINGS = {
  gymName: 'Sawan Fitness Club',
  ownerName: 'Sohel Abaso Mullani',
  email: 'soyall.mullani@gmail.com',
  contactNumber: '+91 84089 00786',
  address: 'Sawan Fitness Club, Near Gotne Petrol Pump, Shindewadi Road, Gargoti, Tal. Bhudargad, Dist. Kolhapur, Maharashtra – 416209',
  landmark: 'Near Gotne Petrol Pump',
  road: 'Shindewadi Road',
  city: 'Gargoti',
  taluka: 'Bhudargad',
  district: 'Kolhapur',
  state: 'Maharashtra',
  pinCode: '416209',
  gymDescription: 'Gargoti’s premier fitness club led by Sohel Abaso Mullani. We deliver world-class training programs, heavy strength facilities, personalized nutrition plans, and guaranteed transformations.',
  gymTagline: 'Train Hard. Live Strong. Transform Yourself.',
  gymTimings: 'Morning: 5:30 AM – 10:30 AM | Evening: 4:30 PM – 10:00 PM (Sunday: 6:00 AM – 12:00 PM)',
  googleMapsUrl: 'https://maps.google.com/?q=Sawan+Fitness+Club+Near+Gotne+Petrol+Pump+Shindewadi+Road+Gargoti+Bhudargad+Kolhapur+416209',
  instagramUrl: 'https://instagram.com/sawanfitnessclub',
  facebookUrl: 'https://facebook.com/sawanfitnessclub',
  whatsappNumber: '+91 84089 00786',
  updatedAt: new Date().toISOString(),
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load settings from disk or write defaults
function getStoredSettings() {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return { ...INITIAL_SETTINGS, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading settings file:', err);
  }
  return { ...INITIAL_SETTINGS };
}

function saveSettings(settings: Record<string, any>) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving settings file:', err);
    return false;
  }
}

// Simple in-memory valid token store for secure session management
const activeTokens = new Set<string>();

// Admin credentials from environment variables (safe fallback for testing)
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'sawan@2026';

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', gym: 'Sawan Fitness Club' });
  });

  // Public Settings endpoint - NEVER exposes secrets or internal credentials
  app.get('/api/settings', (_req: Request, res: Response) => {
    const settings = getStoredSettings();
    res.json({ success: true, settings });
  });

  // Admin Login Endpoint
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = crypto.randomBytes(32).toString('hex');
      activeTokens.add(token);
      return res.json({
        success: true,
        token,
        user: { username: ADMIN_USER, role: 'admin' },
      });
    }

    return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  });

  // Admin Token Verification
  app.get('/api/auth/verify', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (activeTokens.has(token)) {
      return res.json({ success: true, user: { username: ADMIN_USER, role: 'admin' } });
    }
    return res.status(401).json({ success: false, error: 'Session expired' });
  });

  // Update Settings (Protected)
  app.post('/api/settings', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Admin login required' });
    }
    const token = authHeader.split(' ')[1];
    if (!activeTokens.has(token)) {
      return res.status(401).json({ success: false, error: 'Invalid or expired session' });
    }

    const newSettings = req.body;
    if (!newSettings || typeof newSettings !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid settings payload' });
    }

    const current = getStoredSettings();
    const updated = {
      ...current,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };

    const saved = saveSettings(updated);
    if (!saved) {
      return res.status(500).json({ success: false, error: 'Failed to write settings to storage' });
    }

    return res.json({ success: true, settings: updated });
  });

  // Reset to Defaults (Protected)
  app.post('/api/settings/reset', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (!activeTokens.has(token)) {
      return res.status(401).json({ success: false, error: 'Invalid or expired session' });
    }

    const resetValues = { ...INITIAL_SETTINGS, updatedAt: new Date().toISOString() };
    saveSettings(resetValues);
    return res.json({ success: true, settings: resetValues });
  });

  // Vite middleware in dev or static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sawan Fitness Club server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
