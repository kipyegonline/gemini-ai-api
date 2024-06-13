import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const runGemini = async (
  prompt = "What's difference between these pictures?",
  imageParts: any[]
) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;

    const text = response.text();
    return text;
  } catch (error: unknown) {
    return { error: true, message: error.message };
  }
};
