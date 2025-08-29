'use client';

import React, { useState, useEffect } from 'react';
import { YouTubeVideo } from '../../components/ui/youtube-video';
import { YouTubeService } from '../../services/youtube-service';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@mobii/ui';
import { Search, Play, Loader2 } from 'lucide-react';

export default function YouTubeTestPage() {
  const [youtubeService] = useState(() => new YouTubeService());
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  const testExercises = [
    { name: 'Seated Deep Breathing', category: 'chair-yoga', difficulty: 'beginner' },
    { name: 'Chair Squats', category: 'calisthenics', difficulty: 'beginner' },
    { name: 'Seated Arm Circles', category: 'mobility', difficulty: 'beginner' },
    { name: 'Seated Cat-Cow Stretch', category: 'chair-yoga', difficulty: 'beginner' },
    { name: 'Seated Knee Lifts', category: 'strength', difficulty: 'beginner' }
  ];

  // Check API status on mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = () => {
    const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
    setApiStatus(apiKey ? 'connected' : 'disconnected');
  };

  const testSearch = async (exercise: any) => {
    setLoading(true);
    try {
      const video = await youtubeService.searchExerciseVideo(
        exercise.name,
        exercise.difficulty,
        exercise.category
      );
      
      if (video) {
        setVideos(prev => [video, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCustomQuery = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const video = await youtubeService.searchExerciseVideo(
        searchQuery,
        'beginner',
        'general'
      );
      
      if (video) {
        setVideos(prev => [video, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCuratedVideos = async (category: string) => {
    setLoading(true);
    try {
      const videos = await youtubeService.getCuratedFitnessVideos(category, 5);
      setVideos(videos);
    } catch (error) {
      console.error('Failed to get curated videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            YouTube Integration Test
          </h1>
          <p className="text-text-muted">
            Test the YouTube video integration for exercise demonstrations
          </p>
        </div>

        {/* API Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>API Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              {apiStatus === 'connected' ? (
                <>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">YouTube API Connected</span>
                </>
              ) : apiStatus === 'disconnected' ? (
                <>
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 font-medium">YouTube API Disconnected</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-yellow-600 font-medium">Checking connection...</span>
                </>
              )}
            </div>

            {apiStatus === 'disconnected' && (
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  To enable YouTube videos, add your YouTube API key to .env.local:
                </p>
                <code className="block p-2 bg-gray-200 rounded text-xs">
                  NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
                </code>
                <p className="text-xs text-gray-500 mt-2">
                  Get your free API key at <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Console</a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Custom Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Custom Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search for exercise videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                onKeyPress={(e) => e.key === 'Enter' && searchCustomQuery()}
              />
              <Button onClick={searchCustomQuery} disabled={loading || apiStatus !== 'connected'}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Exercises */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Exercise Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testExercises.map((exercise, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-text-primary mb-2">{exercise.name}</h3>
                  <p className="text-sm text-text-muted mb-3">
                    Category: {exercise.category} | Difficulty: {exercise.difficulty}
                  </p>
                  <Button 
                    onClick={() => testSearch(exercise)}
                    disabled={loading || apiStatus !== 'connected'}
                    size="sm"
                    className="w-full"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    Search Video
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Curated Categories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Curated Video Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {['chair-yoga', 'calisthenics', 'mobility', 'strength'].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  onClick={() => getCuratedVideos(category)}
                  disabled={loading || apiStatus !== 'connected'}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  {category.replace('-', ' ').toUpperCase()}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {videos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Found Videos ({videos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((video, index) => (
                  <div key={index} className="space-y-4">
                    <YouTubeVideo
                      videoId={video.id}
                      title={video.title}
                      channelTitle={video.channelTitle}
                      thumbnail={video.thumbnail}
                      className="w-full"
                    />
                    <div>
                      <h3 className="font-semibold text-text-primary text-sm line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-xs text-text-muted mt-1">
                        {video.channelTitle}
                      </p>
                      {video.searchQuery && (
                        <p className="text-xs text-teal-600 mt-1">
                          Search: "{video.searchQuery}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
