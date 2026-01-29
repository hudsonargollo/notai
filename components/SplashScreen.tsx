import React from 'react';
import { motion } from 'framer-motion';
import { Receipt } from 'lucide-react';
import { springTransition, staggerContainer, staggerItem } from '@/lib/animations';

export const SplashScreen: React.FC = () => {
  return (
    <motion.div 
      className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, delay: 2 }}
    >
      
      {/* Central Icon Area */}
      <motion.div 
        className="relative group"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          ...springTransition,
          delay: 0.2,
        }}
      >
        {/* Breathing Glow Background */}
        <motion.div 
          className="absolute inset-0 bg-emerald-500 rounded-full blur-[60px] opacity-20"
          animate={{ 
            opacity: [0.2, 0.3, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Floating Icon Container */}
        <motion.div 
          className="relative bg-gradient-to-tr from-emerald-600 to-teal-500 p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-500/30 ring-1 ring-white/10 overflow-hidden"
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Receipt className="h-20 w-20 text-white drop-shadow-md relative z-10" />
          
          {/* Internal Shimmer */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent"
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Brand Text */}
      <motion.div 
        className="text-center mt-12 space-y-2 z-10"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h1 
          className="text-5xl font-bold text-white tracking-tighter flex items-end justify-center"
          variants={staggerItem}
        >
          not
          <motion.span 
            className="h-4 w-4 bg-emerald-400 rounded-full mb-2 ml-1"
            animate={{ 
              y: [0, -8, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          AÍ
        </motion.h1>
        <motion.p 
          className="text-slate-400 text-lg font-medium tracking-wide"
          variants={staggerItem}
        >
          Syncing Finances...
        </motion.p>
      </motion.div>

      {/* Loading Bar */}
      <motion.div 
        className="mt-16 w-64 h-1.5 bg-slate-900/50 rounded-full overflow-hidden relative border border-slate-800"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          ...springTransition,
          delay: 0.7,
        }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent w-full h-full opacity-80"
          animate={{ 
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>
      
      {/* Footer Branding */}
      <motion.div 
        className="absolute bottom-8 text-xs text-slate-600 font-mono uppercase tracking-widest"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 1,
        }}
      >
        Powered by Neo
      </motion.div>
    </motion.div>
  );
};