// Camera AI Module Configuration
import { CameraAIConfig, AROverlayConfig, VoiceFeedbackConfig, PhotoCaptureConfig } from './types';

// Default configuration for the camera AI module
export const defaultCameraAIConfig: CameraAIConfig = {
  enablePoseDetection: true,
  enableVoiceFeedback: true,
  enableAROverlay: true,
  enablePhotoCapture: true,
  analysisFrequency: 100, // 100ms between analyses
  confidenceThreshold: 0.7, // 70% confidence required
};

// Default AR overlay configuration
export const defaultAROverlayConfig: AROverlayConfig = {
  showTargetZone: true,
  showPoseSkeleton: true,
  showGuidelines: true,
  targetZoneColor: '#00ff00', // Green
  skeletonColor: '#ffffff', // White
  guidelineColor: '#ffff00', // Yellow
};

// Default voice feedback configuration
export const defaultVoiceFeedbackConfig: VoiceFeedbackConfig = {
  enabled: true,
  voiceType: 'motivational',
  feedbackFrequency: 'realtime',
  language: 'en-US',
};

// Default photo capture configuration
export const defaultPhotoCaptureConfig: PhotoCaptureConfig = {
  enabled: true,
  positions: ['front', 'back', 'left', 'right'],
  autoCapture: true,
  countdownDuration: 3,
  quality: 'medium',
};

// Feature flags for premium features
export const cameraAIFeatures = {
  basic: {
    poseDetection: true,
    simpleOverlay: true,
  },
  premium: {
    advancedPoseDetection: true,
    realTimeFormCorrection: true,
    automatedPhotoCapture: true,
    voiceCoaching: true,
    customOverlays: true,
    progressTracking: true,
  },
};

// Performance settings
export const performanceConfig = {
  maxAnalysisFrequency: 50, // Minimum 50ms between analyses
  maxVideoResolution: { width: 1280, height: 720 },
  maxPhotoQuality: 'high',
  enableCaching: true,
  cacheSize: 100, // Number of cached results
};

// Error handling configuration
export const errorConfig = {
  maxRetries: 3,
  retryDelay: 1000, // 1 second
  showUserErrors: true,
  logErrors: true,
  fallbackMode: true,
};
