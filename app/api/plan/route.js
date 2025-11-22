import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const { task } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-3-pro-preview" });

  const prompt = `
    Break the following task into 3–10 clear steps.
    For each step, return: { "title": string, "duration": number in minutes }

    Task: "${task}"

    Return ONLY valid JSON:
    {
      "steps": [
        { "title": "...", "duration": ... }
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return Response.json(parsed);
}
