import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, ChevronDown, Bot } from 'lucide-react';
import { useTranslation } from '../utils/i18n';
import { Language, ChatMessage, AVATAR_URL } from '../types';
import { chatWithFinancialAdvisor, generateNeuralTTS } from '../services/geminiService';
import { getExpenses, getBudgets, getCategories, addExpense, getChatHistory, saveChatHistory, incrementAIInteraction } from '../services/expenseService';
import { Button } from '../src/components/ui/button';
import { Input } from '../src/components/ui/input';
import { Skeleton } from '../src/components/ui/skeleton';
import { useIsMobile } from '../src/hooks/useMediaQuery';
import { fadeInUp } from '../src/lib/animations';
import { Dialog, DialogContent } from '../src/components/ui/dialog';
import { Sheet, SheetContent } from '../src/components/ui/sheet';

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

/**
 * TypingIndicator Component
 * 
 * Shows a skeleton-based typing indicator when AI is processing
 * Uses Shadcn UI Skeleton components for consistent loading states
 */
const TypingIndicator: React.FC<{ loadingMessage: string }> = ({ loadingMessage }) => {
  return (
    <motion.div 
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex justify-start"
    >
      <div className="bg-gradient-to-br from-energy-500/10 to-trust-500/10 border border-energy-500/20 px-4 py-3 rounded-2xl rounded-tl-sm shadow-2xl backdrop-blur-xl max-w-[88%]">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5"
            >
              <Bot className="h-4 w-4 text-energy-500" strokeWidth={2} />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 bg-energy-500/20 rounded-full blur-md"
            />
          </div>
          <span className="text-[11px] font-black text-white">{loadingMessage}</span>
        </div>
        
        {/* Skeleton-based thought waves */}
        <div className="flex gap-1.5 items-center">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton
              key={i}
              className="w-1 rounded-full bg-gradient-to-t from-energy-500 to-trust-500"
              style={{
                height: '4px',
                animation: `pulse 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
        
        {/* Subtle progress indicator */}
        <motion.div 
          className="mt-2 h-0.5 bg-gradient-to-r from-energy-500/0 via-energy-500 to-energy-500/0 rounded-full"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

/**
 * AudioGenerationIndicator Component
 * 
 * Shows when audio is being generated for TTS
 */
const AudioGenerationIndicator: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 pt-2 border-t border-white/10 flex items-center gap-2"
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        <Volume2 className="h-4 w-4 text-energy-500" strokeWidth={2} />
      </motion.div>
      <span className="text-[8px] font-black uppercase tracking-widest text-energy-500/70">Gerando áudio...</span>
      <div className="flex gap-0.5 ml-auto">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
            className="w-1 h-1 bg-energy-500 rounded-full"
          />
        ))}
      </div>
    </motion.div>
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
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [typingId, setTypingId] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  
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
    
    setIsGeneratingAudio(true);
    const base64Audio = await generateNeuralTTS(cleanText, currentLang);
    setIsGeneratingAudio(false);
    
    if (!base64Audio) {
      setIsSpeaking(false);
      return;
    }

    if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') await ctx.resume();
    
    setIsSpeaking(true);
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

    // Generate contextual loading message based on user input
    const lowerText = text.toLowerCase();
    let contextMessage = 'Analisando sua mensagem...';
    
    if (lowerText.includes('gast') || lowerText.includes('despesa') || lowerText.includes('quanto')) {
      contextMessage = '💰 Calculando seus gastos...';
    } else if (lowerText.includes('dica') || lowerText.includes('conselho') || lowerText.includes('ajuda')) {
      contextMessage = '💡 Preparando dicas personalizadas...';
    } else if (lowerText.includes('registr') || lowerText.includes('adiciona') || lowerText.includes('comprei')) {
      contextMessage = '📝 Registrando sua despesa...';
    } else if (lowerText.includes('orçamento') || lowerText.includes('budget')) {
      contextMessage = '📊 Analisando seu orçamento...';
    } else if (lowerText.includes('economia') || lowerText.includes('poupar') || lowerText.includes('economizar')) {
      contextMessage = '🎯 Buscando oportunidades de economia...';
    } else if (lowerText.includes('categoria') || lowerText.includes('onde')) {
      contextMessage = '🏷️ Categorizando informações...';
    }
    
    setLoadingMessage(contextMessage);

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
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        
        recognition.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        recognition.onstart = () => {
            setIsListening(true);
            if (isSpeaking && currentSourceRef.current) {
              try { currentSourceRef.current.stop(); } catch(e) {}
              setIsSpeaking(false);
            }
        };
        
        recognition.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          const confidence = e.results[0][0].confidence;
          
          if (confidence > 0.5) {
            handleSendMessage(transcript);
          } else {
            console.warn('Low confidence speech recognition:', confidence);
          }
        };
        
        recognition.onerror = (e: any) => {
          console.error("Speech recognition error:", e.error);
          setIsListening(false);
          
          if (e.error === 'no-speech') {
            // User didn't speak, just close silently
          } else if (e.error === 'audio-capture') {
            alert("Não consegui acessar o microfone. Verifique as permissões.");
          } else if (e.error === 'not-allowed') {
            alert("O Neo precisa acessar seu microfone para te ouvir!");
          }
        };
        
        recognition.onend = () => setIsListening(false);
        
        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.error("Mic Permission Denied", err);
        alert("O Neo precisa acessar seu microfone para te ouvir!");
      }
    }
  };

  // Collapsed pill button
  const CollapsedPill = () => (
    <motion.div 
      layoutId="neural-pill"
      className="pointer-events-auto flex items-center gap-1.5 glass-panel px-4 py-2 rounded-full shadow-2xl border-white/5 mb-2 active:scale-95 transition-all"
    >
      <button onClick={() => setIsExpanded(true)} className="flex items-center gap-2.5 pr-2 border-r border-white/5 transition-all group">
        <div className="relative">
          <img src={AVATAR_URL} alt="Neo" className="w-7 h-7 rounded-full shadow-inner" />
          <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-950 ${isSpeaking ? 'bg-energy-500 animate-pulse' : isProcessing ? 'bg-blue-500 animate-spin' : isGeneratingAudio ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
        </div>
        <div className="text-left">
          <span className="font-black text-[7px] uppercase tracking-widest text-energy-500 block opacity-70 leading-none">Neo v2.5</span>
          <span className="font-bold text-[10px] text-white/90">
            {isListening ? '🎤 Escutando...' : isProcessing ? '⚡ Processando...' : isSpeaking ? '🔊 Falando...' : 'Falar com o Neo...'}
          </span>
        </div>
      </button>
      <button 
        onClick={toggleVoice} 
        disabled={isProcessing || isSpeaking || isGeneratingAudio}
        className={`p-1.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isListening ? 'bg-red-500 text-white shadow-lg scale-110' : 'text-slate-500 active:text-white'}`}
      >
        {isListening ? <MicOff className="h-4 w-4" strokeWidth={2} /> : <Mic className="h-4 w-4" strokeWidth={2} />}
      </button>
    </motion.div>
  );

  // Chat content (shared between mobile and desktop)
  const ChatContent = () => (
    <>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex justify-between items-center bg-slate-900/40 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={AVATAR_URL} alt="Neo" className={`w-8 h-8 rounded-full border border-white/10 ${isSpeaking || isGeneratingAudio ? 'scale-110 ring-2 ring-energy-500/20' : ''}`} />
            <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-950 ${isListening ? 'bg-red-500 animate-ping' : isProcessing ? 'bg-blue-500 animate-pulse' : isGeneratingAudio ? 'bg-yellow-500 animate-pulse' : isSpeaking ? 'bg-energy-500 animate-pulse' : 'bg-green-500'}`}></div>
          </div>
          <div>
            <h3 className="font-black text-[11px] text-white leading-none">Neo Analytics</h3>
            <p className="text-[7px] uppercase font-black text-energy-500 tracking-widest mt-1 opacity-70">
              {isListening ? 'Escutando...' : isProcessing ? 'Processando...' : isGeneratingAudio ? 'Gerando Áudio...' : isSpeaking ? 'Falando...' : 'Sistemas On-line'}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)} 
            className="h-8 w-8 rounded-lg"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" strokeWidth={2} /> : <VolumeX className="h-4 w-4 text-red-400" strokeWidth={2} />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsExpanded(false)} 
            className="h-8 w-8 rounded-lg"
          >
            <ChevronDown className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar scroll-smooth">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            variants={fadeInUp}
            initial="initial"
            animate="animate"
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[88%] rounded-[1.2rem] p-3 text-[12px] font-bold leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-trust-500 text-white rounded-tr-sm shadow-lg shadow-trust-500/20' : 'bg-white/5 text-slate-100 border border-white/5 rounded-tl-sm backdrop-blur-3xl'}`}>
              <TypewriterMessage content={msg.content} isNew={typingId === msg.id} onComplete={() => setTypingId(null)} />
              
              {/* Audio generation indicator */}
              {msg.role === 'assistant' && isGeneratingAudio && msg.id === messages[messages.length - 1]?.id && (
                <AudioGenerationIndicator />
              )}
              
              {msg.suggestions && !typingId && msg.role === 'assistant' && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {msg.suggestions.map((s, idx) => (
                    <Button
                      key={idx}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSendMessage(s)}
                      className="text-[8px] font-black uppercase tracking-widest h-auto px-2 py-1.5 border border-white/10 hover:border-energy-500/50"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
        
        {/* Typing indicator with Skeleton */}
        <AnimatePresence>
          {isProcessing && <TypingIndicator loadingMessage={loadingMessage} />}
        </AnimatePresence>
        
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/60 backdrop-blur-3xl border-t border-white/5 pb-8">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isProcessing && !isSpeaking && !isGeneratingAudio && handleSendMessage()}
              placeholder={isProcessing || isSpeaking || isGeneratingAudio ? "Aguarde o Neo terminar..." : "Manda uma pro Neo..."}
              disabled={isProcessing || isSpeaking || isGeneratingAudio}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-[12px] font-bold disabled:opacity-50"
            />
            <Button
              size="icon"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping || isProcessing || isSpeaking || isGeneratingAudio}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 bg-energy-500 hover:bg-energy-600 rounded-lg"
            >
              <Send className="h-4 w-4" strokeWidth={2} />
            </Button>
          </div>
          <Button
            size="icon"
            onClick={toggleVoice}
            disabled={isProcessing || isSpeaking || isGeneratingAudio}
            className={`h-10 w-10 rounded-xl ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-white/5 hover:bg-white/10 border border-white/10'}`}
          >
            <Mic className="h-4 w-4" strokeWidth={2} />
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Collapsed pill button - always visible */}
      {!isExpanded && (
        <div className="fixed inset-x-0 bottom-0 z-[60] pointer-events-none flex flex-col items-center p-3 pb-safe">
          <CollapsedPill />
        </div>
      )}

      {/* Expanded chat interface - responsive modal */}
      {isMobile ? (
        // Mobile: Use Sheet (bottom sheet)
        <Sheet open={isExpanded} onOpenChange={setIsExpanded}>
          <SheetContent 
            side="bottom" 
            className="h-[58vh] p-0 flex flex-col"
            style={{
              borderTopLeftRadius: "2rem",
              borderTopRightRadius: "2rem",
            }}
          >
            <ChatContent />
          </SheetContent>
        </Sheet>
      ) : (
        // Desktop: Use Dialog
        <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
          <DialogContent className="max-w-md h-[65vh] p-0 flex flex-col gap-0 overflow-hidden">
            <ChatContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
