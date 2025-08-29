// AI Generator Module - Main Export
// This module handles all AI-powered functionality including:
// - Workout generation using multiple AI providers
// - Exercise database integration
// - AI-powered recommendations
// - Smart workout customization

export { AIWorkoutGenerator } from './components/ai-workout-generator';
export { AIService } from './services/ai-service';
export { ExerciseDatabaseService } from './services/exercise-database-service';

export type { WorkoutPreferences, GeneratedWorkout } from './types';
export type { Exercise, ExerciseCategory, ExerciseDifficulty } from './types';

// Feature gate for premium AI features
export const aiGeneratorFeatureGate = {
  isEnabled: (userId?: string) => {
    // TODO: Implement user-based feature checking
    // For now, always enabled for development
    return true;
  },
  requirePremium: true,
  features: {
    advancedWorkoutGeneration: true,
    multipleAIProviders: true,
    customExerciseCreation: true,
    smartRecommendations: true,
    personalizedWorkouts: true,
  }
};
