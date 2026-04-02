<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Vantage Point

Strategic decision-making application using Analytic Hierarchy Process (AHP).

## Setup

1. **Set up environment variables:**
   Create a `.env` file in the root directory (you can copy `.env.example` as a template):
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your `GEMINI_API_KEY`.

2. **Run the application:**
   The application is containerized. To build and start the development environment:
   ```bash
   make
   make run
   ```

   View the app at `http://localhost:3000`.
