// Voice Coaching Module
// - AI-powered voice coaching and feedback
// - Real-time voice commands and interactions
// - Multiple voice styles and personalities
// - Voice command processing

export { VoiceCoaching } from './components/voice-coaching';
export { VoiceCommand } from './components/voice-command';
export { RealTimeVoiceCoach } from './components/real-time-voice-coach';
export { VoiceSelector } from './components/voice-selector';

export { VoiceCoachingService } from './services/voice-coaching-service';
export { VoiceCommandService } from './services/voice-command-service';

export type { VoiceCoachingConfig } from './types';
export type { VoiceOption } from './components/voice-selector';

// Feature gate for premium voice coaching features
export const voiceCoachingFeatureGate = {
  isEnabled: (userId?: string) => {
    // TODO: Implement user-based feature checking
    // For now, always enabled for development
    return true;
  },
  requirePremium: true,
  features: {
    advancedVoiceCoaching: true,
    customVoiceTypes: true,
    realTimeVoiceCommands: true,
    multiLanguageSupport: true,
  }
};
