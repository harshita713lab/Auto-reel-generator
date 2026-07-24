// backend/server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const fs = require('fs');
const connectDB = require('./config');
const uploadRoutes = require('./routes/upload');
const reelRoutes = require('./routes/reel');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- 1. FOLDERS CREATE KARO ----------
const uploadDir = process.env.UPLOAD_DIR || './uploads/temp';
const generatedDir = process.env.GENERATED_DIR || './generated/reels';

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir, { recursive: true });

// ---------- 2. MONGODB CONNECT ----------
connectDB();

// ---------- 3. MIDDLEWARE ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static: Frontend public files
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Static: Generated videos ko publicly serve karo
app.use('/generated', express.static(path.join(__dirname, 'generated/reels')));

// ---------- 4. VIEW ENGINE (EJS) ----------
app.set('views', path.join(__dirname, '../frontend/views'));
app.set('view engine', 'ejs');

// ---------- 5. ROUTES ----------

// ✅ Root route
app.get('/', (req, res) => {
  res.send(`
    <h1>🎬 Reel Maker Backend</h1>
    <p>Server is running successfully!</p>
    <p>✅ MongoDB Connected</p>
    <p>📡 Upload API: POST /api/upload</p>
    <p>🎬 Reel API: POST /api/reel/generate</p>
    <p>🎬 Shotstack API: POST /api/reel/generate-shotstack</p>
    <p>📂 Uploads: ${uploadDir}</p>
    <p>📂 Generated: ${generatedDir}</p>
  `);
});

// ✅ API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/reel', reelRoutes);

// Test API route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// ---------- 6. SERVER START ----------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${uploadDir}`);
  console.log(`📁 Generated directory: ${generatedDir}`);
});