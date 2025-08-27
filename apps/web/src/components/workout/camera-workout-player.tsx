'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  CameraOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Settings,
  X,
  Check,
  AlertTriangle,
  Target,
  Activity,
  MessageCircle
} from 'lucide-react';
import { Button, Card, Progress, Badge, Switch } from '@mobii/ui';
import { useTheme } from '../providers/theme-provider';
import { 
  CameraAIService, 
  EXERCISE_CONFIGS, 
  FormCorrection, 
  RepetitionData 
} from '../../services/camera-ai-service';

interface CameraWorkoutPlayerProps {
  exercise: {
    id: string;
    name: string;
    description: string;
    duration: number;
    targetMuscles: string[];
  };
  onComplete: (data: any) => void;
  onSkip: () => void;
  onExit: () => void;
}

export function CameraWorkoutPlayer({ 
  exercise, 
  onComplete, 
  onSkip, 
  onExit 
}: CameraWorkoutPlayerProps) {
  const { themeColors } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraServiceRef = useRef<CameraAIService | null>(null);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentCorrection, setCurrentCorrection] = useState<FormCorrection | null>(null);
  const [repetitionData, setRepetitionData] = useState<RepetitionData | null>(null);
  const [formQuality, setFormQuality] = useState(100);
  const [timeRemaining, setTimeRemaining] = useState(exercise.duration);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize camera service
  useEffect(() => {
    const initializeCamera = async () => {
      try {
        if (!videoRef.current || !canvasRef.current) return;

        cameraServiceRef.current = new CameraAIService();
        await cameraServiceRef.current.initializeCamera(videoRef.current, canvasRef.current);
        
        // Set canvas size
        canvasRef.current.width = 640;
        canvasRef.current.height = 480;
        
        setIsCameraActive(true);
        setError(null);
      } catch (err) {
        console.error('Failed to initialize camera:', err);
        setError('Failed to access camera. Please check permissions.');
      }
    };

    initializeCamera();

    return () => {
      if (cameraServiceRef.current) {
        cameraServiceRef.current.stop();
      }
    };
  }, []);

  // Start exercise when camera is ready
  useEffect(() => {
    if (isCameraActive && cameraServiceRef.current) {
      const exerciseConfig = EXERCISE_CONFIGS[exercise.id] || {
        name: exercise.name,
        targetMuscles: exercise.targetMuscles,
        keyLandmarks: [11, 12, 13, 14, 23, 24],
        targetAngles: {
          'shoulders': 90,
          'arms': 180,
          'core': 90
        },
        tolerance: 15,
        repPattern: 'up-down' as const,
        phases: {
          setup: [0, 1, 2],
          execution: [3, 4, 5],
          return: [6, 7, 8],
          rest: [9, 10]
        }
      };

      cameraServiceRef.current.startExercise(exerciseConfig);
    }
  }, [isCameraActive, exercise]);

  // Timer effect
  useEffect(() => {
    if (isPaused || !isCameraActive) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isCameraActive]);

  // Update data from camera service
  useEffect(() => {
    if (!cameraServiceRef.current || !isCameraActive) return;

    const updateData = () => {
      const data = cameraServiceRef.current!.getCurrentData();
      setRepetitionData(data.repetitionData);
      setFormQuality(data.formQuality);
      
      if (data.corrections.length > 0) {
        setCurrentCorrection(data.corrections[data.corrections.length - 1]);
      }
    };

    const interval = setInterval(updateData, 100); // Update 10 times per second
    return () => clearInterval(interval);
  }, [isCameraActive]);

  const handleComplete = useCallback(() => {
    if (cameraServiceRef.current) {
      cameraServiceRef.current.stopExercise();
    }
    
    const sessionData = {
      exerciseId: exercise.id,
      duration: exercise.duration - timeRemaining,
      repetitions: repetitionData?.count || 0,
      formQuality,
      corrections: currentCorrection ? [currentCorrection] : [],
      completedAt: new Date().toISOString()
    };
    
    onComplete(sessionData);
  }, [exercise, timeRemaining, repetitionData, formQuality, currentCorrection, onComplete]);

  const handleSkip = () => {
    if (cameraServiceRef.current) {
      cameraServiceRef.current.stopExercise();
    }
    onSkip();
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getFormQualityColor = (quality: number) => {
    if (quality >= 80) return 'text-green-500';
    if (quality >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getFormQualityLabel = (quality: number) => {
    if (quality >= 90) return 'Excellent';
    if (quality >= 80) return 'Good';
    if (quality >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-background-primary z-50 flex items-center justify-center">
        <Card className="p-8 max-w-md mx-4">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Camera Access Required</h2>
            <p className="text-text-muted mb-6">{error}</p>
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={onExit}
                className="w-full"
              >
                Exit Workout
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background-primary z-50 flex flex-col">
      {/* Header */}
      <div className="bg-background-secondary/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExit}
              className="text-text-muted hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">{exercise.name}</h1>
              <p className="text-sm text-text-muted">{exercise.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={isCameraActive ? "default" : "secondary"}>
              <Camera className="h-3 w-3 mr-1" />
              {isCameraActive ? "Active" : "Inactive"}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Camera View */}
        <div className="flex-1 relative bg-background-tertiary">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 10 }}
          />
          
          {/* Overlay Information */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            {/* Timer */}
            <Card className="p-3 bg-background-primary/90 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold">{formatTime(timeRemaining)}</div>
                <div className="text-xs text-text-muted">Remaining</div>
              </div>
            </Card>

            {/* Form Quality */}
            <Card className="p-3 bg-background-primary/90 backdrop-blur-sm">
              <div className="text-center">
                <div className={`text-2xl font-bold ${getFormQualityColor(formQuality)}`}>
                  {formQuality}%
                </div>
                <div className="text-xs text-text-muted">
                  {getFormQualityLabel(formQuality)}
                </div>
              </div>
            </Card>

            {/* Repetition Counter */}
            {repetitionData && (
              <Card className="p-3 bg-background-primary/90 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold">{repetitionData.count}</div>
                  <div className="text-xs text-text-muted">Reps</div>
                </div>
              </Card>
            )}
          </div>

          {/* Current Correction */}
          <AnimatePresence>
            {currentCorrection && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute bottom-20 left-4 right-4"
              >
                <Card className={`p-4 border-l-4 ${
                  currentCorrection.severity === 'critical' ? 'border-red-500 bg-red-500/10' :
                  currentCorrection.severity === 'major' ? 'border-yellow-500 bg-yellow-500/10' :
                  'border-blue-500 bg-blue-500/10'
                }`}>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                      currentCorrection.severity === 'critical' ? 'text-red-500' :
                      currentCorrection.severity === 'major' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium mb-1">
                        {currentCorrection.bodyPart.charAt(0).toUpperCase() + currentCorrection.bodyPart.slice(1)}
                      </div>
                      <div className="text-sm text-text-muted">
                        {currentCorrection.correction}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-background-secondary border-l border-border overflow-hidden"
            >
              <div className="p-4 space-y-6">
                <h3 className="text-lg font-semibold">Workout Settings</h3>
                
                {/* Voice Controls */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {isVoiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      <span>Voice Coaching</span>
                    </div>
                    <Switch
                      checked={isVoiceEnabled}
                      onCheckedChange={toggleVoice}
                    />
                  </div>
                </div>

                {/* Exercise Info */}
                <div className="space-y-3">
                  <h4 className="font-medium">Exercise Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-text-muted">Target Muscles:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {exercise.targetMuscles.map(muscle => (
                          <Badge key={muscle} variant="outline" className="text-xs">
                            {muscle}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-text-muted">Duration:</span>
                      <div className="font-medium">{formatTime(exercise.duration)}</div>
                    </div>
                  </div>
                </div>

                {/* Form Quality Progress */}
                <div className="space-y-3">
                  <h4 className="font-medium">Form Quality</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current</span>
                      <span className={getFormQualityColor(formQuality)}>
                        {formQuality}%
                      </span>
                    </div>
                    <Progress value={formQuality} className="h-2" />
                    <div className="text-xs text-text-muted">
                      {getFormQualityLabel(formQuality)} form
                    </div>
                  </div>
                </div>

                {/* Repetition Data */}
                {repetitionData && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Repetitions</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Count:</span>
                        <span className="font-medium">{repetitionData.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Phase:</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {repetitionData.currentPhase}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <div className="bg-background-secondary/80 backdrop-blur-sm border-t border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant={isPaused ? "default" : "outline"}
              size="lg"
              onClick={togglePause}
            >
              {isPaused ? "Resume" : "Pause"}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={handleSkip}
            >
              Skip
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant={isVoiceEnabled ? "default" : "outline"}
              size="sm"
              onClick={toggleVoice}
            >
              {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="default"
              size="lg"
              onClick={handleComplete}
              className="bg-accent-primary hover:bg-accent-primary/90"
            >
              <Check className="h-4 w-4 mr-2" />
              Complete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
