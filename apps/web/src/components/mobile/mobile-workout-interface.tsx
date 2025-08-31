'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Volume2, VolumeX, Timer, Target } from 'lucide-react';
import { Button } from '@mobii/ui';

interface Exercise {
  name: string;
  duration: number;
  sets: number;
  reps: string;
  instructions: string[];
  targetMuscles: string[];
}

interface MobileWorkoutInterfaceProps {
  exercises: Exercise[];
  onComplete?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  className?: string;
}

export const MobileWorkoutInterface: React.FC<MobileWorkoutInterfaceProps> = ({
  exercises,
  onComplete,
  onPause,
  onResume,
  className = ''
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const currentExercise = exercises[currentExerciseIndex];

  useEffect(() => {
    if (currentExercise) {
      setTimeRemaining(currentExercise.duration);
    }
  }, [currentExercise]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Exercise completed
            if (currentSet < currentExercise.sets) {
              setCurrentSet(prev => prev + 1);
              return currentExercise.duration;
            } else {
              // All sets completed, move to next exercise
              if (currentExerciseIndex < exercises.length - 1) {
                setCurrentExerciseIndex(prev => prev + 1);
                setCurrentSet(1);
                return exercises[currentExerciseIndex + 1].duration;
              } else {
                // Workout completed
                setIsActive(false);
                onComplete?.();
                return 0;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, isPaused, timeRemaining, currentExercise, currentSet, currentExerciseIndex, exercises, onComplete]);

  const startWorkout = () => {
    setIsActive(true);
    setShowInstructions(false);
  };

  const pauseWorkout = () => {
    setIsPaused(true);
    onPause?.();
  };

  const resumeWorkout = () => {
    setIsPaused(false);
    onResume?.();
  };

  const skipExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setTimeRemaining(exercises[currentExerciseIndex + 1].duration);
    }
  };

  const resetWorkout = () => {
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setTimeRemaining(exercises[0].duration);
    setIsActive(false);
    setIsPaused(false);
    setShowInstructions(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentExerciseIndex * 100) / exercises.length) + 
    ((currentSet - 1) * 100 / exercises.length / currentExercise.sets);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Bar */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-500">
            {currentExerciseIndex + 1} of {exercises.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current Exercise */}
      {currentExercise && (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentExercise.name}
            </h2>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span>Set {currentSet} of {currentExercise.sets}</span>
              <span>•</span>
              <span>{currentExercise.reps}</span>
            </div>
          </div>

          {/* Timer */}
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-500">
              {isPaused ? 'PAUSED' : isActive ? 'WORKING' : 'READY'}
            </div>
          </div>

          {/* Target Muscles */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Target className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {currentExercise.targetMuscles.join(', ')}
            </span>
          </div>

          {/* Instructions */}
          {showInstructions && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {currentExercise.instructions.map((instruction, index) => (
                  <li key={index}>• {instruction}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center space-x-4 mb-4">
          {!isActive ? (
            <Button
              onClick={startWorkout}
              className="flex items-center space-x-2 px-8 py-3 bg-green-500 text-white rounded-full"
            >
              <Play className="w-5 h-5" />
              <span>Start Workout</span>
            </Button>
          ) : (
            <>
              <Button
                onClick={isPaused ? resumeWorkout : pauseWorkout}
                className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center"
              >
                {isPaused ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
              </Button>
              
              <Button
                onClick={skipExercise}
                variant="outline"
                className="w-12 h-12 rounded-full"
              >
                <SkipForward className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={resetWorkout}
                variant="outline"
                className="w-12 h-12 rounded-full"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={() => setIsMuted(!isMuted)}
            variant="outline"
            className="w-10 h-10 rounded-full"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          
          <Button
            onClick={() => setShowInstructions(!showInstructions)}
            variant="outline"
            className="px-4 py-2 rounded-full"
          >
            {showInstructions ? 'Hide' : 'Show'} Instructions
          </Button>
        </div>
      </div>

      {/* Next Exercise Preview */}
      {currentExerciseIndex < exercises.length - 1 && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">Next: {exercises[currentExerciseIndex + 1].name}</h3>
          <p className="text-sm text-gray-600">
            {exercises[currentExerciseIndex + 1].sets} sets • {exercises[currentExerciseIndex + 1].reps}
          </p>
        </div>
      )}

      {/* Mobile Tips */}
      <div className="bg-yellow-50 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">💡 Mobile Tips:</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• Keep your phone nearby for easy access</li>
          <li>• Use the pause button if you need a break</li>
          <li>• Follow the timer for optimal workout pacing</li>
          <li>• Check instructions if you're unsure about form</li>
        </ul>
      </div>
    </div>
  );
};
