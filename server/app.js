import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Load env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');
dotenv.config({ path: path.join(projectRoot, '.env') });

export const app = express();

// Shared middleware
app.use(cors());
app.use(express.json());

// Ensure uploads dir exists (use /tmp in serverless)
const uploadsDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try { fs.mkdirSync(uploadsDir, { recursive: true }); } catch {}
}
app.use('/uploads', express.static(uploadsDir));

// Attach a simple health route so the function is live even before importing full routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'AiFit API (serverless) is running' });
});

export default app;

