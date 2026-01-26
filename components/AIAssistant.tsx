import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, ChevronDown, Bot, Zap, Loader2 } from 'lucide-react';
import { useTranslation } from '../utils/i18n';
import { Language, ChatMessage, AVATAR_URL } from '../types';
import { chatWithFinancialAdvisor, generateNeuralTTS } from '../services/geminiService';
import { getExpenses, getBudgets, getCategories, addExpense, getChatHistory, saveChatHistory, incrementAIInteraction } from '../services/expenseService';

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const TypewriterMessage: React.FC<{ content: string; isNew: boolean; onComplete?: () => void }> = ({ content, isNew, onComplete }) => {
  const [displayedText, setDisplayedText] = useState(isNew ? '' : content);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isNew) {
      setDisplayedText(content);
      return;
    }
    if (currentIndex < content.length) {
      const char = content[currentIndex];
      // Advanced pacing for punctuation
      let delay = 8;
      if (['.', '!', '?'].includes(char)) delay = 350;
      else if ([',', ';', ':'].includes(char)) delay = 140;
      else if (char === ' ') delay = 20;

      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + char);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      onComplete?.();
    }
  }, [currentIndex, content, isNew, onComplete]);

  return (
    <div className="space-y-0.5">
      {displayedText.split('\n').map((line, i) => (
        <span key={i} className="block">
            {line.split(/(\*\*.*?\*\*)/g).map((part, j) => 
                part.startsWith('**') ? <strong key={j} className="text-energy-500 font-black">{part.slice(2, -2)}</strong> : part
            )}
        </span>
      ))}
    </div>
  );
};

