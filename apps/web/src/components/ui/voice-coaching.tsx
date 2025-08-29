'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@mobii/ui';
import { VoiceCoachingService } from '../../services/voice-coaching-service';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Mic, 
  MicOff,
  Settings,
  RotateCcw
} from 'lucide-react';

interface VoiceCoachingProps {
  exerciseName?: string;
  instructions?: string[];
  workoutTitle?: string;
  exercises?: any[];
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  className?: string;
}

export function VoiceCoaching({
  exerciseName,
  instructions,
  workoutTitle,
  exercises,
  onVoiceStart,
  onVoiceEnd,
  className = ''
}: VoiceCoachingProps) {
  const [voiceService] = useState(() => new VoiceCoachingService());
  const [isEnabled, setIsEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [voiceType, setVoiceType] = useState<'motivational' | 'calm' | 'professional' | 'friendly' | 'energetic'>('professional');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check API status on mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }
    };
  }, [currentAudio]);

  const checkApiStatus = async () => {
    const isConnected = await voiceService.testConnection();
    setApiStatus(isConnected ? 'connected' : 'disconnected');
  };

  const playAudio = async (audioUrl: string) => {
    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      setCurrentAudio(audio);

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        onVoiceEnd?.();
      });

      audio.addEventListener('error', () => {
        setIsPlaying(false);
        console.error('Audio playback failed');
      });

      setIsPlaying(true);
      onVoiceStart?.();
      await audio.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      setIsPlaying(false);
      onVoiceEnd?.();
    }
  };

  const generateExerciseInstructions = async () => {
    if (!exerciseName || !instructions || !isEnabled) return;

    setIsLoading(true);
    try {
      const audioUrl = await voiceService.generateExerciseInstructions(
        exerciseName,
        instructions,
        voiceType
      );

      if (audioUrl) {
        await playAudio(audioUrl);
      }
    } catch (error) {
      console.error('Failed to generate exercise instructions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMotivationalMessage = async (type: 'start' | 'during' | 'finish' | 'encouragement') => {
    if (!isEnabled) return;

    setIsLoading(true);
    try {
      const audioUrl = await voiceService.generateMotivationalMessage(type, voiceType);

      if (audioUrl) {
        await playAudio(audioUrl);
      }
    } catch (error) {
      console.error('Failed to generate motivational message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateWorkoutNarration = async () => {
    if (!workoutTitle || !exercises || !isEnabled) return;

    setIsLoading(true);
    try {
      const audioUrl = await voiceService.generateWorkoutNarration(
        workoutTitle,
        exercises,
        voiceType
      );

      if (audioUrl) {
        await playAudio(audioUrl);
      }
    } catch (error) {
      console.error('Failed to generate workout narration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimingCue = async (cueType: 'start' | 'countdown' | 'hold' | 'release' | 'next', duration?: number) => {
    if (!isEnabled) return;

    setIsLoading(true);
    try {
      const audioUrl = await voiceService.generateTimingCues(cueType, duration);

      if (audioUrl) {
        await playAudio(audioUrl);
      }
    } catch (error) {
      console.error('Failed to generate timing cue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFormFeedback = async (feedback: string) => {
    if (!exerciseName || !isEnabled) return;

    setIsLoading(true);
    try {
      const audioUrl = await voiceService.generateFormFeedback(exerciseName, feedback, voiceType);

      if (audioUrl) {
        await playAudio(audioUrl);
      }
    } catch (error) {
      console.error('Failed to generate form feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-generate exercise instructions when exercise changes
  useEffect(() => {
    if (exerciseName && instructions && isEnabled && apiStatus === 'connected') {
      generateExerciseInstructions();
    }
  }, [exerciseName, instructions, isEnabled, apiStatus]);

  if (apiStatus === 'disconnected') {
    return (
      <div className={`p-4 bg-gray-100 rounded-lg text-center ${className}`}>
        <MicOff className="h-6 w-6 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">
          Voice coaching unavailable. Add Eleven Labs API key to enable.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Voice Controls */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-purple-50 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isEnabled ? (
              <Mic className="h-5 w-5 text-teal-600" />
            ) : (
              <MicOff className="h-5 w-5 text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-700">
              Voice Coach
            </span>
          </div>
          
          {apiStatus === 'connected' && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600">Connected</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Voice Type Selector */}
          <select
            value={voiceType}
            onChange={(e) => setVoiceType(e.target.value as any)}
            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
            disabled={isLoading}
          >
            <option value="professional">Professional</option>
            <option value="motivational">Motivational</option>
            <option value="calm">Calm</option>
            <option value="friendly">Friendly</option>
            <option value="energetic">Energetic</option>
          </select>

          {/* Toggle Voice */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEnabled(!isEnabled)}
            disabled={isLoading}
          >
            {isEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </Button>

          {/* Play/Pause Current Audio */}
          {isPlaying && (
            <Button
              variant="outline"
              size="sm"
              onClick={stopAudio}
            >
              <Pause className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {isEnabled && (
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateMotivationalMessage('encouragement')}
            disabled={isLoading}
            className="text-xs"
          >
            💪 Encouragement
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => generateTimingCue('countdown')}
            disabled={isLoading}
            className="text-xs"
          >
            ⏱️ Timing Cue
          </Button>
          
          {workoutTitle && exercises && (
            <Button
              variant="outline"
              size="sm"
              onClick={generateWorkoutNarration}
              disabled={isLoading}
              className="text-xs col-span-2"
            >
              🎯 Workout Overview
            </Button>
          )}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center justify-center p-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
          <span className="ml-2 text-sm text-gray-600">Generating voice...</span>
        </div>
      )}

      {/* Status */}
      {apiStatus === 'checking' && (
        <div className="text-center p-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mx-auto"></div>
          <span className="ml-2 text-sm text-gray-600">Checking voice service...</span>
        </div>
      )}
    </div>
  );
}

// Compact version for workout player
export function CompactVoiceCoaching({
  exerciseName,
  instructions,
  onVoiceStart,
  onVoiceEnd,
  className = ''
}: {
  exerciseName?: string;
  instructions?: string[];
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
  className?: string;
}) {
  const [voiceService] = useState(() => new VoiceCoachingService());
  const [isEnabled, setIsEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const playInstructions = async () => {
    if (!exerciseName || !instructions || !isEnabled) return;

    try {
      const audioUrl = await voiceService.generateExerciseInstructions(
        exerciseName,
        instructions,
        'professional'
      );

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        setCurrentAudio(audio);
        
        audio.addEventListener('ended', () => {
          setIsPlaying(false);
          onVoiceEnd?.();
        });

        setIsPlaying(true);
        onVoiceStart?.();
        await audio.play();
      }
    } catch (error) {
      console.error('Failed to play instructions:', error);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      setIsPlaying(false);
      onVoiceEnd?.();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={isPlaying ? stopAudio : playInstructions}
        disabled={!isEnabled}
        className="flex items-center gap-1"
      >
        {isPlaying ? (
          <>
            <Pause className="h-3 w-3" />
            Stop
          </>
        ) : (
          <>
            <Volume2 className="h-3 w-3" />
            Voice
          </>
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEnabled(!isEnabled)}
        className="p-1"
      >
        {isEnabled ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
      </Button>
    </div>
  );
}
