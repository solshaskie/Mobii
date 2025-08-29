// Voice Coaching Module Types

export interface VoiceCoachingConfig {
  enabled: boolean;
  voiceType: 'motivational' | 'calm' | 'professional' | 'friendly' | 'energetic';
  language: string;
  speed: number; // 0.5 to 2.0
  volume: number; // 0 to 1
  autoPlay: boolean;
}

export interface VoiceCommandType {
  command: string;
  description: string;
  action: () => void;
  keywords: string[];
  confidence: number;
}

export interface VoiceFeedback {
  text: string;
  voiceType: string;
  priority: 'low' | 'medium' | 'high';
  duration?: number;
  callback?: () => void;
}

export interface SpeechRecognitionConfig {
  enabled: boolean;
  language: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
}

export interface TTSConfig {
  enabled: boolean;
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
}

export interface VoiceCoachingState {
  isListening: boolean;
  isSpeaking: boolean;
  currentCommand: string | null;
  lastFeedback: VoiceFeedback | null;
  errors: string[];
  config: VoiceCoachingConfig;
}

export interface VoiceCoachingEvents {
  onCommandDetected: (command: string) => void;
  onFeedbackStarted: (feedback: VoiceFeedback) => void;
  onFeedbackEnded: (feedback: VoiceFeedback) => void;
  onError: (error: string) => void;
  onStatusChanged: (status: string) => void;
}

// Voice command definitions
export const VOICE_COMMANDS = {
  PAUSE: 'pause',
  STOP: 'stop',
  START: 'start',
  NEXT: 'next',
  PREVIOUS: 'previous',
  REPEAT: 'repeat',
  HELP: 'help',
  VOLUME_UP: 'volume up',
  VOLUME_DOWN: 'volume down',
  CHANGE_VOICE: 'change voice',
  CHECK_FORM: 'check form',
  HOW_MUCH_LONGER: 'how much longer',
  NEW_MUSIC: 'new music',
  MORE_EXERCISES: 'more exercises',
} as const;

export type VoiceCommandKey = keyof typeof VOICE_COMMANDS;
