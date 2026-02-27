# Trendora — Data Flow Diagram

This diagram maps out how data moves through the system. We use distinct shapes to represent different component types: Circles `()` for Users, Rounded Boxes `([ ])` for UI Interfaces, Double-lined Boxes `[[ ]]` for Internal APIs, Hexagons `{{ }}` for External APIs, Parallelograms `[/ /]` for Documents/Tokens, Diamonds `{}` for Decisions, and Cylinders `[( )]` for Databases.

## 1. Primary Architecture Data Flow

```mermaid
flowchart LR
    U((👤 User))
    
    subgraph "Frontend"
        UI([React Interface])
    end
    
    subgraph "Backend Services"
        API_AUTH[[Auth Service]]
        API_TRENDS[[Trends Service]]
        API_AI[[AI Service]]
    end
    
    subgraph "External Systems"
        GOOGLE{{Google Trends API}}
        GEMINI{{Gemini AI API}}
        YT{{YouTube Data API}}
    end
    
    subgraph "Data Storage"
        DB[(PostgreSQL)]
        CACHE[(In-Memory Cache)]
    end
    
    U <-->|JSON over HTTPS| UI
    UI <-->|REST API| API_AUTH
    UI <-->|REST API| API_TRENDS
    UI <-->|REST API| API_AI
    
    API_AUTH <-->|Read/Write User| DB
    API_TRENDS <-->|Fetch| GOOGLE
    API_TRENDS <-->|Read/Write Cache| CACHE
    API_AI <-->|Prompt/Response| GEMINI
    API_TRENDS <-->|Search| YT
```

## 2. Authentication Flow

```mermaid
flowchart TD
    U((User))
    UI([Login Page])
    API[[Auth Endpoint]]
    DB[(Users Table)]
    DEC{Is Hash Valid?}
    HOME([Dashboard])
    ERR[/Error Message/]

    U -->|Enters Credentials| UI
    UI -->|POST /login| API
    API -->|SELECT password_hash| DB
    DB -->|Returns hash| API
    API -->|Bcrypt Verify| DEC
    
    DEC -- Yes --> TOKEN[/Generate JWT/]
    TOKEN --> HOME
    
    DEC -- No --> ERR
    ERR --> UI
```

## 3. Content Generation Data Pipeline

```mermaid
flowchart TD
    U((User))
    UI([Dashboard])
    API[[Generate Route]]
    DB[(Style Profiles)]
    GEMINI{{Gemini 2.0 API}}
    RES[/JSON Script/Hooks/]

    U -->|Clicks Generate| UI
    UI -->|POST Trend Keyword| API
    API -->|Fetch User Style| DB
    DB -->|Returns Style Profile| API
    API -->|Build Context Prompt| GEMINI
    GEMINI -->|Returns Markdown JSON| API
    API -->|Parse & Clean| RES
    RES --> UI
    UI -->|Displays Result| U
```

## 4. Prediction Engine Flow

```mermaid
flowchart LR
    CRON((Daily Cron Job))
    DB_HIST[(Trends History DB)]
    ML[[sklearn LinearRegression]]
    DB_PRED[(Predicted Trends DB)]
    UI([Predictions Dashboard])
    
    CRON -->|Trigger Batch| DB_HIST
    DB_HIST -->|14-Day Volume Data| ML
    ML -->|Fit Model & Predict| DB_PRED
    DB_PRED -->|GET /predictions| UI
```
