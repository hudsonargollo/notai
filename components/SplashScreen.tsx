import React from 'react';
import { Receipt } from 'lucide-react';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 animate-out fade-out duration-700 delay-[2000ms] fill-mode-forwards">
      
      {/* Central Icon Area */}
      <div className="relative group">
        {/* Breathing Glow Background */}
        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[60px] opacity-20 animate-pulse-slow group-hover:opacity-30 transition-opacity duration-1000"></div>
        
        {/* Floating Icon Container */}
        <div className="relative bg-gradient-to-tr from-emerald-600 to-teal-500 p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-500/30 animate-float ring-1 ring-white/10 overflow-hidden">
          <Receipt className="h-20 w-20 text-white drop-shadow-md relative z-10" />
          
          {/* Internal Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-30 animate-pulse"></div>
        </div>
      </div>

      {/* Brand Text */}
      <div className="text-center mt-12 space-y-2 z-10">
        <h1 className="text-5xl font-bold text-white tracking-tighter animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300 flex items-end justify-center">
          not<span className="text-emerald-400 inline-block animate-bounce delay-1000 h-4 w-4 bg-emerald-400 rounded-full mb-2 ml-1"></span>AÍ
        </h1>
        <p className="text-slate-400 text-lg font-medium tracking-wide animate-in slide-in-from-bottom-4 fade-in duration-1000 delay-500">
          Syncing Finances...
        </p>
      </div>

      {/* Loading Bar */}
      <div className="mt-16 w-64 h-1.5 bg-slate-900/50 rounded-full overflow-hidden relative animate-in fade-in delay-700 duration-1000 border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-full h-full animate-shimmer opacity-80"></div>
      </div>
      
      {/* Footer Branding */}
      <div className="absolute bottom-8 text-xs text-slate-600 font-mono uppercase tracking-widest animate-in fade-in delay-1000">
        Powered by Neo
      </div>
    </div>
  );
};