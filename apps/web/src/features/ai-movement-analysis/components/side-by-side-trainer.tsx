'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@mobii/ui';
import { Camera, Video, Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface SideBySideTrainerProps {
  selectedTrainer?: any;
}

export const SideBySideTrainer: React.FC<SideBySideTrainerProps> = ({ selectedTrainer }) => {
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);

  // Sample reference videos for different workout types
  const sampleVideos = [
    {
      id: 1,
      title: 'Push-up Form Guide',
      url: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
      thumbnail: 'https://img.youtube.com/vi/IODxDxX7oi4/maxresdefault.jpg',
      duration: '2:15'
    },
    {
      id: 2,
      title: 'Squat Technique',
      url: 'https://www.youtube.com/watch?v=aclHkVaku9U',
      thumbnail: 'https://img.youtube.com/vi/aclHkVaku9U/maxresdefault.jpg',
      duration: '3:42'
    },
    {
      id: 3,
      title: 'Plank Hold',
      url: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
      thumbnail: 'https://img.youtube.com/vi/ASdvN_XEl_c/maxresdefault.jpg',
      duration: '1:58'
    }
  ];

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (cameraRef.current) {
        cameraRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);
    }
  };

  const toggleVideoMode = () => {
    setIsVideoMode(!isVideoMode);
    if (!isVideoMode && !isCameraActive) {
      startCamera();
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const selectVideo = (video: any) => {
    setVideoUrl(video.url);
    setIsVideoMode(true);
    if (!isCameraActive) {
      startCamera();
    }
  };

  const handleVideoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    if (url) {
      setVideoUrl(url);
      setIsVideoMode(true);
      if (!isCameraActive) {
        startCamera();
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Button
            onClick={toggleVideoMode}
            variant={isVideoMode ? "default" : "outline"}
            className="flex items-center space-x-2"
          >
            {isVideoMode ? <Video className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
            <span>{isVideoMode ? 'Video Mode' : 'Camera Only'}</span>
          </Button>
          
          {isVideoMode && (
            <div className="flex items-center space-x-2">
              <Button
                onClick={togglePlayPause}
                variant="outline"
                size="sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                onClick={resetVideo}
                variant="outline"
                size="sm"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <Button
          onClick={() => setShowVideoInput(!showVideoInput)}
          variant="outline"
          size="sm"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Video Input */}
      {showVideoInput && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter YouTube URL or Video Link
              </label>
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleVideoInput}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Or Select from Sample Videos
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => selectVideo(video)}
                    className="cursor-pointer bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <h4 className="font-medium text-sm">{video.title}</h4>
                    <p className="text-xs text-gray-500">{video.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Display Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Camera Feed */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2" />
            Your Camera Feed
          </h3>
          <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
            <video
              ref={cameraRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!isCameraActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Camera not active</p>
                  <Button
                    onClick={startCamera}
                    className="mt-2"
                    size="sm"
                  >
                    Start Camera
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reference Video */}
        {isVideoMode && (
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Video className="w-5 h-5 mr-2" />
              Reference Video
            </h3>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No video selected</p>
                    <p className="text-xs opacity-75">Choose a video above</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* AI Coaching Panel */}
      {isVideoMode && videoUrl && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            🤖 AI Coach Feedback
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-blue-800">
                <strong>Form Check:</strong> Your posture looks good! Keep your back straight.
              </p>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm text-green-800">
                <strong>Pace:</strong> You're matching the reference video speed perfectly.
              </p>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <p className="text-sm text-yellow-800">
                <strong>Tip:</strong> Try to keep your elbows closer to your body during the movement.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">How to Use Side-by-Side Training:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Toggle between camera-only and video comparison modes</li>
          <li>• Select a reference video or enter a YouTube URL</li>
          <li>• Use play/pause controls to sync with the reference video</li>
          <li>• Watch the AI coach feedback for real-time form guidance</li>
          <li>• Practice alongside the reference video for perfect form</li>
        </ul>
      </div>
    </div>
  );
};
