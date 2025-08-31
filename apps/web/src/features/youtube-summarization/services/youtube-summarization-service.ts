'use client';

// Remove OpenAI and other API dependencies
// import OpenAI from 'openai';
import { 
  YouTubeVideoInfo, 
  VideoTranscript, 
  VideoSummary, 
  AINarration, 
  SummarizedWorkout 
} from '../types';

class YouTubeSummarizationService {
  // Remove API dependencies
  // private openai: OpenAI;
  // private youtubeApiKey: string;
  // private elevenLabsApiKey: string;

  constructor() {
    // Remove API initialization
    // this.openai = new OpenAI({
    //   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    //   dangerouslyAllowBrowser: true,
    // });
    // this.youtubeApiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '';
    // this.elevenLabsApiKey = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY || '';
  }

  // Extract video information from YouTube API (mock implementation)
  async getVideoInfo(videoId: string): Promise<YouTubeVideoInfo> {
    // Mock video info instead of using YouTube API
    const mockVideoInfo: YouTubeVideoInfo = {
      videoId,
      title: "Chair Yoga for Beginners - Complete 15 Minute Session",
      description: "A gentle chair yoga session perfect for beginners. This 15-minute workout focuses on flexibility, breathing, and mindfulness.",
      duration: "PT15M30S",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      channelTitle: "Mobii Fitness",
      publishedAt: "2024-01-15T10:00:00Z",
      viewCount: "125000",
      likeCount: "8500"
    };

    return mockVideoInfo;
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
      },
      {
        text: "Slowly tilt your head to the right, hold for three breaths.",
        start: 28,
        duration: 6,
        confidence: 0.89
      },
      {
        text: "Now tilt to the left side, feeling the stretch in your neck.",
        start: 34,
        duration: 6,
        confidence: 0.90
      },
      {
        text: "Let's do some seated spinal twists to improve flexibility.",
        start: 40,
        duration: 8,
        confidence: 0.93
      },
      {
        text: "Place your right hand on your left knee and twist gently.",
        start: 48,
        duration: 7,
        confidence: 0.87
      },
      {
        text: "Hold this position for three deep breaths.",
        start: 55,
        duration: 5,
        confidence: 0.92
      }
    ];

    return mockTranscript;
  }

  // Generate AI summary and workout instructions (mock implementation)
  async generateSummary(transcript: VideoTranscript[]): Promise<VideoSummary> {
    // Mock summary instead of using AI
    const mockSummary: VideoSummary = {
      title: "Chair Yoga for Beginners",
      summary: "This 15-minute chair yoga session focuses on gentle stretching, breathing exercises, and mindfulness. Perfect for beginners or those with limited mobility.",
      keyPoints: [
        "Gentle shoulder and neck stretches",
        "Breathing exercises for relaxation",
        "Seated spinal twists for flexibility",
        "Mindful movement and body awareness"
      ],
      difficulty: "beginner",
      duration: "15 minutes",
      equipment: ["chair"],
      targetMuscles: ["neck", "shoulders", "back", "core"]
    };

    return mockSummary;
  }

  // Generate AI narration (mock implementation)
  async generateNarration(summary: VideoSummary): Promise<AINarration> {
    // Mock narration instead of using AI
    const mockNarration: AINarration = {
      script: [
        "Welcome to your chair yoga session. Let's begin with some gentle breathing.",
        "Take a deep breath in through your nose, filling your lungs completely.",
        "Now exhale slowly through your mouth, releasing any tension.",
        "Let's start with shoulder rolls. Roll your shoulders forward in a circular motion.",
        "Now roll them backward, feeling the movement in your upper back.",
        "Great! Now let's do some neck stretches. Tilt your head gently to the right.",
        "Hold this position for three breaths, feeling the stretch in your neck.",
        "Now tilt to the left side, maintaining the same gentle pressure.",
        "Let's move to spinal twists. Place your right hand on your left knee.",
        "Twist your torso to the left, looking over your shoulder.",
        "Hold this position for three deep breaths.",
        "Now switch sides, placing your left hand on your right knee.",
        "Twist to the right and hold for three breaths.",
        "Excellent work! Let's finish with some gentle breathing.",
        "Take three more deep breaths, feeling the benefits of your practice."
      ],
      audioUrl: null, // No audio generation without API
      duration: 180 // 3 minutes
    };

    return mockNarration;
  }

  // Generate summarized workout (mock implementation)
  async generateWorkout(summary: VideoSummary, narration: AINarration): Promise<SummarizedWorkout> {
    // Mock workout instead of using AI
    const mockWorkout: SummarizedWorkout = {
      id: `workout_${Date.now()}`,
      title: summary.title,
      description: summary.summary,
      exercises: [
        {
          name: "Breathing Exercise",
          duration: 60,
          instructions: ["Sit tall", "Breathe deeply", "Focus on your breath"],
          targetMuscles: ["core"]
        },
        {
          name: "Shoulder Rolls",
          duration: 90,
          instructions: ["Roll shoulders forward", "Roll shoulders backward", "Repeat 5 times"],
          targetMuscles: ["shoulders", "upper back"]
        },
        {
          name: "Neck Stretches",
          duration: 120,
          instructions: ["Tilt head right", "Hold 3 breaths", "Tilt head left", "Hold 3 breaths"],
          targetMuscles: ["neck"]
        },
        {
          name: "Spinal Twists",
          duration: 180,
          instructions: ["Place right hand on left knee", "Twist left", "Hold 3 breaths", "Switch sides"],
          targetMuscles: ["core", "back"]
        }
      ],
      totalDuration: 450, // 7.5 minutes
      difficulty: summary.difficulty,
      equipment: summary.equipment,
      tips: [
        "Move slowly and mindfully",
        "Listen to your body",
        "Don't force any movements",
        "Breathe deeply throughout"
      ]
    };

    return mockWorkout;
  }

  // Main method to process a YouTube video
  async processVideo(videoUrl: string): Promise<SummarizedWorkout> {
    try {
      // Extract video ID from URL
      const videoId = this.extractVideoId(videoUrl);
      
      // Get video information
      const videoInfo = await this.getVideoInfo(videoId);
      
      // Extract transcript
      const transcript = await this.extractTranscript(videoId);
      
      // Generate summary
      const summary = await this.generateSummary(transcript);
      
      // Generate narration
      const narration = await this.generateNarration(summary);
      
      // Generate final workout
      const workout = await this.generateWorkout(summary, narration);
      
      return workout;
    } catch (error) {
      console.error('Error processing video:', error);
      throw new Error('Failed to process video. Please try again.');
    }
  }

  // Helper method to extract video ID from YouTube URL
  private extractVideoId(url: string): string {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : 'dQw4w9WgXcQ'; // Default fallback
  }
}

// Create singleton instance
const youtubeSummarizationService = new YouTubeSummarizationService();

export default youtubeSummarizationService;
