import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_DATABASE } from './src/data/initialData';
import { PlatformDatabase } from './src/types/platform';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'server_data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

// Ensure database file exists
function getDatabase(): PlatformDatabase {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        // Ensure admins array exists
        if (!parsed.admins || !Array.isArray(parsed.admins) || parsed.admins.length === 0) {
          parsed.admins = INITIAL_DATABASE.admins;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading server database:', err);
  }

  // Seed default database
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATABASE, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error initializing database file:', err);
  }
  return INITIAL_DATABASE;
}

function saveDatabase(data: PlatformDatabase): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving database to file:', err);
    return false;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));

  // Central Database API Endpoints (accessible across any device & browser)
  app.get('/api/db', (_req: Request, res: Response) => {
    const db = getDatabase();
    res.json(db);
  });

  app.post('/api/db', (req: Request, res: Response) => {
    const incoming = req.body;
    if (!incoming || typeof incoming !== 'object') {
      res.status(400).json({ success: false, error: 'بيانات غير صالحة' });
      return;
    }
    const success = saveDatabase(incoming);
    if (success) {
      res.json({ success: true, lastUpdated: incoming.lastUpdated });
    } else {
      res.status(500).json({ success: false, error: 'فشل حفظ البيانات على السيرفر' });
    }
  });

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Development mode: attach Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve dist files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Dr. Ahmed Sanad Physics Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
