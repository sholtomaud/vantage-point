import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const intakeSchema = z.object({
  type: z.enum(["QUESTION", "INTAKE_COMPLETE"]).describe("Whether Gemini is asking a question or the intake is complete."),
  message: z.string().describe("The message to the user."),
  data: z.object({
    goal: z.string().optional(),
    criteria: z.array(z.object({
      name: z.string(),
      description: z.string()
    })).optional(),
    alternatives: z.array(z.object({
      label: z.string(),
      description: z.string()
    })).optional()
  }).optional()
});

export type IntakeResult = z.infer<typeof intakeSchema>;

export class GeminiService {
  async processIntake(chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[]): Promise<IntakeResult> {
    const systemInstruction = `You are Vantage AI, a Strategic Decision Consultant.
    Your goal is to help users structure a decision for AHP (Analytic Hierarchy Process) evaluation.

    Phase 1: Determine the Domain and Goal of the decision.
    Phase 2: Identify the Criteria (Merit components).
    Phase 3: Identify the Alternatives (Options).

    Be concise, professional, and analytical.

    You MUST always return a structured JSON response following the schema.
    If you need more information, set type to "QUESTION" and provide a message.
    When you have identified the Goal, at least 3 Criteria, and at least 3 Alternatives, set type to "INTAKE_COMPLETE", provide the structured data, and a summary message.

    AHP Domain Identification is crucial. Once the domain is set, help the user find the best options and criteria for that specific domain.`;

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: chatHistory,
        systemInstruction,
        responseMimeType: "application/json",
        responseJsonSchema: zodToJsonSchema(intakeSchema),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Gemini API');
    }

    const result = await response.json();
    return intakeSchema.parse(JSON.parse(result.text));
  }
}

export const geminiService = new GeminiService();
