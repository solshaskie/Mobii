'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../lib/utils';
import {
  Home,
  Dumbbell,
  TrendingUp,
  Settings,
  Menu,
  X,
  Palette,
  Crown,
  ChevronRight,
  BarChart3,
  Brain,
  Target,
  Camera,
} from 'lucide-react';
import { Button } from '@mobii/ui';

const navigationItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Workouts', href: '/workouts', icon: Dumbbell },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'AI Generator', href: '/ai-generator', icon: Brain },
  { name: 'Goals', href: '/goals', icon: Target },
  { name: 'Camera AI', href: '/camera-demo', icon: Camera },
  { name: 'Themes', href: '/themes', icon: Palette },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="bg-background-secondary border border-border"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? '4rem' : '16rem',
        }}
        className={cn(
          'fixed left-0 top-0 z-40 h-full bg-background-secondary border-r border-border transition-all duration-300',
          'lg:relative lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xl font-bold bg-gradient-to-r from-accent-pink to-accent-blue bg-clip-text text-transparent"
                >
                  Mobii
                </motion.div>
              )}
            </motion.div>
            
            {/* Collapse Button (Desktop) */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex"
            >
              <ChevronRight
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isCollapsed && 'rotate-180'
                )}
              />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer',
                      isActive
                        ? 'bg-accent/10 text-accent border-r-2 border-accent'
                        : 'text-text-secondary hover:text-text-primary hover:bg-background-tertiary'
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Premium Section */}
          <div className="p-4 border-t border-border">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 border border-accent-purple/20 rounded-lg p-4',
                isCollapsed && 'p-2'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-accent-purple" />
                {!isCollapsed && (
                  <span className="text-sm font-medium text-accent-purple">
                    Premium Features
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <p className="text-xs text-text-secondary mb-3">
                  Unlock advanced AI features, unlimited workouts, and premium themes.
                </p>
              )}
              <Button size="sm" className="w-full text-xs">
                {isCollapsed ? 'Upgrade' : 'Upgrade Now'}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
