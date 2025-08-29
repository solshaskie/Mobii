'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Logo from './logo';

interface BrandHeaderProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
  variant?: 'default' | 'centered' | 'minimal';
  className?: string;
}

export default function BrandHeader({
  title = 'Mobii',
  subtitle = 'Mobility · Ability · Strength',
  showLogo = true,
  variant = 'default',
  className = ''
}: BrandHeaderProps) {
  const containerClasses = {
    default: 'flex items-center justify-between p-6',
    centered: 'flex flex-col items-center justify-center p-8 text-center',
    minimal: 'flex items-center p-4'
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-r from-background-primary to-background-secondary border-b border-border-primary ${containerClasses[variant]} ${className}`}
    >
      {showLogo && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Logo variant="full" size="lg" />
        </motion.div>
      )}
      
      <div className={variant === 'centered' ? 'mt-4' : 'ml-4'}>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-2xl font-bold text-text-primary bg-gradient-to-r from-teal-400 to-purple-600 bg-clip-text text-transparent"
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-sm text-text-muted mt-1 tracking-wide"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </motion.header>
  );
}
