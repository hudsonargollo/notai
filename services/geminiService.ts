import { GoogleGenAI, Type, Modality, FunctionDeclaration } from "@google/genai";
import { AIReceiptResponse, Expense, Budget, ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
        category: { type: Type.STRING, description: 'Category of spending.' },
        date: { type: Type.STRING, description: 'ISO Date YYYY-MM-DD.' },
        note: { type: Type.STRING, description: 'A brief description.' }
      },
      required: ['merchant', 'amount', 'category']
    }
  }
];

export const parseReceiptImage = async (file: File, activeCategories: string[], language: string): Promise<{data: AIReceiptResponse, imageUrl: string}> => {
  const base64Image = await compressImage(file);
  const base64Data = base64Image.split(',')[1];
  const targetLanguage = language === 'pt' ? 'Portuguese (Brazil)' : 'English';

  const systemPrompt = `
    Você é o "Neo", um assistente financeiro ultra-inteligente e descontraído.
    Tarefa: Extrair dados da imagem do recibo.
    Moeda: SEMPRE BRL (R$).
    Idioma: ${targetLanguage}.
    Tom: Conversacional, prático, estilo "coach financeiro amigo". Use termos como "Opa", "Bora", "Show".
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
    Você é o "Neo", o núcleo de inteligência financeira descontraído do not.AÍ.
    
    PERSONALIDADE E TOM:
    - Persona: Um "Fintech Bro" brasileiro, muito gente fina e direto ao ponto.
    - Estilo: Use gírias corporativas leves e fillers naturais: "Cara", "Olha só", "Beleza!", "Tudo certo", "Manda ver".
    - Pacing: Frases curtas, ritmo de áudio de WhatsApp. Evite ser robótico.
    
    CONTEXTO ATUAL:
    - Moeda: R$ (BRL).
    - Gasto no Mês: R$ ${totalSpentMonth.toFixed(2)}
    - Categorias Disponíveis: ${availableCategories.join(', ')}

    INSTRUÇÕES:
    1. Para registrar gastos, chame 'create_expense'. Seja empolgado ao registrar.
    2. Nas análises, dê toques reais de economia, mas sem sermão.
    3. Mantenha as respostas curtas (máximo 150 caracteres) para que o áudio flua bem.
    4. RESPONDA EM ${targetLang}.
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
        temperature: 0.9 // High temperature for more natural speech
      }
    });

    return response;
  } catch (error) {
    console.error("Assistant Communication Error", error);
    return null;
  }
};

export const generateNeuralTTS = async (text: string, language: string): Promise<string | undefined> => {
  // 'Kore' is a good choice for a realistic male voice in Gemini 2.5 TTS
  const voice = language === 'pt' ? 'Kore' : 'Zephyr'; 
  
  try {
    const synthesisPrompt = `Leia isso de forma natural, amigável e descontraída, como um homem brasileiro jovem e inteligente: "${text}"`;
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