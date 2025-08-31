// AI Movement Analysis and Exercise Classification Types

export interface MovementFrame {
  timestamp: number;
  landmarks: PoseLandmarks;
  confidence: number;
  exercisePhase: 'preparation' | 'execution' | 'recovery' | 'rest';
}

export interface PoseLandmarks {
  nose: Point3D;
  leftEye: Point3D;
  rightEye: Point3D;
  leftEar: Point3D;
  rightEar: Point3D;
  leftShoulder: Point3D;
  rightShoulder: Point3D;
  leftElbow: Point3D;
  rightElbow: Point3D;
  leftWrist: Point3D;
  rightWrist: Point3D;
  leftHip: Point3D;
  rightHip: Point3D;
  leftKnee: Point3D;
  rightKnee: Point3D;
  leftAnkle: Point3D;
  rightAnkle: Point3D;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface ExercisePattern {
  id: string;
  name: string;
  category: ExerciseCategory;
  movementSequence: MovementSequence[];
  keyFrames: KeyFrame[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  targetMuscles: string[];
  equipment: string[];
  variations: string[];
  safetyNotes: string[];
  commonMistakes: string[];
  formCues: string[];
}

export interface MovementSequence {
  id: string;
  name: string;
  startFrame: number;
  endFrame: number;
  keyPoints: Point3D[];
  movementType: 'push' | 'pull' | 'squat' | 'lunge' | 'rotation' | 'balance' | 'cardio';
  intensity: number; // 0-1
  duration: number; // milliseconds
}

export interface KeyFrame {
  timestamp: number;
  landmarks: PoseLandmarks;
  description: string;
  formCheckpoints: FormCheckpoint[];
}

export interface FormCheckpoint {
  joint: string;
  angle: number;
  range: { min: number; max: number };
  importance: 'critical' | 'important' | 'minor';
}

export type ExerciseCategory = 
  | 'strength-training'
  | 'cardio'
  | 'flexibility'
  | 'balance'
  | 'functional'
  | 'sports-specific'
  | 'rehabilitation'
  | 'yoga'
  | 'pilates'
  | 'dance'
  | 'martial-arts'
  | 'calisthenics';

export interface AIWorkoutAnalysis {
  videoId: string;
  exercises: DetectedExercise[];
  workoutStructure: WorkoutStructure;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  totalDuration: number;
  estimatedCalories: number;
  targetMuscleGroups: string[];
  equipment: string[];
  safetyAssessment: SafetyAssessment;
  personalization: PersonalizationData;
}

export interface DetectedExercise {
  id: string;
  name: string;
  confidence: number;
  startTime: number;
  endTime: number;
  repetitions: number;
  sets: number;
  restPeriods: number[];
  formQuality: number; // 0-1
  variations: string[];
  modifications: string[];
}

export interface WorkoutStructure {
  warmup: DetectedExercise[];
  mainWorkout: DetectedExercise[];
  cooldown: DetectedExercise[];
  transitions: Transition[];
}

export interface Transition {
  fromExercise: string;
  toExercise: string;
  duration: number;
  instructions: string;
}

export interface SafetyAssessment {
  riskLevel: 'low' | 'medium' | 'high';
  concerns: string[];
  recommendations: string[];
  contraindications: string[];
}

export interface PersonalizationData {
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: string[];
  limitations: string[];
  preferences: string[];
  adaptations: string[];
}

export interface MovementLearningData {
  exercisePattern: ExercisePattern;
  videoAnalysis: AIWorkoutAnalysis;
  userPerformance: UserPerformanceData;
  improvements: Improvement[];
  nextWorkout: RecommendedWorkout;
}

export interface UserPerformanceData {
  formScore: number;
  completionRate: number;
  difficultyRating: number;
  enjoymentRating: number;
  areasForImprovement: string[];
  strengths: string[];
}

export interface Improvement {
  area: string;
  currentLevel: number;
  targetLevel: number;
  exercises: string[];
  timeline: number; // days
}

export interface RecommendedWorkout {
  exercises: DetectedExercise[];
  modifications: string[];
  progression: string[];
  alternatives: string[];
}

// Real-time coaching types
export interface RealTimeFeedback {
  timestamp: number;
  feedbackType: 'form' | 'pace' | 'safety' | 'motivation';
  message: string;
  urgency: 'low' | 'medium' | 'high';
  visualCue?: string;
  audioCue?: string;
}

export interface FormCorrection {
  joint: string;
  currentAngle: number;
  targetAngle: number;
  correction: string;
  visualGuide: string;
}

export interface WorkoutPrediction {
  nextExercise: string;
  confidence: number;
  timeRemaining: number;
  preparation: string[];
}
