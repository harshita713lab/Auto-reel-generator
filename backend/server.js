// backend/server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const fs = require('fs');
const connectDB = require('./src/config/db');
const uploadRoutes = require('./src/routes/uploadRoutes');
const reelRoutes = require('./src/routes/reelRoutes');
const templateRoutes = require('./src/routes/templateRoutes');
const renderRoutes = require('./src/routes/renderRoutes');
const musicRoutes = require('./src/routes/musicRoutes');
const healthRoutes = require('./src/routes/healthRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// ✅ 1. FOLDERS CREATE KARO
// ============================================================
const uploadDir = path.join(__dirname, 'uploads/temp');
const generatedDir = path.join(__dirname, 'generated/reels');
const publicDir = path.join(__dirname, 'public');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(generatedDir)) fs.mkdirSync(generatedDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// ============================================================
// ✅ 2. STATIC FILE SERVING (FIXED)
// ============================================================
// ============================================================
// ✅ 2. STATIC FILE SERVING (FIXED)
// ============================================================
app.use('/uploads/temp', express.static(uploadDir));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/generated', express.static(generatedDir));

// ✅ CORS FIX: /output folder ke liye headers allow karo
app.use('/output', (req, res, next) => {
    // Frontend ka exact port allow karo (5173)
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); 
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // Agar preflight (OPTIONS) request hai toh seedha 200 return karo
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// ✅ IMPORTANT FIX: Ensure 'output' folder is found
const outputPath = path.join(__dirname, 'output');
if (!fs.existsSync(outputPath)) {
    const parentOutputPath = path.join(__dirname, '../output');
    if (fs.existsSync(parentOutputPath)) {
        app.use('/output', express.static(parentOutputPath));
        console.log("📂 Serving output from (Parent):", parentOutputPath);
    } else {
        console.warn("⚠️ Output folder not found anywhere!");
    }
} else {
    app.use('/output', express.static(outputPath));
    console.log("📂 Serving output from (Inside):", outputPath);
}

// ✅ DELETE THIS LINE
// app.use('/renders', express.static(path.join(__dirname, 'output/renders')));

app.use('/public', express.static(publicDir));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// ============================================================
// ✅ 3. MONGODB CONNECT
// ============================================================
connectDB();

// ============================================================
// ✅ 4. MIDDLEWARE
// ============================================================
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Static: Frontend public files
app.use(express.static(path.join(__dirname, '../Frontend/public')));

// ============================================================
// ✅ 5. ROUTES
// ============================================================
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

app.use('/api/upload', uploadRoutes);
app.use('/api/reel', reelRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/render', renderRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/health', healthRoutes);

app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ Backend is working!',
    timestamp: new Date().toISOString(),
    uploadDir: uploadDir,
    generatedDir: generatedDir
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// ✅ 6. ERROR HANDLING MIDDLEWARE
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
// ✅ 7. SERVER START
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