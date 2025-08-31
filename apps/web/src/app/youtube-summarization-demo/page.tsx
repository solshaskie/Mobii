'use client';

import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@mobii/ui';
import { Youtube, Play, Loader2 } from 'lucide-react';

export default function YouTubeSummarizationDemoPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDemo = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      window.location.href = '/youtube-summarization';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            🎬 YouTube Video Summarization Demo
          </h1>
          <p className="text-lg text-text-muted mb-8">
            Transform any YouTube fitness video into an AI-narrated workout session
          </p>
          
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="h-5 w-5 text-red-500" />
                Try the Feature
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleDemo}
                disabled={isProcessing}
                size="lg"
                className="w-full flex items-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
                {isProcessing ? 'Loading...' : 'Start YouTube Summarization'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
