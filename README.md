<h1 align="center">🎵 Spotify Intelligence Studio</h1>

<h3 align="center">An AI-Powered Music Analytics & Intelligence Platform</h3>

<p align="center">
  <strong>Transforming Spotify listening data into meaningful music intelligence.</strong>
</p>

<p align="center">
  A full-stack analytics platform that connects with Spotify, retrieves user music data,<br/>
  analyzes listening preferences, and presents music intelligence through interactive dashboards.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Spotify-API-1DB954?style=for-the-badge&logo=spotify&logoColor=white" alt="Spotify API"/>
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI"/>
</p>

---

## 🖥️ Preview

### Landing Page

![Spotify Intelligence Studio - Landing Page](assets/preview.png)

> *The landing page as seen when the project is first opened on localhost.*

---

## 📖 Project Overview

**Spotify Intelligence Studio** is a full-stack music analytics platform designed to give users a deeper understanding of their Spotify listening behavior.

The application integrates with the **Spotify Web API** using **OAuth 2.0 with PKCE** authentication to securely retrieve user information, top artists, tracks, and playlists.

Instead of simply displaying music data, the platform organizes it into interactive dashboards, analytical visualizations, artist rankings, track statistics, playlist insights, and AI-powered recommendations — transforming raw music data into an intuitive intelligence experience.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Spotify OAuth 2.0** | Secure login with PKCE flow and token management |
| 📊 **Analytics Dashboard** | Interactive charts, genre insights, time-range filters |
| 🎤 **Artist Intelligence** | Top artist rankings, popularity analysis, affinity scores |
| 🎵 **Track Analytics** | Track stats, duration analysis, popularity rankings |
| 📂 **Playlist Intelligence** | Playlist metadata, collection explorer |
| 🤖 **AI Insights** | Gemini-powered listening preference analysis |
| 📋 **Intelligence Reports** | Consolidated music analytics & summaries |
| 👤 **User Profile** | Spotify profile, account info, listening stats |
| ⚙️ **App Settings** | Dashboard preferences and interface config |

---

## 🛠️ Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | UI Framework |
| **TypeScript** | 6 | Type Safety |
| **Vite** | 8 | Build Tool & Dev Server |
| **Tailwind CSS** | 4 | Utility-first Styling |
| **React Router DOM** | 7 | Client-side Routing |
| **Framer Motion** | 13 | Animations & Transitions |
| **Recharts** | 3 | Data Visualization & Charts |
| **Lucide React** | latest | Icon Library |
| **React Icons** | 5 | Additional Icons |
| **Axios** | 1 | HTTP Client |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | LTS | Runtime Environment |
| **Express.js** | 4 | Web Framework |
| **TypeScript** | 5 | Type Safety |
| **spotify-web-api-node** | 5 | Spotify API Wrapper |
| **Axios** | 1 | HTTP Requests |
| **dotenv** | 16 | Environment Variables |
| **cors** | 2 | Cross-Origin Resource Sharing |
| **nodemon** | 3 | Dev Auto-reload |

### Services & Integrations
| Service | Purpose |
|---|---|
| **Spotify Web API** | Music data, user info, top tracks & artists |
| **Spotify OAuth 2.0 PKCE** | Secure authentication |
| **Google Gemini API** | AI-powered music insights |
| **PostgreSQL + Prisma** | Database & ORM |

---

## 🏗️ System Architecture

```
        USER BROWSER
             │
             ▼
     React Frontend (Vite)
     TypeScript + Tailwind
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
 Spotify OAuth   Express Backend
 2.0 / PKCE      (Node.js + TS)
      │             │
      ▼             ▼
 Spotify Auth    Spotify Web API
   Tokens              │
      │          ┌─────┴─────┐
      └────►     │           │
           Data  ▼           ▼
        Processing      Gemini AI
             │          API
        ┌────┴────┐
        ▼         ▼
   PostgreSQL  Analytics
   (Prisma)    Engine
        └────┬────┘
             ▼
      React Dashboards
       Visual Insights
```

---

## 📡 Spotify API Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /v1/me` | Retrieve Spotify user profile |
| `GET /v1/me/top/artists` | Retrieve user's top artists |
| `GET /v1/me/top/tracks` | Retrieve user's top tracks |
| `GET /v1/me/playlists` | Retrieve user's playlists |
| `GET /v1/artists/{id}` | Retrieve artist details |
| `GET /v1/tracks/{id}` | Retrieve track details |

---

## 📁 Project Structure

```
Spotify-Intelligence-Studio/
│
├── frontend/                    # React + Vite + TypeScript
│   └── src/
│       ├── components/          # Reusable UI components
│       ├── views/               # Page-level view components
│       ├── pages/               # Route pages
│       ├── services/            # API service layer
│       └── App.tsx
│
├── backend/                     # Node.js + Express + TypeScript
│   └── src/
│       ├── routes/              # API route definitions
│       ├── controllers/         # Request handlers
│       ├── middleware/          # Auth & error middleware
│       ├── services/            # Business logic
│       └── server.ts
│
├── assets/                      # Screenshots & images
│   └── preview.png
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Git](https://git-scm.com/)
- [Spotify Developer Account](https://developer.spotify.com/dashboard)
- PostgreSQL *(optional — for database features)*
- Google Gemini API Key *(optional — for AI features)*

### 1. Clone the Repository

```bash
git clone https://github.com/priyalllll/Spotify-Intelligence-Studio.git
cd Spotify-Intelligence-Studio
```

### 2. Configure the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000

DATABASE_URL=your_postgresql_connection_string

GEMINI_API_KEY=your_gemini_api_key
```

### 3. Configure Spotify Developer App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create or open your application
3. Copy your **Client ID** and **Client Secret**
4. Add `http://localhost:5000/auth/callback` as a Redirect URI
5. Paste credentials into your `.env` file

### 4. Set Up the Database *(optional)*

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

### 5. Start the Backend

```bash
cd backend
npm run dev
# Runs at http://localhost:5000
```

### 6. Start the Frontend

```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔒 Security

- OAuth 2.0 PKCE — no client secret exposed to the browser
- Tokens stored securely, never committed to GitHub
- Backend handles all Spotify API communication
- Environment variables for all sensitive config
- CORS configured for allowed origins only

> ⚠️ **Never** commit `.env` files or expose access tokens, refresh tokens, or API keys in public repositories.

---

## 🔮 Future Enhancements

- [ ] Advanced listening trend analysis
- [ ] Music preference clustering with ML
- [ ] Enhanced AI-powered track recommendations
- [ ] Exportable PDF intelligence reports
- [ ] Historical listening analytics
- [ ] Artist similarity network graph
- [ ] Mobile-responsive design improvements
- [ ] Real-time now-playing integration

---

## 👩‍💻 Author

**Priyal Rathore**
B.Tech – Computer Engineering | SVKM's NMIMS, Indore

[![GitHub](https://img.shields.io/badge/GitHub-priyalllll-181717?style=for-the-badge&logo=github)](https://github.com/priyalllll)

---

## 📄 License

This project is developed for educational and portfolio purposes.

> Spotify is a trademark of Spotify AB. This project is an independent application and is not affiliated with, endorsed by, or officially connected to Spotify.

---

<p align="center">
  <strong>🎵 Spotify Intelligence Studio</strong><br/>
  Turning Music Data Into Intelligence.
</p>
