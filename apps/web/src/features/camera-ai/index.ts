// Camera AI Module - Main Export
// This module handles all camera-related functionality including:
// - Camera access and video streaming
// - Pose detection and body tracking
// - AR overlay rendering
// - Voice feedback integration
// - Photo capture automation

export { default as CameraWorkoutPlayer } from './components/CameraWorkoutPlayer';
export { default as AutomatedPhotoCapture } from './components/AutomatedPhotoCapture';
export { default as DynamicAROverlay } from './components/DynamicAROverlay';

export { default as PoseDetectionService } from './services/PoseDetectionService';
export { default as BodyTrackingService } from './services/BodyTrackingService';

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
