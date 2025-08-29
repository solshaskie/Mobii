'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@mobii/ui';
import { Mic, MicOff, Volume2, VolumeX, HelpCircle, X } from 'lucide-react';
import { voiceCommandService, VoiceCommandResult, VoiceCommand as VoiceCommandType } from '../../services/voice-command-service';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceCommandProps {
  onCommand?: (result: VoiceCommandResult) => void;
  className?: string;
  showCommands?: boolean;
  autoStart?: boolean;
}

export const VoiceCommand: React.FC<VoiceCommandProps> = ({
  onCommand,
  className = '',
  showCommands = true,
  autoStart = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<VoiceCommandResult | null>(null);
  const [commandHistory, setCommandHistory] = useState<VoiceCommandResult[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const commandsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
      return;
    }

    // Set up voice command service
    voiceCommandService.setOnCommand((result) => {
      setLastCommand(result);
      setCommandHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 commands
      onCommand?.(result);
    });

    voiceCommandService.setOnListeningChange((listening) => {
      setIsListening(listening);
    });

    // Auto-start if requested
    if (autoStart) {
      voiceCommandService.startListening();
    }

    return () => {
      voiceCommandService.stopListening();
    };
  }, [onCommand, autoStart]);

  const toggleListening = () => {
    if (isListening) {
      voiceCommandService.stopListening();
    } else {
      voiceCommandService.startListening();
    }
  };

  const clearHistory = () => {
    setCommandHistory([]);
    setLastCommand(null);
  };

  const getAvailableCommands = (): VoiceCommandType[] => {
    return voiceCommandService.getAvailableCommands();
  };

  if (!isSupported) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-600">
            <MicOff className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Voice Command Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-teal-500" />
              Voice Commands
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelp(!showHelp)}
                className="h-8 w-8 p-0"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
              {commandHistory.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearHistory}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Microphone Button */}
          <div className="flex justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={toggleListening}
                size="lg"
                variant={isListening ? "default" : "outline"}
                className={`h-16 w-16 rounded-full ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-teal-500 hover:bg-teal-600 text-white'
                }`}
              >
                {isListening ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </Button>
            </motion.div>
          </div>

          {/* Status Display */}
          <div className="text-center">
            <AnimatePresence mode="wait">
              {isListening ? (
                <motion.div
                  key="listening"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center justify-center gap-2"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Listening for commands...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="not-listening"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-gray-500"
                >
                  Click microphone to start voice commands
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Last Command Display */}
          <AnimatePresence>
            {lastCommand && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-blue-800">
                      Command: "{lastCommand.command}"
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Action: {lastCommand.action}
                    </div>
                    <div className="text-xs text-blue-500 mt-1">
                      Confidence: {(lastCommand.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {lastCommand.action.replace('_', ' ')}
                  </Badge>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Command History */}
      {commandHistory.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Recent Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {commandHistory.map((cmd, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{cmd.command}</div>
                    <div className="text-xs text-gray-500">{cmd.action}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {(cmd.confidence * 100).toFixed(0)}%
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Commands Help */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Available Voice Commands</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto" ref={commandsRef}>
                  {getAvailableCommands().map((command) => (
                    <div
                      key={command.id}
                      className="p-2 border rounded text-xs"
                    >
                      <div className="font-medium text-gray-800">{command.description}</div>
                      <div className="text-gray-500 mt-1">
                        Try: "{command.keywords[0]}"
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Compact version for integration into workout player
export const CompactVoiceCommand: React.FC<{
  onCommand?: (result: VoiceCommandResult) => void;
  className?: string;
}> = ({ onCommand, className = '' }) => {
  const [isListening, setIsListening] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    voiceCommandService.setOnCommand((result) => {
      setLastAction(result.action);
      onCommand?.(result);
      
      // Clear action after 3 seconds
      setTimeout(() => setLastAction(null), 3000);
    });

    voiceCommandService.setOnListeningChange((listening) => {
      setIsListening(listening);
    });

    return () => {
      voiceCommandService.stopListening();
    };
  }, [onCommand]);

  const toggleListening = () => {
    if (isListening) {
      voiceCommandService.stopListening();
    } else {
      voiceCommandService.startListening();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={toggleListening}
        size="sm"
        variant={isListening ? "default" : "outline"}
        className={`h-10 w-10 rounded-full p-0 ${
          isListening ? 'bg-red-500 hover:bg-red-600' : ''
        }`}
      >
        {isListening ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>
      
      <AnimatePresence>
        {lastAction && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="text-xs text-gray-600"
          >
            {lastAction.replace('_', ' ')}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
