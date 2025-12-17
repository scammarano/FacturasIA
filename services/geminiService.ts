
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class InvoiceAIService {
  // Fix: Instantiating GoogleGenAI right before making an API call as per guidelines
  async processInvoice(imageBase64: string, promptContent: string, mimeType: string = 'image/jpeg'): Promise<any> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Fix: Using gemini-3-pro-preview for complex structured data extraction tasks
    const model = 'gemini-3-pro-preview';
    
    // Limpieza de prefijo base64 para obtener solo los datos puros
    const cleanBase64 = imageBase64.replace(/^data:.*;base64,/, "");

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { text: promptContent },
            { 
              inlineData: { 
                mimeType: mimeType, 
                data: cleanBase64 
              } 
            }
          ]
        },
        config: {
          responseMimeType: "application/json"
        }
      });

      // Fix: Directly accessing .text property instead of .text()
      const text = response.text;
      if (!text) throw new Error("No se pudo obtener respuesta de la IA");
      
      return JSON.parse(text);
    } catch (error) {
      console.error("Error processing document with Gemini:", error);
      throw error;
    }
  }
}
