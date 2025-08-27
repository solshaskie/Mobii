'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CameraWorkoutPlayer } from '../../components/workout/camera-workout-player';
import { Button, Card, Badge } from '@mobii/ui';
import { 
  Camera, 
  Target, 
  Activity, 
  MessageCircle, 
  Play,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const demoExercises = [
  {
    id: 'chair-yoga-stretch',
    name: 'Chair Yoga Stretch',
    description: 'Gentle stretching exercises for flexibility and relaxation',
    duration: 300, // 5 minutes
    targetMuscles: ['shoulders', 'arms', 'core'],
    difficulty: 'Beginner',
    category: 'Chair Yoga'
  },
  {
    id: 'seated-twist',
    name: 'Seated Twist',
    description: 'Spinal rotation exercises for core strength and mobility',
    duration: 240, // 4 minutes
    targetMuscles: ['core', 'back'],
    difficulty: 'Beginner',
    category: 'Chair Yoga'
  },
  {
    id: 'arm-circles',
    name: 'Arm Circles',
    description: 'Shoulder mobility and strength exercises',
    duration: 180, // 3 minutes
    targetMuscles: ['shoulders', 'arms'],
    difficulty: 'Beginner',
    category: 'Calisthenics'
  }
];

export default function CameraDemoPage() {
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  const handleExerciseComplete = (data: any) => {
    setSessionData(data);
    setSelectedExercise(null);
  };

  const handleExerciseSkip = () => {
    setSelectedExercise(null);
  };

  const handleExit = () => {
    setSelectedExercise(null);
  };

  if (selectedExercise) {
    return (
      <CameraWorkoutPlayer
        exercise={selectedExercise}
        onComplete={handleExerciseComplete}
        onSkip={handleExerciseSkip}
        onExit={handleExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Header */}
      <div className="bg-background-secondary border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Camera AI Demo</h1>
              <p className="text-text-muted">
                Experience real-time form correction and voice coaching
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Camera className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold">Real-time Pose Detection</h3>
            </div>
            <p className="text-text-muted">
              Advanced computer vision using MediaPipe to track your body position with 33 key landmarks
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Target className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold">Form Correction</h3>
            </div>
            <p className="text-text-muted">
              Instant feedback on your exercise form with verbal corrections and visual indicators
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <MessageCircle className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold">Voice Coaching</h3>
            </div>
            <p className="text-text-muted">
              AI-powered voice guidance with repetition counting and motivational phrases
            </p>
          </Card>
        </div>

        {/* Demo Exercises */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Try These Exercises</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoExercises.map((exercise) => (
              <Card key={exercise.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{exercise.name}</h3>
                    <p className="text-text-muted text-sm mb-3">{exercise.description}</p>
                  </div>
                  <Badge variant="outline">{exercise.category}</Badge>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Duration:</span>
                    <span className="font-medium">{Math.floor(exercise.duration / 60)}m {exercise.duration % 60}s</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Difficulty:</span>
                    <Badge variant="secondary" className="text-xs">
                      {exercise.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">Target Muscles:</span>
                    <div className="flex flex-wrap gap-1">
                      {exercise.targetMuscles.map((muscle) => (
                        <Badge key={muscle} variant="outline" className="text-xs">
                          {muscle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setSelectedExercise(exercise)}
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Exercise
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Session Results */}
        {sessionData && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Session Results</h2>
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500">
                    {Math.floor(sessionData.duration / 60)}m {sessionData.duration % 60}s
                  </div>
                  <div className="text-sm text-text-muted">Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500">
                    {sessionData.repetitions}
                  </div>
                  <div className="text-sm text-text-muted">Repetitions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500">
                    {sessionData.formQuality}%
                  </div>
                  <div className="text-sm text-text-muted">Form Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500">
                    {sessionData.corrections.length}
                  </div>
                  <div className="text-sm text-text-muted">Corrections</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Technical Details */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Technical Implementation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Computer Vision Stack</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Pose Detection:</span>
                  <span className="font-medium">MediaPipe Pose</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Landmarks:</span>
                  <span className="font-medium">33 Body Points</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Processing:</span>
                  <span className="font-medium">Real-time (30+ FPS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Accuracy:</span>
                  <span className="font-medium">95%+</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">AI Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Form Analysis:</span>
                  <span className="font-medium">Angle Calculation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Rep Counting:</span>
                  <span className="font-medium">Pattern Recognition</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Voice Feedback:</span>
                  <span className="font-medium">TTS Integration</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Correction Engine:</span>
                  <span className="font-medium">Severity-based</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Privacy Notice */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Activity className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Privacy & Security</h3>
              <p className="text-sm text-text-muted">
                All video processing happens locally in your browser. No video data is sent to our servers. 
                Your privacy is protected with end-to-end encryption and local processing only.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
