'use client';

import React from 'react';
import { EnhancedUserProfile } from '@/features/progress-tracking';
import { userProfileService } from '@/features/progress-tracking';

export default function EnhancedProfileDemoPage() {
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
            Enhanced User Profile Management
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive fitness profile management with advanced privacy controls, 
            fitness assessments, data export capabilities, and detailed analytics.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-blue-600 text-2xl font-bold mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Fitness Analytics</h3>
            <p className="text-sm text-gray-600">
              Comprehensive fitness scoring, BMI tracking, BMR/TDEE calculations, and performance metrics.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-green-600 text-2xl font-bold mb-2">🔒</div>
            <h3 className="font-semibold text-gray-900 mb-2">Privacy Controls</h3>
            <p className="text-sm text-gray-600">
              Granular privacy settings for profile visibility, progress photos, weight data, and achievements.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-purple-600 text-2xl font-bold mb-2">📸</div>
            <h3 className="font-semibold text-gray-900 mb-2">Progress Photos</h3>
            <p className="text-sm text-gray-600">
              Automated photo capture with AI guidance, privacy controls, and progress tracking.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-orange-600 text-2xl font-bold mb-2">📤</div>
            <h3 className="font-semibold text-gray-900 mb-2">Data Export</h3>
            <p className="text-sm text-gray-600">
              Export your fitness data in JSON or CSV format with customizable options.
            </p>
          </div>
        </div>

        {/* Enhanced Profile Component */}
        <div className="bg-white rounded-lg shadow-sm border">
          <EnhancedUserProfile />
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Fitness score calculation based on workouts, streaks, and achievements
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Privacy level assessment and visual indicators
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Tabbed interface for organized data presentation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Fitness assessment tools with standardized tests
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Comprehensive data export functionality
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Advanced privacy controls with granular settings
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Security</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>Profile Visibility:</strong> Control who can see your basic profile information
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>Progress Photos:</strong> Keep your progress photos private or share selectively
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>Weight Data:</strong> Protect sensitive weight and body composition data
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>Workout History:</strong> Control visibility of your exercise routines and performance
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>Achievements:</strong> Choose whether to share your fitness accomplishments
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <div className="inline-flex gap-4">
            <a
              href="/progress-tracking-demo"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to Progress Tracking
            </a>
            <a
              href="/voice-coaching-demo"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Voice Coaching Demo →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
