'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@mobii/ui';

interface BrandCardProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'gradient' | 'outlined';
  icon?: React.ReactNode;
  className?: string;
}

export default function BrandCard({
  title,
  children,
  variant = 'default',
  icon,
  className = ''
}: BrandCardProps) {
  const cardVariants = {
    default: 'bg-background-secondary border-border-primary',
    gradient: 'bg-gradient-to-br from-background-secondary to-background-primary border-teal-400/20',
    outlined: 'bg-transparent border-2 border-teal-400/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className={className}
    >
      <Card className={`${cardVariants[variant]} transition-all duration-300 hover:shadow-lg hover:shadow-teal-400/10`}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            {icon && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="p-2 rounded-lg bg-gradient-to-br from-teal-400 to-purple-600 text-white"
              >
                {icon}
              </motion.div>
            )}
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-teal-400 to-purple-600 bg-clip-text text-transparent">
              {title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}
