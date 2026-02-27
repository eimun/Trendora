# Trendora — Database Entity Identification

Before designing the full schema, we identify the core business entities required for the Trendora platform.

## 1. User Entity
- **Purpose**: Represents a content creator using the platform.
- **Key Attributes**: ID, Email, Password Hash, Selected Niches.
- **Role**: The central entity that owns all customized data (content, tracked competitors, style profiles).

## 2. Trend Entity
- **Purpose**: Represents a discovered trending topic in a specific niche.
- **Key Attributes**: Keyword, Niche, Search Volume, Growth Velocity, Virality Score.
- **Role**: Acts as the raw material for content generation and gap analysis.

## 3. Generated Content Entity
- **Purpose**: Stores the AI-generated scripts and metadata created for a specific trend.
- **Key Attributes**: Trend Keyword, Content Type (video/blog), Script Output, Hooks, Hashtags.
- **Role**: Serves as the final product the user can export or schedule.

## 4. Content Calendar Entity
- **Purpose**: Manages the scheduling of generated content.
- **Key Attributes**: Scheduled Date, Scheduled Time, Status (Draft, Scheduled, Published).
- **Role**: Helps users plan their content rollout strategy over time.

## 5. Competitor Channel Entity
- **Purpose**: Represents a YouTube channel tracked by a user for gap analysis.
- **Key Attributes**: Channel ID, Channel Name, Niche.
- **Role**: Defines the comparison baseline for finding untouched trending topics.

## 6. Trend Gap Entity
- **Purpose**: Represents an actionable opportunity where a trend has high volume but low competitor coverage.
- **Key Attributes**: Keyword, Volume, Competitor Coverage Ratio, Opportunity Score.
- **Role**: Gives strategists a direct metric on what to film next.

## 7. Prediction Entity
- **Purpose**: Stores Machine Learning forecasts for a trend's future trajectory.
- **Key Attributes**: Predicted 7-day Volume, Growth Rate, Confidence Score, Estimated Peak Date.
- **Role**: Allows users to act on trends before they peak.

## 8. Style Profile Entity (Stored within User)
- **Purpose**: A breakdown of the user's unique speaking/writing voice.
- **Key Attributes**: Tone, Pacing, Vocabulary Level, Signature Phrases.
- **Role**: Enables AI generation to sound authentic to the specific creator.
