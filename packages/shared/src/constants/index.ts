// Exercise Categories
export const EXERCISE_CATEGORIES = [
  {
    id: 'chair_yoga',
    name: 'Chair Yoga',
    description: 'Gentle yoga poses adapted for seated practice',
    icon: '🧘‍♀️',
  },
  {
    id: 'stretching',
    name: 'Stretching',
    description: 'Flexibility and mobility exercises',
    icon: '🤸‍♀️',
  },
  {
    id: 'strength',
    name: 'Strength Training',
    description: 'Bodyweight and resistance exercises',
    icon: '💪',
  },
  {
    id: 'cardio',
    name: 'Cardio',
    description: 'Heart-pumping aerobic exercises',
    icon: '❤️',
  },
  {
    id: 'balance',
    name: 'Balance',
    description: 'Stability and coordination exercises',
    icon: '⚖️',
  },
  {
    id: 'mobility',
    name: 'Mobility',
    description: 'Joint range of motion exercises',
    icon: '🔄',
  },
] as const;

// TTS Voices
export const TTS_VOICES = [
  {
    id: 'alloy',
    name: 'Alloy',
    language: 'en',
    gender: 'male' as const,
    provider: 'openai',
  },
  {
    id: 'echo',
    name: 'Echo',
    language: 'en',
    gender: 'male' as const,
    provider: 'openai',
  },
  {
    id: 'fable',
    name: 'Fable',
    language: 'en',
    gender: 'male' as const,
    provider: 'openai',
  },
  {
    id: 'onyx',
    name: 'Onyx',
    language: 'en',
    gender: 'male' as const,
    provider: 'openai',
  },
  {
    id: 'nova',
    name: 'Nova',
    language: 'en',
    gender: 'female' as const,
    provider: 'openai',
  },
  {
    id: 'shimmer',
    name: 'Shimmer',
    language: 'en',
    gender: 'female' as const,
    provider: 'openai',
  },
  // Celebrity-like voices (Eleven Labs)
  {
    id: 'chuck-norris',
    name: 'Chuck Norris',
    language: 'en',
    gender: 'male' as const,
    provider: 'elevenlabs',
    celebrity: 'Chuck Norris',
  },
  {
    id: 'arnold',
    name: 'Arnold Schwarzenegger',
    language: 'en',
    gender: 'male' as const,
    provider: 'elevenlabs',
    celebrity: 'Arnold Schwarzenegger',
  },
  {
    id: 'charlize',
    name: 'Charlize Theron',
    language: 'en',
    gender: 'female' as const,
    provider: 'elevenlabs',
    celebrity: 'Charlize Theron',
  },
] as const;

// Fitness Goals
export const FITNESS_GOALS = [
  {
    id: 'strength',
    name: 'Build Strength',
    description: 'Increase muscle strength and power',
    icon: '💪',
  },
  {
    id: 'flexibility',
    name: 'Improve Flexibility',
    description: 'Enhance range of motion and flexibility',
    icon: '🤸‍♀️',
  },
  {
    id: 'mobility',
    name: 'Better Mobility',
    description: 'Improve joint mobility and movement',
    icon: '🔄',
  },
  {
    id: 'weight_loss',
    name: 'Weight Loss',
    description: 'Lose weight and burn calories',
    icon: '⚖️',
  },
  {
    id: 'muscle_gain',
    name: 'Muscle Gain',
    description: 'Build muscle mass and tone',
    icon: '🏋️‍♀️',
  },
  {
    id: 'endurance',
    name: 'Endurance',
    description: 'Improve cardiovascular fitness',
    icon: '❤️',
  },
  {
    id: 'balance',
    name: 'Balance',
    description: 'Enhance stability and coordination',
    icon: '⚖️',
  },
  {
    id: 'stress_relief',
    name: 'Stress Relief',
    description: 'Reduce stress and improve mental health',
    icon: '🧘‍♀️',
  },
] as const;

