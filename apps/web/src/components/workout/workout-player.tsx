'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Settings,
  X,
  Check,
  Clock,
  Flame,
  Target,
  Info
} from 'lucide-react';
import { Button, Card } from '@mobii/ui';
import { Progress } from '@mobii/ui';
import { useTheme } from '../providers/theme-provider';
import { ExercisePlayer } from './exercise-player';
import { WorkoutControls } from './workout-controls';
import { WorkoutTimer } from './workout-timer';
import { WorkoutProgress } from './workout-progress';
import { WorkoutSettings } from './workout-settings';

interface Exercise {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  duration: number;
  calories: number;
  videoUrl?: string;
  imageUrl?: string;
  instructions: string[];
  equipmentRequired: string[];
  targetMuscles: string[];
  setupInstructions?: string;
  executionNotes?: string;
  safetyNotes?: string;
}

interface WorkoutExercise {
  id: string;
  exerciseId: string;
  order: number;
  duration: number;
  sets?: number;
  reps?: number;
  restTime?: number;
  customInstructions?: string;
  exercise: Exercise;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  type: string;
  difficulty: string;
  duration: number;
  calories: number;
  exercises: WorkoutExercise[];
}

interface WorkoutPlayerProps {
  workoutPlan: WorkoutPlan;
  onComplete: (sessionData: any) => void;
  onExit: () => void;
}

export function WorkoutPlayer({ workoutPlan, onComplete, onExit }: WorkoutPlayerProps) {
  const { themeColors } = useTheme();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [exerciseStartTime, setExerciseStartTime] = useState<Date | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [exerciseFeedback, setExerciseFeedback] = useState<Record<string, any>>({});

  const currentExercise = workoutPlan.exercises[currentExerciseIndex];
  const totalExercises = workoutPlan.exercises.length;
  const progress = (completedExercises.size / totalExercises) * 100;

  // Start session when component mounts
  useEffect(() => {
    setSessionStartTime(new Date());
    setExerciseStartTime(new Date());
  }, []);

  // Handle exercise completion
  const handleExerciseComplete = useCallback((exerciseId: string, feedback: any) => {
    setCompletedExercises(prev => new Set([...prev, exerciseId]));
    setExerciseFeedback(prev => ({ ...prev, [exerciseId]: feedback }));

    // Move to next exercise or complete workout
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setExerciseStartTime(new Date());
    } else {
      // Workout completed
      const sessionEndTime = new Date();
      const sessionDuration = sessionEndTime.getTime() - (sessionStartTime?.getTime() || 0);
      
      onComplete({
        workoutPlanId: workoutPlan.id,
        startTime: sessionStartTime,
        endTime: sessionEndTime,
        duration: Math.round(sessionDuration / (1000 * 60)), // minutes
        exercisesCompleted: completedExercises.size + 1,
        totalExercises,
        exerciseFeedback: { ...exerciseFeedback, [exerciseId]: feedback },
      });
    }
  }, [currentExerciseIndex, totalExercises, completedExercises, exerciseFeedback, sessionStartTime, workoutPlan.id, onComplete]);

  // Handle exercise skip
  const handleExerciseSkip = useCallback(() => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setExerciseStartTime(new Date());
    }
  }, [currentExerciseIndex, totalExercises]);

  // Handle exercise previous
  const handleExercisePrevious = useCallback(() => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setExerciseStartTime(new Date());
    }
  }, [currentExerciseIndex]);

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      setIsPaused(true);
    } else {
      setIsPaused(false);
    }
    setIsPlaying(!isPlaying);
  };

  // Calculate estimated calories burned
  const calculateCalories = () => {
    if (!sessionStartTime) return 0;
    const elapsedMinutes = (new Date().getTime() - sessionStartTime.getTime()) / (1000 * 60);
    return Math.round(elapsedMinutes * 5); // Rough estimate: 5 calories per minute
  };

  return (
    <div className="fixed inset-0 bg-background-primary z-50 overflow-hidden">
      {/* Header */}
      <motion.div 
        className="absolute top-0 left-0 right-0 z-10 bg-background-secondary/80 backdrop-blur-sm border-b border-border"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExit}
              className="text-text-secondary hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-text-primary">{workoutPlan.name}</h1>
              <p className="text-sm text-text-secondary">
                {currentExerciseIndex + 1} of {totalExercises} exercises
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Audio Controls */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="text-text-secondary hover:text-text-primary"
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            
            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-text-secondary hover:text-text-primary"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 pb-4">
          <Progress value={progress} className="h-2" />
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="pt-24 h-full flex flex-col">
        {/* Exercise Player */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentExercise?.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {currentExercise && (
                <ExercisePlayer
                  exercise={currentExercise}
                  onComplete={handleExerciseComplete}
                  onSkip={handleExerciseSkip}
                  isPlaying={isPlaying}
                  isPaused={isPaused}
                  audioEnabled={audioEnabled}
                  ttsEnabled={ttsEnabled}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Controls */}
        <motion.div 
          className="bg-background-secondary/80 backdrop-blur-sm border-t border-border p-4"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            {/* Workout Info */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-text-secondary">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  <WorkoutTimer startTime={sessionStartTime} isPaused={isPaused} />
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-text-secondary">
                <Flame className="h-4 w-4" />
                <span className="text-sm">{calculateCalories()} cal</span>
              </div>
              
              <div className="flex items-center gap-2 text-text-secondary">
                <Target className="h-4 w-4" />
                <span className="text-sm">{completedExercises.size}/{totalExercises}</span>
              </div>
            </div>

            {/* Play/Pause Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExercisePrevious}
                disabled={currentExerciseIndex === 0}
                className="text-text-secondary hover:text-text-primary disabled:opacity-50"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="lg"
                onClick={togglePlayPause}
                className="text-text-primary hover:text-accent"
              >
                {isPlaying && !isPaused ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExerciseSkip}
                disabled={currentExerciseIndex === totalExercises - 1}
                className="text-text-secondary hover:text-text-primary disabled:opacity-50"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <WorkoutSettings
            audioEnabled={audioEnabled}
            ttsEnabled={ttsEnabled}
            onAudioToggle={setAudioEnabled}
            onTtsToggle={setTtsEnabled}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
