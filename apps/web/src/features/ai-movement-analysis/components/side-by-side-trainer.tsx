'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Progress } from '@mobii/ui';
import { 
  Video, 
  Camera, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Upload,
  Link,
  Search,
  Target,
  Brain,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SideBySideTrainerProps {
  className?: string;
}

export const SideBySideTrainer: React.FC<SideBySideTrainerProps> = ({ 
  className = '' 
}) => {
  const [isTraining, setIsTraining] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState<any>(null);
  const [userVideo, setUserVideo] = useState<string | null>(null);
  const [demoVideo, setDemoVideo] = useState<string | null>(null);
  const [videoSource, setVideoSource] = useState<'youtube' | 'upload' | 'database'>('youtube');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string>('');
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [formScore, setFormScore] = useState(85);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const userVideoRef = useRef<HTMLVideoElement>(null);
  const demoVideoRef = useRef<HTMLVideoElement>(null);

  // Mock exercise database
  const exerciseDatabase = [
    { id: '1', name: 'Push-ups', category: 'strength', difficulty: 'intermediate', targetMuscles: ['chest', 'triceps', 'shoulders'] },
    { id: '2', name: 'Squats', category: 'strength', difficulty: 'beginner', targetMuscles: ['quads', 'glutes', 'hamstrings'] },
    { id: '3', name: 'Plank', category: 'core', difficulty: 'beginner', targetMuscles: ['core', 'shoulders'] },
    { id: '4', name: 'Burpees', category: 'cardio', difficulty: 'advanced', targetMuscles: ['full body'] },
    { id: '5', name: 'Lunges', category: 'strength', difficulty: 'intermediate', targetMuscles: ['quads', 'glutes'] },
  ];

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
        setUserVideo('active');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  // Handle video source selection
  const handleVideoSourceChange = (source: 'youtube' | 'upload' | 'database') => {
    setVideoSource(source);
    setDemoVideo(null);
    setVideoUrl('');
    setUploadedFile(null);
    setSelectedExercise('');
  };

  // Load YouTube video
  const loadYouTubeVideo = async () => {
    if (!videoUrl.trim()) {
      alert('Please enter a YouTube URL');
      return;
    }

    // Extract video ID and create embed URL
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      alert('Invalid YouTube URL');
      return;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0`;
    setDemoVideo(embedUrl);
    setCurrentExercise({
      name: 'YouTube Exercise',
      source: 'youtube',
      url: videoUrl
    });
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const videoUrl = URL.createObjectURL(file);
      setDemoVideo(videoUrl);
      setCurrentExercise({
        name: file.name,
        source: 'upload',
        file: file
      });
    }
  };

  // Load database exercise
  const loadDatabaseExercise = () => {
    if (!selectedExercise) {
      alert('Please select an exercise');
      return;
    }

    const exercise = exerciseDatabase.find(ex => ex.id === selectedExercise);
    if (exercise) {
      setDemoVideo('/api/exercises/' + exercise.id + '/video'); // Mock video URL
      setCurrentExercise(exercise);
    }
  };

  // AI-powered exercise search
  const searchExercises = async () => {
    if (!aiSearchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Simulate AI search across multiple sources
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = [
        { id: 'ai_1', name: 'Core Strengthening Sequence', source: 'youtube', confidence: 0.95, targetMuscles: ['core', 'abs'] },
        { id: 'ai_2', name: 'Glute Activation Workout', source: 'database', confidence: 0.88, targetMuscles: ['glutes', 'hamstrings'] },
        { id: 'ai_3', name: 'Upper Body Power Moves', source: 'youtube', confidence: 0.92, targetMuscles: ['chest', 'back', 'shoulders'] },
        { id: 'ai_4', name: 'Functional Movement Flow', source: 'database', confidence: 0.85, targetMuscles: ['full body'] },
      ];

      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Start training session
  const startTraining = () => {
    if (!userVideo || !demoVideo) {
      alert('Please start camera and select a demonstration video');
      return;
    }

    setIsTraining(true);
    setIsPaused(false);
    
    // Start both videos
    if (userVideoRef.current) userVideoRef.current.play();
    if (demoVideoRef.current) demoVideoRef.current.play();
    
    // Start form analysis
    startFormAnalysis();
  };

  // Pause/resume training
  const togglePause = () => {
    setIsPaused(!isPaused);
    if (userVideoRef.current) {
      if (isPaused) {
        userVideoRef.current.play();
      } else {
        userVideoRef.current.pause();
      }
    }
    if (demoVideoRef.current) {
      if (isPaused) {
        demoVideoRef.current.play();
      } else {
        demoVideoRef.current.pause();
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Start form analysis
  const startFormAnalysis = () => {
    // Simulate real-time form analysis
    const interval = setInterval(() => {
      if (!isTraining) {
        clearInterval(interval);
        return;
      }

      // Simulate form score changes
      const newScore = Math.max(60, Math.min(100, formScore + (Math.random() - 0.5) * 10));
      setFormScore(newScore);

      // Generate feedback based on score
      if (newScore < 70) {
        setFeedback(['Keep your back straight', 'Engage your core', 'Slow down the movement']);
      } else if (newScore < 85) {
        setFeedback(['Good form!', 'Try to go deeper', 'Maintain this pace']);
      } else {
        setFeedback(['Excellent form!', 'Perfect execution', 'Keep it up!']);
      }
    }, 3000);

    return () => clearInterval(interval);
  };

  // Extract YouTube video ID
  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          🎯 Ultimate AI Personal Trainer
        </h1>
        <p className="text-lg text-text-muted mb-6">
          Side-by-side video comparison with real-time form feedback and AI-powered exercise discovery
        </p>
      </div>

      {/* Video Source Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-500" />
            Select Exercise Source
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Source Tabs */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={videoSource === 'youtube' ? 'default' : 'outline'}
              onClick={() => handleVideoSourceChange('youtube')}
              className="flex items-center gap-2"
            >
              <Link className="h-4 w-4" />
              YouTube Link
            </Button>
            <Button
              variant={videoSource === 'upload' ? 'default' : 'outline'}
              onClick={() => handleVideoSourceChange('upload')}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Video
            </Button>
            <Button
              variant={videoSource === 'database' ? 'default' : 'outline'}
              onClick={() => handleVideoSourceChange('database')}
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Exercise Database
            </Button>
          </div>

          {/* YouTube Source */}
          {videoSource === 'youtube' && (
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="Paste YouTube URL here..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full"
              />
              <Button onClick={loadYouTubeVideo} className="w-full">
                Load YouTube Video
              </Button>
            </div>
          )}

          {/* Upload Source */}
          {videoSource === 'upload' && (
            <div className="space-y-2">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-text-muted" />
                <p className="text-text-muted mb-2">Upload your exercise video</p>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload">
                  <Button variant="outline" asChild>
                    <span>Choose Video File</span>
                  </Button>
                </label>
              </div>
              {uploadedFile && (
                <p className="text-sm text-text-muted">Selected: {uploadedFile.name}</p>
              )}
            </div>
          )}

          {/* Database Source */}
          {videoSource === 'database' && (
            <div className="space-y-2">
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full p-2 border border-border rounded-md bg-background-secondary text-text-primary"
              >
                <option value="">Select an exercise...</option>
                {exerciseDatabase.map(exercise => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name} ({exercise.difficulty})
                  </option>
                ))}
              </select>
              <Button onClick={loadDatabaseExercise} className="w-full">
                Load Exercise
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Exercise Discovery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Exercise Discovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Describe your goals (e.g., 'strengthen my core', 'target glutes')"
              value={aiSearchQuery}
              onChange={(e) => setAiSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={searchExercises}
              disabled={isSearching || !aiSearchQuery.trim()}
              className="flex items-center gap-2"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-text-primary">AI Found These Exercises:</h4>
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-3 bg-background-secondary rounded-lg hover:bg-background-tertiary cursor-pointer"
                  onClick={() => {
                    setDemoVideo(result.source === 'youtube' ? result.url : `/api/exercises/${result.id}/video`);
                    setCurrentExercise(result);
                  }}
                >
                  <div>
                    <h5 className="font-medium text-text-primary">{result.name}</h5>
                    <p className="text-sm text-text-muted">
                      Targets: {result.targetMuscles.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{result.source}</Badge>
                    <span className="text-sm text-text-muted">
                      {Math.round(result.confidence * 100)}% match
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Side-by-Side Training Interface */}
      {userVideo && demoVideo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-green-500" />
                AI Personal Training Session
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid ${isFullscreen ? 'grid-cols-2' : 'grid-cols-1 lg:grid-cols-2'} gap-4 mb-4`}>
              {/* User Camera Feed */}
              <div className="relative">
                <h4 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Your Form
                </h4>
                <video
                  ref={userVideoRef}
                  className="w-full rounded-lg border-2 border-green-500"
                  autoPlay
                  muted
                  playsInline
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="bg-green-500">
                    LIVE
                  </Badge>
                </div>
              </div>

              {/* Demonstration Video */}
              <div className="relative">
                <h4 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Target Form
                </h4>
                {videoSource === 'youtube' ? (
                  <iframe
                    src={demoVideo}
                    className="w-full h-64 rounded-lg border-2 border-blue-500"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    ref={demoVideoRef}
                    src={demoVideo}
                    className="w-full rounded-lg border-2 border-blue-500"
                    controls
                    muted={isMuted}
                  />
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="default" className="bg-blue-500">
                    DEMO
                  </Badge>
                </div>
              </div>
            </div>

            {/* Training Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button
                  onClick={isTraining ? togglePause : startTraining}
                  className="flex items-center gap-2"
                >
                  {isTraining ? (
                    isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {isTraining ? (isPaused ? 'Resume' : 'Pause') : 'Start Training'}
                </Button>
                <Button
                  variant="outline"
                  onClick={toggleMute}
                  className="flex items-center gap-2"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted">Form Score:</span>
                <Badge variant={formScore >= 85 ? 'default' : formScore >= 70 ? 'secondary' : 'destructive'}>
                  {formScore}%
                </Badge>
              </div>
            </div>

            {/* Real-time Feedback */}
            {isTraining && feedback.length > 0 && (
              <div className="bg-background-secondary p-4 rounded-lg">
                <h5 className="font-medium text-text-primary mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  AI Form Feedback
                </h5>
                <div className="space-y-1">
                  {feedback.map((tip, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span className="text-text-muted">{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Camera Setup */}
      {!userVideo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-green-500" />
              Start Your Camera
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-text-muted mb-4">
              Enable your camera to start the AI personal training session
            </p>
            <Button onClick={startCamera} className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Start Camera
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
