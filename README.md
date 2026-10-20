# Moodify_Telugu_Songs

Moodify is an AI-powered mood-based Telugu music streaming web application. Using real-time facial expression analysis powered by Google MediaPipe, Moodify detects your current emotion (Happy, Sad, Surprised, Neutral) through your webcam and automatically plays a matching Telugu song to elevate or resonate with your mood.

---

## 🌟 Key Features

- **Real-Time Emotion Detection**: Detects facial landmarks and expressions using MediaPipe FaceLandmarker directly in the browser.
- **1 Emotion = 1 Song**: Plays an emotion-tailored Telugu soundtrack instantly upon mood detection.
  - 😄 **Happy**: Upbeat & cheerful tracks
  - 😢 **Sad**: Soulful & soothing melodies
  - 😲 **Surprised**: Energetic & high-vibe songs
  - 😐 **Neutral**: Silent mode (no song played, player stays paused)
- **Responsive Music Player**:
  - Auto-play upon mood detection
  - Minimalist, responsive UI (desktop, tablet, and mobile)
  - 5-second quick forward and rewind skip controls
  - Playback speed switcher (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x)
  - Interactive scrubbable seekbar and volume controls
- **Authentication System**:
  - Secure registration and login (Email / Username)
  - JWT authentication stored via HTTP-only secure cookies
- **Cloud Storage Integration**:
  - Songs and album art stored and streamed seamlessly via ImageKit
  - MongoDB database for user data and song catalog

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **SCSS / CSS Modules**
- **MediaPipe Tasks Vision** (`@mediapipe/tasks-vision`)
- **Axios** (Cookie-based credentials)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose**
- **ImageKit SDK** (Audio & Poster storage)
- **Node-ID3** (Metadata tag parsing)
- **JSONWebToken** & **Bcrypt**

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Tarun-Gajjalwar/Moodify_Telugu_Songs.git
cd Moodify_Telugu_Songs
```

### 2. Backend Setup
```bash
cd Backend
npm install
```
Create a `.env` file in `Backend/` following the `.env.example` format:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
Moodify/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database & third-party configs
│   │   ├── controllers/     # Auth & Song controllers
│   │   ├── middlewares/     # Auth & Upload middlewares
│   │   ├── models/          # User & Song schemas
│   │   ├── routes/          # Express route definitions
│   │   └── services/        # Storage services
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/        # Auth context, hooks & pages
│   │   │   ├── Expression/  # MediaPipe webcam detector
│   │   │   ├── home/        # Player, Song context & dashboard
│   │   │   └── shared/      # Navbar & reusable components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .gitignore
│   └── package.json
├── .gitignore
└── README.md
```

---

## 📄 License
MIT License
