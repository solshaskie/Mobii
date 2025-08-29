'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@mobii/ui';
import Logo from './logo';
import { 
  Home, 
  Dumbbell, 
  BarChart3, 
  Brain, 
  Target, 
  Menu, 
  X,
  Settings,
  User,
  LogOut,
  Camera,
  Mic,
  Scale
} from 'lucide-react';

interface NavigationProps {
  className?: string;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Overview and quick actions'
  },
  {
    name: 'Workouts',
    href: '/workouts',
    icon: Dumbbell,
    description: 'Browse and start workouts'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Track your progress'
  },
  {
    name: 'AI Generator',
    href: '/ai-generator',
    icon: Brain,
    description: 'Create personalized workouts'
  },
  {
    name: 'Goals',
    href: '/goals',
    icon: Target,
    description: 'Set and manage goals'
  },
  {
    name: 'Camera AI',
    href: '/camera-demo',
    icon: Camera,
    description: 'AI form analysis with webcam'
  },
  {
    name: 'Camera Test',
    href: '/camera-test',
    icon: Camera,
    description: 'Simple camera test'
  },
  {
    name: 'Camera Debug',
    href: '/camera-debug',
    icon: Camera,
    description: 'Camera state debug'
  },
  {
    name: 'Voice Commands',
    href: '/voice-command-test',
    icon: Mic,
    description: 'Test voice command system'
  },
  {
    name: 'Weight Tracking',
    href: '/weight-tracking',
    icon: Scale,
    description: 'Track weight and body composition'
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
    description: 'User profile and progress photos'
  },
  {
    name: 'Auto Photo Capture',
    href: '/automated-photo-capture',
    icon: Camera,
    description: 'AI-guided progress photo capture'
  }
];

export default function Navigation({ className = '' }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.nav
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className={`hidden lg:flex flex-col w-64 bg-background-secondary border-r border-border-primary h-screen fixed left-0 top-0 z-40 ${className}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border-primary">
          <Logo variant="full" size="lg" />
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-400/20 to-purple-600/20 border border-teal-400/30 text-text-primary'
                      : 'text-text-muted hover:text-text-primary hover:bg-background-primary'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-border-primary">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-background-primary">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-purple-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-text-primary">John Doe</div>
              <div className="text-xs text-text-muted">Premium Member</div>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background-secondary border-b border-border-primary"
      >
        <div className="flex items-center justify-between p-4">
          <Logo variant="simple" size="md" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="lg:hidden"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={closeMobileMenu}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-background-secondary border-l border-border-primary z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-primary">
                  <Logo variant="simple" size="md" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeMobileMenu}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Navigation Items */}
                <div className="flex-1 p-4 space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    
                    return (
                      <Link key={item.name} href={item.href} onClick={closeMobileMenu}>
                        <motion.div
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                            isActive
                              ? 'bg-gradient-to-r from-teal-400/20 to-purple-600/20 border border-teal-400/30 text-text-primary'
                              : 'text-text-muted hover:text-text-primary hover:bg-background-primary'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-xs opacity-70">{item.description}</div>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>

                {/* Mobile User Section */}
                <div className="p-4 border-t border-border-primary">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-background-primary mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-purple-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">John Doe</div>
                      <div className="text-xs text-text-muted">Premium Member</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for desktop sidebar */}
      <div className="hidden lg:block w-64" />
      
      {/* Spacer for mobile header */}
      <div className="lg:hidden h-16" />
    </>
  );
}

