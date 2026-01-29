import React, { useState, useEffect } from 'react';
import { Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '../utils/i18n';
import { Language, AVATAR_URL } from '../types';
import { PageTransition } from '../src/components/layout/PageTransition';
import { Card, CardContent, CardFooter, CardHeader } from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';
import { fadeInUp, scaleOnHover } from '../src/lib/animations';

interface LoginScreenProps {
  onLogin: () => void;
  currentLang: Language;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, currentLang }) => {
  const t = useTranslation(currentLang);
  const [currentMsgIndex, setCurrentMsgIndex] = useState(0);

  const messages = ['loginMsg1', 'loginMsg2', 'loginMsg3', 'loginMsg4'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px]"></div>
        </div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="w-full max-w-md z-10"
        >
          <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-800 shadow-2xl">
            <CardHeader className="flex flex-col items-center text-center space-y-6 pt-8">
              {/* App Logo */}
              <div className="flex items-center space-x-2">
                <div className="bg-emerald-500/20 p-2 rounded-xl">
                  <Receipt className="h-6 w-6 text-emerald-400" />
                </div>
                <span className="text-xl font-bold text-white tracking-wide">
                  not<span className="text-emerald-400">.</span>AÍ
                </span>
              </div>

              {/* Character */}
              <motion.div
                className="relative w-40 h-40"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={AVATAR_URL}
                  alt="Neo Assistant"
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                />
              </motion.div>
            </CardHeader>

            <CardContent className="flex flex-col items-center text-center space-y-4 px-8">
              {/* Dynamic Rotating Message */}
              <div className="h-16 flex items-center justify-center w-full">
                <motion.p
                  key={currentMsgIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl font-bold text-white"
                >
                  {t(messages[currentMsgIndex])}
                </motion.p>
              </div>

              {/* Google Button */}
              <motion.div
                className="w-full"
                whileHover="hover"
                whileTap="tap"
                variants={scaleOnHover}
              >
                <Button
                  onClick={onLogin}
                  className="w-full bg-white text-slate-900 font-semibold py-6 px-4 rounded-xl hover:bg-slate-50 transition-colors"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>{t('googleSignIn')}</span>
                </Button>
              </motion.div>
            </CardContent>

            <CardFooter className="flex justify-center pb-8">
              <p className="text-xs text-slate-500">
                {t('createAccount')} • Privacy Policy
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
};
