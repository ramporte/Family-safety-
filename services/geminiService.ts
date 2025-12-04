import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSafetyAdvice = async (
  query: string, 
  context: string = ""
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `
      You are Guardian AI, a calm, reassuring, and expert family safety advisor.
      Your goal is to provide concise, practical safety advice.
      
      Guidelines:
      1. If the query suggests an immediate life-threatening emergency, IMMEDIATELY advise calling emergency services (911/112) as the first line.
      2. Provide step-by-step instructions for first aid or emergency situations if asked.
      3. Be brief and clear. Use bullet points for readability.
      4. If the user context is provided (e.g., location, family members), use it to personalize advice.
      5. Tone: Professional, empathetic, direct.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: `Context: ${context}\n\nUser Query: ${query}`,
      config: {
        systemInstruction,
        temperature: 0.4, // Lower temperature for more reliable safety advice
      }
    });

    return response.text || "I apologize, I couldn't generate advice at this moment. If this is an emergency, please call emergency services immediately.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection error. Please check your internet or dial emergency services if urgent.";
  }
};

export const generatePanicMessage = async (
  situation: string,
  location: { lat: number; lng: number }
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Generate a short, urgent text message (SMS) to be sent to emergency contacts.
      Situation: ${situation}
      Location: Latitude ${location.lat}, Longitude ${location.lng}.
      
      The message should be under 160 characters if possible, stating "SOS", the user's need for help, and the location coordinates.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || `SOS! I need help. Location: ${location.lat}, ${location.lng}`;
  } catch (error) {
    return `SOS! I need help. Location: ${location.lat}, ${location.lng}`;
  }
};
