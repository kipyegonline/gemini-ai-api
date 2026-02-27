import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_API_KEY;
const ai = new GoogleGenAI({ apiKey: API_KEY });
type Parts = {
  role: string;
  parts: { text: string } | { data: string; mimeType: string };
}[];
export const runGemini = async (
  prompt = "What's the difference between these pictures?",
  imageParts: Parts,
): Promise<string | { error: true; message: string }> => {
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }, ...imageParts] }],
    });
    return result.text ?? "";
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return { error: true, message };
  }
};
