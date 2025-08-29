'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@mobii/ui';
import { Camera, CheckCircle, ArrowLeft } from 'lucide-react';

// Error boundary component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Component Error</h2>
          <p className="text-red-600 mb-4">
            There was an error loading the photo capture component: {this.state.error?.message}
          </p>
          <Button 
            onClick={() => this.setState({ hasError: false, error: null })}
            variant="outline"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lazy load the complex component
const AutomatedPhotoCapture = React.lazy(() => 
  import('../../features/camera-ai/components/automated-photo-capture').then(module => ({
    default: module.AutomatedPhotoCapture
  }))
);

export default function AutomatedPhotoCapturePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullComponent, setShowFullComponent] = useState(false);

  useEffect(() => {
    // Simulate loading and check for errors
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Automated Photo Capture...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📸 Automated Progress Photo Capture
          </h1>
          <p className="text-gray-600 text-lg">
            Get guided through consistent progress photos with AI voice instructions and positioning feedback
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-gray-800 mb-2">AI Positioning Guide</h3>
            <p className="text-sm text-gray-600">
              Real-time feedback on your position and posture for consistent photos
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">🗣️</div>
            <h3 className="font-semibold text-gray-800 mb-2">Voice Instructions</h3>
            <p className="text-sm text-gray-600">
              Clear, step-by-step voice guidance through each photo position
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-800 mb-2">Quality Analysis</h3>
            <p className="text-sm text-gray-600">
              Automatic quality assessment and recommendations for better photos
            </p>
          </div>
        </div>

        {/* Component Toggle */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Photo Capture Component</h2>
            <Button 
              onClick={() => setShowFullComponent(!showFullComponent)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Camera className="h-5 w-5" />
              {showFullComponent ? 'Hide Full Component' : 'Show Full Component'}
            </Button>
          </div>
          
          {showFullComponent ? (
            <ErrorBoundary>
              <React.Suspense fallback={
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading full component...</p>
                </div>
              }>
                <AutomatedPhotoCapture
                  onComplete={(photos) => {
                    console.log('Session completed with photos:', photos);
                    alert(`Session completed! ${photos.length} photos captured.`);
                  }}
                  onCancel={() => {
                    console.log('Session cancelled');
                    setShowFullComponent(false);
                  }}
                />
              </React.Suspense>
            </ErrorBoundary>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">
                Click "Show Full Component" to load the complete automated photo capture system.
              </p>
              <p className="text-sm text-gray-500">
                This will load the full component with AI positioning, voice instructions, and AR overlays.
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Before You Start:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Find a well-lit area with a plain background</li>
                <li>• Wear form-fitting but comfortable clothing</li>
                <li>• Ensure your camera has a clear view of your full body</li>
                <li>• Stand 6-8 feet from the camera</li>
                <li>• Allow camera permissions when prompted</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Photo Positions:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Front View:</strong> Face the camera directly</li>
                <li>• <strong>Side View:</strong> Turn 90° to show your profile</li>
                <li>• <strong>Back View:</strong> Turn 180° to show your back</li>
                <li>• <strong>Full Body:</strong> Step back for complete body view</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3">💡 Pro Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div>
              <p><strong>Consistency:</strong> Take photos at the same time of day and in the same lighting</p>
              <p><strong>Posture:</strong> Maintain natural, relaxed posture throughout all photos</p>
            </div>
            <div>
              <p><strong>Clothing:</strong> Wear the same outfit for all progress photo sessions</p>
              <p><strong>Background:</strong> Use a plain, neutral background for best results</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
