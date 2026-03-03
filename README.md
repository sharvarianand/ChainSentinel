# 🛡️ ChainSentinel

**ChainSentinel** is a next-generation, autonomous supply chain intelligence and orchestration platform. It leverages a multi-agent AI architecture to detect global signals, simulate risks, and execute autonomous mitigation strategies—ensuring enterprise resilience in a volatile global economy.

---

## 🚀 Vision: Autonomous Supply Chain Control

Traditional supply chains are reactive. ChainSentinel shifts the paradigm to **autonomous resilience**:
- **Detect**: 24/7 global signal scanning (news, weather, port data).
- **Decide**: AI-driven scenario simulation and risk calculation in milliseconds.
- **Resolve**: Autonomous agents negotiate with suppliers and reroute logistics without human intervention.

---

## 🛠️ Tech Stack

### Frontend (Next.js 15)
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion & Lucide Icons
- **Visualizations**: Three.js (R3F), Cobe (Interactive 3D Globe), Recharts
- **Authentication**: Clerk (with custom dark theme)
- **State Management**: Zustand

### Backend (FastAPI & Multi-Agent)
- **Framework**: FastAPI (Python 3.12)
- **AI Core**: Google Gemini 1.5 Pro (via Vertex AI/Google AI SDK)
- **Databases**: 
  - **PostgreSQL**: Transactional and structured metadata.
  - **Neo4j**: Graph-based supply node relationship mapping.
  - **Redis**: Real-time message brokering and agent coordination.
- **Communication**: WebSockets (Socket.io) for live agent activity feeds.

---

## 🧠 Multi-Agent Architecture

ChainSentinel operates through a swarm of specialized agents:

1.  **Intelligence Agent**: Scans news, weather, and logistics APIs for disruption signals.
2.  **Risk Agent**: Calculates the "Value at Risk" (VaR) and cascading node impacts using Graph DB.
3.  **Simulation Agent**: Runs "Monte Carlo" style scenarios to predict the outcome of diverse mitigation paths.
4.  **Optimization Agent**: Identifies the mathematically optimal route/supplier shift to minimize cost and time.
5.  **Orchestration Agent**: Generates and executes Purchase Orders (POs) or logistics shifts autonomously.
6.  **Learning Agent**: Performs digital forensics on past incidents to improve future detection patterns.

---

## ⚙️ Getting Started

### 1. Environment Configuration
Create a `.env` file in the root and add the following:
```bash
# Database & Infra
DB_PASSWORD=your_secure_password
NEO4J_PASSWORD=your_neo4j_password
REDIS_URL=redis://localhost:6380

# API Keys
GEMINI_API_KEY=your_google_ai_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 2. Run with Docker (Recommended)
The easiest way to start the entire ecosystem (Databases, Redis, Neo4j, 6+ Agents, and Frontend) is via Docker Compose:
```bash
docker-compose up --build
```
- **Frontend**: [http://localhost:3001](http://localhost:3001)
- **API Gateway**: [http://localhost:8000](http://localhost:8000)

### 3. Local Development (Frontend Only)
If you just want to work on the UI:
```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Dashboard Features
- **Live Geospatial Globe**: Real-time visualization of supply nodes and active disruptions.
- **Autonomous Timeline**: A live feed of agent decisions as they happen.
- **Risk Trajectory**: Compare projected unmitigated risk vs. autonomous mitigation outcomes.
- **Human-in-the-Loop**: A secure interface for managers to approve high-cost agent recommendations.

---

## 📄 License
© 2026 ChainSentinel Systems. All rights reserved.
Built for the future of resilient global trade.
