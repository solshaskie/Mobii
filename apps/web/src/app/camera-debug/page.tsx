'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@mobii/ui';

export default function CameraDebugPage() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLog(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(`[${timestamp}] ${message}`);
  };

  const startCamera = async () => {
    try {
      addLog('Starting camera request...');
      setIsCameraOn(false); // Reset state
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      addLog(`Camera stream obtained: ${stream.id}`);
      addLog(`Stream tracks: ${stream.getTracks().map(t => t.kind).join(', ')}`);
      
      if (videoRef.current) {
        addLog('Setting video srcObject...');
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        addLog('Setting isCameraOn to true...');
        setIsCameraOn(true);
        addLog(`isCameraOn state after setState: ${true}`);
        
        // Force video to play immediately
        try {
          addLog('Attempting to play video...');
          await videoRef.current.play();
          addLog('Video play() successful');
        } catch (playError) {
          addLog(`Video play() failed: ${playError}`);
        }
        
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          addLog(`Video metadata loaded: ${videoRef.current?.videoWidth}x${videoRef.current?.videoHeight}`);
        };
        
        videoRef.current.oncanplay = () => {
          addLog('Video can play event fired');
        };
        
        videoRef.current.onerror = (e) => {
          addLog(`Video error: ${e}`);
        };

        videoRef.current.onplay = () => {
          addLog('Video play event fired');
        };

        videoRef.current.onplaying = () => {
          addLog('Video playing event fired');
        };
      } else {
        addLog('ERROR: videoRef.current is null');
      }
    } catch (error) {
      addLog(`Camera access failed: ${error}`);
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    addLog('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        addLog(`Stopping track: ${track.kind}`);
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    addLog('Camera stopped');
  };

  const toggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Log state changes
  useEffect(() => {
    addLog(`isCameraOn state changed to: ${isCameraOn}`);
  }, [isCameraOn]);

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Camera State Debug
          </h1>
          <p className="text-text-muted">
            Debug camera state management issues
          </p>
        </div>

        {/* Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Camera Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isCameraOn ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-sm">
                  {isCameraOn ? 'Camera Active' : 'Camera Inactive'}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                State Value: {isCameraOn.toString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Camera Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={toggleCamera}
                variant={isCameraOn ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {isCameraOn ? 'Stop Camera' : 'Start Camera'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Video Display */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Video Feed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg border"
                style={{ 
                  maxHeight: '400px', 
                  minHeight: '300px',
                  backgroundColor: '#f0f0f0'
                }}
              />
              
              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📹</div>
                    <div className="text-gray-600">Click "Start Camera" to begin</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Debug Log */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-xs max-h-60 overflow-y-auto">
              {debugLog.length === 0 ? (
                <div className="text-gray-500">No debug info yet...</div>
              ) : (
                debugLog.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
