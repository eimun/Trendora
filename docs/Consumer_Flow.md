# Trendora — Consumer Flow Diagram

The consumer flow illustrates how a user (the content creator) interacts with the system to "consume" data insights and turn them into actionable content.

```mermaid
graph TD
    classDef user fill:#e1f5fe,stroke:#039be5,stroke-width:2px;
    classDef platform fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px;
    classDef insight fill:#e8f5e9,stroke:#43a047,stroke-width:2px;

    U((User / Content Creator)):::user
    
    subgraph "Insight Consumption Phase"
        T[Platform fetches PyTrends]:::platform
        G[Platform calculates Trend Gaps]:::platform
        P[Platform runs ML Forecasting]:::platform
        
        I1[Raw Trends]:::insight
        I2[High Opportunity Gaps]:::insight
        I3[Future Growth Predictions]:::insight
        
        T --> I1
        G --> I2
        P --> I3
    end
    
    subgraph "Action Phase"
        A1[User reviews trending topics]:::user
        A2[User identifies competitor gaps]:::user
        A3[User validates trend longevity]:::user
        
        GEN[AI Generation Engine]:::platform
        OUT[Personalized Video Script]:::insight
    end
    
    U -->|Logs in & Selects Niche| InsightConsumptionPhase
    
    I1 --> A1
    I2 --> A2
    I3 --> A3
    
    A1 --> GEN
    A2 --> GEN
    A3 --> GEN
    
    GEN -->|Applies Style Profile| OUT
    OUT --> U
```

## Flow Breakdown

1. **Insight Consumption Phase**: The platform aggregates data from Google Trends, YouTube, and its internal ML models. It serves these as refined insights (Trends, Gaps, Predictions) to the user via the Dashboard.
2. **Action Phase**: The user consumes these insights, deciding which topic has the best combination of low competition (Gap), high search volume (Trend), and future longevity (Prediction).
3. **Execution**: The user passes their chosen insight into the Generation Engine, which applies their personal style profile to produce a script ready for filming.
