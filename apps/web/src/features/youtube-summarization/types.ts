// Types for YouTube video summarization
export interface YouTubeVideoInfo {
  videoId: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
}

export interface VideoTranscript {
  text: string;
  start: number;
  duration: number;
  confidence: number;
}

export interface VideoSummary {
  summary: string;
  keyPoints: string[];
  exerciseInstructions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  calories: number;
  targetMuscles: string[];
  equipment: string[];
  safetyNotes: string[];
}

export interface AINarration {
  narrationText: string;
  audioUrl?: string;
  duration: number;
  voiceId: string;
}

export interface SummarizedWorkout {
  videoInfo: YouTubeVideoInfo;
  summary: VideoSummary;
  narration: AINarration;
  transcript: VideoTranscript[];
  createdAt: Date;
  workoutId: string;
}
