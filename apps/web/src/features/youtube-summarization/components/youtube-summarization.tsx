'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Progress } from '@mobii/ui';
import { 
  Youtube, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  Share2, 
  Trash2,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  Flame,
  Users,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { youtubeSummarizationService } from '../services/youtube-summarization-service';
import { SummarizedWorkout, YouTubeVideoInfo } from '../types';

interface YouTubeSummarizationProps {
  className?: string;
}

export const YouTubeSummarization: React.FC<YouTubeSummarizationProps> = ({ 
  className = '' 
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<SummarizedWorkout | null>(null);
  const [savedWorkouts, setSavedWorkouts] = useState<SummarizedWorkout[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<YouTubeVideoInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('alloy');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);

  // Load saved workouts on component mount
  useEffect(() => {
    const workouts = youtubeSummarizationService.getSavedWorkouts();
    setSavedWorkouts(workouts);
  }, []);

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Process YouTube video
  const handleProcessVideo = async () => {
    if (!videoUrl.trim()) {
      alert('Please enter a YouTube URL');
      return;
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      alert('Invalid YouTube URL');
      return;
    }

    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const workout = await youtubeSummarizationService.processVideo(videoId, selectedVoice);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setCurrentWorkout(workout);
      setSavedWorkouts(youtubeSummarizationService.getSavedWorkouts());
      
      setTimeout(() => setProgress(0), 1000);
    } catch (error) {
      console.error('Error processing video:', error);
      alert('Error processing video. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Search YouTube videos
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await youtubeSummarizationService.searchFitnessVideos(searchQuery, 8);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching videos:', error);
      alert('Error searching videos. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Play audio narration
  const handlePlayAudio = () => {
    if (!currentWorkout?.narration.audioUrl) return;

    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
      setIsPlaying(false);
    } else {
      const audio = new Audio(currentWorkout.narration.audioUrl);
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setAudioElement(null);
      });
      audio.addEventListener('timeupdate', () => {
        const progress = (audio.currentTime / audio.duration) * 100;
        setProgress(progress);
      });
      audio.play();
      setAudioElement(audio);
      setIsPlaying(true);
    }
  };

  // Delete workout
  const handleDeleteWorkout = (workoutId: string) => {
    youtubeSummarizationService.deleteWorkout(workoutId);
    setSavedWorkouts(youtubeSummarizationService.getSavedWorkouts());
    if (currentWorkout?.workoutId === workoutId) {
      setCurrentWorkout(null);
    }
  };

  // Load workout
  const handleLoadWorkout = (workout: SummarizedWorkout) => {
    setCurrentWorkout(workout);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          YouTube Video Summarization
        </h1>
        <p className="text-text-muted">
          Transform any YouTube fitness video into an AI-narrated workout session
        </p>
      </div>

      {/* Video Processing Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-500" />
            Process YouTube Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Voice Selection */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              AI Voice
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background-secondary text-text-primary"
            >
              <option value="alloy">Alloy (Professional)</option>
              <option value="echo">Echo (Motivational)</option>
              <option value="fable">Fable (Calm)</option>
              <option value="onyx">Onyx (Energetic)</option>
              <option value="nova">Nova (Friendly)</option>
            </select>
          </div>

          {/* Video URL Input */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              YouTube Video URL
            </label>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleProcessVideo}
                disabled={isProcessing || !videoUrl.trim()}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isProcessing ? 'Processing...' : 'Process'}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-text-muted">
                <span>Processing video...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-500" />
            Search Fitness Videos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search for fitness videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="flex items-center gap-2"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Search
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((video) => (
                <motion.div
                  key={video.videoId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-text-primary text-sm line-clamp-2 mb-2">
                      {video.title}
                    </h3>
                    <p className="text-text-muted text-xs mb-2">
                      {video.channelTitle}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Eye className="h-3 w-3" />
                      <span>{parseInt(video.viewCount).toLocaleString()}</span>
                      <Clock className="h-3 w-3" />
                      <span>{video.duration}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setVideoUrl(`https://www.youtube.com/watch?v=${video.videoId}`)}
                      className="w-full mt-2"
                    >
                      Use This Video
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Workout Display */}
      {currentWorkout && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Generated Workout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video Info */}
            <div className="flex gap-4">
              <img
                src={currentWorkout.videoInfo.thumbnail}
                alt={currentWorkout.videoInfo.title}
                className="w-32 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary mb-1">
                  {currentWorkout.videoInfo.title}
                </h3>
                <p className="text-text-muted text-sm mb-2">
                  {currentWorkout.videoInfo.channelTitle}
                </p>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {parseInt(currentWorkout.videoInfo.viewCount).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {currentWorkout.videoInfo.duration}
                  </span>
                </div>
              </div>
            </div>

            {/* Workout Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-background-secondary p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-text-primary mb-1">
                  <Target className="h-4 w-4" />
                  Difficulty
                </div>
                <Badge variant={currentWorkout.summary.difficulty === 'beginner' ? 'default' : 'secondary'}>
                  {currentWorkout.summary.difficulty}
                </Badge>
              </div>
              <div className="bg-background-secondary p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-text-primary mb-1">
                  <Clock className="h-4 w-4" />
                  Duration
                </div>
                <span className="text-text-primary">{currentWorkout.summary.duration} min</span>
              </div>
              <div className="bg-background-secondary p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-text-primary mb-1">
                  <Flame className="h-4 w-4" />
                  Calories
                </div>
                <span className="text-text-primary">~{currentWorkout.summary.calories} cal</span>
              </div>
            </div>

            {/* Summary */}
            <div>
              <h4 className="font-medium text-text-primary mb-2">Summary</h4>
              <p className="text-text-muted text-sm">{currentWorkout.summary.summary}</p>
            </div>

            {/* Key Points */}
            <div>
              <h4 className="font-medium text-text-primary mb-2">Key Points</h4>
              <div className="space-y-1">
                {currentWorkout.summary.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm text-text-muted">
                    <CheckCircle className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise Instructions */}
            <div>
              <h4 className="font-medium text-text-primary mb-2">Exercise Instructions</h4>
              <div className="space-y-2">
                {currentWorkout.summary.exerciseInstructions.map((instruction, index) => (
                  <div key={index} className="bg-background-secondary p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="flex-shrink-0">
                        {index + 1}
                      </Badge>
                      <span className="text-sm text-text-primary">{instruction}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audio Controls */}
            {currentWorkout.narration.audioUrl && (
              <div className="bg-background-secondary p-4 rounded-lg">
                <h4 className="font-medium text-text-primary mb-3">AI Narration</h4>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handlePlayAudio}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? 'Pause' : 'Play'} Narration
                  </Button>
                  <div className="flex-1">
                    <Progress value={progress} className="h-2" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button className="flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start Workout
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                variant="outline"
                onClick={() => handleDeleteWorkout(currentWorkout.workoutId)}
                className="flex items-center gap-2 text-red-500"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Workouts */}
      {savedWorkouts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              Saved Workouts ({savedWorkouts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedWorkouts.map((workout) => (
                <motion.div
                  key={workout.workoutId}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleLoadWorkout(workout)}
                >
                  <img
                    src={workout.videoInfo.thumbnail}
                    alt={workout.videoInfo.title}
                    className="w-full h-24 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-medium text-text-primary text-sm line-clamp-2 mb-2">
                      {workout.videoInfo.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                      <Badge variant="outline" size="sm">
                        {workout.summary.difficulty}
                      </Badge>
                      <span>{workout.summary.duration} min</span>
                    </div>
                    <p className="text-text-muted text-xs">
                      Created: {new Date(workout.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
