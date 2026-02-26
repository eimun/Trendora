# Trendora — User Flow Diagram

This diagram visualizes the end-to-end journey of a user interacting with the Trendora platform, from landing on the site to utilizing its core features like trend discovery, content generation, and predictive forecasting.

```mermaid
stateDiagram-v2
    [*] --> LandingPage: User visits site
    LandingPage --> Registration: Click Sign Up
    LandingPage --> Login: Click Log In
    
    Registration --> Dashboard: Successful Sign Up (JWT token issued)
    Login --> Dashboard: Successful Log In (JWT token issued)
    
    state DashboardArea {
        direction TB
        
        state "Trend Discovery & Generation" as GenFlow {
            Dashboard --> SelectNiche: Choose niche (Tech/Finance/etc.)
            SelectNiche --> ViewTrends: View scored trending topics
            ViewTrends --> GenerateContent: Click "Generate Content" on a trend
            GenerateContent --> ContentResult: View generated script, hooks, hashtags
            ContentResult --> SaveToCalendar: Click "Schedule Content"
        }
        
        state "Style Training" as StyleFlow {
            Dashboard --> TrainStyle: Navigate to Style Trainer
            TrainStyle --> InputSamples: Paste past content samples
            InputSamples --> StyleProfile: AI learns user's voice
        }
        
        state "Competitor Gap Analysis" as GapFlow {
            Dashboard --> GapAnalysis: Navigate to Gap Analysis
            GapAnalysis --> AddCompetitor: Input competitor YouTube channel
            GapAnalysis --> ViewOpportunities: View trends competitors missed
        }
        
        state "Predictive Forecasting" as PredFlow {
            Dashboard --> MLPredictions: Navigate to Predictions
            MLPredictions --> ViewForecast: View 7-day volume forecasts & recommendations
        }
    }
    
    SaveToCalendar --> Dashboard
    StyleProfile --> Dashboard
    ViewOpportunities --> Dashboard
    ViewForecast --> Dashboard
    
    DashboardArea --> Logout: Click Log Out
    Logout --> LandingPage
```

## Key User Journeys

### 1. The Content Creator Flow
1. User logs in and lands on the **Dashboard**.
2. Selects their niche (e.g., "Tech").
3. Browses the top virality-scored trends.
4. Clicks "Generate Content" on a promising trend.
5. Gets an AI-generated script, hooks, and hashtags for a YouTube Short/TikTok.
6. Saves the item to their Content Calendar.

### 2. The Voice Cloning Flow
1. User navigates to the **Style Trainer**.
2. Pastes examples of their past successful posts or scripts.
3. Trendora analyzes and saves a unique "Style Profile" (tone, pacing, vocabulary).
4. From now on, any generated content uses their personalized voice.

### 3. The Strategist Flow
1. User goes to **Gap Analysis**.
2. Enters their top competitors' YouTube channel URLs.
3. Trendora cross-references trending topics with competitor videos.
4. User finds "High Opportunity" gaps (topics their competitors haven't covered yet).
5. User navigates to **Predictions** to see if that topic will continue growing over the next 7 days before filming.
