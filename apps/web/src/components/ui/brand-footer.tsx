'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Logo from './logo';

interface BrandFooterProps {
  showLogo?: boolean;
  variant?: 'default' | 'minimal';
  className?: string;
}

export default function BrandFooter({
  showLogo = true,
  variant = 'default',
  className = ''
}: BrandFooterProps) {
  const containerClasses = {
    default: 'flex flex-col md:flex-row items-center justify-between p-6 border-t border-border-primary',
    minimal: 'flex items-center justify-center p-4 border-t border-border-primary'
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-gradient-to-r from-background-secondary to-background-primary ${containerClasses[variant]} ${className}`}
    >
      {showLogo && (
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-4 md:mb-0"
        >
          <Logo variant="icon" size="sm" />
        </motion.div>
      )}
      
      <div className="text-center md:text-right">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-sm text-text-muted"
        >
          © 2024 Mobii. All rights reserved.
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xs text-text-muted mt-1 tracking-wide"
        >
          Mobility · Ability · Strength
        </motion.p>
      </div>
    </motion.footer>
  );
}
