'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@mobii/ui';

export default function CameraTestPage() {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<string>('Ready');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const addDebugInfo = (info: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  const startCamera = async () => {
    try {
      addDebugInfo('Starting camera request...');
      setStatus('Requesting camera...');
      setError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      addDebugInfo(`Camera stream obtained: ${stream.id}`);
      addDebugInfo(`Stream tracks: ${stream.getTracks().map(t => t.kind).join(', ')}`);
      setStatus('Camera stream obtained');
      
      if (videoRef.current) {
        addDebugInfo('Setting video srcObject...');
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOn(true);
        setStatus('Video element updated');
        
        // Force video to play immediately
        addDebugInfo('Attempting to play video...');
        try {
          await videoRef.current.play();
          addDebugInfo('Video play() successful');
          setStatus('Video playing');
        } catch (playError) {
          addDebugInfo(`Video play() failed: ${playError}`);
          setError('Failed to play video: ' + (playError as Error).message);
        }
        
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          addDebugInfo(`Video metadata loaded: ${videoRef.current?.videoWidth}x${videoRef.current?.videoHeight}`);
          setStatus('Video metadata loaded');
        };
        
        videoRef.current.oncanplay = () => {
          addDebugInfo('Video can play event fired');
          setStatus('Video can play');
        };
        
        videoRef.current.onerror = (e) => {
          addDebugInfo(`Video error: ${e}`);
          setError('Video error occurred');
        };

        videoRef.current.onplay = () => {
          addDebugInfo('Video play event fired');
        };

        videoRef.current.onplaying = () => {
          addDebugInfo('Video playing event fired');
        };
      } else {
        addDebugInfo('ERROR: videoRef.current is null');
        setError('Video element not found');
      }
    } catch (error) {
      addDebugInfo(`Camera access failed: ${error}`);
      console.error('Failed to start camera:', error);
      setError('Camera access denied: ' + (error as Error).message);
      setStatus('Failed');
    }
  };

  const stopCamera = () => {
    addDebugInfo('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        addDebugInfo(`Stopping track: ${track.kind}`);
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
    setStatus('Camera stopped');
    setError('');
  };

  const testCameraAccess = async () => {
    try {
      addDebugInfo('Testing camera access...');
      setStatus('Testing camera access...');
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      addDebugInfo(`Found ${videoDevices.length} video device(s)`);
      videoDevices.forEach((device, index) => {
        addDebugInfo(`Device ${index}: ${device.label || 'Unknown'}`);
      });
      setStatus(`Found ${videoDevices.length} video device(s)`);
    } catch (error) {
      addDebugInfo(`Failed to enumerate devices: ${error}`);
      console.error('Failed to enumerate devices:', error);
      setError('Failed to enumerate devices: ' + (error as Error).message);
    }
  };

  const clearDebug = () => {
    setDebugInfo([]);
  };

  useEffect(() => {
    testCameraAccess();
  }, []);

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            Minimal Camera Test
          </h1>
          <p className="text-text-muted">
            Debug camera access and video display step by step
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
                Status: {status}
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  Error: {error}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Camera Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={startCamera}
                disabled={isCameraOn}
                className="flex items-center gap-2"
              >
                Start Camera
              </Button>
              
              <Button
                onClick={stopCamera}
                disabled={!isCameraOn}
                variant="destructive"
                className="flex items-center gap-2"
              >
                Stop Camera
              </Button>
              
              <Button
                onClick={testCameraAccess}
                variant="outline"
                className="flex items-center gap-2"
              >
                Test Access
              </Button>

              <Button
                onClick={clearDebug}
                variant="outline"
                className="flex items-center gap-2"
              >
                Clear Debug
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
            
            {/* Debug Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">
                <strong>Debug Info:</strong>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>• Video element: {videoRef.current ? 'Present' : 'Not found'}</div>
                <div>• Stream: {streamRef.current ? 'Active' : 'None'}</div>
                <div>• Video readyState: {videoRef.current?.readyState || 'N/A'}</div>
                <div>• Video paused: {videoRef.current?.paused !== undefined ? videoRef.current.paused : 'N/A'}</div>
                <div>• Video currentTime: {videoRef.current?.currentTime || 'N/A'}</div>
                <div>• Video duration: {videoRef.current?.duration || 'N/A'}</div>
              </div>
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
              {debugInfo.length === 0 ? (
                <div className="text-gray-500">No debug info yet...</div>
              ) : (
                debugInfo.map((info, index) => (
                  <div key={index} className="mb-1">{info}</div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
