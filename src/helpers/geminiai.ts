import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = import.meta.env.VITE_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export const runGemini = async (
  prompt = "What's different between these pictures?",
  imageParts: any[]
) => {
  // For text-and-images input (multimodal), use the gemini-pro-vision model
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    console.log(response.status, response);
    const text = response.text();
    return text;
  } catch (error: unknown) {
    console.log(error.message);
    return { error: true, message: error.message };
  }
};
