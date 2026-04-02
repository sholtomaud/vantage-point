import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3001;

// Note: The library name is @google/genai as used in the project
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY || '');

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url || '/', `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Handle API requests
  if (pathname === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const { contents, systemInstruction, responseMimeType, responseJsonSchema } = JSON.parse(body);

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
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ text: response.text() }));
      } catch (error: any) {
        console.error('Gemini API Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // Handle static file serving for the dist folder
  // Prevent path traversal by resolving and checking the path
  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  let filePath = path.join(__dirname, 'dist', safePath === '/' ? 'index.html' : safePath);

  if (!filePath.startsWith(path.join(__dirname, 'dist'))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Extension to Content-Type mapping
  const extname = path.extname(filePath).toLowerCase();
  const mimeTypes: { [key: string]: string } = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm',
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Fallback to index.html for SPA routing
        fs.readFile(path.join(__dirname, 'dist', 'index.html'), (err, indexContent) => {
          if (err) {
            res.writeHead(500);
            res.end(`Error: ${err.code}`);
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexContent, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
