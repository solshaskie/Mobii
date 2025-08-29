// Camera AI Module Types

export interface CameraAIConfig {
  enablePoseDetection: boolean;
  enableVoiceFeedback: boolean;
  enableAROverlay: boolean;
  enablePhotoCapture: boolean;
  analysisFrequency: number; // milliseconds
  confidenceThreshold: number; // 0-1
}

export interface PoseAnalysisResult {
  confidence: number;
  poseKeypoints: Array<{
    x: number;
    y: number;
    confidence: number;
  }>;
  postureStatus: 'good' | 'needs_adjustment' | 'poor';
  recommendations: string[];
  timestamp: number;
}

export interface BodyPositionData {
  isInFrame: boolean;
  distance: number; // percentage
  position: 'front' | 'back' | 'left' | 'right';
  confidence: number;
  targetZone: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface AROverlayConfig {
  showTargetZone: boolean;
  showPoseSkeleton: boolean;
  showGuidelines: boolean;
  targetZoneColor: string;
  skeletonColor: string;
  guidelineColor: string;
}

export interface VoiceFeedbackConfig {
  enabled: boolean;
  voiceType: 'motivational' | 'calm' | 'professional' | 'friendly' | 'energetic';
  feedbackFrequency: 'realtime' | 'periodic' | 'on_demand';
  language: string;
}

export interface PhotoCaptureConfig {
  enabled: boolean;
  positions: Array<'front' | 'back' | 'left' | 'right'>;
  autoCapture: boolean;
  countdownDuration: number;
  quality: 'low' | 'medium' | 'high';
}

// Module state interfaces
export interface CameraAIState {
  isActive: boolean;
  isAnalyzing: boolean;
  currentPose: PoseAnalysisResult | null;
  bodyPosition: BodyPositionData | null;
  overlayConfig: AROverlayConfig;
  voiceConfig: VoiceFeedbackConfig;
  photoConfig: PhotoCaptureConfig;
  errors: string[];
}

// Event interfaces
export interface CameraAIEvents {
  onPoseDetected: (result: PoseAnalysisResult) => void;
  onBodyPositionChanged: (data: BodyPositionData) => void;
  onPhotoCaptured: (photoData: string, position: string) => void;
  onError: (error: string) => void;
  onStatusChanged: (status: string) => void;
}
