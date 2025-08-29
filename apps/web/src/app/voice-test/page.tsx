'use client';

import React, { useState } from 'react';
import { VoiceCoaching } from '../../features/voice-coaching/components/voice-coaching';
import { VoiceCoachingService } from '../../features/voice-coaching/services/voice-coaching-service';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@mobii/ui';
import { Mic, MicOff, Play, Pause, Volume2, Settings } from 'lucide-react';

export default function VoiceTestPage() {
  const [voiceService] = useState(() => new VoiceCoachingService());
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  // Test data
  const testExercise = {
    name: 'Seated Deep Breathing',
    instructions: [
      'Sit tall in your chair with feet flat on the floor',
      'Place your hands on your belly',
      'Inhale deeply through your nose, feeling your belly expand',
      'Exhale slowly through your mouth',
      'Repeat 5-10 times'
    ]
  };

  const testWorkout = {
    title: 'Morning Chair Yoga Flow',
    exercises: [
      { name: 'Seated Deep Breathing', description: 'Gentle breathing exercise to start your day' },
      { name: 'Seated Neck Stretches', description: 'Release tension in your neck and shoulders' },
      { name: 'Seated Arm Circles', description: 'Improve shoulder mobility and circulation' }
    ]
  };

  React.useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const isConnected = await voiceService.testConnection();
      setApiStatus(isConnected ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('API status check failed:', error);
      setApiStatus('disconnected');
    }
  };

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Voice Coaching Test
          </h1>
          <p className="text-text-muted">
            Test the AI voice coaching features for your fitness app
          </p>
        </div>

        {/* API Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {apiStatus === 'connected' ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Connected to Eleven Labs</span>
                </>
              ) : apiStatus === 'disconnected' ? (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">Disconnected</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-yellow-600 font-medium">Checking connection...</span>
                </>
              )}
            </div>
            
            {apiStatus === 'disconnected' && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  To enable voice coaching, add your Eleven Labs API key to .env.local:
                </p>
                                 <code className="block p-2 bg-gray-200 rounded text-xs">
                   NEXT_PUBLIC_ELEVEN_LABS_API_KEY=your_elevenlabs_key_here
                 </code>
                <p className="text-xs text-gray-500 mt-2">
                  Get your free API key at <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">elevenlabs.io</a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voice Coaching Component */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Voice Coaching Interface</CardTitle>
          </CardHeader>
          <CardContent>
            <VoiceCoaching
              exerciseName={testExercise.name}
              instructions={testExercise.instructions}
              workoutTitle={testWorkout.title}
              exercises={testWorkout.exercises}
            />
          </CardContent>
        </Card>

        {/* Test Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exercise Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Exercise Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-text-primary mb-2">{testExercise.name}</h4>
                  <ol className="text-sm text-text-muted space-y-1">
                    {testExercise.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-teal-400 font-bold">{index + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="text-xs text-gray-500">
                  <p>🎤 Voice coaching will automatically narrate these instructions</p>
                  <p>🎯 Choose different voice types for different coaching styles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Voice Types */}
          <Card>
            <CardHeader>
              <CardTitle>Voice Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                  <span className="text-sm font-medium">Professional</span>
                  <span className="text-xs text-gray-500">Clear, instructional</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm font-medium">Motivational</span>
                  <span className="text-xs text-gray-500">Energetic, encouraging</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                  <span className="text-sm font-medium">Calm</span>
                  <span className="text-xs text-gray-500">Soothing, relaxing</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <span className="text-sm font-medium">Friendly</span>
                  <span className="text-xs text-gray-500">Warm, approachable</span>
                </div>
                
                <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="text-sm font-medium">Energetic</span>
                  <span className="text-xs text-gray-500">Dynamic, high-energy</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Voice Coaching Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-medium">Exercise Instructions</span>
                </div>
                <p className="text-xs text-gray-600 ml-6">
                  AI-generated voice guidance for each exercise step
                </p>
                
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium">Motivational Coaching</span>
                </div>
                <p className="text-xs text-gray-600 ml-6">
                  Encouraging messages to keep you motivated
                </p>
                
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Timing Cues</span>
                </div>
                <p className="text-xs text-gray-600 ml-6">
                  Voice countdowns and timing guidance
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Form Feedback</span>
                </div>
                <p className="text-xs text-gray-600 ml-6">
                  Real-time form correction and tips
                </p>
                
                <div className="flex items-center gap-2">
                  <Pause className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Workout Narration</span>
                </div>
                <p className="text-xs text-gray-600 ml-6">
                  Complete workout overview and guidance
                </p>
                
                <div className="flex items-center gap-2">
                  <MicOff className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Voice Control</span>
                </div>
                <p className="text-xs text-gray-600 ml-6">
                  Enable/disable voice coaching anytime
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
