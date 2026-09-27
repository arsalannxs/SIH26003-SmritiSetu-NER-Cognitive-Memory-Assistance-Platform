# SmritiSetu NER — Cognitive & Memory Assistance Platform
### Smart India Hackathon 2026 • Problem Statement: SIH26003
**Ministry of Development of North Eastern Region (MDoNER)**

---

## 📌 Executive Summary
**SmritiSetu NER** is a simple, calming, and culturally inclusive cognitive engagement, routine assistance, and caregiver monitoring platform developed for elderly individuals experiencing memory difficulties or early cognitive decline in the North Eastern Region of India (Assam, Meghalaya, Arunachal Pradesh, Manipur, Mizoram, Nagaland, Tripura, Sikkim).

> ⚠️ **CRITICAL ETHICAL & MEDICAL DISCLAIMER:**  
> SmritiSetu NER is a **cognitive assistance and supportive engagement platform**, **NOT** a clinical diagnostic or medical treatment system. It does not diagnose dementia, prescribe medications, or replace medical specialists. All AI observations are framed as supportive routine insights and engagement trends.

---

## 👥 Three Core User Modes
1. **Elderly / Patient Mode (Default)**:
   - Ultra-large touch buttons, high-contrast readable typography, warm and gentle color palette.
   - 6 Large Action Cards: 🧠 Play, 💊 Medicines, 💧 Drink Water ("I DRANK WATER" one-tap button), 📅 Today's Plan, ❤️ My Progress, 🎤 Speak to Assistant.
   - 5-button bottom navigation (Home, Play, Medicines, Progress, Talk).
   - "← Back" on every screen. No confusing nested menus or clinical charts on the elderly screen.
2. **Caregiver Mode**:
   - Patient overview & profile switcher (Dhiren Borah - Guwahati, Maya Devi - Shillong, Tashi Wangchuk - Tawang).
   - Non-diagnostic engagement analytics (Recharts: 7D / 30D / 90D activity, focus rate, routine adherence).
   - Caregiver notifications and routine alerts.
   - Caregiver notes and observations journal.
   - Cultural theme selector (Assam Tea & Flora, Northeast Wildlife, Heritage & Festivals, Himalayan Nature).
   - Family photo reminiscence album manager.
   - Gemini 3.8 Flash supportive trend summarizer.
3. **Healthcare / Community Field Worker Mode**:
   - Regional health block overview (ANM / ASHA worker interface).
   - Assigned elderly patients list in district.
   - Field visit observation log (non-diagnostic community care tracking).

---

## 🧠 6 Culturally Relevant Cognitive Activities
1. **Card Memory Match (Pairs)**: Find pairs of culturally familiar NER flora, fauna, and handloom items (Assam Tea Leaf 🍃, One-horned Rhino 🦏, Great Hornbill 🦜, Traditional Japi Hat 👒, Bihu Dhol Drum 🥁, Golden Muga Silk ✨).
2. **Daily Routine Recall (Sequencing)**: Arranges familiar morning routine steps (Wake Up ☀️ ➔ Brush Teeth 🪥 ➔ Morning Tea 🍵 ➔ Medicine 💊 ➔ Garden Walk 🌿) answering "What comes next?".
3. **Object Recognition**: Identifies everyday household and cultural objects (Clay tea cup, Wall clock, Hand fan, Brass bell) with **Tap or Voice Answer**.
4. **Gentle Patterns**: Simple sequence completion (🔴 🔵 🔴 🔵 [ ? ]).
5. **Focus & Attention**: Visual search activity ("Tap all the tea leaves" among distractor items).
6. **Family Memory Album**: Loving reminiscence with family photos, names, relationships, and story prompts uploaded by caregivers.

---

## 📈 Adaptive Difficulty Engine
- Evaluates recent performance (accuracy, completion rate, attempt count, response pacing).
- Automatically transitions between: **Gentle (Easy) ➔ Mild (Easy+) ➔ Engaging (Medium) ➔ Advanced (Hard)**.
- **Strict Anti-Stigma Guideline**: Always labeled **"Activity Difficulty"**, never "Dementia Severity" or "Cognitive Decline".

---

## 🤖 AI & Voice Architecture
- **Server-Side Gemini AI (`gemini-3.8-flash`)**:
  - Warm encouraging voice greetings.
  - Caregiver weekly engagement trend summaries.
  - Voice query interpretation.
  - Graceful deterministic local fallbacks when offline or without API key.
- **Multilingual Support**:
  - Centralized translations for **English (`en`)**, **Hindi (`hi`)**, and **Assamese (`as`)**.
- **Voice Assistant**:
  - Web Speech API Speech Recognition for hands-free voice input.
  - SpeechSynthesis Text-to-Speech tuned to a calm, measured pace (0.88x) for elderly listeners.

---

## 📡 Offline-First & Sync Queue
- IndexedDB / LocalStorage local-first architecture.
- Detects network drops; all games, reminders, and notes continue functioning locally.
- Action items enter a local **Sync Queue**.
- When connection returns, automatic background synchronization drains the queue and alerts caregivers.
- Includes a live **"Simulate Offline"** toggle in the header for hackathon demonstrations.

---

## 🎬 SIH 2026 17-Step Demonstration Flow
Tap **"RUN SIH DEMO"** in the top navigation bar to run an interactive or auto-playing step-by-step walkthrough covering the entire scenario:
1. Elderly user opens app
2. App greets user
3. Starts memory game
4. Records performance
5. Difficulty is adapted
6. Medicine reminder appears
7. User marks medicine taken
8. User asks voice assistant ("What do I have today?")
9. Assistant responds with voice
10. Caregiver opens dashboard
11. Sees activity completion
12. Sees weekly engagement trend
13. Adds caregiver observation
14. Simulates offline network drop
15. Queues data locally
16. Restores connection
17. Confirms seamless sync

---

## 🛠️ Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Motion
- **Charts**: Recharts
- **Backend / Proxy**: Express, Node.js, `tsx`
- **AI SDK**: `@google/genai` (Gemini 3.8 Flash via server-side `/api/ai/*`)
- **Storage**: LocalStorage / IndexedDB sync queue

---

## 🚀 Setup & Execution Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API Key (optional — full app runs with graceful local fallback if key is omitted):
```env
GEMINI_API_KEY="your_api_key_here"
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🏛️ Ministry & Challenge Attribution
- **Challenge Code**: SIH26003
- **Organization**: Ministry of Development of North Eastern Region (MDoNER)
- **Category**: Software
- **Theme**: AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients in North Eastern Region (NER)
