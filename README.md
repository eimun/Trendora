# 🚀 Trendora - AI-Powered Trend Analysis for Content Strategy

Trendora helps content creators discover trending topics and generate viral content instantly, with predictive analytics that forecast what will trend before it trends.

## ✨ Key Innovations

1. **Trend Gap Analysis** - Find opportunities competitors missed using YouTube API
2. **Virality Scoring** - Data-driven 0-100 scores for each trend
3. **Style Cloning** - AI learns YOUR writing voice via Gemini analysis
4. **Predictive Forecasting** - ML-powered 7-day trend predictions

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Tailwind CSS, Axios |
| **Backend** | Python Flask, PostgreSQL |
| **AI** | Google Gemini API |
| **Data** | PyTrends, YouTube Data API |
| **ML** | scikit-learn, pandas |

## 📦 Installation

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL 14+

### Database Setup
```bash
psql postgres
CREATE DATABASE trendora;
CREATE USER trendora_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE trendora TO trendora_user;
\q
```

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env   # Then add your API keys

# Initialize database
python database.py
python migrations/add_gap_analysis.py
python migrations/add_virality_score.py
python migrations/add_style_learning.py
python migrations/add_forecasting.py

# Seed demo data
python seed_data.py

# Start server
python app.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## 🔑 Required API Keys

| Key | Get it from |
|-----|------------|
| `GEMINI_API_KEY` | https://makersuite.google.com/app/apikey |
| `YOUTUBE_API_KEY` | https://console.cloud.google.com/ |

## 📊 Project Structure

```
trendora/
├── backend/
│   ├── app.py                # Flask entry point (8 blueprints)
│   ├── database.py           # PostgreSQL connection + schema
│   ├── auth.py               # JWT authentication
│   ├── trends_service.py     # Google Trends integration
│   ├── ai_service.py         # Gemini content generation
│   ├── youtube_service.py    # YouTube API integration
│   ├── virality_scorer.py    # Trend scoring algorithm
│   ├── style_analyzer.py     # Writing style analysis
│   ├── prediction_engine.py  # ML forecasting engine
│   ├── cache.py              # In-memory caching
│   ├── seed_data.py          # Demo data seeder
│   ├── test_setup.py         # Setup verification
│   ├── cron_archiver.py      # Daily trend archiver
│   ├── cron_predictions.py   # Daily prediction generator
│   ├── routes/               # 7 API route modules
│   ├── migrations/           # 4 database migrations
│   └── tests/                # API test suite
├── frontend/
│   └── src/
│       ├── App.js            # Router + ErrorBoundary
│       ├── config.js         # API URL configuration
│       └── components/
│           ├── Login.jsx
│           ├── Dashboard.jsx
│           ├── GapAnalysis.jsx
│           ├── PredictiveDashboard.jsx
│           ├── StyleTrainer.jsx
│           ├── Navbar.jsx
│           ├── LoadingSpinner.jsx
│           └── ErrorBoundary.jsx
├── DEMO_SCRIPT.md
└── README.md
```

## 🎥 Demo

Login: `demo@trendora.com` / `demo123`

## 📈 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/trends/fetch` | Fetch trending topics |
| POST | `/api/generate/script` | Generate AI content |
| POST | `/api/calendar/save` | Save to calendar |
| GET | `/api/calendar/list` | List scheduled content |
| POST | `/api/gaps/add-competitor` | Track competitor |
| POST | `/api/gaps/analyze` | Run gap analysis |
| POST | `/api/virality/score` | Score a trend |
| POST | `/api/style/train` | Train style profile |
| POST | `/api/predictions/forecast` | Generate predictions |
| GET | `/api/predictions/cached` | Get cached predictions |

## 🚀 Deployment

- **Backend**: Deploy to Render using `render.yaml`
- **Frontend**: Deploy to Vercel using `vercel.json`

## 👥 Team

- **Eimun Akit Purti** - Frontend & AI Integration
- **Anuj Patel** - Backend & API Architecture

## 📄 License

MIT
