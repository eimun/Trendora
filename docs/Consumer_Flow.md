# Trendora — Consumer Flow Diagram

The consumer flow illustrates how a user (the content creator) interacts with the system to "consume" data insights and turn them into actionable content. Utilizing specific shapes to distinguish between External APIs (Hexagons), Data Storage/Insights (Cylinders), User Decisions (Diamonds), and Processes (Subroutines).

```mermaid
flowchart TD
    classDef user fill:#e1f5fe,stroke:#039be5,stroke-width:2px;
    classDef platform fill:#f3e5f5,stroke:#8e24aa,stroke-width:2px;
    classDef insight fill:#e8f5e9,stroke:#43a047,stroke-width:2px;

    U((👤 Content Creator)):::user
    
    subgraph "Phase 1: Insight Generation (Backend)"
        T{{Google PyTrends}}:::platform
        G{{Competitor Analysis}}:::platform
        P{{ML Forecasting Engine}}:::platform
        
        I1[(Raw Trends DB)]:::insight
        I2[(Opportunity Gaps)]:::insight
        I3[(Growth Predictions)]:::insight
        
        T --> I1
        G --> I2
        P --> I3
    end
    
    subgraph "Phase 2: Insight Consumption (Frontend)"
        A1{Review Trending<br/>Topics}:::user
        A2{Identify Competitor<br/>Gaps}:::user
        A3{Validate Trend<br/>Longevity}:::user
        
        GEN[[AI Generation Engine]]:::platform
        OUT[/Personalized Video Script/]:::insight
    end
    
    U -->|Logs in & Selects Niche| I1
    
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
