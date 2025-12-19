import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
  if (!genAI) {
    const apiKey = process.env.API_KEY;
    if (apiKey) {
      genAI = new GoogleGenAI({ apiKey });
    } else {
      console.warn("API_KEY not found in environment.");
    }
  }
  return genAI;
};

export const chatWithArticle = async (
  articleContent: string,
  userQuery: string
): Promise<string> => {
  const ai = getGenAI();
  if (!ai) return "Error: AI Service not initialized (Missing API Key).";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context: You are an AI assistant for "EAI Times" (Embodied AI Times), a publication dedicated to explaining complex robotics and physical AI concepts in simple, accessible language.
      
      The user is reading the following article:
      ---
      ${articleContent}
      ---
      
      User Question: ${userQuery}
      
      Instructions:
      1. Answer based on the article content.
      2. Use simple analogies where possible.
      3. Avoid overly academic jargon.
      4. Keep the tone helpful, curious, and clear.`,
    });
    
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "System Error: Unable to process request at this time.";
  }
};