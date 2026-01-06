
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

export const generateProductDescription = async (productName: string, category: string) => {
  if (!API_KEY) return "AI services currently unavailable. Please check your API key.";
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a compelling, professional e-commerce product description for a ${productName} in the ${category} category. Focus on benefits and quality. Keep it under 100 words.`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI service.";
  }
};

export const getShoppingAssistantResponse = async (query: string, availableProducts: string) => {
  if (!API_KEY) return "I'm sorry, I'm offline right now.";

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful shopping assistant for NovaMart. 
      Available Products: ${availableProducts}
      User Query: ${query}
      Provide a helpful, friendly recommendation based on the user's query and the available products.`,
    });
    return response.text;
  } catch (error) {
    return "I'm having trouble thinking right now. How else can I help?";
  }
};
