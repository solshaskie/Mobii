// Voice Coaching Module - Main Export
// This module handles all voice-related functionality including:
// - Text-to-Speech (TTS) for coaching
// - Speech recognition for voice commands
// - Voice feedback and instructions
// - Voice command processing

export { VoiceCoaching } from './components/voice-coaching';
export { VoiceCommand } from './components/voice-command';

export { VoiceCoachingService } from './services/voice-coaching-service';
export { VoiceCommandService } from './services/voice-command-service';

export type { VoiceCoachingConfig } from './types';
export type { VoiceCommandType } from './types';
export type { VoiceFeedback } from './types';

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
