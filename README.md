# ⏱️ Tempus

> *"Time is a game played beautifully by children."* — Heraclitus

**Tempus** is a premium focus timer designed to help you stay productive with style. Built with Next.js 15, featuring stunning WebGL particle effects, ambient music streaming, and comprehensive session analytics.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat-square&logo=tailwind-css)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animated-ff69b4?style=flat-square)

---

## ✨ Features

### 🎯 Timer Modes
- **Simple Mode** — Set any duration with hours, minutes, and seconds
- **Pomodoro Mode** — Classic technique with work sessions, short breaks, and long breaks

### 🎨 Visual Excellence
- **WebGL Particle Background** — GPU-accelerated particles with mouse interaction
- **Glitch Text Effects** — Cyberpunk-style text animations on the landing page
- **Progress Arc** — Elegant circular progress indicator with glow effects
- **6 Accent Themes** — Rose, Violet, Cyan, Emerald, Amber, Blue

### 🎵 Ambient Streaming
- **Lofi Girl** — Classic lo-fi hip hop beats
- **Chillhop Radio** — Jazzy hip-hop instrumentals
- **Coffee Shop Jazz** — Cozy café atmosphere
- **Synthwave Radio** — Retro-futuristic vibes

### 📊 Analytics
- **Session History** — Track all completed focus sessions
- **Weekly Insights** — Visualize your productivity patterns
- **Activity Heatmap** — See your most productive days
- **Tag System** — Categorize sessions (Work, Study, Creative, Exercise, Reading)

### ⚡ Quality of Life
- **Browser Tab Title** — See remaining time without switching tabs
- **Keyboard Shortcuts** — Spacebar to start/pause, R to reset, Z for Zen mode
- **Zen Mode** — Distraction-free timer display
- **Completion Celebrations** — Confetti and sound effects on session complete
- **Browser Notifications** — Get notified when your timer ends

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yashkokane1031/Tempus.git
cd Tempus

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see Tempus in action.

### Build for Production

```bash
npm run build
npm start
```

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **3D/WebGL** | OGL (Particles) |
| **State** | Zustand + LocalStorage |
| **Fonts** | JetBrains Mono, Inter |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main application
│   ├── layout.tsx        # Root layout with fonts
│   └── globals.css       # Theme variables & styles
├── components/
│   ├── Timer.tsx         # Timer display
│   ├── TimePicker.tsx    # Duration selector
│   ├── ProgressArc.tsx   # Circular progress
│   ├── Particles.tsx     # WebGL background
│   ├── StreamPlayer.tsx  # YouTube ambient player
│   ├── ThemePicker.tsx   # Accent color selector
│   ├── Analytics/        # Charts and heatmaps
│   └── ...
├── hooks/
│   ├── useTimer.ts       # Timer logic
│   ├── useStore.ts       # Zustand store
│   └── useDocumentTitle.ts
├── lib/
│   ├── sounds.ts         # Audio effects
│   ├── confetti.ts       # Celebration effects
│   └── storage.ts        # LocalStorage utilities
└── types/
    └── index.ts          # TypeScript definitions
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start / Pause timer |
| `R` | Reset timer |
| `Z` | Toggle Zen mode |
| `?` | Show keyboard hints |

---

## 🎨 Themes

Tempus includes 6 beautiful accent color themes:

- 🌹 **Rose** — Warm, energetic red
- 💜 **Violet** — Creative purple
- 🔵 **Cyan** — Cool, focused teal
- 💚 **Emerald** — Calm, balanced green
- 🟠 **Amber** — Warm, inviting orange
- 🔷 **Blue** — Classic, professional blue

---

## 📄 License

MIT License — feel free to use this project for personal or commercial purposes.

---

## 🙏 Acknowledgments

- [Lofi Girl](https://www.youtube.com/c/LofiGirl) for the amazing streams
- [ReactBits](https://reactbits.dev) for the particles component inspiration
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

---

<p align="center">
  <strong>Built with ❤️ by Yash Kokane</strong>
</p>
