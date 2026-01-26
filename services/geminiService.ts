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
    Tom: Estilo "coach financeiro amigo" e moderno. Use termos como "Opa", "Bora lá", "Show".
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
    throw new Error("Neo não conseguiu processar essa imagem.");
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
    Você é o "Neo", o assistente de IA mais descolado e inteligente do mundo financeiro.
    
    PERSONALIDADE E TOM:
    - Um "Fintech Coach" brasileiro: amigável, direto, e muito positivo.
    - Linguagem: Informal mas profissional. Use fillers naturais: "Cara", "Olha só", "Beleza!", "Show de bola".
    - Ritmo: Fale como se estivesse mandando um áudio rápido no WhatsApp para um amigo. Evite formalidades.
    
    CONTEXTO FINANCEIRO:
    - Gastos totais do mês atual: R$ ${totalSpentMonth.toFixed(2)}
    - Categorias de gastos permitidas: ${availableCategories.join(', ')}

    INSTRUÇÕES:
    1. Se o usuário quiser registrar algo, chame 'create_expense'.
    2. Se pedir análise, dê dicas reais, rápidas e motivadoras.
    3. Suas respostas devem ser curtas e diretas (máximo 160 caracteres) para funcionarem bem em áudio.
    4. RESPONDA SEMPRE EM ${targetLang}.
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
        temperature: 0.95 
      }
    });

    return response;
  } catch (error) {
    console.error("Erro na comunicação com o Neo", error);
    return null;
  }
};

export const generateNeuralTTS = async (text: string, language: string): Promise<string | undefined> => {
  // 'Kore' is the premium male voice for PT-BR
  const voice = language === 'pt' ? 'Kore' : 'Zephyr'; 
  
  try {
    const synthesisPrompt = `Leia esta mensagem de forma natural, expressiva e levemente entusiasmada, como um homem brasileiro jovem e inteligente: "${text}"`;
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