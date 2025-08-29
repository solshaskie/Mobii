'use client';

import React, { useEffect } from 'react';
import { UserProfile } from '../../features/progress-tracking/components/user-profile';
import { userProfileService } from '../../features/progress-tracking/services/user-profile-service';
import { Button } from '@mobii/ui';
import { Database, RotateCcw, User } from 'lucide-react';

export default function ProfilePage() {
  useEffect(() => {
    // Add sample data if no profile exists
    const profile = userProfileService.getCurrentProfile();
    if (!profile) {
      userProfileService.addSampleData();
    }
  }, []);

  const handleAddSampleData = () => {
    userProfileService.addSampleData();
    window.location.reload();
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all profile and progress photo data? This cannot be undone.')) {
      userProfileService.clearAllData();
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            👤 User Profile & Progress Photos
          </h1>
          <p className="text-gray-600">
            Manage your profile, track progress with photos, and control your privacy settings
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

        {/* User Profile Component */}
        <UserProfile />
      </div>
    </div>
  );
}
