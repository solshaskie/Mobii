'use client';

import React, { useEffect } from 'react';
import { WeightTracking } from '../../components/ui/weight-tracking';
import { weightTrackingService } from '../../services/weight-tracking-service';
import { Button } from '@mobii/ui';
import { Database, RotateCcw } from 'lucide-react';

export default function WeightTrackingPage() {
  useEffect(() => {
    // Add sample data if no data exists
    const entries = weightTrackingService.getWeightEntries();
    if (entries.length === 0) {
      weightTrackingService.addSampleData();
    }
  }, []);

  const handleAddSampleData = () => {
    weightTrackingService.addSampleData();
    window.location.reload();
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all weight tracking data? This cannot be undone.')) {
      weightTrackingService.clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Weight Tracking
          </h1>
          <p className="text-gray-600">
            Monitor your progress, set goals, and achieve your fitness objectives
          </p>
        </div>

        {/* Development Controls */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={handleAddSampleData}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Add Sample Data
          </Button>
          <Button
            variant="outline"
            onClick={handleClearData}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <RotateCcw className="h-4 w-4" />
            Clear All Data
          </Button>
        </div>

        {/* Weight Tracking Component */}
        <WeightTracking />
      </div>
    </div>
  );
}
