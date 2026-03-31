import { GoogleGenAI } from "@google/genai";

export interface IntakeResult {
  goal: string;
  criteria: { name: string; weight: number; description: string }[];
  alternatives: { label: string; merit: number; viability: number; cost: number; time: number; risk: number }[];
}

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
  }

  async processIntake(chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]): Promise<string> {
    const response = await this.ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: chatHistory,
      config: {
        systemInstruction: `You are Vantage AI, a Decision Intelligence platform. 
        Your goal is to help users frame complex decisions by separating Merit (What is best?) from Viability (What is possible?).
        
        Phase 1: Problem Deconstruction.
        Ask clarifying questions to identify:
        1. The core Goal.
        2. The Criteria for success (Merit).
        3. The Alternatives being considered.
        4. The Constraints (Budget, Time, Risk).
        
        Be concise, professional, and analytical. Use "Calm Tech" tone.
        
        When you have enough information, output a JSON block with the following structure:
        {
          "type": "INTAKE_COMPLETE",
          "data": {
            "goal": "...",
            "criteria": [{ "name": "...", "weight": 0.3, "description": "..." }],
            "alternatives": [{ "label": "...", "merit": 0.8, "viability": 0.7, "cost": 1000000, "time": 12, "risk": 0.2 }]
          }
        }
        Only output the JSON when you are certain the intake is complete. Otherwise, continue the conversation.`,
      },
    });

    return response.text;
  }
}

export const geminiService = new GeminiService();
