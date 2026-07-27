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
const PORT = process.env.PORT || 5000;

// ============================================================
// ✅ 1. FOLDERS CREATE KARO
// ============================================================
const uploadDir = process.env.UPLOAD_DIR || './uploads/temp';
const generatedDir = process.env.GENERATED_DIR || './generated/reels';
const publicDir = path.join(__dirname, 'public');

// ✅ FIXED: Proper static folder serving
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// ✅ FIXED: Better static file serving
app.use('/uploads/temp', express.static(path.join(__dirname, 'uploads/temp')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/generated', express.static(path.join(__dirname, 'generated/reels')));
app.use('/public', express.static(publicDir));

// ============================================================
// ✅ 2. MONGODB CONNECT
// ============================================================
connectDB();

// ============================================================
// ✅ 3. MIDDLEWARE
// ============================================================
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static: Frontend public files
app.use(express.static(path.join(__dirname, '../frontend/public')));

// ============================================================
// ✅ 4. ROUTES
// ============================================================

// ✅ Root route
app.get('/', (req, res) => {
  res.send(`
    <h1>🎬 Reel Maker Backend</h1>
    <p>Server is running successfully!</p>
    <p>✅ MongoDB Connected</p>
    <p>📡 Upload API: POST /api/upload</p>
    <p>🎬 Reel API: POST /api/reel/generate</p>
    <p>📂 Uploads: ${uploadDir}</p>
    <p>📂 Generated: ${generatedDir}</p>
    <p>📂 Public: ${publicDir}</p>
  `);
});

// ✅ API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/reel', reelRoutes);

// ✅ Test API route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Backend is working!',
    timestamp: new Date().toISOString(),
    uploadDir: uploadDir,
    generatedDir: generatedDir
  });
});

// ✅ Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// ✅ 5. ERROR HANDLING MIDDLEWARE
// ============================================================
app.use((req, res, next) => {
  res.status(404).json({ error: `Route ${req.url} not found` });
});

app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

// ============================================================
// ✅ 6. SERVER START
// ============================================================
app.listen(PORT, () => {
  console.log(`\n╔═══════════════════════════════════════════════════╗`);
  console.log(`║         🚀  SERVER STARTED SUCCESSFULLY         ║`);
  console.log(`╚═══════════════════════════════════════════════════╝`);
  console.log(`   ├── Port: ${PORT}`);
  console.log(`   ├── Uploads: ${uploadDir}`);
  console.log(`   ├── Generated: ${generatedDir}`);
  console.log(`   └── Public: ${publicDir}`);
  console.log(`\n📡 API Endpoints:`);
  console.log(`   ├── POST /api/upload`);
  console.log(`   ├── POST /api/reel/generate`);
  console.log(`   ├── GET  /api/reel/all`);
  console.log(`   ├── GET  /api/reel/latest`);
  console.log(`   ├── DELETE /api/reel/:id`);
  console.log(`   └── POST /api/reel/:id/rate`);
  console.log(`\n✅ Server ready!\n`);
});