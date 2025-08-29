'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Progress } from '@mobii/ui';
import { Camera, Video, VideoOff, RotateCcw, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { poseDetectionService, FormAnalysis } from '../services/pose-detection-service';
import { VoiceCoachingService } from '../../voice-coaching/services/voice-coaching-service';

interface CameraWorkoutPlayerProps {
  exerciseName: string;
  instructions: string[];
  onFormFeedback?: (feedback: string) => void;
  onRepCount?: (count: number) => void;
  onComplete?: () => void;
  className?: string;
}

export function CameraWorkoutPlayer({
  exerciseName,
  instructions,
  onFormFeedback,
  onRepCount,
  onComplete,
  className = ''
}: CameraWorkoutPlayerProps) {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [formFeedback, setFormFeedback] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [poseConfidence, setPoseConfidence] = useState(0);
  const [postureStatus, setPostureStatus] = useState<'good' | 'needs_improvement' | 'poor'>('good');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voiceType, setVoiceType] = useState<'motivational' | 'calm' | 'professional' | 'friendly' | 'energetic'>('motivational');
  const [isVoicePlaying, setIsVoicePlaying] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const voiceService = new VoiceCoachingService();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Start camera
  const startCamera = async () => {
    try {
      console.log('Starting camera request...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      console.log(`Camera stream obtained: ${stream.id}`);
      console.log(`Stream tracks: ${stream.getTracks().map(t => t.kind).join(', ')}`);
      
      if (videoRef.current) {
        console.log('Setting video srcObject...');
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        console.log('Setting isCameraOn to true...');
        setIsCameraOn(true);
        setIsAnalyzing(true);
        
        // Force video to play immediately
        try {
          console.log('Attempting to play video...');
          await videoRef.current.play();
          console.log('Video play() successful');
        } catch (playError) {
          console.error('Video play() failed:', playError);
        }
        
        // Wait for video to load before starting pose detection
        videoRef.current.onloadedmetadata = () => {
          console.log('Video loaded, starting pose detection');
          console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
          startPoseDetection();
          
          // Start voice coaching after a short delay
          setTimeout(() => {
            startVoiceCoaching();
          }, 2000);
        };
        
        // Add event listeners for debugging
        videoRef.current.oncanplay = () => {
          console.log('Video can play');
        };
        
        videoRef.current.onerror = (e) => {
          console.error('Video error:', e);
        };

        videoRef.current.onplay = () => {
          console.log('Video play event fired');
        };

        videoRef.current.onplaying = () => {
          console.log('Video playing event fired');
        };
      } else {
        console.error('ERROR: videoRef.current is null');
      }
    } catch (error) {
      console.error('Failed to start camera:', error);
      setFormFeedback('Camera access denied. Please enable camera permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    // Stop pose detection
    poseDetectionService.stopDetection();
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setIsAnalyzing(false);
    setPoseConfidence(0);
    setPostureStatus('good');
  };

  // Start real MediaPipe pose detection
  const startPoseDetection = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    try {
      console.log('Initializing MediaPipe pose detection...');
      
      // Set up pose detection results callback
      poseDetectionService.setOnResults((results, analysis) => {
        // Update UI with real analysis results
        setPoseConfidence(analysis.confidence);
        setPostureStatus(analysis.posture);
        
        if (analysis.feedback) {
          setFormFeedback(analysis.feedback);
          onFormFeedback?.(analysis.feedback);
          
          // Generate voice feedback if enabled
          if (voiceEnabled && !isVoicePlaying) {
            generateVoiceFeedback(analysis.feedback);
          }
        }
        
        if (analysis.repDetected) {
          setRepCount(analysis.repCount);
          onRepCount?.(analysis.repCount);
          
          // Generate rep count voice feedback
          if (voiceEnabled && !isVoicePlaying) {
            generateRepCountVoice(analysis.repCount);
          }
        }
        
        // Draw pose landmarks on canvas
        poseDetectionService.drawPoseLandmarks(canvasRef.current!, results);
      });

      // Start pose detection
      const success = await poseDetectionService.startDetection(videoRef.current, canvasRef.current);
      
      if (success) {
        console.log('MediaPipe pose detection started successfully');
      } else {
        console.error('Failed to start pose detection');
        setFormFeedback('Failed to initialize AI pose detection. Using fallback mode.');
      }
    } catch (error) {
      console.error('Error starting pose detection:', error);
      setFormFeedback('Error initializing AI pose detection. Using fallback mode.');
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Voice coaching functions
  const generateVoiceFeedback = async (feedback: string) => {
    if (!voiceEnabled || isVoicePlaying) return;
    
    setIsVoicePlaying(true);
    try {
      const audioUrl = await voiceService.generateFormFeedback(exerciseName, feedback, voiceType);
      if (audioUrl) {
        await playAudio(audioUrl);
      }
    } catch (error) {
      console.error('Failed to generate voice feedback:', error);
    } finally {
      setIsVoicePlaying(false);
    }
  };

  const generateRepCountVoice = async (count: number) => {
    if (!voiceEnabled || isVoicePlaying) return;
    
    setIsVoicePlaying(true);
    try {
      const message = `Great! That's ${count} ${count === 1 ? 'repetition' : 'repetitions'}. Keep going!`;
      const audioUrl = await voiceService.generateMotivationalMessage('encouragement', voiceType);
      if (audioUrl) {
        await playAudio(audioUrl);
      }
    } catch (error) {
      console.error('Failed to generate rep count voice:', error);
    } finally {
      setIsVoicePlaying(false);
    }
  };

  const playAudio = async (audioUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(audioUrl);
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error('Audio playback failed'));
      audio.play().catch(reject);
    });
  };

  const startVoiceCoaching = async () => {
    if (!voiceEnabled) return;
    
    setIsVoicePlaying(true);
    try {
      const audioUrl = await voiceService.generateMotivationalMessage('start', voiceType);
      if (audioUrl) {
        await playAudio(audioUrl);
      }
    } catch (error) {
      console.error('Failed to start voice coaching:', error);
    } finally {
      setIsVoicePlaying(false);
    }
  };

  // Reset rep count
  const resetReps = () => {
    setRepCount(0);
    poseDetectionService.resetRepCount();
    onRepCount?.(0);
  };

  // Toggle audio
  const toggleAudio = () => {
    setIsMuted(!isMuted);
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Camera Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-teal-400" />
            AI Form Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={toggleCamera}
              variant={isCameraOn ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isCameraOn ? <VideoOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
              {isCameraOn ? 'Stop Camera' : 'Start Camera'}
            </Button>

            <Button
              onClick={togglePlay}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>

            <Button
              onClick={toggleAudio}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>

                         <Button
               onClick={resetReps}
               variant="outline"
               className="flex items-center gap-2"
             >
               <RotateCcw className="h-4 w-4" />
               Reset Reps
             </Button>

             <Button
               onClick={() => setVoiceEnabled(!voiceEnabled)}
               variant={voiceEnabled ? "default" : "outline"}
               className="flex items-center gap-2"
             >
               {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
               {voiceEnabled ? 'Voice On' : 'Voice Off'}
             </Button>
          </div>

                     {/* Camera Status */}
           <div className="flex items-center gap-2 mb-4">
             <div className={`w-3 h-3 rounded-full ${isCameraOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
             <span className="text-sm text-gray-600">
               {isCameraOn ? 'Camera Active - AI Analysis Running' : 'Camera Inactive'}
             </span>
           </div>
           
           {/* Pose Detection Status */}
           {isCameraOn && (
             <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <span className="text-sm text-gray-600">AI Confidence:</span>
                 <div className="flex items-center gap-2">
                   <Progress value={poseConfidence * 100} className="w-20" />
                   <span className="text-xs text-gray-500">{Math.round(poseConfidence * 100)}%</span>
                 </div>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-sm text-gray-600">Posture:</span>
                 <div className={`px-2 py-1 rounded text-xs ${
                   postureStatus === 'good' ? 'bg-green-100 text-green-800' :
                   postureStatus === 'needs_improvement' ? 'bg-yellow-100 text-yellow-800' :
                   'bg-red-100 text-red-800'
                 }`}>
                   {postureStatus === 'good' ? 'Good' :
                    postureStatus === 'needs_improvement' ? 'Needs Work' : 'Poor'}
                 </div>
               </div>
                          </div>
           )}
           
           {/* Voice Coaching Controls */}
           {isCameraOn && (
             <div className="space-y-2">
               <div className="flex items-center justify-between">
                 <span className="text-sm text-gray-600">Voice Coach:</span>
                 <div className="flex items-center gap-2">
                   <select
                     value={voiceType}
                     onChange={(e) => setVoiceType(e.target.value as any)}
                     className="text-xs border rounded px-2 py-1 bg-white"
                     disabled={!voiceEnabled}
                   >
                     <option value="motivational">Motivational</option>
                     <option value="calm">Calm</option>
                     <option value="professional">Professional</option>
                     <option value="friendly">Friendly</option>
                     <option value="energetic">Energetic</option>
                   </select>
                 </div>
               </div>
               {isVoicePlaying && (
                 <div className="flex items-center gap-2 text-xs text-blue-600">
                   <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                   Voice coaching...
                 </div>
               )}
             </div>
           )}
         </CardContent>
       </Card>

                           {/* Camera View */}
        <Card>
          <CardHeader>
            <CardTitle>Live Camera Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg border"
                style={{ maxHeight: '400px', minHeight: '300px' }}
                onLoadedMetadata={() => console.log('Video metadata loaded')}
                onCanPlay={() => console.log('Video can play')}
                onError={(e) => console.error('Video error:', e)}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ maxHeight: '400px' }}
              />
              
                              {/* Overlay for pose landmarks (real) */}
                {isAnalyzing && (
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                    AI Pose Detection Active
                  </div>
                )}
              
              {/* Fallback when camera is off */}
              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📹</div>
                    <div className="text-gray-600">Click "Start Camera" to begin</div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Camera Status Info */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Camera Status:</strong> {isCameraOn ? 'Active' : 'Inactive'}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {isCameraOn 
                  ? 'Camera is active and analyzing your form'
                  : 'Click "Start Camera" to enable AI form analysis'
                }
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Rep Counter */}
      <Card>
        <CardHeader>
          <CardTitle>Repetition Counter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">{repCount}</div>
            <div className="text-sm text-gray-600">Repetitions Completed</div>
          </div>
        </CardContent>
      </Card>

             {/* Form Feedback */}
       {formFeedback && (
         <Card>
           <CardHeader>
             <CardTitle>AI Form Feedback</CardTitle>
           </CardHeader>
           <CardContent>
             <div className={`border rounded-lg p-4 ${
               postureStatus === 'good' ? 'bg-green-50 border-green-200' :
               postureStatus === 'needs_improvement' ? 'bg-yellow-50 border-yellow-200' :
               'bg-red-50 border-red-200'
             }`}>
               <p className={`${
                 postureStatus === 'good' ? 'text-green-800' :
                 postureStatus === 'needs_improvement' ? 'text-yellow-800' :
                 'text-red-800'
               }`}>
                 {formFeedback}
               </p>
               {poseConfidence > 0 && (
                 <div className="mt-2 text-xs text-gray-600">
                   AI Confidence: {Math.round(poseConfidence * 100)}%
                 </div>
               )}
             </div>
           </CardContent>
         </Card>
       )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Exercise Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {instructions.map((instruction, index) => (
              <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                <span className="text-teal-400 font-bold">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Complete Button */}
      <Button
        onClick={onComplete}
        className="w-full py-3 text-lg"
        disabled={!isCameraOn}
      >
        Complete Exercise
      </Button>
    </div>
  );
}
