'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Palette } from 'lucide-react';
import { useTheme } from '../providers/theme-provider';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';

export function ThemeSelector() {
  const { currentTheme, setTheme, availableThemes } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Palette className="h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className="flex items-center gap-3 p-3 cursor-pointer"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <ThemePreview colors={theme.colors} />
                <div>
                  <div className="font-medium">{theme.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {theme.description}
                  </div>
                </div>
              </div>
            </div>
            {currentTheme === theme.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-accent"
              >
                <Check className="h-4 w-4" />
              </motion.div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ThemePreview({ colors }: { colors: any }) {
  return (
    <div className="flex gap-1 p-1 rounded border">
      <div
        className="w-3 h-3 rounded-sm"
        style={{ backgroundColor: colors.primary }}
      />
      <div
        className="w-3 h-3 rounded-sm"
        style={{ backgroundColor: colors.accent }}
      />
      <div
        className="w-3 h-3 rounded-sm"
        style={{ backgroundColor: colors.accentGreen }}
      />
      <div
        className="w-3 h-3 rounded-sm"
        style={{ backgroundColor: colors.accentBlue }}
      />
    </div>
  );
}
