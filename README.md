# AEGIS: AI Race Strategist

AEGIS is a production-grade, human-aware Formula-1 Race Intelligence and Strategy Optimization Platform. Unlike traditional racing telemetry tools, AEGIS models both vehicle physics and human driver limitations in real-time, employing an advanced Monte Carlo Tree Search (MCTS) decision engine to solve optimal pit windows, adapt to dynamic weather shifts, and defend against rival undercuts/overcuts.

---

## 🚀 Key Features

*   **Real-Time Vehicle Physics**: High-fidelity simulation of speedometer speeds, engine RPM, G-Forces, ERS batteries, drag reduction systems (DRS), mode-based fuel consumption, and independent 4-corner tire temperatures and wear degradation.
*   **Human Driver Model (HDM)**: Simulates professional racing driver limitations including fatigue accumulation, stress variables, focus coefficients, reaction delay scaling, and risk biases to calculate the **Human Risk Penalty (HRP)**. High HRP increases probability of lock-ups, slips, and braking delays.
*   **MCTS Strategy Optimization**: Evaluates candidates over remaining race stints under dynamic rain weather radar maps using Monte Carlo rollouts to forecast pit stop laps, optimal compounds, and win probabilities.
*   **Cyberpunk Motorsport Operational HUD**: Glassmorphic panels, glowing telemetry arcs, a real-time canvas-based Silverstone GPS track locator with racing lines, Recharts analytics, and an interactive **AI Race Engineer Voice Assistant** channel.
*   **Tamper-Proof Audit Chain**: Encodes live telemetry records using SHA-256 block hashing links, securing historical data runs against interference.

---

## 📂 Folder Structure

```
Aegis.mvp/
├── backend/
│   ├── app/
│   │   ├── main.py                # FastAPI entrypoint & simulation background loop
│   │   ├── websocket.py           # Real-time WebSocket connection manager
│   │   ├── database/              # SQLAlchemy session connection
│   │   ├── models/                # Database relational schemas
│   │   ├── schemas/               # Pydantic validation schemas
│   │   └── services/              # Core simulation services
│   │       ├── physics_engine.py  # G-Force, ERS, and tire wear calculations
│   │       ├── hdm_engine.py      # Driver fatigue, stress, and HRP
│   │       ├── weather_engine.py  # Rain intensity & track wetness drying
│   │       ├── telemetry_engine.py# Consolidator of physical & cognitive states
│   │       ├── mcts_strategy.py   # Monte Carlo strategy optimization algorithm
│   │       ├── pit_engine.py      # Pit stationary times & out-lap warmup delays
│   │       ├── event_engine.py    # Global yellow flags, Safety Car triggers, VSCs
│   │       ├── anomaly_detector.py# Tire overheating & cognitive decline warnings
│   │       └── blockchain_sec.py  # SHA-256 telemetry ledger hashing
│   ├── requirements.txt           # Python backend dependencies
│   └── Dockerfile                 # Backend container configuration
│
├── frontend/
│   ├── app/                       # Next.js 15 pages, layouts, and global styles
│   ├── components/                # Modular telemetry cockpit UI widgets
│   │   ├── dashboard/             # Top navigation & session controllers
│   │   ├── telemetry/             # Speeds, G-forces, and independent tire corners
│   │   ├── track/                 # Interactive Silverstone SVG GPS visualizer
│   │   ├── strategy/              # Stint recommendations, action buttons, HRP gauges
│   │   ├── ai/                    # Race Engineer Assistant Voice chat interface
│   │   ├── charts/                # Recharts fatigue/wear/fuel area logs
│   │   └── shared/                # Styled GlassCard panels
│   ├── hooks/                     # useRaceWebSocket connection link hooks
│   ├── store/                     # Zustand central telemetry state managers
│   ├── tailwind.config.ts         # F1 cyberpunk styling tokens
│   └── package.json               # Frontend package dependencies
│
└── docker-compose.yml             # Root multi-container composer
```

---

## 🛠️ Step-by-Step Installation & Startup

Follow these directions to launch the complete AEGIS ecosystem:

### 1. Requirements
Ensure the following are installed locally:
*   [Python 3.10+](https://www.python.org/downloads/)
*   [Node.js 18+](https://nodejs.org/en)

### 2. Startup Backend API (Uvicorn Server)
Open your terminal and navigate to the backend subdirectory:

```powershell
# Navigate inside backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\Activate.ps1

# Install requirements
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The Uvicorn server will boot on `http://localhost:8000`. You can inspect the interactive OpenAPI endpoints at `http://localhost:8000/docs`.

### 3. Startup Frontend Dashboard (Next.js 15 App)
Open a new terminal window:

```powershell
# Navigate inside frontend directory
cd frontend

# Install package dependencies
npm install

# Start Next.js dev server
npm run dev
```

Open `http://localhost:3000` in your web browser. You will enter the **AEGIS Operations Center** where live telemetry frames will start streaming automatically!

### 4. Running Unified Container Deployment
To compile and launch both systems inside docker:

```powershell
# Run from root folder containing docker-compose.yml
docker-compose up --build
```

---

## 🔌 API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/race/session` | Returns active F1 session metadata. |
| **POST** | `/race/session/restart` | Resets and initializes a new race session. |
| **GET** | `/telemetry/live` | Returns high-frequency live physics & driver states. |
| **GET** | `/driver/state` | Returns cognitive stress, focus, fatigue, and delays. |
| **GET** | `/weather` | Returns ambient/track temps, rain %, and wetness mm. |
| **GET** | `/events` | Returns recent race logs and safety alerts. |
| **GET** | `/analytics/hrp` | Returns historical fatigue/stress records for charting. |
| **POST** | `/strategy/recommend` | Evaluates customized MCTS rollouts. |
| **POST** | `/ai/chat` | AI Race Engineer voice context chat assistant. |
| **WS** | `/ws/telemetry` | WebSocket high-frequency bidirectional stream. |

---

## ⚙️ Environment Variables

A `.env` file can be configured inside `/backend` with:

*   `DATABASE_URL`: Set a custom PostgreSQL address (e.g. `postgresql://user:pass@host/db`). Defaults to a local SQLite autogenerated `aegis.db`.
*   `OPENAI_API_KEY`: Supply an OpenAI API key to unlock natural language intelligence for the **AI Race Engineer Assistant**. If omitted, AEGIS uses a high-performance, rules-based Formula-1 reasoning fallback.
