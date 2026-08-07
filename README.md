# 🎬 Auto-Reel-Generator

An automated short video/reel generation platform powered by **Node.js**, **Express**, **Remotion (React for Video)**, and a **Vite + React** frontend. Users can upload images, select audio tracks, and programmatically render stunning high-quality vertical reels (`.mp4`) with smooth transitions and beat sync.

---

## 🚀 Key Features

- **Automated Composition Selection**: Automatically picks the best video composition/layout based on image count (e.g., `PremiumGrid`, `CinematicWeddingReel`, `WhiteCardPolaroidStack`, `RoyalWeddingStory`, `ReelComposition`).
- **Dynamic Animations & Transitions**: Built-in camera motion effects (KenBurns, Pan, Zoom) and transitions (Fade, Slide, Blur, Flash, Whip, Film Burn).
- **Audio & Beat Sync**: Fast FFmpeg audio overlay, volume control, and beat-timestamp synchronization.
- **Embedded FFmpeg Resolution**: Uses `ffmpeg-static` and `ffprobe-static` binaries directly—no manual system environment variable setup required.
- **Chromium Security Sandbox Optimized**: Automatically handles image-to-Base64 Data URI conversion to render local assets seamlessly in Remotion's headless Chrome engine without browser security blocks.
- **Modern Responsive Frontend**: Interactive React + Vite interface with real-time preview, template selection, and progress tracking.

---

## 🛠️ Tech Stack

### 1. Backend (`/backend`)
- **Runtime**: Node.js v24.2.0+
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **Video Engine**: `@remotion/renderer`, `@remotion/bundler`, `remotion`
- **Media Processing**: `ffmpeg-static`, `ffprobe-static`, `fluent-ffmpeg`, `sharp`
- **Upload Handling**: Multer

### 2. Remotion Engine (`/backend/remotion`)
- **Core Library**: Remotion 4.x
- **Framework**: React 18 & TypeScript 5
- **Headless Browser**: Puppeteer & Chromium

### 3. Frontend (`/Frontend`)
- **Framework**: React 19 & Vite 8
- **UI Components & Icons**: Lucide React, FontAwesome, Framer Motion, React CountUp
- **Routing & State**: React Router DOM v7, Axios, React Toastify

---

## 📂 Project Structure

```text
Auto-reel-generator/
├── backend/
│   ├── output/                   # Rendered videos (.mp4) and previews
│   ├── remotion/                 # Remotion React compositions & TS code
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── compositions/     # Reel compositions (Wedding, Grid, WhiteCard, etc.)
│   │       ├── components/       # Animated Image & video sub-components
│   │       ├── hooks/            # Animation & transition hooks
│   │       └── utils/            # Remotion helper functions
│   ├── src/
│   │   ├── config/               # FFmpeg, Remotion, Database & Env configs
│   │   ├── controllers/          # API Controllers (Reel, Render, Music, Upload)
│   │   ├── models/               # Mongoose schemas (Reel, Music, Template)
│   │   ├── routes/               # Express API routes
│   │   ├── services/             # Video, Audio, & Storage services
│   │   └── utils/                # Logger & utility helpers
│   ├── tests/                    # Remotion & Reel test scripts
│   ├── package.json
│   └── server.js                 # Express server entry point
├── Frontend/
│   ├── src/                      # React frontend components, pages, & assets
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ⚙️ Setup & Installation Guide

### Prerequisites
- **Node.js**: v20.0.0 or higher (v24 recommended)
- **NPM**: v9.x or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas connection string

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/harshita713lab/Auto-reel-generator.git
cd Auto-reel-generator
```

### Step 2: Install Backend Dependencies
```bash
# Navigate to backend directory
cd backend
npm install

# Navigate into remotion subfolder and install its dependencies
cd remotion
npm install
cd ..
```

### Step 3: Install Frontend Dependencies
```bash
# Navigate to Frontend directory
cd ../Frontend
npm install
cd ..
```

---

## 🔑 Environment Configuration

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
HOST=127.0.0.1

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/reel-generator

# Asset & Upload directories
UPLOAD_DIR=./uploads/temp
THUMBNAILS_DIR=./uploads/thumbnails
GENERATED_DIR=./generated/reels
MUSIC_DIR=./assets/music
TEMPLATES_DIR=./templates

# Server Base URL
ASSETS_URL=http://127.0.0.1:5000
```

---

## 🏃 Running Locally

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
The API server will run on `http://localhost:5000`.

### 2. Start Frontend App
```bash
cd Frontend
npm run dev
```
Vite will start the client dev server on `http://localhost:5173`.

---

## 🧪 Testing Commands

Run automated tests from the `backend/` directory to verify rendering pipeline:

```bash
# Test Remotion video renderer
npm run test:remotion

# Test full Reel creation & DB integration
npm run test:reel

# Run full test suite
npm run test:all
```

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).
