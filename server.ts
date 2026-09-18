import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { MongoClient, Db } from 'mongodb';

dotenv.config();

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'gym_settings.json');
const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');

// MongoDB Database Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:sawan2026@cluster0.mongodb.net/sawan_fitness?retryWrites=true&w=majority';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'sawan_fitness';

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let isMongoConnected = false;

// Initialize MongoDB with graceful fallback
async function initMongo() {
  if (!MONGODB_URI) return;
  try {
    mongoClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    await mongoClient.connect();
    mongoDb = mongoClient.db(MONGODB_DB_NAME);
    isMongoConnected = true;
    console.log(`[Database] MongoDB successfully connected to database: ${MONGODB_DB_NAME}`);
  } catch (err: any) {
    console.warn(`[Database] MongoDB connection note: Running in resilient local storage mode (${err.message || 'offline'})`);
    isMongoConnected = false;
  }
}

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
  gymTagline: 'GO HEAVY OR GO HOME',
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

// Load settings from MongoDB or fallback to disk
async function getStoredSettings(): Promise<Record<string, any>> {
  if (isMongoConnected && mongoDb) {
    try {
      const doc = await mongoDb.collection('settings').findOne({ type: 'gym_settings' });
      if (doc && doc.data) {
        return { ...INITIAL_SETTINGS, ...doc.data };
      }
    } catch (e) {
      console.error('Error fetching settings from MongoDB:', e);
    }
  }

  // Fallback to local JSON storage
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

async function saveSettings(settings: Record<string, any>): Promise<boolean> {
  let mongoSuccess = false;
  if (isMongoConnected && mongoDb) {
    try {
      await mongoDb.collection('settings').updateOne(
        { type: 'gym_settings' },
        { $set: { type: 'gym_settings', data: settings, updatedAt: new Date() } },
        { upsert: true }
      );
      mongoSuccess = true;
    } catch (e) {
      console.error('Error saving settings to MongoDB:', e);
    }
  }

  // Always ensure local file is also safely written as durable backup
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving settings file:', err);
    return mongoSuccess;
  }
}

// Simple in-memory valid token store for secure session management
const activeTokens = new Set<string>();

// Admin credentials from environment variables
const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'sawan@2026';

function maskMongoUri(uri: string): string {
  try {
    return uri.replace(/\/\/(.*):(.*)@/, '//***:***@');
  } catch {
    return 'mongodb+srv://***:***@cluster0...';
  }
}

async function startServer() {
  await initMongo();

  const app = express();
  app.use(express.json());

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      gym: 'Sawan Fitness Club',
      database: isMongoConnected ? 'MongoDB (Connected)' : 'Local Persistent JSON Storage',
    });
  });

  // Database Connection Status & String info (Protected info safely masked)
  app.get('/api/db/status', (_req: Request, res: Response) => {
    res.json({
      success: true,
      isMongoConnected,
      databaseName: MONGODB_DB_NAME,
      connectionString: maskMongoUri(MONGODB_URI),
      driver: 'mongodb',
      storageMode: isMongoConnected ? 'MongoDB Atlas Cluster' : 'Persistent File System + Firestore Cloud',
    });
  });

  // Public Settings endpoint
  app.get('/api/settings', async (_req: Request, res: Response) => {
    const settings = await getStoredSettings();
    res.json({ success: true, settings });
  });

  // Member Inquiry Submission
  app.post('/api/inquiries', async (req: Request, res: Response) => {
    const { name, phone, email, goal, preferredPlan, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and Phone number are required' });
    }

    const inquiry = {
      id: crypto.randomUUID(),
      name,
      phone,
      email: email || '',
      goal: goal || 'General Fitness & Muscle Building',
      preferredPlan: preferredPlan || 'Monthly Standard',
      message: message || '',
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    if (isMongoConnected && mongoDb) {
      try {
        await mongoDb.collection('inquiries').insertOne(inquiry);
      } catch (e) {
        console.error('Error saving inquiry to MongoDB:', e);
      }
    }

    // Also append to local JSON file
    try {
      let list = [];
      if (fs.existsSync(INQUIRIES_FILE)) {
        list = JSON.parse(fs.readFileSync(INQUIRIES_FILE, 'utf-8'));
      }
      list.push(inquiry);
      fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(list, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving inquiry to disk:', e);
    }

    return res.json({ success: true, message: 'Inquiry received successfully!', inquiry });
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
  app.post('/api/settings', async (req: Request, res: Response) => {
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

    const current = await getStoredSettings();
    const updated = {
      ...current,
      ...newSettings,
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveSettings(updated);
    if (!saved) {
      return res.status(500).json({ success: false, error: 'Failed to write settings to storage' });
    }

    return res.json({ success: true, settings: updated });
  });

  // Reset to Defaults (Protected)
  app.post('/api/settings/reset', async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    if (!activeTokens.has(token)) {
      return res.status(401).json({ success: false, error: 'Invalid or expired session' });
    }

    const resetValues = { ...INITIAL_SETTINGS, updatedAt: new Date().toISOString() };
    await saveSettings(resetValues);
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
