'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Progress, Badge } from '@mobii/ui';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw,
  Heart,
  Zap,
  Target,
  User,
  Clock,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceCoachingService } from '../services/voice-coaching-service';
import { VoiceCommandService, VoiceCommandResult } from '../services/voice-command-service';
import { VoiceSelector } from './voice-selector';

interface RealTimeVoiceCoachProps {
  exerciseName?: string;
  exerciseInstructions?: string[];
  onVoiceCommand?: (command: VoiceCommandResult) => void;
  onVoiceChange?: (voiceType: string) => void;
  className?: string;
  isActive?: boolean;
}

export const RealTimeVoiceCoach: React.FC<RealTimeVoiceCoachProps> = ({
  exerciseName = 'Current Exercise',
  exerciseInstructions = [],
  onVoiceCommand,
  onVoiceChange,
  className = '',
  isActive = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [currentVoiceType, setCurrentVoiceType] = useState<'motivational' | 'calm' | 'professional' | 'friendly' | 'energetic'>('motivational');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState<VoiceCommandResult | null>(null);
  const [coachingMode, setCoachingMode] = useState<'automatic' | 'manual' | 'minimal'>('automatic');
  const [coachingIntensity, setCoachingIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedVoiceId, setSelectedVoiceId] = useState('rachel_motivational');
  const [sessionStats, setSessionStats] = useState({
    totalCommands: 0,
    totalFeedback: 0,
    sessionDuration: 0,
    voiceChanges: 0
  });

  const voiceService = useRef(new VoiceCoachingService());
  const commandService = useRef(new VoiceCommandService());
  const sessionStartTime = useRef<number>(Date.now());
  const feedbackInterval = useRef<NodeJS.Timeout | null>(null);
  const statsInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize voice command service
  useEffect(() => {
    const service = commandService.current;
    
    service.setOnCommand((result) => {
      console.log('Voice command received:', result);
      setLastCommand(result);
      onVoiceCommand?.(result);
      
      // Handle specific commands
      handleVoiceCommand(result);
    });

    service.setOnListeningChange((listening) => {
      setIsListening(listening);
    });

    return () => {
      service.stopListening();
    };
  }, [onVoiceCommand]);

  // Start automatic coaching when active
  useEffect(() => {
    if (isActive && coachingMode === 'automatic') {
      startAutomaticCoaching();
    } else {
      stopAutomaticCoaching();
    }

    return () => {
      stopAutomaticCoaching();
    };
  }, [isActive, coachingMode, coachingIntensity]);

  // Update session stats
  useEffect(() => {
    statsInterval.current = setInterval(() => {
      setSessionStats(prev => ({
        ...prev,
        sessionDuration: Math.floor((Date.now() - sessionStartTime.current) / 1000)
      }));
    }, 1000);

    return () => {
      if (statsInterval.current) {
        clearInterval(statsInterval.current);
      }
    };
  }, []);

  // Handle voice commands
  const handleVoiceCommand = useCallback(async (result: VoiceCommandResult) => {
    setSessionStats(prev => ({ ...prev, totalCommands: prev.totalCommands + 1 }));

    switch (result.action) {
      case 'pause_workout':
        await speakFeedback('Workout paused. Take a moment to breathe.');
        break;
      case 'resume_workout':
        await speakFeedback('Resuming workout. Let\'s get back to it!');
        break;
      case 'stop_workout':
        await speakFeedback('Workout completed. Great job today!');
        break;
      case 'set_voice_motivational':
        setCurrentVoiceType('motivational');
        onVoiceChange?.('motivational');
        await speakFeedback('Switching to motivational voice coach!');
        break;
      case 'set_voice_calm':
        setCurrentVoiceType('calm');
        onVoiceChange?.('calm');
        await speakFeedback('Switching to calm voice coach.');
        break;
      case 'set_voice_professional':
        setCurrentVoiceType('professional');
        onVoiceChange?.('professional');
        await speakFeedback('Switching to professional voice coach.');
        break;
      case 'check_form':
        await speakFeedback('Let me check your form. Hold that position and I\'ll give you feedback.');
        break;
      case 'get_form_help':
        await speakFeedback('I\'ll guide you through this exercise step by step. Follow my instructions.');
        break;
      default:
        if (result.response) {
          await speakFeedback(result.response);
        }
    }
  }, [onVoiceChange]);

  // Start automatic coaching
  const startAutomaticCoaching = () => {
    if (feedbackInterval.current) {
      clearInterval(feedbackInterval.current);
    }

    const interval = coachingIntensity === 'high' ? 15000 : coachingIntensity === 'medium' ? 30000 : 60000;
    
    feedbackInterval.current = setInterval(async () => {
      if (isActive && !isSpeaking) {
        await provideAutomaticFeedback();
      }
    }, interval);
  };

  // Stop automatic coaching
  const stopAutomaticCoaching = () => {
    if (feedbackInterval.current) {
      clearInterval(feedbackInterval.current);
      feedbackInterval.current = null;
    }
  };

  // Provide automatic feedback
  const provideAutomaticFeedback = async () => {
    const feedbacks = [
      'You\'re doing great! Keep up the excellent form.',
      'Remember to breathe deeply and stay focused.',
      'Your dedication is inspiring. Keep pushing forward!',
      'Every rep is making you stronger. You\'ve got this!',
      'Perfect form! You\'re building strength and confidence.',
      'Stay hydrated and listen to your body.',
      'You\'re making incredible progress. Keep going!',
      'Focus on quality over quantity. You\'re doing amazing!'
    ];

    const randomFeedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
    await speakFeedback(randomFeedback);
    setSessionStats(prev => ({ ...prev, totalFeedback: prev.totalFeedback + 1 }));
  };

  // Speak feedback using voice service
  const speakFeedback = async (text: string) => {
    if (!isVoiceEnabled || isSpeaking) return;

    setIsSpeaking(true);
    try {
      const audioUrl = await voiceService.current.generateMotivationalMessage('encouragement', currentVoiceType);
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        await audio.play();
      } else {
        // Fallback to browser speech synthesis
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.onend = () => setIsSpeaking(false);
          utterance.onerror = () => setIsSpeaking(false);
          speechSynthesis.speak(utterance);
        } else {
          setIsSpeaking(false);
        }
      }
    } catch (error) {
      console.error('Failed to speak feedback:', error);
      setIsSpeaking(false);
    }
  };

  // Toggle voice listening
  const toggleVoiceListening = () => {
    if (isListening) {
      commandService.current.stopListening();
    } else {
      commandService.current.startListening();
    }
  };

  // Toggle voice coaching
  const toggleVoiceCoaching = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (isVoiceEnabled) {
      // Stop any ongoing speech
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    }
  };

  // Handle voice selection from voice selector
  const handleVoiceSelection = async (voiceId: string) => {
    setSelectedVoiceId(voiceId);
    setSessionStats(prev => ({ ...prev, voiceChanges: prev.voiceChanges + 1 }));
    
    // Map voice ID to category for backward compatibility
    const voiceCategoryMap: Record<string, typeof currentVoiceType> = {
      'rachel_motivational': 'motivational',
      'mike_energetic': 'motivational',
      'sarah_cheerleader': 'motivational',
      'zen_master': 'calm',
      'serena_calm': 'calm',
      'dr_alex': 'professional',
      'coach_maria': 'professional',
      'buddy_chris': 'friendly',
      'friend_lisa': 'friendly',
      'fire_ignite': 'energetic',
      'lightning_bolt': 'energetic'
    };
    
    const newVoiceType = voiceCategoryMap[voiceId] || 'motivational';
    setCurrentVoiceType(newVoiceType);
    onVoiceChange?.(newVoiceType);
    
    const voiceNames: Record<string, string> = {
      'rachel_motivational': 'Rachel',
      'mike_energetic': 'Mike',
      'sarah_cheerleader': 'Sarah',
      'zen_master': 'Zen Master',
      'serena_calm': 'Serena',
      'dr_alex': 'Dr. Alex',
      'coach_maria': 'Coach Maria',
      'buddy_chris': 'Buddy Chris',
      'friend_lisa': 'Friend Lisa',
      'fire_ignite': 'Fire Ignite',
      'lightning_bolt': 'Lightning Bolt'
    };
    
    const voiceName = voiceNames[voiceId] || 'Voice Coach';
    await speakFeedback(`Switched to ${voiceName}.`);
  };

  // Provide exercise instructions
  const provideExerciseInstructions = async () => {
    if (exerciseInstructions.length > 0) {
      const instructionText = `For ${exerciseName}: ${exerciseInstructions.join('. ')}. Let's get started!`;
      await speakFeedback(instructionText);
    }
  };

  // Get coaching mode description
  const getCoachingModeDescription = () => {
    switch (coachingMode) {
      case 'automatic':
        return 'Provides regular encouragement and feedback automatically';
      case 'manual':
        return 'Only responds to voice commands and manual triggers';
      case 'minimal':
        return 'Minimal voice interaction, mostly for essential feedback';
      default:
        return '';
    }
  };

  // Get intensity description
  const getIntensityDescription = () => {
    switch (coachingIntensity) {
      case 'high':
        return 'Frequent encouragement and feedback';
      case 'medium':
        return 'Balanced coaching with regular check-ins';
      case 'low':
        return 'Minimal coaching with occasional encouragement';
      default:
        return '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Voice Coach Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-blue-500" />
            Real-Time Voice Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Main Controls */}
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleVoiceListening}
                variant={isListening ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                {isListening ? 'Listening' : 'Start Listening'}
              </Button>

              <Button
                onClick={toggleVoiceCoaching}
                variant={isVoiceEnabled ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {isVoiceEnabled ? 'Voice On' : 'Voice Off'}
              </Button>

              <Button
                onClick={provideExerciseInstructions}
                variant="outline"
                className="flex items-center gap-2"
                disabled={!isVoiceEnabled || isSpeaking}
              >
                <Play className="h-4 w-4" />
                Instructions
              </Button>
            </div>

            {/* Voice Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Voice Coach Style:</label>
              <VoiceSelector
                selectedVoice={selectedVoiceId}
                onVoiceChange={handleVoiceSelection}
                className="w-full"
              />
            </div>

            {/* Coaching Mode Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Coaching Mode:</label>
              <div className="flex flex-wrap gap-2">
                {(['automatic', 'manual', 'minimal'] as const).map((mode) => (
                  <Button
                    key={mode}
                    onClick={() => setCoachingMode(mode)}
                    variant={coachingMode === mode ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {coachingMode === mode && <Target className="h-3 w-3" />}
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-gray-500">{getCoachingModeDescription()}</p>
            </div>

            {/* Coaching Intensity */}
            {coachingMode === 'automatic' && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Coaching Intensity:</label>
                <div className="flex flex-wrap gap-2">
                  {(['low', 'medium', 'high'] as const).map((intensity) => (
                    <Button
                      key={intensity}
                      onClick={() => setCoachingIntensity(intensity)}
                      variant={coachingIntensity === intensity ? "default" : "outline"}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      {coachingIntensity === intensity && <Zap className="h-3 w-3" />}
                      {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">{getIntensityDescription()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Voice Coach Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm font-medium">
                  {isListening ? 'Listening' : 'Idle'}
                </span>
              </div>
              <div className="text-xs text-gray-500">Voice Recognition</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">
                  {isSpeaking ? 'Speaking' : 'Quiet'}
                </span>
              </div>
              <div className="text-xs text-gray-500">Voice Output</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-blue-600 mb-1">
                {sessionStats.totalCommands}
              </div>
              <div className="text-xs text-gray-500">Commands</div>
            </div>

            <div className="text-center">
              <div className="text-lg font-bold text-green-600 mb-1">
                {sessionStats.totalFeedback}
              </div>
              <div className="text-xs text-gray-500">Feedback</div>
            </div>
          </div>

          {/* Session Duration */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Session Duration:</span>
              <span className="text-sm font-medium">
                {Math.floor(sessionStats.sessionDuration / 60)}:{(sessionStats.sessionDuration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Command Display */}
      <AnimatePresence>
        {lastCommand && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-purple-500" />
                  Last Voice Command
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Command:</span>
                    <span className="ml-2 text-sm text-gray-600">"{lastCommand.command}"</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Action:</span>
                    <span className="ml-2 text-sm text-gray-600">{lastCommand.action}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Confidence:</span>
                    <span className="ml-2 text-sm text-gray-600">{Math.round(lastCommand.confidence * 100)}%</span>
                  </div>
                  {lastCommand.response && (
                    <div>
                      <span className="text-sm font-medium text-gray-700">Response:</span>
                      <span className="ml-2 text-sm text-gray-600">"{lastCommand.response}"</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Available Commands */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-500" />
            Available Voice Commands
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Workout Control</h4>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">• "Pause" or "Stop" - Pause workout</div>
                <div className="text-sm text-gray-600">• "Resume" or "Continue" - Resume workout</div>
                <div className="text-sm text-gray-600">• "End workout" - Stop workout</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Voice Coach</h4>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">• "Motivational voice" - Switch to motivational</div>
                <div className="text-sm text-gray-600">• "Calm voice" - Switch to calm</div>
                <div className="text-sm text-gray-600">• "Professional voice" - Switch to professional</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Form Help</h4>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">• "Check my form" - Get form feedback</div>
                <div className="text-sm text-gray-600">• "Help me" - Get exercise guidance</div>
                <div className="text-sm text-gray-600">• "Am I doing this right?" - Form check</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">General</h4>
              <div className="space-y-1">
                <div className="text-sm text-gray-600">• "How much longer?" - Time remaining</div>
                <div className="text-sm text-gray-600">• "What's next?" - Next exercise</div>
                <div className="text-sm text-gray-600">• "I need a break" - Request rest</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
