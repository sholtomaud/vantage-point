import express from 'express';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Note: The library name is @google/genai as used in the project
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || '');

app.post('/api/chat', async (req, res) => {
  try {
    const { contents, systemInstruction, responseMimeType, responseJsonSchema } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction,
    });

    const generationConfig = {
      responseMimeType: responseMimeType || "text/plain",
      responseJsonSchema: responseJsonSchema,
    };

    const result = await model.generateContent({
      contents,
      generationConfig,
    });

    const response = await result.response;
    res.json({ text: response.text() });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
