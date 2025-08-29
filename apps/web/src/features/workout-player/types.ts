// Workout Player Module Types

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  publishedAt: string;
  channelTitle: string;
  viewCount: string;
  likeCount: string;
  videoUrl: string;
}

export interface VideoSearchResult {
  videos: YouTubeVideo[];
  totalResults: number;
  nextPageToken?: string;
  prevPageToken?: string;
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

export interface ExerciseSearchResult {
  exercises: Exercise[];
  totalResults: number;
  categories: ExerciseCategory[];
  difficulties: ExerciseDifficulty[];
}
