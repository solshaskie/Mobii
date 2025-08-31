'use client';

import React from 'react';
import { EnhancedWeightTracking } from '@/features/progress-tracking';
import { weightTrackingService } from '@/features/progress-tracking';

export default function EnhancedWeightTrackingDemoPage() {
  // Ensure we have sample data for the demo
  React.useEffect(() => {
    const entries = weightTrackingService.getWeightEntries();
    if (entries.length === 0) {
      // Add some sample weight entries
      const sampleEntries = [
        { date: '2024-01-01', weight: 180, bodyFat: 22, muscleMass: 140, notes: 'New Year starting weight', mood: 'good' as const },
        { date: '2024-01-03', weight: 179.5, bodyFat: 21.8, muscleMass: 140.5, notes: 'Good workout today', mood: 'great' as const },
        { date: '2024-01-05', weight: 178.8, bodyFat: 21.5, muscleMass: 141, notes: 'Feeling lighter', mood: 'good' as const },
        { date: '2024-01-07', weight: 178.2, bodyFat: 21.2, muscleMass: 141.5, notes: 'Consistent progress', mood: 'great' as const },
        { date: '2024-01-10', weight: 177.5, bodyFat: 21, muscleMass: 142, notes: 'Reached weekly goal', mood: 'great' as const },
        { date: '2024-01-12', weight: 177, bodyFat: 20.8, muscleMass: 142.5, notes: 'Great week overall', mood: 'good' as const },
        { date: '2024-01-15', weight: 176.5, bodyFat: 20.5, muscleMass: 143, notes: 'Feeling strong', mood: 'great' as const },
      ];

      sampleEntries.forEach(entry => {
        weightTrackingService.addWeightEntry(entry);
      });

      // Set a weight goal
      weightTrackingService.createWeightGoal({
        type: 'lose',
        targetWeight: 170,
        currentWeight: 176.5,
        startWeight: 180,
        startDate: '2024-01-01',
        weeklyGoal: 1.5,
        notes: 'Goal to reach 170 lbs by end of March',
        isActive: true
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Enhanced Weight Tracking
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Advanced weight tracking with AI insights, predictions, analytics, and comprehensive goal management.
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-blue-600 text-2xl font-bold mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">AI Insights</h3>
            <p className="text-sm text-gray-600">
              Intelligent analysis of your weight trends, consistency patterns, and personalized recommendations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-purple-600 text-2xl font-bold mb-2">🔮</div>
            <h3 className="font-semibold text-gray-900 mb-2">Weight Predictions</h3>
            <p className="text-sm text-gray-600">
              AI-powered weight predictions based on your current trends and consistency patterns.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-green-600 text-2xl font-bold mb-2">📈</div>
            <h3 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
            <p className="text-sm text-gray-600">
              Detailed analytics including BMI tracking, consistency scores, and progress visualization.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-orange-600 text-2xl font-bold mb-2">🎯</div>
            <h3 className="font-semibold text-gray-900 mb-2">Goal Management</h3>
            <p className="text-sm text-gray-600">
              Comprehensive goal setting and tracking with progress indicators and milestone celebrations.
            </p>
          </div>
        </div>

        {/* Enhanced Weight Tracking Component */}
        <div className="bg-white rounded-lg shadow-sm border">
          <EnhancedWeightTracking />
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                AI-powered weight predictions with confidence scores
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Intelligent insights based on tracking patterns
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Advanced filtering and search capabilities
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Comprehensive goal management with progress tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Mood and lifestyle tracking integration
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Detailed analytics and consistency scoring
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Benefits</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>Trend Analysis:</strong> Understand your weight patterns and identify factors affecting progress
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>Motivation:</strong> Visual progress tracking and milestone celebrations keep you motivated
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>Accountability:</strong> Consistent tracking builds healthy habits and accountability
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>Data-Driven Decisions:</strong> Make informed decisions about nutrition and exercise
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                <div>
                  <strong>Goal Achievement:</strong> Set realistic goals and track progress towards achieving them
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <div className="inline-flex gap-4">
            <a
              href="/enhanced-profile-demo"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Enhanced Profile Demo
            </a>
            <a
              href="/enhanced-progress-photos-demo"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Enhanced Progress Photos Demo →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
