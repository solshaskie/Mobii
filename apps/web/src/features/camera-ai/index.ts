// Camera AI Module - Main Export
// This module handles all camera-related functionality including:
// - Camera access and video streaming
// - Pose detection and body tracking
// - AR overlay rendering
// - Voice feedback integration
// - Photo capture automation

export { CameraWorkoutPlayer } from './components/camera-workout-player';
export { AutomatedPhotoCapture } from './components/automated-photo-capture';
export { DynamicAROverlay } from './components/dynamic-ar-overlay';

export { PoseDetectionService } from './services/pose-detection-service';
export { BodyTrackingService } from './services/body-tracking-service';

export type { CameraAIConfig } from './types';
export type { PoseAnalysisResult } from './types';
export type { BodyPositionData } from './types';

// Feature gate for premium camera AI features
export const cameraAIFeatureGate = {
  isEnabled: (userId?: string) => {
    // TODO: Implement user-based feature checking
    // For now, always enabled for development
    return true;
  },
  requirePremium: true,
  features: {
    advancedPoseDetection: true,
    realTimeFormCorrection: true,
    automatedPhotoCapture: true,
    voiceCoaching: true,
  }
};
