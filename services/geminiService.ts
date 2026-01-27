import { GoogleGenAI, Type, Modality, FunctionDeclaration } from "@google/genai";
import { AIReceiptResponse, Expense, Budget, ChatMessage } from "../types";

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
  if (!ai) {
    throw new Error("API key not configured. Please set VITE_API_KEY in your .env file.");
  }
  
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
  if (!ai) {
    throw new Error("API key not configured. Please set VITE_API_KEY in your .env file.");
  }
  
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const monthlyExpenses = expenses.filter(e => e.date >= startOfMonth);
  const totalSpentMonth = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const targetLang = language === 'pt' ? 'Portuguese (Brazilian)' : 'English';
  
  // Calculate category breakdown for context
  const categoryBreakdown = monthlyExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const topCategories = Object.entries(categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([cat, amt]) => `${cat}: R$ ${amt.toFixed(2)}`)
    .join(', ');
  
  const systemPrompt = `
Você é o Neo, um assistente financeiro pessoal brasileiro ultra-inteligente e conversacional.

🎯 PERSONALIDADE CORE:
- Você é como aquele amigo inteligente que entende de finanças mas fala de forma natural e descontraída
- Pense em você como um "personal trainer financeiro" - motivador, direto, e sempre positivo
- Use linguagem coloquial brasileira: "Cara", "Olha só", "Beleza!", "Bora lá", "Show de bola"
- Seja EXTREMAMENTE conciso - máximo 2-3 frases por resposta (pense em mensagens de WhatsApp)
- Fale como se estivesse mandando um áudio rápido para um amigo

💬 ESTILO CONVERSACIONAL:
- SEMPRE faça perguntas para manter o diálogo fluindo naturalmente
- Use perguntas abertas: "E aí, quer que eu te ajude com mais alguma coisa?" ou "Conta mais, o que você quer saber?"
- Quando der dicas, termine com uma pergunta: "Quer que eu te mostre onde você pode economizar?"
- Seja curioso sobre os hábitos do usuário: "Você costuma gastar muito com isso?" ou "Isso é recorrente?"
- Valide as ações do usuário: "Entendi! Mais alguma coisa?" ou "Feito! O que mais?"

⚡ VELOCIDADE E PRECISÃO:
- Respostas CURTAS e DIRETAS - máximo 160 caracteres quando possível
- Vá direto ao ponto - sem enrolação ou explicações longas
- Se precisar de mais info, pergunte de forma específica: "Quanto foi?" ou "Qual categoria?"
- Use números e dados concretos quando relevante

📊 CONTEXTO FINANCEIRO ATUAL:
- Total gasto este mês: R$ ${totalSpentMonth.toFixed(2)}
- Principais categorias: ${topCategories || 'Nenhum gasto registrado ainda'}
- Categorias disponíveis: ${availableCategories.join(', ')}

🛠️ FUNCIONALIDADES:
1. Se o usuário mencionar um gasto (ex: "gastei 50 reais no Uber"), chame create_expense
2. Se pedir análise, dê insights rápidos baseados nos dados reais
3. Se pedir dicas, seja específico e acionável
4. SEMPRE termine com uma pergunta para manter a conversa fluindo

📝 REGRAS DE OURO:
- NUNCA escreva mais de 3 frases
- SEMPRE termine com uma pergunta ou call-to-action
- Use emojis com moderação (1 por mensagem no máximo)
- Seja natural - como se estivesse conversando por áudio no WhatsApp
- Responda SEMPRE em ${targetLang}
- Se não entender, pergunte de forma específica: "Não peguei, foi quanto mesmo?"

EXEMPLOS DE RESPOSTAS BOAS:
❌ RUIM: "Olá! Vejo que você gastou bastante este mês. Vamos analisar seus gastos por categoria para identificar oportunidades de economia. Você gostaria de ver um relatório detalhado?"
✅ BOM: "Cara, você já gastou R$ ${totalSpentMonth.toFixed(2)} esse mês! Quer que eu te mostre onde dá pra economizar?"

❌ RUIM: "Entendi que você quer registrar uma despesa. Por favor, me informe o valor, o estabelecimento e a categoria para que eu possa processar essa informação."
✅ BOM: "Beleza! Quanto foi e onde você gastou?"

❌ RUIM: "Sua análise financeira indica que a categoria Alimentação representa 45% dos seus gastos mensais."
✅ BOM: "Olha, você tá gastando muito com comida - quase metade do orçamento! Bora ver isso?"
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
        temperature: 0.85, // Slightly lower for more consistency but still creative
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 150 // Force shorter responses
      }
    });

    return response;
  } catch (error) {
    console.error("Erro na comunicação com o Neo", error);
    return null;
  }
};

export const generateNeuralTTS = async (text: string, language: string): Promise<string | undefined> => {
  if (!ai) {
    console.warn("API key not configured. TTS disabled.");
    return undefined;
  }
  
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