interface AIAssistantProps {
  onClose: () => void;
  currentLang: Language;
  onNavigate?: (target: 'dashboard' | 'scan') => void;
  onShowPaywall?: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ currentLang, onShowPaywall }) => {
  const t = useTranslation(currentLang);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [typingId, setTypingId] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const history = getChatHistory();
    setMessages(history.length > 0 ? history : [{ 
        id: 'init-1', 
        role: 'assistant', 
        content: t('aiGreeting'),
        suggestions: [t('qa_analyze'), t('qa_tips')]
    }]);
  }, [currentLang, t]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isExpanded) {
        const timer = setTimeout(scrollToBottom, 50);
        return () => clearTimeout(timer);
    }
  }, [isExpanded, messages, scrollToBottom]);

  const speakNeural = async (text: string) => {
    if (!soundEnabled) return;
    if (currentSourceRef.current) {
        try { currentSourceRef.current.stop(); } catch(e) {}
    }
    const cleanText = text.replace(/\*\*/g, '').trim();
    if (!cleanText) return;
    
    setIsSpeaking(true);
    const base64Audio = await generateNeuralTTS(cleanText, currentLang);
    if (!base64Audio) {
      setIsSpeaking(false);
      return;
    }

    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') await ctx.resume();
    
    const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.onended = () => setIsSpeaking(false);
    currentSourceRef.current = source;
    source.start(0);
  };

  const handleSendMessage = async (textOverride?: string) => {
    const text = textOverride || inputText;
    if (!text.trim()) return;

    if (!incrementAIInteraction()) {
        const msgId = Date.now().toString();
        setMessages(p => [...p, { id: msgId, role: 'assistant', content: t('freeLimitReached') }]);
        setTypingId(msgId);
        onShowPaywall?.();
        return;
    }

    const updatedHistory = [...messages, { id: Date.now().toString(), role: 'user', content: text } as ChatMessage];
    setMessages(updatedHistory);
    setInputText('');
    setIsProcessing(true);
    setIsTyping(true);

    const response = await chatWithFinancialAdvisor(updatedHistory, getExpenses(), getBudgets(), getCategories(), currentLang);
    
    setIsProcessing(false);
    if (response) {
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'create_expense') {
            const args = fc.args as any;
            addExpense({ merchant_name: args.merchant, amount: args.amount, category: args.category || 'Other', date: args.date || new Date().toISOString().split('T')[0], ai_summary: args.note || 'Comando de Voz', currency: 'BRL' });
            const confirmation = currentLang === 'pt' ? `Feito! Registrei R$ ${args.amount} no ${args.merchant}. Quer mais alguma coisa?` : `Done! Just registered R$ ${args.amount} at ${args.merchant}. What else?`;
            const msgId = Date.now().toString();
            setMessages(p => [...p, { id: msgId, role: 'assistant', content: confirmation }]);
            setTypingId(msgId);
            speakNeural(confirmation);
          }
        }
      } else if (response.text) {
        const msgId = Date.now().toString();
        setMessages(p => [...p, { id: msgId, role: 'assistant', content: response.text }]);
        setTypingId(msgId);
        speakNeural(response.text);
      }
    }
    setIsTyping(false);
    saveChatHistory(updatedHistory);
  };

  const toggleVoice = async () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        if (!SpeechRecognition) {
          alert("Navegador sem suporte a reconhecimento de voz.");
          return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = currentLang === 'pt' ? 'pt-BR' : 'en-US';
        recognition.onstart = () => {
            setIsListening(true);
            if (isSpeaking && currentSourceRef.current) currentSourceRef.current.stop();
        };
        recognition.onresult = (e: any) => handleSendMessage(e.results[0][0].transcript);
        recognition.onend = () => setIsListening(false);
        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.error("Mic Permission Denied", err);
        alert("O Neo precisa acessar seu microfone para te ouvir!");
      }
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] pointer-events-none flex flex-col items-center p-3 pb-safe">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div 
            layoutId="neural-pill"
            className="pointer-events-auto flex items-center gap-1.5 glass-panel px-4 py-2 rounded-full shadow-2xl border-white/5 mb-2 active:scale-95 transition-all"
          >
             <button onClick={() => setIsExpanded(true)} className="flex items-center gap-2.5 pr-2 border-r border-white/5 transition-all group">
                <div className="relative">
                  <img src={AVATAR_URL} alt="Neo" className="w-7 h-7 rounded-full shadow-inner" />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-950 ${isSpeaking ? 'bg-energy-500 animate-pulse' : isProcessing ? 'bg-blue-500 animate-spin' : 'bg-green-500'}`}></div>
                </div>
                <div className="text-left">
                    <span className="font-black text-[7px] uppercase tracking-widest text-energy-500 block opacity-70 leading-none">Neo v2.5</span>
                    <span className="font-bold text-[10px] text-white/90">Falar com o Neo...</span>
                </div>
             </button>
             <button onClick={toggleVoice} className={`p-1.5 rounded-full transition-all ${isListening ? 'bg-red-500 text-white shadow-lg scale-110' : 'text-slate-500 active:text-white'}`}>
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
             </button>
          </motion.div>
        ) : (
          <motion.div 
            layoutId="neural-pill"
            className="pointer-events-auto glass-panel w-full max-w-sm h-[58vh] rounded-[2rem] shadow-[0_32px_128px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden border-white/5"
          >
             {/* Header - Extremely compact */}
             <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-slate-900/40 backdrop-blur-xl shrink-0">
                <div className="flex items-center gap-3">
                   <div className="relative">
                      <img src={AVATAR_URL} alt="Neo" className={`w-8 h-8 rounded-full border border-white/10 ${isSpeaking ? 'scale-110 ring-2 ring-energy-500/20' : ''}`} />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-950 ${isListening ? 'bg-red-500 animate-ping' : isProcessing ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                   </div>
                   <div>
                      <h3 className="font-black text-[11px] text-white leading-none">Neo Analytics</h3>
                      <p className="text-[7px] uppercase font-black text-energy-500 tracking-widest mt-1 opacity-70">
                        {isListening ? 'Escutando...' : isProcessing ? 'Processando...' : 'Sistemas On-line'}
                      </p>
                   </div>
                </div>
                <div className="flex gap-1.5">
                   <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 glass-panel rounded-lg active:scale-90 transition-transform">
                      {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-slate-300" /> : <VolumeX className="h-3.5 w-3.5 text-red-400" />}
                   </button>
                   <button onClick={() => setIsExpanded(false)} className="p-2 glass-panel rounded-lg active:scale-90 transition-transform">
                      <ChevronDown className="h-4 w-4 text-slate-300" />
                   </button>
                </div>
             </div>

             {/* Chat History - Reduced Padding & Small Font */}
             <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar scroll-smooth">
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[88%] rounded-[1.2rem] p-3 text-[12px] font-bold leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-trust-500 text-white rounded-tr-sm shadow-lg shadow-trust-500/20' : 'bg-white/5 text-slate-100 border border-white/5 rounded-tl-sm backdrop-blur-3xl'}`}>
                      <TypewriterMessage content={msg.content} isNew={typingId === msg.id} onComplete={() => setTypingId(null)} />
                      {msg.suggestions && !typingId && msg.role === 'assistant' && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {msg.suggestions.map((s, idx) => (
                            <button key={idx} onClick={() => handleSendMessage(s)} className="text-[8px] font-black uppercase tracking-widest bg-white/5 px-2 py-1.5 rounded-lg border border-white/10 hover:border-energy-500/50 active:scale-95 transition-all whitespace-nowrap">{s}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/5 px-3 py-2 rounded-xl flex items-center gap-2 shadow-xl">
                       <Loader2 className="h-3 w-3 text-energy-500 animate-spin" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Neo está processando...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-1" />
             </div>

             {/* Bottom Input Area - Low Clutter */}
             <div className="p-4 bg-slate-900/60 backdrop-blur-3xl border-t border-white/5 pb-8">
                <div className="flex gap-2 items-center">
                   <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Manda uma pro Neo..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 outline-none transition-all text-[12px] font-bold text-white placeholder:text-slate-800"
                      />
                      <button 
                        onClick={() => handleSendMessage()}
                        disabled={!inputText.trim() || isTyping || isProcessing}
                        className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-energy-500 text-white rounded-lg shadow-lg disabled:opacity-20 active:scale-90 transition-transform"
                      >
                         <Send className="h-4 w-4" />
                      </button>
                   </div>
                   <button 
                     onClick={toggleVoice}
                     className={`p-2.5 rounded-xl transition-all shadow-xl ${isListening ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-white/5 border border-white/10 text-slate-500 active:text-white'}`}
                   >
                      <Mic className="h-4.5 w-4.5" />
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};