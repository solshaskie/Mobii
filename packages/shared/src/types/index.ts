// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  fitnessProfile: FitnessProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  ttsVoice: string;
  backgroundMusic: boolean;
  notifications: boolean;
  workoutDuration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface FitnessProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // kg
  height: number; // cm
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: FitnessGoal[];
  limitations: string[];
  equipment: string[];
}

export interface FitnessGoal {
  id: string;
  type: 'strength' | 'flexibility' | 'mobility' | 'weight_loss' | 'muscle_gain';
  target: number;
  current: number;
  unit: string;
  deadline?: Date;
}

// Exercise Types
export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // seconds
  sets?: number;
  reps?: number;
  videoUrl?: string;
  imageUrl?: string;
  instructions: string[];
  modifications: ExerciseModification[];
  targetMuscles: string[];
  equipment: string[];
}

export interface ExerciseCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface ExerciseModification {
  id: string;
  name: string;
  description: string;
  difficulty: 'easier' | 'harder';
  instructions: string[];
}

// Workout Types
export interface WorkoutPlan {
  id: string;
  userId: string;
  date: Date;
  type: 'chair_yoga' | 'calisthenics' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  exercises: WorkoutExercise[];
  aiGenerated: boolean;
  userFeedback?: WorkoutFeedback;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // seconds
  sets?: number;
  reps?: number;
  videoUrl?: string;
  imageUrl?: string;
  instructions: string[];
  modifications: ExerciseModification[];
  targetMuscles: string[];
  order: number;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  workoutPlanId: string;
  startTime: Date;
  endTime?: Date;
  exercises: CompletedExercise[];
  feedback: WorkoutFeedback;
  metrics: WorkoutMetrics;
}

export interface CompletedExercise {
  exerciseId: string;
  duration: number;
  sets?: number;
  reps?: number;
  skipped: boolean;
  difficulty: number; // 1-10 scale
  notes?: string;
}

export interface WorkoutFeedback {
  difficulty: number; // 1-10 scale
  enjoyment: number; // 1-10 scale
  energy: number; // 1-10 scale
  comments?: string;
  skippedExercises: string[];
}

export interface WorkoutMetrics {
  totalDuration: number;
  caloriesBurned?: number;
  heartRate?: number[];
  intensity: number; // 1-10 scale
}

// Audio Types
export interface TTSProvider {
  name: string;
  voices: TTSVoice[];
  generateSpeech(text: string, voice: string): Promise<AudioBuffer>;
}

export interface TTSVoice {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female';
  accent?: string;
  celebrity?: string;
}

export interface BackgroundMusic {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: number;
  genre: string;
  mood: 'energetic' | 'calm' | 'motivational' | 'relaxing';
}

// Progress Types
export interface ProgressEntry {
  id: string;
  userId: string;
  date: Date;
  weight?: number;
  measurements?: BodyMeasurements;
  notes?: string;
}

export interface BodyMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  calves?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: AchievementCriteria;
  unlockedAt?: Date;
}

export interface AchievementCriteria {
  type: 'workouts_completed' | 'streak_days' | 'total_time' | 'weight_goal';
  target: number;
  timeframe?: number; // days
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileForm {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: FitnessGoal[];
  limitations: string[];
  equipment: string[];
}

// UI Types
export interface Theme {
  name: 'dark' | 'light';
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}
