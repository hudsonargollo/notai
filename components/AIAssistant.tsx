import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, ChevronDown, Zap } from 'lucide-react';
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
      const delay = char === '.' || char === '!' || char === '?' ? 60 : 10;
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
                part.startsWith('**') ? <strong key={j} className="text-energy-500">{part.slice(2, -2)}</strong> : part
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
    const base64Audio = await generateNeuralTTS(cleanText, currentLang);
    if (!base64Audio) return;
    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') await ctx.resume();
    const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    // Fix: AudioBufferSourceNode does not have an 'onstart' property.
    // Use onended for cleanup and manually set state after start().
    source.onended = () => setIsSpeaking(false);
    currentSourceRef.current = source;
    source.start(0);
    setIsSpeaking(true);
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
    setIsTyping(true);

    const response = await chatWithFinancialAdvisor(updatedHistory, getExpenses(), getBudgets(), getCategories(), currentLang);
    
    if (response) {
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'create_expense') {
            const args = fc.args as any;
            addExpense({ merchant_name: args.merchant, amount: args.amount, category: args.category || 'Other', date: args.date || new Date().toISOString().split('T')[0], ai_summary: args.note || 'Comando de Voz', currency: 'BRL' });
            const confirmation = currentLang === 'pt' ? `Show! Registrei R$ ${args.amount} no ${args.merchant}.` : `Done! Registered R$ ${args.amount} at ${args.merchant}.`;
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

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (!SpeechRecognition) return;
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
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] pointer-events-none flex flex-col items-center p-4 safe-pb">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div 
            layoutId="neural-pill"
            className="pointer-events-auto flex items-center gap-2 glass-panel px-4 py-2.5 rounded-full shadow-2xl border-white/10"
          >
             <button onClick={() => setIsExpanded(true)} className="flex items-center gap-2.5 pr-3 border-r border-white/5 active:scale-95 transition-all">
                <div className="relative">
                  <img src={AVATAR_URL} alt="Neo" className="w-7 h-7 rounded-full" />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-900 ${isSpeaking ? 'bg-energy-500 animate-pulse' : 'bg-green-500'}`}></div>
                </div>
                <div className="text-left">
                    <span className="font-black text-[7px] uppercase tracking-widest text-energy-500 block opacity-80">Neo AI</span>
                    <span className="font-bold text-[11px] text-white/80">Fale com o Neo...</span>
                </div>
             </button>
             <button onClick={toggleVoice} className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white' : 'text-slate-500'}`}>
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
             </button>
          </motion.div>
        ) : (
          <motion.div 
            layoutId="neural-pill"
            className="pointer-events-auto glass-panel w-full max-w-lg h-[55vh] rounded-[1.8rem] shadow-2xl flex flex-col relative overflow-hidden border-white/10"
          >
             {/* Dynamic Island Expansion */}
             <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center bg-slate-950/40">
                <div className="flex items-center gap-3">
                   <img src={AVATAR_URL} alt="Neo" className={`w-8 h-8 rounded-full border border-white/10 transition-transform ${isSpeaking ? 'scale-110' : ''}`} />
                   <div>
                      <h3 className="font-black text-xs text-white">Neo Core</h3>
                      <p className="text-[7px] uppercase font-black text-energy-500 tracking-widest">
                        {isListening ? 'Ouvindo...' : isTyping ? 'Analisando...' : 'On-line'}
                      </p>
                   </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 glass-panel rounded-lg">
                      {soundEnabled ? <Volume2 className="h-3.5 w-3.5 text-slate-400" /> : <VolumeX className="h-3.5 w-3.5 text-red-500" />}
                   </button>
                   <button onClick={() => setIsExpanded(false)} className="p-2 glass-panel rounded-lg">
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                   </button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
                {messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-[1.2rem] p-3 text-[11px] font-bold leading-relaxed ${msg.role === 'user' ? 'bg-trust-500 text-white rounded-tr-sm' : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-sm backdrop-blur-3xl'}`}>
                      <TypewriterMessage content={msg.content} isNew={typingId === msg.id} onComplete={() => setTypingId(null)} />
                      {msg.suggestions && !typingId && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {msg.suggestions.map((s, idx) => (
                            <button key={idx} onClick={() => handleSendMessage(s)} className="text-[8px] font-black uppercase tracking-tighter bg-white/5 px-2.5 py-1 rounded-md border border-white/5">{s}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/5 p-2 rounded-xl flex gap-1">
                       <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-energy-500 rounded-full" />
                       <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-energy-500 rounded-full" />
                       <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-energy-500 rounded-full" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} className="h-2" />
             </div>

             <div className="p-4 bg-slate-900/60 border-t border-white/5">
                <div className="flex gap-2 items-center">
                   <div className="relative flex-1">
                      <input 
                        type="text" 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Manda a letra..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-4 outline-none font-bold text-xs text-white placeholder:text-slate-800"
                      />
                      <button 
                        onClick={() => handleSendMessage()}
                        disabled={!inputText.trim() || isTyping}
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-energy-500 text-white rounded-lg shadow-lg disabled:opacity-20 active:scale-90 transition-all"
                      >
                         <Send className="h-3.5 w-3.5" />
                      </button>
                   </div>
                   <button 
                     onClick={toggleVoice}
                     className={`p-2.5 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white shadow-xl' : 'bg-white/5 border border-white/10 text-slate-500'}`}
                   >
                      <Mic className="h-4 w-4" />
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};