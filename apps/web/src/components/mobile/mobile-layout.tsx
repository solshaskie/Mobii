'use client';

import React from 'react';
import { MobileNavigation } from './mobile-navigation';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <MobileNavigation />
      
      {/* Main Content */}
      <main className="lg:pt-0">
        {children}
      </main>
      
      {/* Mobile-specific enhancements */}
      <div className="lg:hidden">
        {/* Touch-friendly spacing */}
        <div className="h-4" />
        
        {/* Mobile gesture hints */}
        <div className="fixed bottom-24 right-4 z-40">
          <div className="bg-blue-500 text-white rounded-full p-3 shadow-lg">
            <div className="w-6 h-6 flex items-center justify-center">
              <span className="text-sm">👆</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
