'use client';

import React, { useState } from 'react';
import { Home, Camera, Brain, BarChart3, User, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileNavigationProps {
  className?: string;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
      description: 'Main dashboard'
    },
    {
      name: 'Camera AI',
      href: '/automated-photo-capture',
      icon: Camera,
      description: 'AI-powered photo capture'
    },
    {
      name: 'AI Trainer',
      href: '/ai-trainer-personality',
      icon: Brain,
      description: 'Personal AI coach'
    },
    {
      name: 'YouTube AI',
      href: '/youtube-summarization',
      icon: Brain,
      description: 'Video summarization'
    },
    {
      name: 'Movement AI',
      href: '/ai-movement-analysis',
      icon: Brain,
      description: 'Movement analysis'
    },
    {
      name: 'Progress',
      href: '/progress-tracking',
      icon: BarChart3,
      description: 'Track your progress'
    },
    {
      name: 'Profile',
      href: '/user-profile',
      icon: User,
      description: 'User profile'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">Mobii</h1>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Content Padding */}
      <div className="lg:hidden pt-16 pb-20" />
    </>
  );
};
