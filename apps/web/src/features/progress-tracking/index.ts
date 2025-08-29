// Progress Tracking Module - Main Export
// This module handles all progress tracking functionality including:
// - Weight tracking and analytics
// - User profiles and progress photos
// - Achievement system
// - Progress analytics and insights

export { WeightTracking } from './components/weight-tracking';
export { UserProfile } from './components/user-profile';

export { weightTrackingService } from './services/weight-tracking-service';
export { userProfileService } from './services/user-profile-service';
export { achievementService } from './services/achievement-service';
export { progressPhotoCaptureService } from './services/progress-photo-capture-service';

export type { WeightEntry, WeightGoal, WeightProgress, WeightAnalytics } from './types';
export type { UserProfile as UserProfileType, ProgressPhoto, UserStats } from './types';
export type { Achievement, UserStats as AchievementUserStats } from './types';

// Feature gate for premium progress tracking features
export const progressTrackingFeatureGate = {
  isEnabled: (userId?: string) => {
    // TODO: Implement user-based feature checking
    // For now, always enabled for development
    return true;
  },
  requirePremium: true,
  features: {
    advancedAnalytics: true,
    progressPhotos: true,
    achievementSystem: true,
    goalTracking: true,
    trendAnalysis: true,
  }
};
