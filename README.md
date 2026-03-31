<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Vantage Point

Strategic decision-making application using Analytic Hierarchy Process (AHP) to calculate the Overall Vector of Priority (OVP) for alternatives.

## Run Locally

**Prerequisites:** Node.js (v18+)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory (you can copy `.env.example` as a template):
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your `GEMINI_API_KEY` to your Google Gemini API key.

3. **Run the application:**
   To use the AI features, you need to run both the frontend development server and the backend proxy server:

   ```bash
   npm run dev:all
   ```

   Alternatively, you can run them in separate terminals:
   * Frontend: `npm run dev` (Port 3000)
   * Backend: `npm run server` (Port 3001)

   View the app at `http://localhost:3000`.
