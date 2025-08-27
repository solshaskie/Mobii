'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Info,
  Target,
  Clock,
  Check,
  Star,
  Heart,
  X
} from 'lucide-react';
import { Button, Card } from '@mobii/ui';
import { Progress, Badge } from '@mobii/ui';
import { useTheme } from '../providers/theme-provider';

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

interface ExercisePlayerProps {
  exercise: WorkoutExercise;
  onComplete: (exerciseId: string, feedback: any) => void;
  onSkip: () => void;
  isPlaying: boolean;
  isPaused: boolean;
  audioEnabled: boolean;
  ttsEnabled: boolean;
}

export function ExercisePlayer({ 
  exercise, 
  onComplete, 
  onSkip, 
  isPlaying, 
  isPaused, 
  audioEnabled, 
  ttsEnabled 
}: ExercisePlayerProps) {
  const { themeColors } = useTheme();
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration);
  const [isActive, setIsActive] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [difficulty, setDifficulty] = useState<number>(5);
  const [enjoyment, setEnjoyment] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (isPlaying && !isPaused && timeRemaining > 0) {
      setIsActive(true);
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Exercise completed
            clearInterval(intervalRef.current!);
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setIsActive(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isPaused, timeRemaining]);

  // Reset timer when exercise changes
  useEffect(() => {
    setTimeRemaining(exercise.duration);
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [exercise.duration]);

  // Handle exercise completion
  const handleComplete = () => {
    const feedback = {
      duration: exercise.duration - timeRemaining,
      difficulty,
      enjoyment,
      notes,
      setsCompleted: exercise.sets || 0,
      repsCompleted: exercise.reps || 0,
    };
    onComplete(exercise.exerciseId, feedback);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress
  const progress = ((exercise.duration - timeRemaining) / exercise.duration) * 100;

  return (
    <div className="h-full flex flex-col">
      {/* Exercise Media */}
      <div className="flex-1 relative bg-background-tertiary">
        {exercise.exercise.videoUrl ? (
          <video
            src={exercise.exercise.videoUrl}
            className="w-full h-full object-cover"
            autoPlay={isActive}
            muted={!audioEnabled}
            loop
          />
        ) : exercise.exercise.imageUrl ? (
          <img
            src={exercise.exercise.imageUrl}
            alt={exercise.exercise.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Target className="h-16 w-16 mx-auto text-text-muted mb-4" />
              <p className="text-text-muted">No media available</p>
            </div>
          </div>
        )}

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-primary/80 via-transparent to-transparent">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  {exercise.exercise.category}
                </Badge>
                <Badge variant="outline">
                  {exercise.exercise.difficulty}
                </Badge>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInstructions(!showInstructions)}
                className="text-text-primary bg-background-secondary/80 hover:bg-background-secondary"
              >
                <Info className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Info */}
      <div className="bg-background-secondary p-6">
        <div className="space-y-4">
          {/* Exercise Name and Timer */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">{exercise.exercise.name}</h2>
              <p className="text-text-secondary text-sm">{exercise.exercise.description}</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-xs text-text-muted">remaining</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-text-muted">
              <span>{Math.round(progress)}% complete</span>
              <span>{exercise.duration}s total</span>
            </div>
          </div>

          {/* Exercise Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-text-secondary">
              <Target className="h-4 w-4" />
              <span>Target: {exercise.exercise.targetMuscles.join(', ')}</span>
            </div>
            
            {exercise.sets && exercise.reps && (
              <div className="flex items-center gap-2 text-text-secondary">
                <Clock className="h-4 w-4" />
                <span>{exercise.sets} sets × {exercise.reps} reps</span>
              </div>
            )}
          </div>

          {/* Custom Instructions */}
          {exercise.customInstructions && (
            <Card className="p-3 bg-accent/10 border-accent/20">
              <p className="text-sm text-accent font-medium">{exercise.customInstructions}</p>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onSkip}
              variant="outline"
              className="flex-1"
            >
              Skip Exercise
            </Button>
            
            <Button
              onClick={handleComplete}
              disabled={timeRemaining > 0}
              className="flex-1 bg-accent hover:bg-accent/90"
            >
              <Check className="h-4 w-4 mr-2" />
              Complete
            </Button>
          </div>
        </div>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background-primary/95 z-10 overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Exercise Instructions</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInstructions(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Setup Instructions */}
            {exercise.exercise.setupInstructions && (
              <div>
                <h4 className="font-medium text-text-primary mb-2">Setup</h4>
                <p className="text-text-secondary text-sm">{exercise.exercise.setupInstructions}</p>
              </div>
            )}

            {/* Step-by-step Instructions */}
            <div>
              <h4 className="font-medium text-text-primary mb-2">Instructions</h4>
              <ol className="space-y-2">
                {exercise.exercise.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3 text-text-secondary text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Execution Notes */}
            {exercise.exercise.executionNotes && (
              <div>
                <h4 className="font-medium text-text-primary mb-2">Execution Notes</h4>
                <p className="text-text-secondary text-sm">{exercise.exercise.executionNotes}</p>
              </div>
            )}

            {/* Safety Notes */}
            {exercise.exercise.safetyNotes && (
              <div>
                <h4 className="font-medium text-text-primary mb-2">Safety Notes</h4>
                <p className="text-text-secondary text-sm">{exercise.exercise.safetyNotes}</p>
              </div>
            )}

            {/* Equipment Required */}
            {exercise.exercise.equipmentRequired.length > 0 && (
              <div>
                <h4 className="font-medium text-text-primary mb-2">Equipment Required</h4>
                <div className="flex flex-wrap gap-2">
                  {exercise.exercise.equipmentRequired.map((equipment, index) => (
                    <Badge key={index} variant="outline">
                      {equipment}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
