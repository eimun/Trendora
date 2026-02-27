# Trendora — API Planning

This document outlines the high-level resource planning for the Trendora REST API.

## Core Resources

We have grouped our API endpoints around the following core resources:

### 1. Authentication (`/api/auth`)
- **Purpose**: Handle user identity, registration, and session management.
- **Methods needed**: 
  - `POST` for User Registration
  - `POST` for User Login
- **Security**: Publicly accessible. Issues JWT tokens.

### 2. Trends (`/api/trends`)
- **Purpose**: Provide real-time data on what is currently popular.
- **Methods needed**:
  - `POST` (or GET with params) to fetch trends filtered by Niche.
- **Security**: Requires JWT Authorization.

### 3. Content Generation (`/api/generate`)
- **Purpose**: Interface with the Google Gemini AI to create scripts.
- **Methods needed**:
  - `POST` to send a prompt/trend and receive the generated JSON script.
- **Security**: Requires JWT Authorization.

### 4. Style Analyzer (`/api/style`)
- **Purpose**: Allow users to train the AI on their specific voice.
- **Methods needed**:
  - `POST` to submit sample texts and generate a persistent style profile.
- **Security**: Requires JWT Authorization.

### 5. Gap Analysis (`/api/gaps`)
- **Purpose**: Compare trends with competitor YouTube content.
- **Methods needed**:
  - `POST` to add a competitor channel to track.
  - `POST` to run the analysis engine against tracked channels.
- **Security**: Requires JWT Authorization.

### 6. Virality Scoring (`/api/virality`)
- **Purpose**: Score a trend's potential based on our proprietary algorithm.
- **Methods needed**:
  - `POST` to calculate a score based on volume and velocity.
- **Security**: Requires JWT Authorization.

### 7. Predictive Forecasting (`/api/predictions`)
- **Purpose**: Serve Machine Learning forecasts on trend trajectories.
- **Methods needed**:
  - `GET` to retrieve cached daily predictions.
  - `POST` to force a new forecast calculation.
- **Security**: Requires JWT Authorization.

### 8. Scheduling (`/api/calendar`)
- **Purpose**: Manage the user's content posting schedule.
- **Methods needed**:
  - `GET` to list all scheduled items.
  - `POST` to save a generated item to a specific date/time.
- **Security**: Requires JWT Authorization.
