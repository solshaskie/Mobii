// Progress Tracking Module - Main Export
// This module handles all progress tracking functionality including:
// - User profile management
// - Weight tracking and analytics
// - Progress photos
// - Fitness assessments
// - Data export and privacy controls

export { UserProfile } from './components/user-profile';
export { EnhancedUserProfile } from './components/enhanced-user-profile';
export { WeightTracking } from './components/weight-tracking';
export { EnhancedWeightTracking } from './components/enhanced-weight-tracking';
export { EnhancedProgressPhotos } from './components/enhanced-progress-photos';

export { userProfileService } from './services/user-profile-service';
export { weightTrackingService } from './services/weight-tracking-service';

export type { 
  UserProfile as UserProfileType,
  ProgressPhoto,
  UserStats,
  WeightEntry,
  WeightGoal,
  WeightProgress,
  WeightAnalytics
} from './types';

// Feature gate for premium progress tracking features
export const PROGRESS_TRACKING_FEATURES = {
  enhancedAnalytics: true,
  dataExport: true,
  fitnessAssessments: true,
  advancedPrivacy: true,
  enhancedProgressPhotos: true,
  aiPhotoAnalysis: true,
  photoCompression: true,
  enhancedWeightTracking: true,
  weightPredictions: true,
  aiInsights: true
} as const;
