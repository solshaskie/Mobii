// Database Module Types

export interface DatabaseConfig {
  url: string;
  key: string;
  options?: {
    auth?: {
      autoRefreshToken?: boolean;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
    };
  };
}

export interface UserData {
  id: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    displayName: string;
    avatar?: string;
    dateOfBirth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    height: {
      feet: number;
      inches: number;
      centimeters: number;
    };
    weight: {
      pounds: number;
      kilograms: number;
    };
    fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    fitnessGoals: string[];
    medicalConditions?: string[];
    injuries?: string[];
    dietaryRestrictions?: string[];
    activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
    timezone: string;
    language: string;
    units: 'imperial' | 'metric';
    privacySettings: {
      profileVisibility: 'public' | 'friends' | 'private';
      progressPhotos: 'public' | 'friends' | 'private';
      weightData: 'public' | 'friends' | 'private';
      workoutHistory: 'public' | 'friends' | 'private';
      achievements: 'public' | 'friends' | 'private';
    };
    preferences: {
      workoutDuration: number;
      workoutFrequency: number;
      preferredWorkoutTime: 'morning' | 'afternoon' | 'evening' | 'night';
      musicPreference?: string;
      voiceCoachStyle: 'motivational' | 'calm' | 'professional';
      notifications: {
        workoutReminders: boolean;
        progressUpdates: boolean;
        achievements: boolean;
        weeklyReports: boolean;
      };
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutData {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'generated' | 'custom' | 'preset';
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: {
    id: string;
    name: string;
    duration: number;
    sets: number;
    reps: number;
    description: string;
    category: string;
    videoUrl?: string;
  }[];
  completedAt?: string;
  startedAt?: string;
  notes?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProgressData {
  id: string;
  userId: string;
  type: 'weight' | 'measurement' | 'photo' | 'achievement';
  value: any;
  date: string;
  notes?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}
