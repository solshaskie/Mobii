'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, RotateCcw, Settings, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@mobii/ui';

interface MobileCameraViewProps {
  onCapture?: (imageData: string) => void;
  onStart?: () => void;
  onStop?: () => void;
  className?: string;
}

export const MobileCameraView: React.FC<MobileCameraViewProps> = ({
  onCapture,
  onStart,
  onStop,
  className = ''
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight * 0.7 },
          facingMode: 'user'
        },
        audio: false
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsActive(true);
      onStart?.();
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
    onStop?.();
  };

  const capturePhoto = () => {
    if (videoRef.current && isActive) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        onCapture?.(imageData);
      }
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Camera View */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isMuted}
          className="w-full h-full object-cover"
        />
        
        {/* Camera Overlay */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-white border-dashed rounded-full opacity-50" />
          </div>
        )}
        
        {/* Camera Status */}
        {isActive && (
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {isPaused ? 'PAUSED' : 'LIVE'}
          </div>
        )}
      </div>

      {/* Mobile Controls */}
      <div className="mt-4 space-y-4">
        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-4">
          {!isActive ? (
            <Button
              onClick={startCamera}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-full"
            >
              <Camera className="w-5 h-5" />
              <span>Start Camera</span>
            </Button>
          ) : (
            <>
              <Button
                onClick={capturePhoto}
                className="w-16 h-16 bg-white border-4 border-gray-300 rounded-full flex items-center justify-center shadow-lg"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full" />
              </Button>
              
              <Button
                onClick={togglePause}
                className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </Button>
            </>
          )}
        </div>

        {/* Secondary Controls */}
        {isActive && (
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={toggleMute}
              variant="outline"
              className="w-10 h-10 rounded-full"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            <Button
              onClick={stopCamera}
              variant="outline"
              className="w-10 h-10 rounded-full"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              className="w-10 h-10 rounded-full"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Mobile Tips:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Hold your phone steady for best results</li>
          <li>• Ensure good lighting for accurate AI analysis</li>
          <li>• Keep your full body in frame</li>
          <li>• Follow the on-screen guidance</li>
        </ul>
      </div>
    </div>
  );
};
