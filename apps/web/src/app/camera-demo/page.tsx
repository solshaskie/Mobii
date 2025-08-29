'use client';

import React, { useState } from 'react';
import { CameraWorkoutPlayer } from '../../components/ui/camera-workout-player';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@mobii/ui';
import { Camera, Video, Brain, Target, Volume2 } from 'lucide-react';

export default function CameraDemoPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [totalReps, setTotalReps] = useState(0);
  const [feedbackHistory, setFeedbackHistory] = useState<string[]>([]);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const demoExercises = [
    {
      name: 'Seated Deep Breathing',
      instructions: [
        'Sit tall in your chair with feet flat on the floor',
        'Place your hands on your belly',
        'Inhale deeply through your nose, feeling your belly expand',
        'Exhale slowly through your mouth',
        'Repeat 5-10 times'
      ]
    },
    {
      name: 'Seated Arm Circles',
      instructions: [
        'Sit with your back straight',
        'Extend your arms out to the sides',
        'Make small circles with your arms',
        'Keep your shoulders relaxed',
        'Do 10 circles forward, then 10 backward'
      ]
    },
    {
      name: 'Chair Squats',
      instructions: [
        'Stand in front of your chair',
        'Lower yourself as if sitting down',
        'Just before touching the chair, stand back up',
        'Keep your back straight throughout',
        'Do 10-15 repetitions'
      ]
    }
  ];

  const handleFormFeedback = (feedback: string) => {
    setFeedbackHistory(prev => [feedback, ...prev.slice(0, 4)]);
  };

  const handleRepCount = (count: number) => {
    setTotalReps(count);
  };

  const handleComplete = () => {
    alert('Exercise completed! Great job!');
  };

  const nextExercise = () => {
    setCurrentExercise(prev => (prev + 1) % demoExercises.length);
    setTotalReps(0);
    setFeedbackHistory([]);
  };

  const prevExercise = () => {
    setCurrentExercise(prev => (prev - 1 + demoExercises.length) % demoExercises.length);
    setTotalReps(0);
    setFeedbackHistory([]);
  };

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            AI Camera Workout Demo
          </h1>
          <p className="text-text-muted">
            Experience real-time AI form analysis and coaching with your webcam
          </p>
        </div>

        {/* Features Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Camera AI Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Camera className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-800">Real-time Analysis</div>
                  <div className="text-sm text-blue-600">Live pose detection</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-semibold text-green-800">Rep Counting</div>
                  <div className="text-sm text-green-600">Automatic tracking</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <Brain className="h-6 w-6 text-purple-600" />
                <div>
                  <div className="font-semibold text-purple-800">Form Feedback</div>
                  <div className="text-sm text-purple-600">AI coaching</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <Volume2 className="h-6 w-6 text-orange-600" />
                <div>
                  <div className="font-semibold text-orange-800">Voice Coaching</div>
                  <div className="text-sm text-orange-600">Audio guidance</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercise Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Exercise: {demoExercises[currentExercise].name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Button onClick={prevExercise} variant="outline">
                Previous Exercise
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-gray-600">Exercise {currentExercise + 1} of {demoExercises.length}</div>
                <div className="text-lg font-semibold">{demoExercises[currentExercise].name}</div>
              </div>
              
              <Button onClick={nextExercise} variant="outline">
                Next Exercise
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Camera Workout Player */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <CameraWorkoutPlayer
              exerciseName={demoExercises[currentExercise].name}
              instructions={demoExercises[currentExercise].instructions}
              onFormFeedback={handleFormFeedback}
              onRepCount={handleRepCount}
              onComplete={handleComplete}
            />
          </div>

          {/* Stats and Feedback */}
          <div className="space-y-6">
            {/* Total Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Session Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">{totalReps}</div>
                    <div className="text-sm text-teal-600">Total Reps</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{feedbackHistory.length}</div>
                    <div className="text-sm text-blue-600">AI Feedback</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feedback History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent AI Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                {feedbackHistory.length > 0 ? (
                  <div className="space-y-2">
                    {feedbackHistory.map((feedback, index) => (
                      <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 text-sm">{feedback}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4 text-gray-500">
                    Start the camera to receive AI feedback
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>How to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li>1. Click "Start Camera" to enable your webcam</li>
                  <li>2. Position yourself so your full body is visible</li>
                  <li>3. Follow the exercise instructions</li>
                  <li>4. Watch for real-time AI feedback</li>
                  <li>5. The system will count your repetitions</li>
                  <li>6. Complete the exercise when finished</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Debug Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-xs max-h-40 overflow-y-auto">
              {debugInfo.length === 0 ? (
                <div className="text-gray-500">No debug info yet... Start camera to see logs</div>
              ) : (
                debugInfo.map((info, index) => (
                  <div key={index} className="mb-1">{info}</div>
                ))
              )}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Check browser console (F12) for additional debug information
            </div>
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Privacy Notice:</strong> This demo uses your webcam for real-time pose analysis. 
                Video data is processed locally in your browser and is not stored or transmitted to any server. 
                You can stop the camera at any time by clicking "Stop Camera".
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
