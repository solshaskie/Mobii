// Progress Tracking Module Types

export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  waterWeight?: number;
  notes?: string;
  mood?: string;
  timestamp: number;
}

export interface WeightGoal {
  id: string;
  type: 'lose' | 'gain' | 'maintain';
  targetWeight: number;
  currentWeight: number;
  startWeight: number;
  startDate: string;
  targetDate?: string;
  weeklyGoal?: number;
  notes?: string;
  isActive: boolean;
}

export interface WeightProgress {
  totalChange: number;
  weeklyChange: number;
  monthlyChange: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  progressPercentage: number;
  currentWeight: number;
  streak: number;
  bmiCategory: string;
  bmi: number;
  goalProgress: number;
}

export interface WeightAnalytics {
  averageWeight: number;
  minWeight: number;
  maxWeight: number;
  totalEntries: number;
  streakDays: number;
  weeklyAverage: number;
  monthlyAverage: number;
  consistency: number;
  weightRange: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ProgressPhoto {
  id: string;
  userId: string;
  date: string;
  type: 'front' | 'back' | 'side' | 'progress';
  imageUrl: string;
  thumbnailUrl?: string;
  notes?: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface UserStats {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  currentStreak: number;
  longestStreak: number;
  averageWorkoutDuration: number;
  favoriteWorkoutType: string;
  lastWorkoutDate?: string;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'workout' | 'streak' | 'weight' | 'milestone' | 'special';
  icon: string;
  criteria: {
    type: string;
    value: number;
    timeframe?: string;
  };
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}
