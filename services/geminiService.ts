
import { GoogleGenAI, Type, Modality, FunctionDeclaration } from "@google/genai";
import { AIReceiptResponse, Expense, Budget, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to compress image
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

const financialTools: FunctionDeclaration[] = [
  {
    name: 'create_expense',
    parameters: {
      type: Type.OBJECT,
      description: 'Registers a new financial expense record.',
      properties: {
        merchant: { type: Type.STRING, description: 'Where the money was spent.' },
        amount: { type: Type.NUMBER, description: 'Total value in BRL (R$).' },
        category: { type: Type.STRING, description: 'Category of spending (e.g., Alimentação, Transporte, Lazer).' },
        date: { type: Type.STRING, description: 'ISO Date YYYY-MM-DD. Defaults to today.' },
        note: { type: Type.STRING, description: 'A brief description of what was purchased.' }
      },
      required: ['merchant', 'amount', 'category']
    }
  },
  {
    name: 'set_budget',
    parameters: {
      type: Type.OBJECT,
      description: 'Updates a monthly spending limit for a specific category.',
      properties: {
        category: { type: Type.STRING, description: 'The category to set a limit for.' },
        amount: { type: Type.NUMBER, description: 'The limit amount in BRL.' }
      },
      required: ['category', 'amount']
    }
  }
];

export const parseReceiptImage = async (file: File, activeCategories: string[], language: string): Promise<{data: AIReceiptResponse, imageUrl: string}> => {
  const base64Image = await compressImage(file);
  const base64Data = base64Image.split(',')[1];
  const targetLanguage = language === 'pt' ? 'Portuguese (Brazil)' : 'English';

  const systemPrompt = `
    You are "Neo", a sophisticated yet friendly financial assistant.
    Task: Extract data from the receipt image.
    Currency: ALWAYS BRL (R$).
    Language: ${targetLanguage}.
    Tone: Friendly, concise, helpful.
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
    throw new Error("Neo could not process the image.");
  }
};

export const chatWithFinancialAdvisor = async (
  history: ChatMessage[], 
  expenses: Expense[], 
  budgets: Budget[],
  availableCategories: string[],
  language: string
) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const monthlyExpenses = expenses.filter(e => e.date >= startOfMonth);
  const totalSpentMonth = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const targetLang = language === 'pt' ? 'Portuguese (Brazilian)' : 'English';
  
  const systemPrompt = `
    You are "Neo", the high-tech, ultra-cool financial core of the not.AÍ app.
    
    PERSONALITY:
    - Persona: Friendly, relaxed, slightly informal but highly competent "fintech bro".
    - Vibe: Speak like a helpful friend who's a pro at investing and saving.
    - Style: Use conversational filler words (e.g., "Opa", "Cara", "Beleza", "Olha só") naturally.
    - Pacing: Be concise. Don't lecture. Give direct answers with a helpful twist.
    
    CONTEXT:
    - Currency: R$ (BRL).
    - Current Month Spent: R$ ${totalSpentMonth.toFixed(2)}
    - Budgets: ${JSON.stringify(budgets)}
    - Categories: ${availableCategories.join(', ')}

    ABILITIES:
    1. If user says "Gastei [valor] no [lugar]", call 'create_expense'.
    2. If user wants to change a limit, call 'set_budget'.
    3. If asked to "Analisar", generate a brief but insightful report on their spending habits and read it back automatically.
    4. If asked for "Dicas", provide 3 specific, actionable ways to save based on their biggest spending categories.

    Language: ALWAYS respond in ${targetLang}. Keep the pacing natural for text-to-speech.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      config: {
        systemInstruction: systemPrompt,
        tools: [{ functionDeclarations: financialTools }],
        temperature: 0.9, // Higher temperature for more natural informal speech
      }
    });

    return response;
  } catch (error) {
    console.error("Assistant Communication Error", error);
    return null;
  }
};

export const generateNeuralTTS = async (text: string, language: string): Promise<string | undefined> => {
  const voice = language === 'pt' ? 'Fenrir' : 'Zephyr'; 
  
  try {
    // Adding pacing instructions to the generation prompt for better results
    const synthesisPrompt = `Speak this as a cool, friendly male AI financial assistant. Use natural human pacing, slight pauses for commas, and a conversational tone: "${text}"`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: synthesisPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (err) {
    return undefined;
  }
};
