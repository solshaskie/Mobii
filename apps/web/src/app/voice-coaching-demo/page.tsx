'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@mobii/ui';
import { Mic, Volume2, Settings, Play, Heart, Zap } from 'lucide-react';
import { RealTimeVoiceCoach, VoiceSelector } from '../../features/voice-coaching';

export default function VoiceCoachingDemoPage() {
  const [currentExercise, setCurrentExercise] = useState('Push-ups');
  const [exerciseInstructions] = useState([
    'Start in a plank position with your hands shoulder-width apart',
    'Lower your body until your chest nearly touches the floor',
    'Push back up to the starting position',
    'Keep your core engaged throughout the movement'
  ]);

  const handleVoiceCommand = (command: any) => {
    console.log('Voice command received:', command);
  };

  const handleVoiceChange = (voiceType: string) => {
    console.log('Voice changed to:', voiceType);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Voice Coaching Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of fitness coaching with AI-powered voice guidance, 
            real-time feedback, and personalized voice coaches.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-blue-500" />
                Voice Commands
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Control your workout with natural voice commands. Pause, resume, 
                change voice styles, and get form feedback hands-free.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-green-500" />
                Multiple Voices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Choose from 15+ voice coaches with different personalities, 
                styles, and specialties for every workout type.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Real-time Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get instant encouragement, form corrections, and motivational 
                messages throughout your workout session.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Voice Selector Demo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-500" />
              Voice Coach Selection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Browse and preview different voice coaches. Each voice has unique 
              characteristics and is optimized for specific workout types.
            </p>
            <VoiceSelector
              selectedVoice="rachel_motivational"
              onVoiceChange={(voiceId) => console.log('Selected voice:', voiceId)}
            />
          </CardContent>
        </Card>

        {/* Real-time Voice Coach Demo */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Real-Time Voice Coach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Current Exercise: {currentExercise}</h3>
              <p className="text-gray-600">
                Experience the full voice coaching system with automatic feedback, 
                voice commands, and real-time interaction.
              </p>
            </div>
            <RealTimeVoiceCoach
              exerciseName={currentExercise}
              exerciseInstructions={exerciseInstructions}
              onVoiceCommand={handleVoiceCommand}
              onVoiceChange={handleVoiceChange}
              isActive={true}
            />
          </CardContent>
        </Card>

        {/* Voice Categories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Voice Coach Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-blue-600 mb-2">Motivational</h4>
                <p className="text-sm text-gray-600 mb-2">Energetic and inspiring coaches</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Rachel - Energetic fitness coach</li>
                  <li>• Mike - Dynamic motivator</li>
                  <li>• Sarah - Cheerful cheerleader</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-green-600 mb-2">Calm</h4>
                <p className="text-sm text-gray-600 mb-2">Peaceful and mindful guides</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Zen Master - Meditation guide</li>
                  <li>• Serena - Gentle wellness coach</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-purple-600 mb-2">Professional</h4>
                <p className="text-sm text-gray-600 mb-2">Knowledgeable and precise experts</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Dr. Alex - Fitness expert</li>
                  <li>• Coach Maria - Structured trainer</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-orange-600 mb-2">Friendly</h4>
                <p className="text-sm text-gray-600 mb-2">Warm and supportive companions</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Buddy Chris - Workout partner</li>
                  <li>• Friend Lisa - Encouraging companion</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-red-600 mb-2">Energetic</h4>
                <p className="text-sm text-gray-600 mb-2">High-energy and intense motivators</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Fire Ignite - Burning passion</li>
                  <li>• Lightning Bolt - Electrifying motivator</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold text-indigo-600 mb-2">Creative</h4>
                <p className="text-sm text-gray-600 mb-2">Artistic and expressive guides</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Artist Flow - Creative movement</li>
                  <li>• Poet Words - Inspiring storyteller</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Voice Commands Guide */}
        <Card>
          <CardHeader>
            <CardTitle>Voice Commands Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Workout Control</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">"Pause" or "Stop"</span>
                    <span className="text-xs text-gray-500">Pause workout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">"Resume" or "Continue"</span>
                    <span className="text-xs text-gray-500">Resume workout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">"End workout"</span>
                    <span className="text-xs text-gray-500">Stop workout</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Form & Help</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">"Check my form"</span>
                    <span className="text-xs text-gray-500">Get form feedback</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">"Help me"</span>
                    <span className="text-xs text-gray-500">Get exercise guidance</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">"Am I doing this right?"</span>
                    <span className="text-xs text-gray-500">Form check</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
