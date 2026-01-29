import React, { useState } from 'react';
import { Check, Star, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Language, AVATAR_URL } from '../types';
import { useTranslation } from '../utils/i18n';
import { useIsMobile } from '../src/hooks/useMediaQuery';
import { scaleOnHover, modalAnimation, staggerContainer, staggerItem } from '../src/lib/animations';

// Shadcn/UI Components
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '../src/components/ui/dialog';
import {
  Sheet,
  SheetContent,
} from '../src/components/ui/sheet';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';

interface PaywallModalProps {
  onClose: () => void;
  onSubscribe: () => void;
  currentLang: Language;
  specialOffer?: boolean;
  onStartTrial?: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ 
  onClose, 
  onSubscribe, 
  currentLang, 
  specialOffer, 
  onStartTrial 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const t = useTranslation(currentLang);
  const isMobile = useIsMobile();

  const handleClose = () => {
    setIsOpen(false);
    // Delay actual close to allow animation to complete
    setTimeout(onClose, 200);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleClose();
    }
  };

  const handleSubscribe = () => {
    onSubscribe();
    handleClose();
  };

  const handleStartTrial = () => {
    if (onStartTrial) {
      onStartTrial();
      handleClose();
    }
  };

  // Shared content component for both mobile and desktop
  const PaywallContent = () => (
    <motion.div
      variants={modalAnimation}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Hidden accessibility elements */}
      <DialogTitle className="sr-only">
        {specialOffer ? t('specialOfferTitle') : t('premiumTitle')}
      </DialogTitle>
      <DialogDescription className="sr-only">
        Upgrade to premium to unlock unlimited features and advanced capabilities
      </DialogDescription>

      <Card className="border-0 shadow-none">
        {/* Hero Section */}
        <CardHeader className="relative bg-gradient-to-b from-emerald-900 to-slate-900 p-8 flex flex-col items-center text-center space-y-0">
          {specialOffer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-4 left-4 bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg shadow-yellow-500/20 flex items-center"
            >
              <Sparkles className="h-3 w-3 mr-1 fill-current" /> Limited Time
            </motion.div>
          )}
          
          <motion.div 
            className="relative w-32 h-32 mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
          >
            <div className="absolute inset-0 bg-emerald-500/30 rounded-full blur-xl"></div>
            <img 
              src={AVATAR_URL} 
              alt="Neo Premium" 
              className="w-full h-full object-contain relative z-10"
            />
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 p-1.5 rounded-full border-4 border-slate-900">
              <Star className="h-6 w-6 fill-current" />
            </div>
          </motion.div>
          
          <CardTitle className="text-2xl font-bold text-white mb-2">
            {specialOffer ? t('specialOfferTitle') : t('premiumTitle')}
          </CardTitle>
          <CardDescription className="text-slate-300">
            {specialOffer ? t('specialOfferDesc') : t('premiumDesc')}
          </CardDescription>
        </CardHeader>

        {/* Benefits with stagger animation */}
        <CardContent className="p-6">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-4"
          >
            <motion.div 
              className="flex items-center text-slate-200"
              variants={staggerItem}
            >
              <div className="bg-emerald-500/20 p-2 rounded-full mr-3 text-emerald-400 flex-shrink-0">
                <Check className="h-4 w-4" strokeWidth={2} />
              </div>
              <span>{t('benefit1')}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center text-slate-200"
              variants={staggerItem}
            >
              <div className="bg-emerald-500/20 p-2 rounded-full mr-3 text-emerald-400 flex-shrink-0">
                <Check className="h-4 w-4" strokeWidth={2} />
              </div>
              <span>{t('benefit2')}</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center text-slate-200"
              variants={staggerItem}
            >
              <div className="bg-emerald-500/20 p-2 rounded-full mr-3 text-emerald-400 flex-shrink-0">
                <Check className="h-4 w-4" strokeWidth={2} />
              </div>
              <span>{t('benefit3')}</span>
            </motion.div>
          </motion.div>
        </CardContent>

        {/* Pricing & CTA */}
        <CardFooter className="flex flex-col p-6 pt-0 space-y-3">
          <div className="text-center mb-3 w-full">
            <span className="text-slate-500 line-through text-sm block mb-1">
              {t('priceAnchor')}
            </span>
            <span className="text-3xl font-bold text-white block">
              {specialOffer ? t('priceSpecial') : t('priceFinal')}
            </span>
          </div>
          
          <motion.div 
            className="w-full"
            whileHover="hover" 
            whileTap="tap" 
            variants={scaleOnHover}
          >
            <Button 
              onClick={handleSubscribe}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/20"
              size="lg"
              aria-label={t('subscribe')}
            >
              <Lock className="h-4 w-4 mr-2" strokeWidth={2} />
              {t('subscribe')}
            </Button>
          </motion.div>

          {specialOffer && onStartTrial && (
            <motion.div 
              className="w-full"
              whileHover="hover" 
              whileTap="tap" 
              variants={scaleOnHover}
            >
              <Button 
                onClick={handleStartTrial}
                variant="outline"
                className="w-full bg-white/5 border-white/10 hover:bg-white/10"
                size="lg"
                aria-label={t('startTrial')}
              >
                {t('startTrial')}
              </Button>
            </motion.div>
          )}
          
          <Button 
            onClick={handleClose}
            variant="ghost"
            className="w-full text-slate-500 hover:text-white text-xs"
            size="sm"
            aria-label={t('restore')}
          >
            {t('restore')}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  // Render Sheet for mobile, Dialog for desktop
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={handleOpenChange}>
        <SheetContent
          side="bottom"
          className="p-0 rounded-t-2xl overflow-hidden"
        >
          {/* Visual handle indicator for mobile */}
          <div className="mx-auto w-12 h-1.5 rounded-full bg-muted my-4" />
          <PaywallContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-md p-0 gap-0 overflow-hidden"
      >
        <PaywallContent />
      </DialogContent>
    </Dialog>
  );
};
