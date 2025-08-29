// AI Generator Module Types

export interface WorkoutPreferences {
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  energyLevel: 'low' | 'medium' | 'high';
  workoutType: 'chair-yoga' | 'calisthenics' | 'mixed';
  includeWarmup: boolean;
  includeCooldown: boolean;
}

export interface GeneratedWorkout {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  calories: number;
  exerciseCount: number;
  focusAreas: string[];
  exercises: {
    name: string;
    duration: number;
    sets: number;
    reps: number;
    description: string;
    category: string;
  }[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  equipment: string[];
  instructions: string[];
  muscleGroups: string[];
  videoUrl?: string;
  imageUrl?: string;
}

export type ExerciseCategory = 
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'balance'
  | 'core'
  | 'upper-body'
  | 'lower-body'
  | 'full-body'
  | 'chair-exercise'
  | 'standing'
  | 'floor';

export type ExerciseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface AIWorkoutRequest {
  preferences: WorkoutPreferences;
  userProfile?: {
    fitnessLevel: string;
    injuries?: string[];
    goals: string[];
  };
}

export interface AIWorkoutResponse {
  workout: GeneratedWorkout;
  reasoning: string;
  alternatives?: GeneratedWorkout[];
}
