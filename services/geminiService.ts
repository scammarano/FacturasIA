
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class InvoiceAIService {
  private ai: GoogleGenAI;

  // Fix: Initializing GoogleGenAI with process.env.API_KEY directly as per guidelines
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }

  async processInvoice(imageBase64: string, promptContent: string, mimeType: string = 'image/jpeg'): Promise<any> {
    const model = 'gemini-3-flash-preview';
    
    // Limpieza de prefijo base64 para obtener solo los datos puros
    const cleanBase64 = imageBase64.replace(/^data:.*;base64,/, "");

    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
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
