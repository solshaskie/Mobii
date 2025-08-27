'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { X, Volume2, VolumeX, MessageSquare, MessageSquareOff } from 'lucide-react';
import { Button, Card } from '@mobii/ui';
import { Switch } from '@mobii/ui';

interface WorkoutSettingsProps {
  audioEnabled: boolean;
  ttsEnabled: boolean;
  onAudioToggle: (enabled: boolean) => void;
  onTtsToggle: (enabled: boolean) => void;
  onClose: () => void;
}

export function WorkoutSettings({
  audioEnabled,
  ttsEnabled,
  onAudioToggle,
  onTtsToggle,
  onClose,
}: WorkoutSettingsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">Workout Settings</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Audio Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {audioEnabled ? (
                  <Volume2 className="h-5 w-5 text-accent" />
                ) : (
                  <VolumeX className="h-5 w-5 text-text-muted" />
                )}
                <div>
                  <h4 className="font-medium text-text-primary">Background Audio</h4>
                  <p className="text-sm text-text-secondary">
                    Play music and sound effects during workouts
                  </p>
                </div>
              </div>
              <Switch
                checked={audioEnabled}
                onCheckedChange={onAudioToggle}
              />
            </div>

            {/* TTS Settings */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {ttsEnabled ? (
                  <MessageSquare className="h-5 w-5 text-accent" />
                ) : (
                  <MessageSquareOff className="h-5 w-5 text-text-muted" />
                )}
                <div>
                  <h4 className="font-medium text-text-primary">Text-to-Speech</h4>
                  <p className="text-sm text-text-secondary">
                    Voice guidance for exercise instructions
                  </p>
                </div>
              </div>
              <Switch
                checked={ttsEnabled}
                onCheckedChange={onTtsToggle}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <Button
              onClick={onClose}
              className="w-full"
            >
              Done
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
