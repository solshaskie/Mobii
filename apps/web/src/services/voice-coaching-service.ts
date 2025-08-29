// Voice coaching service using Eleven Labs API
export class VoiceCoachingService {
  private apiKey = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  // Voice IDs for different coaching styles
  private voices = {
    motivational: '21m00Tcm4TlvDq8ikWAM', // Rachel - energetic, motivational
    calm: 'AZnzlk1XvdvUeBnXmlld', // Domi - calm, soothing
    professional: 'EXAVITQu4vr4xnSDxMaL', // Bella - professional, clear
    friendly: 'VR6AewLTigWG4xSOukaG', // Arnold - friendly, encouraging
    energetic: 'pNInz6obpgDQGcFmaJgB' // Adam - energetic, dynamic
  };

  constructor() {
    if (!this.apiKey) {
      console.warn('Eleven Labs API key not found. Voice coaching features will be disabled.');
    }
  }

  // Generate voice coaching for exercise instructions
  async generateExerciseInstructions(exerciseName: string, instructions: string[], voiceType: 'motivational' | 'calm' | 'professional' | 'friendly' | 'energetic' = 'professional'): Promise<string | null> {
    try {
      if (!this.apiKey) {
        return null;
      }

      const voiceId = this.voices[voiceType];
      const text = this.formatInstructionsForVoice(exerciseName, instructions);

      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Eleven Labs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Failed to generate exercise instructions:', error);
      return null;
    }
  }

  // Generate motivational coaching messages
  async generateMotivationalMessage(messageType: 'start' | 'during' | 'finish' | 'encouragement', voiceType: 'motivational' | 'calm' | 'professional' | 'friendly' | 'energetic' = 'motivational'): Promise<string | null> {
    try {
      if (!this.apiKey) {
        return null;
      }

      const voiceId = this.voices[voiceType];
      const text = this.getMotivationalMessage(messageType);

      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.7,
            similarity_boost: 0.7
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Eleven Labs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Failed to generate motivational message:', error);
      return null;
    }
  }

  // Generate form correction feedback
  async generateFormFeedback(exerciseName: string, feedback: string, voiceType: 'motivational' | 'calm' | 'professional' | 'friendly' | 'energetic' = 'professional'): Promise<string | null> {
    try {
      if (!this.apiKey) {
        return null;
      }

      const voiceId = this.voices[voiceType];
      const text = `For ${exerciseName}, remember: ${feedback}. Keep up the great work!`;

      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.6
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Eleven Labs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Failed to generate form feedback:', error);
      return null;
    }
  }

  // Generate workout countdown and timing cues
  async generateTimingCues(cueType: 'start' | 'countdown' | 'hold' | 'release' | 'next', duration?: number): Promise<string | null> {
    try {
      if (!this.apiKey) {
        return null;
      }

      const voiceId = this.voices.energetic;
      const text = this.getTimingCue(cueType, duration);

      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.8,
            similarity_boost: 0.8
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Eleven Labs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Failed to generate timing cues:', error);
      return null;
    }
  }

  // Generate complete workout narration
  async generateWorkoutNarration(workoutTitle: string, exercises: any[], voiceType: 'motivational' | 'calm' | 'professional' | 'friendly' | 'energetic' = 'professional'): Promise<string | null> {
    try {
      if (!this.apiKey) {
        return null;
      }

      const voiceId = this.voices[voiceType];
      const text = this.formatWorkoutNarration(workoutTitle, exercises);

      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.6
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Eleven Labs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error('Failed to generate workout narration:', error);
      return null;
    }
  }

  // Format instructions for voice narration
  private formatInstructionsForVoice(exerciseName: string, instructions: string[]): string {
    let text = `Let's do ${exerciseName}. `;
    
    instructions.forEach((instruction, index) => {
      text += `Step ${index + 1}: ${instruction}. `;
    });
    
    text += `Great job! You're doing amazing.`;
    
    return text;
  }

  // Get motivational messages
  private getMotivationalMessage(type: 'start' | 'during' | 'finish' | 'encouragement'): string {
    const messages = {
      start: [
        "Welcome to your workout! You're about to do something amazing for your body and mind. Let's get started!",
        "Ready to feel stronger and more energized? Let's begin this incredible journey together!",
        "You've made the choice to invest in yourself today. That's already a win! Let's make it count!"
      ],
      during: [
        "You're doing fantastic! Every movement is making you stronger.",
        "Keep going! You're building strength and confidence with every rep.",
        "You've got this! Your body is capable of incredible things.",
        "Stay focused and breathe. You're doing exactly what you need to do."
      ],
      finish: [
        "Congratulations! You've completed your workout. You should be proud of yourself!",
        "Amazing work! You've just given your body the gift of movement and strength.",
        "You did it! Every exercise you completed is a step toward a healthier, stronger you."
      ],
      encouragement: [
        "You're stronger than you think. Keep pushing forward!",
        "Every expert was once a beginner. You're on the right path!",
        "Your future self will thank you for this workout. Keep going!",
        "You're not just exercising, you're building a better version of yourself!"
      ]
    };

    const typeMessages = messages[type];
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  }

  // Get timing cues
  private getTimingCue(type: 'start' | 'countdown' | 'hold' | 'release' | 'next', duration?: number): string {
    switch (type) {
      case 'start':
        return "Ready? Let's begin!";
      case 'countdown':
        return duration ? `Hold for ${duration} more seconds.` : "Keep going!";
      case 'hold':
        return "Hold that position. Breathe deeply.";
      case 'release':
        return "Now release slowly. Great control!";
      case 'next':
        return "Next exercise coming up. Get ready!";
      default:
        return "Keep going!";
    }
  }

  // Format workout narration
  private formatWorkoutNarration(workoutTitle: string, exercises: any[]): string {
    let text = `Welcome to ${workoutTitle}. This workout includes ${exercises.length} exercises designed to strengthen and energize your body. `;
    
    exercises.forEach((exercise, index) => {
      text += `Exercise ${index + 1}: ${exercise.name}. ${exercise.description}. `;
    });
    
    text += "Remember to listen to your body and take breaks when needed. Let's begin!";
    
    return text;
  }

  // Get available voices
  async getAvailableVoices(): Promise<any[]> {
    try {
      if (!this.apiKey) {
        return [];
      }

      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Eleven Labs API error: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Failed to get available voices:', error);
      return [];
    }
  }

  // Test API connection
  async testConnection(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.log('No Eleven Labs API key found');
        return false;
      }

      console.log('Testing Eleven Labs API connection...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('Eleven Labs API connection successful');
        return true;
      } else {
        console.log(`Eleven Labs API error: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error('Voice coaching API test failed:', error);
      return false;
    }
  }
}
