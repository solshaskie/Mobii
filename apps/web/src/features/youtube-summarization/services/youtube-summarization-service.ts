'use client';

import OpenAI from 'openai';
import { 
  YouTubeVideoInfo, 
  VideoTranscript, 
  VideoSummary, 
  AINarration, 
  SummarizedWorkout 
} from '../types';

class YouTubeSummarizationService {
  private openai: OpenAI;
  private youtubeApiKey: string;
  private elevenLabsApiKey: string;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true,
    });
    this.youtubeApiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';
    this.elevenLabsApiKey = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY || '';
  }

  // Extract video information from YouTube API
  async getVideoInfo(videoId: string): Promise<YouTubeVideoInfo> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${this.youtubeApiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch video information');
      }

      const data = await response.json();
      const video = data.items[0];

      if (!video) {
        throw new Error('Video not found');
      }

      return {
        videoId,
        title: video.snippet.title,
        description: video.snippet.description,
        duration: video.contentDetails.duration,
        thumbnail: video.snippet.thumbnails.high.url,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
      };
    } catch (error) {
      console.error('Error fetching video info:', error);
      throw error;
    }
  }

  // Extract transcript from YouTube video (mock implementation)
  async extractTranscript(videoId: string): Promise<VideoTranscript[]> {
    // Mock transcript for demonstration
    const mockTranscript: VideoTranscript[] = [
      {
        text: "Welcome to this chair yoga session. Let's start with some gentle stretches.",
        start: 0,
        duration: 5,
        confidence: 0.95
      },
      {
        text: "Sit comfortably in your chair with your feet flat on the ground.",
        start: 5,
        duration: 4,
        confidence: 0.92
      },
      {
        text: "Take a deep breath in through your nose, and exhale slowly.",
        start: 9,
        duration: 6,
        confidence: 0.88
      },
      {
        text: "Now, let's do some shoulder rolls. Roll your shoulders forward and back.",
        start: 15,
        duration: 8,
        confidence: 0.94
      },
      {
        text: "Great! Now let's move to some gentle neck stretches.",
        start: 23,
        duration: 5,
        confidence: 0.91
      }
    ];

    return mockTranscript;
  }

  // Generate AI summary and workout instructions
  async generateSummary(transcript: VideoTranscript[], videoInfo: YouTubeVideoInfo): Promise<VideoSummary> {
    try {
      const transcriptText = transcript.map(t => t.text).join(' ');
      
      const prompt = `
You are a professional fitness trainer. Analyze this YouTube video transcript and create a workout summary.

Video Title: ${videoInfo.title}
Transcript: ${transcriptText}

Provide a JSON response with:
- summary: 2-3 sentence summary
- keyPoints: 3-5 key points
- exerciseInstructions: step-by-step instructions
- difficulty: beginner/intermediate/advanced
- duration: estimated minutes
- calories: estimated calories
- targetMuscles: muscle groups targeted
- equipment: equipment needed
- safetyNotes: safety considerations
`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional fitness trainer. Provide accurate, safe exercise instructions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      let summaryData;
      try {
        summaryData = JSON.parse(response);
      } catch (error) {
        console.error('Failed to parse OpenAI response:', response);
        throw new Error('Invalid response format from AI');
      }

      return {
        summary: summaryData.summary || 'A comprehensive workout session',
        keyPoints: summaryData.keyPoints || ['Focus on form', 'Breathe steadily', 'Listen to your body'],
        exerciseInstructions: summaryData.exerciseInstructions || ['Start with warm-up', 'Follow the instructor', 'Cool down properly'],
        difficulty: summaryData.difficulty || 'beginner',
        duration: summaryData.duration || 15,
        calories: summaryData.calories || 120,
        targetMuscles: summaryData.targetMuscles || ['Full body'],
        equipment: summaryData.equipment || ['Chair'],
        safetyNotes: summaryData.safetyNotes || ['Stop if you feel pain', 'Modify as needed'],
      };
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

  // Generate AI narration
  async generateNarration(summary: VideoSummary, voiceId: string = 'alloy'): Promise<AINarration> {
    try {
      const narrationText = `
Welcome to your AI-narrated workout session. ${summary.summary}

Key points: ${summary.keyPoints.join('. ')}

Exercise instructions:
${summary.exerciseInstructions.map((instruction, index) => 
  `Step ${index + 1}: ${instruction}`
).join('\n')}

Safety notes: ${summary.safetyNotes.join('. ')}

This workout targets: ${summary.targetMuscles.join(', ')}.
Duration: ${summary.duration} minutes.
Calories: approximately ${summary.calories}.

Let's get started!
      `.trim();

      let audioUrl;
      if (this.elevenLabsApiKey) {
        audioUrl = await this.generateAudio(narrationText, voiceId);
      }

      return {
        narrationText,
        audioUrl,
        duration: summary.duration * 60,
        voiceId,
      };
    } catch (error) {
      console.error('Error generating narration:', error);
      throw error;
    }
  }

  // Generate audio using Eleven Labs TTS
  private async generateAudio(text: string, voiceId: string): Promise<string> {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.elevenLabsApiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      return audioUrl;
    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    }
  }

  // Main method to process a YouTube video
  async processVideo(videoId: string, voiceId: string = 'alloy'): Promise<SummarizedWorkout> {
    try {
      console.log('Processing video:', videoId);

      const videoInfo = await this.getVideoInfo(videoId);
      const transcript = await this.extractTranscript(videoId);
      const summary = await this.generateSummary(transcript, videoInfo);
      const narration = await this.generateNarration(summary, voiceId);

      const workout: SummarizedWorkout = {
        videoInfo,
        summary,
        narration,
        transcript,
        createdAt: new Date(),
        workoutId: `workout_${videoId}_${Date.now()}`,
      };

      this.saveWorkout(workout);
      return workout;
    } catch (error) {
      console.error('Error processing video:', error);
      throw error;
    }
  }

  // Save workout to localStorage
  private saveWorkout(workout: SummarizedWorkout): void {
    try {
      const existingWorkouts = this.getSavedWorkouts();
      existingWorkouts.push(workout);
      
      if (existingWorkouts.length > 50) {
        existingWorkouts.splice(0, existingWorkouts.length - 50);
      }
      
      localStorage.setItem('mobii_summarized_workouts', JSON.stringify(existingWorkouts));
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  }

  // Get saved workouts from localStorage
  getSavedWorkouts(): SummarizedWorkout[] {
    try {
      const saved = localStorage.getItem('mobii_summarized_workouts');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved workouts:', error);
      return [];
    }
  }

  // Get a specific workout by ID
  getWorkout(workoutId: string): SummarizedWorkout | null {
    const workouts = this.getSavedWorkouts();
    return workouts.find(w => w.workoutId === workoutId) || null;
  }

  // Delete a workout
  deleteWorkout(workoutId: string): void {
    try {
      const workouts = this.getSavedWorkouts();
      const filteredWorkouts = workouts.filter(w => w.workoutId !== workoutId);
      localStorage.setItem('mobii_summarized_workouts', JSON.stringify(filteredWorkouts));
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  }

  // Search YouTube for fitness videos
  async searchFitnessVideos(query: string, maxResults: number = 10): Promise<YouTubeVideoInfo[]> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoDuration=medium&videoCategoryId=17&maxResults=${maxResults}&key=${this.youtubeApiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to search YouTube');
      }

      const data = await response.json();
      
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',');
      const detailedResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${this.youtubeApiKey}`
      );
      
      if (!detailedResponse.ok) {
        throw new Error('Failed to fetch video details');
      }

      const detailedData = await detailedResponse.json();
      
      return detailedData.items.map((video: any) => ({
        videoId: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        duration: video.contentDetails.duration,
        thumbnail: video.snippet.thumbnails.high.url,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
      }));
    } catch (error) {
      console.error('Error searching videos:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const youtubeSummarizationService = new YouTubeSummarizationService();
