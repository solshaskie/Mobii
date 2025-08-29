'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Progress, Badge } from '@mobii/ui';
import { 
  Camera, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  X, 
  ArrowRight,
  Volume2,
  VolumeX,
  Target,
  User,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  progressPhotoCaptureService,
  PhotoCaptureSession,
  PhotoCaptureStep,
  CapturedPhoto
} from '../../services/progress-photo-capture-service';
import { userProfileService } from '../../services/user-profile-service';
import { DynamicAROverlay } from './dynamic-ar-overlay';

interface AutomatedPhotoCaptureProps {
  className?: string;
  onComplete?: (photos: CapturedPhoto[]) => void;
  onCancel?: () => void;
}

export const AutomatedPhotoCapture: React.FC<AutomatedPhotoCaptureProps> = ({ 
  className = '',
  onComplete,
  onCancel
}) => {
  const [session, setSession] = useState<PhotoCaptureSession | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isOptimalPosition, setIsOptimalPosition] = useState(false);
  const [positionAdjustments, setPositionAdjustments] = useState<string[]>([]);
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<CapturedPhoto | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const voiceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
      if (voiceIntervalRef.current) {
        clearInterval(voiceIntervalRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      progressPhotoCaptureService.stopSession();
    };
  }, []);

  // Start camera when session begins
  useEffect(() => {
    console.log('Camera effect triggered:', { session: !!session, isCameraActive });
    if (session && !isCameraActive) {
      console.log('Session started, initializing camera...');
      startCamera();
    }
  }, [session, isCameraActive]);

  // Start voice instructions when session begins
  useEffect(() => {
    if (session && isVoiceEnabled) {
      console.log('Starting voice instructions...');
      startVoiceInstructions();
    }
  }, [session, isVoiceEnabled]);

  // Start periodic voice instructions
  const startVoiceInstructions = () => {
    if (voiceIntervalRef.current) {
      clearInterval(voiceIntervalRef.current);
    }

    // Initial instructions
    const initialInstruction = {
      id: 'initial',
      text: `Welcome to your progress photo session. You should see a HUGE WHITE X MARK in the center of your screen. Stand directly on top of this X mark, about 6 to 8 feet from the camera. Say "ready" when you're positioned on the X.`,
      priority: 'high' as const,
      timing: 'immediate' as const
    };
    progressPhotoCaptureService.addVoiceInstruction(initialInstruction);
    
    // Step-specific instruction
    const stepInstruction = {
      id: 'step',
      text: `For the ${session?.currentStep.name}, ${session?.currentStep.description}. ${session?.currentStep.instructions.join('. ')}. Look for the HUGE WHITE X MARK in the center of your screen and stand directly on top of it. When you're ready, say "ready" or "okay".`,
      priority: 'high' as const,
      timing: 'immediate' as const
    };
    progressPhotoCaptureService.addVoiceInstruction(stepInstruction);

    // Start voice recognition
    startVoiceRecognition();

    // Periodic encouragement and guidance
    voiceIntervalRef.current = setInterval(() => {
      if (session && isVoiceEnabled && !isListening) {
        const encouragement = {
          id: 'encouragement',
          text: 'You\'re doing great! Look for the green target area with the X mark in the center of your screen. Stand in the center of that area and say "ready" when you\'re positioned correctly.',
          priority: 'medium' as const,
          timing: 'immediate' as const
        };
        progressPhotoCaptureService.addVoiceInstruction(encouragement);
      }
    }, 15000); // Every 15 seconds
  };

  // Start voice recognition
  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.log('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      console.log('Voice recognition started');
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      console.log('Heard:', transcript);
      
      if (transcript.includes('ready') || transcript.includes('okay') || transcript.includes('ok')) {
        handleReadyCommand();
      } else if (transcript.includes('capture') || transcript.includes('take photo')) {
        capturePhoto();
      } else if (transcript.includes('stop') || transcript.includes('cancel')) {
        stopSession();
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      console.log('Voice recognition ended');
      setIsListening(false);
      // Restart recognition after a short delay
      setTimeout(() => {
        if (session && isVoiceEnabled) {
          startVoiceRecognition();
        }
      }, 1000);
    };

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
  };

  // Handle ready command
  const handleReadyCommand = () => {
    if (isOptimalPosition) {
      startCountdown();
    } else {
      // Speak feedback about positioning
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          positionAdjustments.length > 0 
            ? positionAdjustments[0] 
            : "I can see you're not quite in the right position yet. Please adjust your position and try again."
        );
        speechSynthesis.speak(utterance);
      }
    }
  };

  // Start countdown
  const startCountdown = () => {
    setCountdown(3);
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance("Perfect! Starting countdown in 3, 2, 1...");
      speechSynthesis.speak(utterance);
    }

    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownIntervalRef.current!);
          capturePhoto();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start camera
  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      console.log('Camera stream obtained:', stream);
      console.log('Video tracks:', stream.getVideoTracks());

      // Wait for video ref to be available
      let attempts = 0;
      const maxAttempts = 10;
      
      while (!videoRef.current && attempts < maxAttempts) {
        console.log(`Waiting for video ref... attempt ${attempts + 1}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (videoRef.current) {
        console.log('Video ref found, setting stream...');
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          console.log('Video dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
        };
        
        videoRef.current.onplay = () => {
          console.log('Video started playing');
        };
        
        videoRef.current.onerror = (error) => {
          console.error('Video error:', error);
        };

        // Force play the video
        try {
          await videoRef.current.play();
          console.log('Video play() successful');
        } catch (playError) {
          console.error('Error playing video:', playError);
        }
      } else {
        console.error('Video ref is still null after waiting');
        throw new Error('Video element not available');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert(`Unable to access camera: ${error.message}. Please check permissions.`);
    }
  };

  // Start capture session
  const startSession = async () => {
    console.log('Start session button clicked');
    
    const currentUser = userProfileService.getCurrentProfile();
    if (!currentUser) {
      console.log('No user profile found, creating sample profile');
      // Create a sample profile for testing
      const sampleProfile = {
        id: 'test-user-1',
        name: 'Test User',
        email: 'test@example.com',
        age: 30,
        height: 175,
        weight: 70,
        fitnessLevel: 'beginner',
        goals: ['weight loss', 'strength'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      userProfileService.updateProfile(sampleProfile);
    }

    console.log('Starting capture session...');
    const newSession = progressPhotoCaptureService.startCaptureSession(currentUser?.id || 'test-user-1');
    console.log('Session created:', newSession);
    setSession(newSession);
  };

  // Handle position updates from dynamic AR overlay
  const handlePositionUpdate = (isOptimal: boolean, adjustments: string[]) => {
    setIsOptimalPosition(isOptimal);
    setPositionAdjustments(adjustments);
  };

  // Capture photo
  const capturePhoto = async () => {
    if (!videoRef.current || !session) return;

    setIsCapturing(true);
    
    try {
      const photo = await progressPhotoCaptureService.capturePhoto(videoRef.current);
      
      if (photo) {
        setCapturedPhotos(prev => [...prev, photo]);
        setPreviewPhoto(photo);
        setShowPreview(true);
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  // Move to next step
  const nextStep = () => {
    const nextStep = progressPhotoCaptureService.nextStep();
    if (nextStep) {
      setSession(progressPhotoCaptureService.getCurrentSession());
    } else {
      // Session completed
      const finalSession = progressPhotoCaptureService.getCurrentSession();
      if (finalSession && onComplete) {
        onComplete(finalSession.photos);
      }
    }
  };

  // Retake current step
  const retakeStep = () => {
    progressPhotoCaptureService.retakeCurrentStep();
    setSession(progressPhotoCaptureService.getCurrentSession());
    setCapturedPhotos(prev => prev.slice(0, -1));
  };

  // Toggle voice
  const toggleVoice = () => {
    const newVoiceEnabled = !isVoiceEnabled;
    setIsVoiceEnabled(newVoiceEnabled);
    
    if ('speechSynthesis' in window) {
      if (isVoiceEnabled) {
        speechSynthesis.cancel();
      }
    }
    
    if (newVoiceEnabled && session) {
      startVoiceInstructions();
    } else if (voiceIntervalRef.current) {
      clearInterval(voiceIntervalRef.current);
    }
  };

  // Stop session
  const stopSession = () => {
    progressPhotoCaptureService.stopSession();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }
    if (voiceIntervalRef.current) {
      clearInterval(voiceIntervalRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setCountdown(null);
    setIsListening(false);
    if (onCancel) {
      onCancel();
    }
  };

  // Get session progress
  const getProgress = () => {
    return progressPhotoCaptureService.getSessionProgress();
  };

  const progress = getProgress();

  if (!session) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <Camera className="h-16 w-16 text-blue-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Automated Progress Photo Capture
        </h2>
        <p className="text-gray-600 mb-6">
          Get guided through consistent progress photos with AI voice instructions
        </p>
        <div className="space-y-4">
          <Button onClick={startSession} size="lg" className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Start Photo Session
          </Button>
          
          <Button 
            onClick={startCamera} 
            variant="outline" 
            size="lg" 
            className="flex items-center gap-2"
            disabled={isCameraActive}
          >
            <Camera className="h-5 w-5" />
            {isCameraActive ? 'Camera Active' : 'Test Camera Only'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Session Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-500" />
              Progress Photo Session
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleVoice}
                className="flex items-center gap-2"
              >
                {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                {isVoiceEnabled ? 'Voice On' : 'Voice Off'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={stopSession}
                className="flex items-center gap-2 text-red-600"
              >
                <X className="h-4 w-4" />
                Stop Session
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Step {progress.currentStep} of {progress.totalSteps}</span>
                <span>{progress.percentage}% Complete</span>
              </div>
              <Progress value={progress.percentage} className="h-2" />
            </div>

            {/* Current Step Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">
                {session.currentStep.name}
              </h3>
              <p className="text-blue-700 text-sm mb-3">
                {session.currentStep.description}
              </p>
              <div className="space-y-1">
                {session.currentStep.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-blue-600">
                    <Target className="h-3 w-3" />
                    {instruction}
                  </div>
                ))}
              </div>
            </div>

            {/* Remaining Steps */}
            {progress.remainingSteps.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Remaining Steps:</h4>
                <div className="flex flex-wrap gap-2">
                  {progress.remainingSteps.map((step, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {step}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Camera Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-green-500" />
            Camera Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Video Element */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-96 object-cover"
              />
              
              {/* Camera Status Indicator */}
              <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs z-10">
                Camera: {isCameraActive ? 'Active' : 'Inactive'}
              </div>
              
              {/* Voice Status Indicator */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs z-10">
                Voice: {isListening ? '🎤 Listening' : '🔇 Idle'}
              </div>
              
              {/* Countdown Display */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-black bg-opacity-80 text-white text-8xl font-bold rounded-full w-32 h-32 flex items-center justify-center">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Capture Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-10">
                <Button
                  onClick={capturePhoto}
                  disabled={isCapturing || !isOptimalPosition}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  {isCapturing ? 'Capturing...' : 'Capture Photo'}
                </Button>
              </div>

              {/* Dynamic AR Overlay with Real-time Body Tracking - INSIDE the video container */}
              {session && (
                <DynamicAROverlay
                  videoElement={videoRef.current}
                  photoType={session.currentStep.type}
                  onPositionUpdate={handlePositionUpdate}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Captured Photos */}
      {capturedPhotos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Captured Photos ({capturedPhotos.length}/{progress.totalSteps})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {capturedPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group cursor-pointer"
                  onClick={() => {
                    setPreviewPhoto(photo);
                    setShowPreview(true);
                  }}
                >
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={photo.thumbnailUrl}
                      alt={`${photo.type} view`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Check className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium capitalize">{photo.type}</div>
                    <div className="text-xs text-gray-500">
                      Quality: {photo.metadata.quality}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={retakeStep}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Retake Current
              </Button>
              <Button
                onClick={nextStep}
                disabled={!session.currentStep.isCompleted}
                className="flex items-center gap-2"
              >
                {progress.currentStep === progress.totalSteps ? 'Complete Session' : 'Next Step'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Photo Preview Modal */}
      <AnimatePresence>
        {showPreview && previewPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {previewPhoto.type.charAt(0).toUpperCase() + previewPhoto.type.slice(1)} View
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={previewPhoto.imageUrl}
                    alt={`${previewPhoto.type} view`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700">Quality Metrics:</div>
                    <div className="space-y-1 text-gray-600">
                      <div>Overall Quality: {previewPhoto.metadata.quality}%</div>
                      <div>Lighting: {previewPhoto.metadata.lighting}%</div>
                      <div>Positioning: {previewPhoto.metadata.positioning}%</div>
                      <div>Blur: {previewPhoto.metadata.blur}%</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700">Analysis:</div>
                    <div className="space-y-1 text-gray-600">
                      <div>Body Detected: {previewPhoto.analysis.bodyDetected ? 'Yes' : 'No'}</div>
                      <div>Face Detected: {previewPhoto.analysis.faceDetected ? 'Yes' : 'No'}</div>
                      <div>Pose Quality: {previewPhoto.analysis.poseQuality}%</div>
                    </div>
                  </div>
                </div>

                {previewPhoto.analysis.recommendations.length > 0 && (
                  <div>
                    <div className="font-medium text-gray-700 mb-2">Recommendations:</div>
                    <ul className="space-y-1">
                      {previewPhoto.analysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <Check className="h-3 w-3 text-green-500" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