// Equipment Options
export const EQUIPMENT_OPTIONS = [
  {
    id: 'none',
    name: 'No Equipment',
    description: 'Bodyweight exercises only',
    icon: '👤',
  },
  {
    id: 'chair',
    name: 'Chair',
    description: 'Standard chair for support',
    icon: '🪑',
  },
  {
    id: 'resistance_bands',
    name: 'Resistance Bands',
    description: 'Elastic bands for resistance training',
    icon: '🎯',
  },
  {
    id: 'dumbbells',
    name: 'Dumbbells',
    description: 'Free weights for strength training',
    icon: '🏋️',
  },
  {
    id: 'yoga_mat',
    name: 'Yoga Mat',
    description: 'Cushioned surface for floor exercises',
    icon: '🧘‍♀️',
  },
  {
    id: 'foam_roller',
    name: 'Foam Roller',
    description: 'Self-massage and recovery tool',
    icon: '🔄',
  },
] as const;

// Workout Durations (in minutes)
export const WORKOUT_DURATIONS = [
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '60 minutes' },
] as const;

// Difficulty Levels
export const DIFFICULTY_LEVELS = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'Perfect for those new to exercise',
    color: '#00ff88',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'For those with some fitness experience',
    color: '#ff8000',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'Challenging workouts for fitness enthusiasts',
    color: '#ff0080',
  },
] as const;

// Achievement Types
export const ACHIEVEMENT_TYPES = [
  {
    id: 'first_workout',
    name: 'First Steps',
    description: 'Complete your first workout',
    icon: '🎯',
    criteria: { type: 'workouts_completed', target: 1 },
  },
  {
    id: 'week_streak',
    name: 'Week Warrior',
    description: 'Complete 7 workouts in a row',
    icon: '🔥',
    criteria: { type: 'streak_days', target: 7 },
  },
  {
    id: 'month_streak',
    name: 'Monthly Master',
    description: 'Complete 30 workouts in a row',
    icon: '👑',
    criteria: { type: 'streak_days', target: 30 },
  },
  {
    id: 'hundred_workouts',
    name: 'Century Club',
    description: 'Complete 100 workouts',
    icon: '💯',
    criteria: { type: 'workouts_completed', target: 100 },
  },
  {
    id: 'weight_goal',
    name: 'Goal Getter',
    description: 'Reach your weight goal',
    icon: '🎯',
    criteria: { type: 'weight_goal', target: 1 },
  },
] as const;

// App Configuration
export const APP_CONFIG = {
  name: 'Mobii',
  version: '0.1.0',
  description: 'Personalized Chair Yoga & Calisthenics Web App',
  author: 'Mobii Team',
  website: 'https://mobii.app',
  support: 'support@mobii.app',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
  },
  users: {
    profile: '/api/users/profile',
    preferences: '/api/users/preferences',
    progress: '/api/users/progress',
  },
  workouts: {
    generate: '/api/workouts/generate',
    current: '/api/workouts/current',
    history: '/api/workouts/history',
    complete: '/api/workouts/complete',
  },
  exercises: {
    list: '/api/exercises',
    categories: '/api/exercises/categories',
    search: '/api/exercises/search',
  },
  audio: {
    tts: '/api/audio/tts',
    music: '/api/audio/music',
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  user: 'mobii_user',
  preferences: 'mobii_preferences',
  theme: 'mobii_theme',
  workoutSession: 'mobii_workout_session',
  audioSettings: 'mobii_audio_settings',
} as const;

// Theme Colors
export const THEME_COLORS = {
  dark: {
    primary: '#0a0a0a',
    secondary: '#1a1a1a',
    tertiary: '#2a2a2a',
    text: '#ffffff',
    textSecondary: '#b3b3b3',
    textMuted: '#666666',
    accent: '#ff0080',
    accentGreen: '#00ff88',
    accentBlue: '#0080ff',
    accentPurple: '#8000ff',
    accentOrange: '#ff8000',
    border: '#333333',
  },
  light: {
    primary: '#ffffff',
    secondary: '#f8f9fa',
    tertiary: '#e9ecef',
    text: '#000000',
    textSecondary: '#6c757d',
    textMuted: '#adb5bd',
    accent: '#ff0080',
    accentGreen: '#00ff88',
    accentBlue: '#0080ff',
    accentPurple: '#8000ff',
    accentOrange: '#ff8000',
    border: '#dee2e6',
  },
} as const;
