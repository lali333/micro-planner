import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  const { task } = await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Break this task into 3–6 clear steps.
    For each step, output JSON:

    { "title": "...", "duration": minutes }

    Task: "${task}"
    Return ONLY valid JSON:
    {
      "steps": [ ... ]
    }
  `;

  const result = await model.generateContent(prompt);

  // Extract text
  const text = result.response.text();

  // Parse JSON safely
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  return Response.json(parsed);
}
