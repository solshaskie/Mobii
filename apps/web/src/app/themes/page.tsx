'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../components/providers/theme-provider';
import { THEME_NAMES, THEME_DESCRIPTIONS } from '@mobii/shared';
import { Button, Card } from '@mobii/ui';
import { Check, Palette, Sparkles } from 'lucide-react';

export default function ThemesPage() {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <div className="container-responsive py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 text-accent text-4xl mb-4"
          >
            <Palette className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Choose Your Theme</h1>
          </motion.div>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Personalize your Mobii experience with our carefully crafted themes. 
            Each theme is designed to enhance your workout experience and match your mood.
          </p>
        </div>

        {/* Theme Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableThemes.map((theme, index) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ThemeCard
                theme={theme}
                isActive={currentTheme === theme.id}
                onSelect={() => setTheme(theme.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* Theme Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Theme Preview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ThemePreviewCard />
            <ThemeFeaturesCard />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function ThemeCard({ 
  theme, 
  isActive, 
  onSelect 
}: { 
  theme: any; 
  isActive: boolean; 
  onSelect: () => void; 
}) {
  return (
    <Card 
      className={`relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 ${
        isActive ? 'ring-2 ring-accent shadow-glow-accent' : 'hover:shadow-lg'
      }`}
      onClick={onSelect}
    >
      {/* Theme Preview */}
      <div className="h-32 relative overflow-hidden">
        <div className="absolute inset-0 flex">
          <div 
            className="flex-1" 
            style={{ backgroundColor: theme.colors.primary }}
          />
          <div 
            className="flex-1" 
            style={{ backgroundColor: theme.colors.secondary }}
          />
          <div 
            className="flex-1" 
            style={{ backgroundColor: theme.colors.tertiary }}
          />
        </div>
        
        {/* Accent Colors */}
        <div className="absolute bottom-2 left-2 right-2 flex gap-1">
          <div 
            className="h-3 flex-1 rounded"
            style={{ backgroundColor: theme.colors.accent }}
          />
          <div 
            className="h-3 flex-1 rounded"
            style={{ backgroundColor: theme.colors.accentGreen }}
          />
          <div 
            className="h-3 flex-1 rounded"
            style={{ backgroundColor: theme.colors.accentBlue }}
          />
          <div 
            className="h-3 flex-1 rounded"
            style={{ backgroundColor: theme.colors.accentPurple }}
          />
        </div>

        {/* Active Indicator */}
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 h-6 w-6 bg-accent rounded-full flex items-center justify-center"
          >
            <Check className="h-4 w-4 text-white" />
          </motion.div>
        )}
      </div>

      {/* Theme Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{theme.name}</h3>
        <p className="text-text-secondary text-sm mb-3">{theme.description}</p>
        
        <Button 
          variant={isActive ? "default" : "outline"} 
          size="sm" 
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isActive ? 'Active' : 'Select Theme'}
        </Button>
      </div>
    </Card>
  );
}

function ThemePreviewCard() {
  const { currentTheme, themeColors } = useTheme();
  
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4">Current Theme: {THEME_NAMES[currentTheme]}</h3>
      
      <div className="space-y-4">
        {/* Color Palette */}
        <div>
          <h4 className="font-medium mb-2">Color Palette</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: themeColors.primary }}
                />
                <span className="text-sm">Primary</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: themeColors.secondary }}
                />
                <span className="text-sm">Secondary</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: themeColors.tertiary }}
                />
                <span className="text-sm">Tertiary</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: themeColors.accent }}
                />
                <span className="text-sm">Accent</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: themeColors.accentGreen }}
                />
                <span className="text-sm">Success</span>
              </div>
              <div className="flex items-center gap-2">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: themeColors.accentBlue }}
                />
                <span className="text-sm">Info</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sample UI Elements */}
        <div>
          <h4 className="font-medium mb-2">Sample UI</h4>
          <div className="space-y-2">
            <Button size="sm">Primary Button</Button>
            <Button variant="outline" size="sm">Secondary Button</Button>
            <div className="h-2 bg-background-tertiary rounded-full">
              <div 
                className="h-2 rounded-full"
                style={{ 
                  backgroundColor: themeColors.accent,
                  width: '60%'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ThemeFeaturesCard() {
  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-accent" />
        Theme Features
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Accessibility</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• High contrast ratios for readability</li>
            <li>• Color-blind friendly palettes</li>
            <li>• Consistent focus indicators</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Performance</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• CSS custom properties for instant switching</li>
            <li>• Optimized color calculations</li>
            <li>• Smooth transitions between themes</li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Customization</h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• 8 carefully crafted themes</li>
            <li>• Automatic theme persistence</li>
            <li>• Easy to add new themes</li>
          </ul>
        </div>
      </div>
    </Card>
  );
}
