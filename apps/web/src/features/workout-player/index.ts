// Workout Player Module - Main Export
// This module handles all workout playback functionality including:
// - YouTube video integration
// - Exercise database
// - Workout timing and controls
// - Video playback management

export { YouTubeVideo } from './components/youtube-video';
export { WorkoutTimer } from './components/workout-timer';

export { YouTubeService } from './services/youtube-service';
export { ExerciseDBService } from './services/exercisedb-service';

export type { YouTubeVideo as YouTubeVideoType, VideoSearchResult } from './types';
export type { Exercise as ExerciseDBType, ExerciseSearchResult } from './types';

// Feature gate for premium workout player features
export const workoutPlayerFeatureGate = {
  isEnabled: (userId?: string) => {
    // TODO: Implement user-based feature checking
    // For now, always enabled for development
    return true;
  },
  requirePremium: true,
  features: {
    hdVideoQuality: true,
    unlimitedVideoAccess: true,
    customPlaylists: true,
    offlineWorkouts: true,
    advancedVideoControls: true,
  }
};
