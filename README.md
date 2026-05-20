# Mobile Performance Telemetry Backend

This repository contains the backend service for processing and diagnosing mobile application performance telemetry data, designed to ingest payloads from `appinsights.in`.

## Architecture Overview

This project is built using a modern, cost-optimized, and highly performant architecture:

*   **Language & Framework**: Node.js with TypeScript and Express. It utilizes strict non-blocking asynchronous I/O to ensure optimal CPU utilization and scalability.
*   **Database**: Google Cloud Firestore (Native Mode) is used for reliable time-series storage. The application interfaces with Firestore using a clean Repository pattern via the official `@google-cloud/firestore` SDK.
*   **Queue/Worker System**: To remain highly cost-efficient and minimize the memory footprint, telemetry payloads are processed out-of-band using an asynchronous in-memory background worker mechanism (with a strict upper bound of 5,000 items) right within the application process. This allows the API to respond immediately with `202 Accepted` or apply backpressure with `429 Too Many Requests`.
*   **AI Integration**: An AI core utilizes the official Google Gen AI SDK (`@google/genai`) and the `gemini-2.5-pro` model to evaluate telemetry metrics and provide automated diagnostic proposals for reducing rendering lag.
*   **Structure**: The codebase strictly adheres to a modular Clean Architecture (Controller-Service-Repository).

## Prerequisites

*   Node.js (v18+ recommended)
*   Google Cloud SDK (for local Application Default Credentials)
*   A Google Cloud Project with Firestore enabled.
*   A Gemini API Key (for the Gen AI service).

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Ensure the following environment variables are configured before running the application:

*   `PORT`: The port the server should bind to (default is 8080).
*   `GOOGLE_APPLICATION_CREDENTIALS`: Path to your Google Cloud service account JSON file (or rely on ADC if running in a GCP environment).
*   `GEMINI_API_KEY`: Your API key for the Google Gen AI SDK.
*   `QA_API_KEY`: A shared secret key used for the `X-AppInsights-QA-Key` header to authenticate telemetry from QA/Staging builds.

### 3. Build & Run

To compile the TypeScript code and start the server:

```bash
npm run build
npm start
```

## API Endpoint

### `POST /v1/perf-report`

Accepts incoming telemetry performance reports.

**Headers:**

*   `Content-Type: application/json`
*   `X-AppInsights-QA-Key: <your_qa_api_key>`

**Payload Schema:**

The payload must strictly conform to the following schema (maximum size 500KB):

```json
{
  "app_info": {
    "version": "1.0.0",
    "platform": "ios",
    "device_model": "iPhone 14 Pro",
    "rendering_engine": "flutter"
  },
  "metrics": {
    "page_identifier": "home_feed",
    "time_to_first_frame_ms": 120,
    "total_monitored_frames": 1800,
    "jank_frames_detected": 45,
    "worst_offending_frame_ms": 85,
    "averages": {
      "ui_thread_build_ms": 12.5,
      "raster_thread_ms": 18.2
    }
  }
}
```

**Responses:**

*   `202 Accepted`: Payload successfully enqueued for out-of-band processing.
*   `400 Bad Request`: Payload validation failed (e.g., missing required fields, invalid types).
*   `401 Unauthorized`: Invalid or missing `X-AppInsights-QA-Key` header.
*   `429 Too Many Requests`: The in-memory queue is full; the client should back off and try again later.
