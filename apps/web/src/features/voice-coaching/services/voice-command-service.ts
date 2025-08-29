// Voice command service using free Web Speech API

// Voice command service using free Web Speech API

export interface VoiceCommand {
  id: string;
  keywords: string[];
  action: string;
  description: string;
  response?: string;
}

export interface VoiceCommandResult {
  command: string;
  action: string;
  confidence: number;
  response?: string;
}

export class VoiceCommandService {
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  private isListening = false;
  private onCommandCallback: ((result: VoiceCommandResult) => void) | null = null;
  private onListeningChangeCallback: ((isListening: boolean) => void) | null = null;

  // Available voice commands
  private commands: VoiceCommand[] = [
    // Workout control commands
    {
      id: 'pause',
      keywords: ['pause', 'stop', 'hold', 'wait'],
      action: 'pause_workout',
      description: 'Pause the current workout',
      response: 'Workout paused. Say "resume" to continue.'
    },
    {
      id: 'resume',
      keywords: ['resume', 'continue', 'start', 'go', 'play'],
      action: 'resume_workout',
      description: 'Resume the paused workout',
      response: 'Resuming workout. Let\'s keep going!'
    },
    {
      id: 'stop',
      keywords: ['stop workout', 'end workout', 'finish', 'quit'],
      action: 'stop_workout',
      description: 'Stop and end the workout',
      response: 'Workout stopped. Great job today!'
    },

    // Voice coach commands
    {
      id: 'change_voice',
      keywords: ['change voice', 'new voice', 'different voice', 'switch voice'],
      action: 'change_voice_coach',
      description: 'Change the voice coach style',
      response: 'Changing voice coach. What style would you prefer?'
    },
    {
      id: 'motivational_voice',
      keywords: ['motivational', 'energetic', 'pump me up'],
      action: 'set_voice_motivational',
      description: 'Set voice to motivational style',
      response: 'Switching to motivational voice coach!'
    },
    {
      id: 'calm_voice',
      keywords: ['calm', 'relaxed', 'soothing', 'gentle'],
      action: 'set_voice_calm',
      description: 'Set voice to calm style',
      response: 'Switching to calm voice coach.'
    },
    {
      id: 'professional_voice',
      keywords: ['professional', 'clear', 'instructional'],
      action: 'set_voice_professional',
      description: 'Set voice to professional style',
      response: 'Switching to professional voice coach.'
    },

    // Form feedback commands
    {
      id: 'form_check',
      keywords: ['am i doing this correctly', 'how is my form', 'check my form', 'am i doing it right'],
      action: 'check_form',
      description: 'Get real-time form feedback',
      response: 'Let me check your form. Hold that position.'
    },
    {
      id: 'form_help',
      keywords: ['help me', 'i need help', 'what should i do', 'guide me'],
      action: 'get_form_help',
      description: 'Get help with current exercise',
      response: 'I\'ll guide you through this exercise step by step.'
    },

    // Music commands
    {
      id: 'change_music',
      keywords: ['change music', 'new music', 'different music', 'switch music'],
      action: 'change_music',
      description: 'Change the background music',
      response: 'Changing the music. What genre would you like?'
    },
    {
      id: 'motivational_music',
      keywords: ['motivational music', 'pump up music', 'energetic music'],
      action: 'set_music_motivational',
      description: 'Set music to motivational genre',
      response: 'Playing motivational music to keep you energized!'
    },
    {
      id: 'calm_music',
      keywords: ['calm music', 'relaxing music', 'peaceful music'],
      action: 'set_music_calm',
      description: 'Set music to calm genre',
      response: 'Switching to calming music for focus.'
    },

    // Time and progress commands
    {
      id: 'time_remaining',
      keywords: ['how much longer', 'time left', 'how much time', 'remaining time'],
      action: 'get_time_remaining',
      description: 'Get time remaining for current exercise',
      response: 'Let me check how much time is left.'
    },
    {
      id: 'workout_progress',
      keywords: ['how am i doing', 'my progress', 'workout status', 'how many reps'],
      action: 'get_workout_progress',
      description: 'Get current workout progress',
      response: 'Let me check your progress so far.'
    },

    // Exercise suggestions
    {
      id: 'similar_exercises',
      keywords: ['more like this', 'similar exercises', 'recommend exercises', 'what else'],
      action: 'get_similar_exercises',
      description: 'Get recommendations for similar exercises',
      response: 'I\'ll find some similar exercises for you.'
    },
    {
      id: 'next_exercise',
      keywords: ['next exercise', 'what\'s next', 'next workout', 'next move'],
      action: 'get_next_exercise',
      description: 'Get information about the next exercise',
      response: 'Let me tell you about the next exercise.'
    },

    // General commands
    {
      id: 'volume_up',
      keywords: ['volume up', 'louder', 'turn up volume', 'increase volume'],
      action: 'volume_up',
      description: 'Increase voice volume',
      response: 'Increasing volume.'
    },
    {
      id: 'volume_down',
      keywords: ['volume down', 'quieter', 'turn down volume', 'decrease volume'],
      action: 'volume_down',
      description: 'Decrease voice volume',
      response: 'Decreasing volume.'
    },
    {
      id: 'mute',
      keywords: ['mute', 'silence', 'quiet', 'turn off voice'],
      action: 'mute_voice',
      description: 'Mute voice coaching',
      response: 'Voice coaching muted. Say "unmute" to turn it back on.'
    },
    {
      id: 'unmute',
      keywords: ['unmute', 'turn on voice', 'enable voice', 'voice on'],
      action: 'unmute_voice',
      description: 'Unmute voice coaching',
      response: 'Voice coaching enabled again!'
    }
  ];

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.initializeSpeechRecognition();
      this.initializeSpeechSynthesis();
    }
  }

  private initializeSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        console.log('Voice recognition started');
        this.isListening = true;
        this.onListeningChangeCallback?.(true);
      };

      this.recognition.onend = () => {
        console.log('Voice recognition ended');
        this.isListening = false;
        this.onListeningChangeCallback?.(false);
        
        // Restart listening if it was active
        if (this.isListening) {
          this.startListening();
        }
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        const confidence = event.results[event.results.length - 1][0].confidence;
        
        console.log('Heard:', transcript, 'Confidence:', confidence);
        
        this.processCommand(transcript, confidence);
      };

      this.recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
        this.onListeningChangeCallback?.(false);
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }

  private initializeSpeechSynthesis(): void {
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }

  private processCommand(transcript: string, confidence: number): void {
    // Find the best matching command
    let bestMatch: VoiceCommand | null = null;
    let bestScore = 0;

    for (const command of this.commands) {
      for (const keyword of command.keywords) {
        if (transcript.includes(keyword.toLowerCase())) {
          const score = this.calculateMatchScore(transcript, keyword);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = command;
          }
        }
      }
    }

    if (bestMatch && bestScore > 0.3) { // Minimum confidence threshold
      const result: VoiceCommandResult = {
        command: transcript,
        action: bestMatch.action,
        confidence: confidence,
        response: bestMatch.response
      };

      console.log('Command recognized:', result);
      
      // Speak the response
      if (result.response) {
        this.speakResponse(result.response);
      }

      // Call the callback
      this.onCommandCallback?.(result);
    } else {
      console.log('No command recognized for:', transcript);
      this.speakResponse("I didn't understand that command. Try saying 'help' for available commands.");
    }
  }

  private calculateMatchScore(transcript: string, keyword: string): number {
    const transcriptWords = transcript.split(' ');
    const keywordWords = keyword.toLowerCase().split(' ');
    
    let matches = 0;
    for (const word of keywordWords) {
      if (transcriptWords.some(tw => tw.includes(word) || word.includes(tw))) {
        matches++;
      }
    }
    
    return matches / keywordWords.length;
  }

  private speakResponse(text: string): void {
    if (this.synthesis) {
      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      // Try to use a good voice
      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Natural') || 
        voice.name.includes('Premium')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      this.synthesis.speak(utterance);
    }
  }

  // Public methods
  startListening(): void {
    if (this.recognition && !this.isListening) {
      try {
        this.recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.onListeningChangeCallback?.(false);
    }
  }

  toggleListening(): void {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  isVoiceListening(): boolean {
    return this.isListening;
  }

  setOnCommand(callback: (result: VoiceCommandResult) => void): void {
    this.onCommandCallback = callback;
  }

  setOnListeningChange(callback: (isListening: boolean) => void): void {
    this.onListeningChangeCallback = callback;
  }

  getAvailableCommands(): VoiceCommand[] {
    return this.commands;
  }

  speakText(text: string): void {
    this.speakResponse(text);
  }

  // Test method
  testVoiceCommand(command: string): void {
    this.processCommand(command.toLowerCase(), 0.9);
  }
}

// Export singleton instance
export const voiceCommandService = new VoiceCommandService();
