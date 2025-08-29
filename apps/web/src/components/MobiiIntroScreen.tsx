'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@mobii/ui';

interface MobiiIntroScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export default function MobiiIntroScreen({ 
  onComplete, 
  duration = 3000 
}: MobiiIntroScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-teal-400 to-purple-600"
        >
          {/* Pulsing Ring Animation */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute"
          >
            <div className="w-[500px] h-[500px] rounded-full border-8 border-white/30 flex items-center justify-center">
              <div className="w-[400px] h-[400px] rounded-full border-8 border-white/50 flex items-center justify-center">
                <div className="w-[300px] h-[300px] rounded-full border-8 border-white/70 flex items-center justify-center">
                  <div className="w-[200px] h-[200px] rounded-full border-8 border-white/90 flex items-center justify-center">
                    <div className="w-[100px] h-[100px] rounded-full bg-white/20"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobii Logo */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative z-10 text-center"
          >
            <motion.h1
              className="text-6xl font-bold text-white mb-4 font-['Poppins']"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                background: 'linear-gradient(45deg, #ffffff, #f0f0f0, #ffffff)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Mobii
            </motion.h1>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg text-white/90 tracking-wider"
            >
              Mobility · Ability · Strength
            </motion.p>
          </motion.div>

          {/* Skip Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onComplete?.(), 500);
            }}
            className="absolute bottom-8 right-8 px-6 py-2 text-white/80 hover:text-white transition-colors"
          >
            Skip
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
