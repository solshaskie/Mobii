'use client';

import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Progress } from '@mobii/ui';
import { Brain, Video, Play, Loader2, CheckCircle } from 'lucide-react';
import { movementAnalysisService } from '../services/movement-analysis-service';

interface AIMovementAnalyzerProps {
  className?: string;
}

export const AIMovementAnalyzer: React.FC<AIMovementAnalyzerProps> = ({ 
  className = '' 
}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyzeVideo = async () => {
    if (!videoUrl.trim()) {
      alert('Please enter a video URL');
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);
    setAnalysis(null);

    try {
      // Simulate analysis progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // Perform actual analysis
      const result = await movementAnalysisService.analyzeVideoMovement(videoUrl);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          🧠 AI Movement Analysis
        </h1>
        <p className="text-lg text-text-muted mb-6">
          Revolutionary AI that analyzes any fitness video and automatically classifies exercises
        </p>
      </div>

      {/* Video Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-500" />
            Analyze Fitness Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Video URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 p-3 border border-border rounded-md bg-background-secondary text-text-primary"
              />
              <Button
                onClick={handleAnalyzeVideo}
                disabled={isAnalyzing || !videoUrl.trim()}
                className="flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Brain className="h-4 w-4" />
                )}
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </Button>
            </div>
          </div>

          {/* Progress */}
          {isAnalyzing && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-text-muted">
                <span>AI analyzing movement patterns...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              AI Analysis Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-background-secondary p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-text-primary">
                    {analysis.exercises.length}
                  </div>
                  <div className="text-sm text-text-muted">Exercises Detected</div>
                </div>
                <div className="bg-background-secondary p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-text-primary capitalize">
                    {analysis.difficulty}
                  </div>
                  <div className="text-sm text-text-muted">Difficulty Level</div>
                </div>
                <div className="bg-background-secondary p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-text-primary">
                    {Math.round(analysis.totalDuration / 60000)} min
                  </div>
                  <div className="text-sm text-text-muted">Duration</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-text-primary mb-2">Detected Exercises:</h4>
                <div className="space-y-2">
                  {analysis.exercises.map((exercise: any, index: number) => (
                    <div key={exercise.id} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                      <span className="text-text-primary">
                        {index + 1}. {exercise.name}
                      </span>
                      <span className="text-sm text-text-muted">
                        {Math.round(exercise.confidence * 100)}% confidence
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full flex items-center gap-2">
                <Play className="h-4 w-4" />
                Start AI-Coached Workout
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
