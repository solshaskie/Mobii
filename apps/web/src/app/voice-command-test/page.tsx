'use client';

import React, { useState } from 'react';
import { VoiceCommand } from '../../components/ui/voice-command';
import { VoiceCommandResult } from '../../services/voice-command-service';
import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from '@mobii/ui';
import { Mic, Volume2, Play, Pause, SkipForward, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VoiceCommandTestPage() {
  const [lastCommand, setLastCommand] = useState<VoiceCommandResult | null>(null);
  const [commandHistory, setCommandHistory] = useState<VoiceCommandResult[]>([]);
  const [workoutStatus, setWorkoutStatus] = useState<'idle' | 'paused' | 'active'>('idle');
  const [voiceType, setVoiceType] = useState<'motivational' | 'calm' | 'professional'>('motivational');
  const [musicGenre, setMusicGenre] = useState<'motivational' | 'calm' | 'energetic'>('motivational');

  const handleCommand = (result: VoiceCommandResult) => {
    setLastCommand(result);
    setCommandHistory(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 commands

    // Handle different command actions
    switch (result.action) {
      case 'pause_workout':
        setWorkoutStatus('paused');
        break;
      case 'resume_workout':
        setWorkoutStatus('active');
        break;
      case 'stop_workout':
        setWorkoutStatus('idle');
        break;
      case 'set_voice_motivational':
        setVoiceType('motivational');
        break;
      case 'set_voice_calm':
        setVoiceType('calm');
        break;
      case 'set_voice_professional':
        setVoiceType('professional');
        break;
      case 'set_music_motivational':
        setMusicGenre('motivational');
        break;
      case 'set_music_calm':
        setMusicGenre('calm');
        break;
      case 'set_music_energetic':
        setMusicGenre('energetic');
        break;
      default:
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getVoiceTypeColor = (type: string) => {
    switch (type) {
      case 'motivational': return 'bg-orange-500';
      case 'calm': return 'bg-blue-500';
      case 'professional': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getMusicGenreColor = (genre: string) => {
    switch (genre) {
      case 'motivational': return 'bg-red-500';
      case 'calm': return 'bg-teal-500';
      case 'energetic': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎤 Voice Command Test
          </h1>
          <p className="text-gray-600">
            Test the free Web Speech API voice commands for your fitness app
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Voice Command Component */}
          <div>
            <VoiceCommand 
              onCommand={handleCommand}
              showCommands={true}
              autoStart={false}
            />
          </div>

          {/* Status Dashboard */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-green-500" />
                  Workout Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <Badge className={`${getStatusColor(workoutStatus)} text-white`}>
                      {workoutStatus.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Voice Coach:</span>
                    <Badge className={`${getVoiceTypeColor(voiceType)} text-white`}>
                      {voiceType}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Music:</span>
                    <Badge className={`${getMusicGenreColor(musicGenre)} text-white`}>
                      {musicGenre}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Test Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-teal-500" />
                  Quick Test Commands
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCommand({
                      command: 'pause',
                      action: 'pause_workout',
                      confidence: 0.9,
                      response: 'Workout paused. Say "resume" to continue.'
                    })}
                  >
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCommand({
                      command: 'resume',
                      action: 'resume_workout',
                      confidence: 0.9,
                      response: 'Resuming workout. Let\'s keep going!'
                    })}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Resume
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCommand({
                      command: 'change voice',
                      action: 'change_voice_coach',
                      confidence: 0.9,
                      response: 'Changing voice coach. What style would you prefer?'
                    })}
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Change Voice
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCommand({
                      command: 'change music',
                      action: 'change_music',
                      confidence: 0.9,
                      response: 'Changing the music. What genre would you like?'
                    })}
                  >
                    <SkipForward className="h-4 w-4 mr-1" />
                    Change Music
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Command History */}
        {commandHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Command History</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCommandHistory([])}
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {commandHistory.map((cmd, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        "{cmd.command}"
                      </div>
                      <div className="text-sm text-gray-500">
                        Action: {cmd.action.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {(cmd.confidence * 100).toFixed(0)}%
                      </Badge>
                      <span className="text-xs text-gray-400">
                        #{commandHistory.length - index}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test Voice Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="font-medium">1.</span>
                <span>Click the microphone button to start voice recognition</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">2.</span>
                <span>Try saying commands like: "pause", "resume", "change voice", "how much longer"</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">3.</span>
                <span>Watch the status dashboard update in real-time</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-medium">4.</span>
                <span>Click the help button (?) to see all available commands</span>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <strong>💡 Tip:</strong> Speak clearly and in a normal volume. The Web Speech API works best in Chrome and Edge browsers.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
