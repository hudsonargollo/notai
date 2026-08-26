import { GoogleGenAI, Type } from "@google/genai";
import { AIReceiptResponse } from "../types";

// Use Vite environment variable (VITE_ prefix required)
const API_KEY = import.meta.env.VITE_API_KEY || '';
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const compressImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const createReceiptSchema = (categories: string[]) => ({
  type: Type.OBJECT,
  properties: {
    merchant_name: { type: Type.STRING },
    transaction_date: { type: Type.STRING },
    total_amount: { type: Type.NUMBER },
    currency: { type: Type.STRING },
    category: { type: Type.STRING, enum: categories },
    line_items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING },
          price: { type: Type.NUMBER },
          quantity: { type: Type.NUMBER }
        }
      }
    },
    summary_note: { type: Type.STRING }
  },
  required: ["merchant_name", "total_amount", "category", "summary_note", "line_items"]
});

export const parseReceiptImage = async (file: File, activeCategories: string[], language: string): Promise<{data: AIReceiptResponse, imageUrl: string}> => {
  if (!ai) {
    throw new Error("API key not configured. Please set VITE_API_KEY in your .env file.");
  }
  
  const base64Image = await compressImage(file);
  const base64Data = base64Image.split(',')[1];
  const targetLanguage = language === 'pt' ? 'Portuguese (Brazil)' : 'English';

  const systemPrompt = `
    Tarefa: Extrair dados da imagem do recibo.
    Moeda: SEMPRE BRL (R$).
    Idioma: ${targetLanguage}.
    Tom do summary_note: calmo, direto, uma frase curta com fatos (sem gírias, sem exclamação, sem emojis).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Data } },
          { text: "Extract receipt data into JSON." }
        ]
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: createReceiptSchema(activeCategories),
        temperature: 0.1
      }
    });

    return { data: JSON.parse(response.text), imageUrl: base64Image };
  } catch (error) {
    throw new Error("Não foi possível processar essa imagem.");
  }
};
