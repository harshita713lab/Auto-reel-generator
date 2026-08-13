# 🎬 Auto-Reel-Generator

<div align="center">

### 🚀 Automated Short Video & Vertical Reel Generation Platform

An end-to-end, high-performance video generation platform powered by **Node.js**, **Express**, **Remotion (React for Video)**, **FFmpeg**, **MongoDB**, and a **Vite + React** frontend. Programmatically convert photo collections into cinematic vertical `.mp4` reels with beat sync, smooth transitions, and dynamic camera movements.

[![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/react-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/express-4.18.2-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Remotion](https://img.shields.io/badge/remotion-4.0.498-FF4154?style=for-the-badge&logo=remotion)](https://www.remotion.dev/)
[![Vite](https://img.shields.io/badge/vite-8.1.1-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/mongodb-8.0.0-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-red?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/status-Production--Ready-purple?style=for-the-badge)](#)

</div>

---

## 🌟 Overview & Key Features

**Auto-Reel-Generator** automates the entire video creation workflow for social media platforms like Instagram Reels, YouTube Shorts, and TikTok.

- 🔄 **Dynamic Round-Robin Template Looping**: Automatically rotates through all available templates for any given image count so consecutive reel generations with the same photo count produce fresh visual styles.
- 🎨 **18+ High-Definition Wedding & Event Compositions**: Specially crafted React-based Remotion templates handling 4 to 23 images per reel.
- 🎵 **Audio & Beat Sync Integration**: Fast FFmpeg audio stream merging, volume control, beat detection, and timestamp synchronization.
- ⚡ **Headless Chromium Video Rendering**: Headless Puppeteer engine with embedded `ffmpeg-static` binaries—no system environment variable setup needed.
- 🖼️ **Base64 Data URI Ingestion**: Real-time image optimization via Sharp and Base64 encoding to prevent browser security blocks inside headless Chromium.
- 📱 **Modern Interactive UI**: Responsive React + Vite frontend with real-time video preview, music selection, custom template options, and download history.

---

## 📊 Template & Image Count Mapping

The backend automatically detects uploaded image counts and maps them to matching compositions. If multiple templates exist for the same count, the system rotates through them in an **Alternate Round-Robin Loop**:

| Template Name | Composition ID | Required Images | Default Theme Audio | Alternate Loop |
| :--- | :--- | :---: | :--- | :---: |
| **Template 13** | `Template13` | **4 Images** | `ReelAudio-13.mp3` | 🔄 `Template13` ↔ `Template15` |
| **Template 15** | `Template15` | **4 Images** | `ReelAudio-15.mp3` | 🔄 `Template15` ↔ `Template13` |
| **Template 5** | `Template5` | **5 Images** | `ReelAudio-5.mp3` | Single |
| **Template 19** | `Template19` | **7 Images** | `ReelAudio-19.mp3` | Single |
| **Template 7** | `Template7` | **8 Images** | `ReelAudio-7.mp3` | Single |
| **Template 3** | `Template3` | **10 Images** | `ReelAudio-3.mp3` | Single |
| **Template 14** | `Template14` | **11 Images** | `ReelAudio-14.mp3` | Single |
| **Template 6** | `Template6` | **12 Images** | `ReelAudio-6.mp3` | 🔄 `Template6` ↔ `Template17` |
| **Template 17** | `Template17` | **12 Images** | `ReelAudio-17.mp3` | 🔄 `Template17` ↔ `Template6` |
| **Template 2** | `Template2` | **13 Images** | `ReelAudio-2.mp3` | 🔄 `Template2` ↔ `Template16` |
| **Template 16** | `Template16` | **13 Images** | `ReelAudio-16.mp3` | 🔄 `Template16` ↔ `Template2` |
| **Template 1** | `Template1` | **14 Images** | `ReelAudio-1.mp3` | Single |
| **Template 9** | `Template9` | **15 Images** | `ReelAudio-9.mp3` | Single |
| **Template 10** | `Template10` | **16 Images** | `ReelAudio-10.mp3` | Single |
| **Template 8** | `Template8` | **17 Images** | `ReelAudio-8.mp3` | 🔄 `Template8` ↔ `Template18` |
| **Template 18** | `Template18` | **17 Images** | `ReelAudio-18.mp3` | 🔄 `Template18` ↔ `Template8` |
| **Template 11** | `Template11` | **18 Images** | `ReelAudio-11.mp3` | Single |
| **Template 12** | `Template12` | **23 Images** | `ReelAudio-12.mp3` | Single |

---

## 🛠️ Tech Stack & Architecture

### 1. Backend API (`/backend`)
- **Runtime**: Node.js v20.0.0+ (v24 recommended)
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose ORM
- **Video Engine**: `@remotion/renderer`, `@remotion/bundler`, `remotion`
- **Media Processing**: `ffmpeg-static`, `ffprobe-static`, `fluent-ffmpeg`, `sharp`, `multer`

### 2. Remotion Engine (`/backend/remotion`)
- **Core Library**: Remotion 4.x
- **Framework**: React 18 & TypeScript 5
- **Headless Browser**: Puppeteer & Chromium Engine

### 3. Frontend (`/Frontend`)
- **Framework**: React 19 & Vite 8
- **UI Components & Motion**: Lucide React, FontAwesome, Framer Motion, React CountUp
- **Routing & State**: React Router DOM v7, Axios, React Toastify

---

## 📂 Directory Structure

```text
Auto-reel-generator/
├── backend/
│   ├── assets/
│   │   └── music/            
│   ├── remotion/
│   │   ├── render.js  
│   │   ├── package.json
│   │   └── src/
│   │       ├── Root.tsx      
│   │       └── compositions/
│   │           └── Wedding/    
│   ├── src/
│   │   ├── config/          
│   │   ├── controllers/   
│   │   ├── models/             
│   │   ├── routes/
│   │   └── services/    
│   ├── .env                      
│   └── server.js          
├── Frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── components/             
│       └── pages/               
└── README.md
```

---

## ⚙️ Quick Start & Installation

### Prerequisites
- **Node.js**: v20.0.0 or higher
- **NPM**: v9.x or higher
- **MongoDB**: Local MongoDB instance or MongoDB Atlas Connection String

---

### Step 1: Clone Repository
```bash
git clone https://github.com/harshita713lab/Auto-reel-generator.git
cd Auto-reel-generator
```

### Step 2: Install Backend & Remotion Dependencies
```bash
# Navigate to backend
cd backend
npm install

# Navigate to remotion engine
cd remotion
npm install
cd ..
```

### Step 3: Install Frontend Dependencies
```bash
cd ../Frontend
npm install
cd ..
```

---

## 🔑 Environment Variables Setup

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
HOST=127.0.0.1

# MongoDB Connection String (Local or Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/reelmaker

# Uploads & Assets Directories
UPLOAD_DIR=./uploads/temp
THUMBNAILS_DIR=./uploads/thumbnails
GENERATED_DIR=./generated/reels
MUSIC_DIR=./assets/music
TEMPLATES_DIR=./templates

# Server Base URL
ASSETS_URL=http://127.0.0.1:5000
```

---

## 🏃 Running the Application

#### Terminal 1 — Start Backend Server:
```bash
cd backend
npm run dev
```
> Server running on `http://localhost:5000`

#### Terminal 2 — Start Frontend Application:
```bash
cd Frontend
npm run dev
```
> Client app live on `http://localhost:5173`

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/upload` | Upload multiple images for processing |
| `POST` | `/api/reel/generate` | Generate reel with selected images & auto template loop |
| `GET` | `/api/reel/all` | Fetch all generated reels |
| `GET` | `/api/reel/latest` | Fetch the most recent generated reel |
| `POST` | `/api/reel/:id/change-music` | Update background music track of rendered reel |
| `DELETE` | `/api/reel/:id` | Move reel to trash |
| `GET` | `/api/music` | Fetch available background music list |
| `GET` | `/api/health` | Backend status check |

---

## 📝 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<div align="center">
  <b>Built with ❤️ by Harshita Lab</b>
</div>
