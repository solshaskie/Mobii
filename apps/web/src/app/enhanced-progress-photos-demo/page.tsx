'use client';

import React from 'react';
import { EnhancedProgressPhotos } from '@/features/progress-tracking';
import { userProfileService } from '@/features/progress-tracking';

export default function EnhancedProgressPhotosDemoPage() {
  // Ensure we have sample data for the demo
  React.useEffect(() => {
    const currentProfile = userProfileService.getCurrentProfile();
    if (!currentProfile) {
      userProfileService.addSampleData();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Enhanced Progress Photos
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Advanced progress photo management with AI analysis, session organization, 
            privacy controls, and comprehensive analytics.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-blue-600 text-2xl font-bold mb-2">📸</div>
            <h3 className="font-semibold text-gray-900 mb-2">Photo Sessions</h3>
            <p className="text-sm text-gray-600">
              Organize photos into sessions with automatic grouping, tagging, and metadata management.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-purple-600 text-2xl font-bold mb-2">🤖</div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Analysis</h3>
            <p className="text-sm text-gray-600">
              AI-powered body composition analysis, progress metrics, and personalized recommendations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-green-600 text-2xl font-bold mb-2">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">Privacy Controls</h3>
            <p className="text-sm text-gray-600">
              Granular privacy settings with session-level and photo-level visibility controls.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-orange-600 text-2xl font-bold mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Progress Analytics</h3>
            <p className="text-sm text-gray-600">
              Comprehensive analytics with timeline views, progress tracking, and trend analysis.
            </p>
          </div>
        </div>

        {/* Enhanced Progress Photos Component */}
        <div className="bg-white rounded-lg shadow-sm border">
          <EnhancedProgressPhotos />
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Session-based photo organization with automatic grouping
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                AI-powered body composition and progress analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Advanced search, filter, and sort capabilities
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Image compression and optimization settings
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Privacy controls with granular visibility settings
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Progress timeline and analytics visualization
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Photo Management Benefits</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>Visual Progress Tracking:</strong> See your transformation over time with organized photo sessions
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>AI Insights:</strong> Get intelligent analysis of body composition changes and progress metrics
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>Privacy Protection:</strong> Keep your progress photos private with granular control settings
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>Motivation:</strong> Visual evidence of progress helps maintain motivation and consistency
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>Data Organization:</strong> Efficiently manage and organize your progress photo collection
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration with Other Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl mb-2">📱</div>
              <h4 className="font-medium text-gray-900 mb-2">Automated Photo Capture</h4>
              <p className="text-sm text-gray-600">
                Seamlessly integrates with the automated photo capture system for guided progress photos.
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-medium text-gray-900 mb-2">Enhanced Profile</h4>
              <p className="text-sm text-gray-600">
                Connects with the enhanced user profile for comprehensive fitness tracking.
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⚖️</div>
              <h4 className="font-medium text-gray-900 mb-2">Weight Tracking</h4>
              <p className="text-sm text-gray-600">
                Correlates progress photos with weight data for complete progress analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <div className="inline-flex gap-4">
            <a
              href="/enhanced-weight-tracking-demo"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Enhanced Weight Tracking Demo
            </a>
            <a
              href="/enhanced-profile-demo"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Enhanced Profile Demo →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
