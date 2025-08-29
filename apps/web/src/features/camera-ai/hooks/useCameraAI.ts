// Camera AI Module Hook
// Centralized state management for all camera AI functionality

import { useState, useCallback, useRef, useEffect } from 'react';
import { CameraAIState, CameraAIEvents, CameraAIConfig, PoseAnalysisResult, BodyPositionData } from '../types';
import { defaultCameraAIConfig, defaultAROverlayConfig, defaultVoiceFeedbackConfig, defaultPhotoCaptureConfig } from '../config';

interface UseCameraAIOptions {
  config?: Partial<CameraAIConfig>;
  events?: Partial<CameraAIEvents>;
  userId?: string;
}

export const useCameraAI = (options: UseCameraAIOptions = {}) => {
  const { config = {}, events = {}, userId } = options;
  
  // Merge default config with provided config
  const mergedConfig = { ...defaultCameraAIConfig, ...config };
  
  // State management
  const [state, setState] = useState<CameraAIState>({
    isActive: false,
    isAnalyzing: false,
    currentPose: null,
    bodyPosition: null,
    overlayConfig: defaultAROverlayConfig,
    voiceConfig: defaultVoiceFeedbackConfig,
    photoConfig: defaultPhotoCaptureConfig,
    errors: [],
  });

  // Refs for cleanup
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastAnalysisTimeRef = useRef<number>(0);

  // Update state helper
  const updateState = useCallback((updates: Partial<CameraAIState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Add error helper
  const addError = useCallback((error: string) => {
    updateState({ errors: [...state.errors, error] });
    events.onError?.(error);
  }, [state.errors, updateState, events]);

  // Clear errors helper
  const clearErrors = useCallback(() => {
    updateState({ errors: [] });
  }, [updateState]);

  // Start camera AI
  const startCameraAI = useCallback(async () => {
    try {
      updateState({ isActive: true, errors: [] });
      events.onStatusChanged?.('Camera AI started');
      
      // TODO: Initialize camera, pose detection, etc.
      
    } catch (error) {
      addError(`Failed to start camera AI: ${error}`);
    }
  }, [updateState, addError, events]);

  // Stop camera AI
  const stopCameraAI = useCallback(() => {
    try {
      updateState({ isActive: false, isAnalyzing: false });
      
      // Cleanup intervals
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
        analysisIntervalRef.current = null;
      }
      
      events.onStatusChanged?.('Camera AI stopped');
      
    } catch (error) {
      addError(`Failed to stop camera AI: ${error}`);
    }
  }, [updateState, addError, events]);

  // Update pose analysis
  const updatePoseAnalysis = useCallback((poseResult: PoseAnalysisResult) => {
    updateState({ currentPose: poseResult });
    events.onPoseDetected?.(poseResult);
  }, [updateState, events]);

  // Update body position
  const updateBodyPosition = useCallback((bodyData: BodyPositionData) => {
    updateState({ bodyPosition: bodyData });
    events.onBodyPositionChanged?.(bodyData);
  }, [updateState, events]);

  // Update overlay configuration
  const updateOverlayConfig = useCallback((overlayConfig: Partial<typeof state.overlayConfig>) => {
    updateState({ overlayConfig: { ...state.overlayConfig, ...overlayConfig } });
  }, [state.overlayConfig, updateState]);

  // Update voice configuration
  const updateVoiceConfig = useCallback((voiceConfig: Partial<typeof state.voiceConfig>) => {
    updateState({ voiceConfig: { ...state.voiceConfig, ...voiceConfig } });
  }, [state.voiceConfig, updateState]);

  // Update photo configuration
  const updatePhotoConfig = useCallback((photoConfig: Partial<typeof state.photoConfig>) => {
    updateState({ photoConfig: { ...state.photoConfig, ...photoConfig } });
  }, [state.photoConfig, updateState]);

  // Check if feature is enabled (for premium features)
  const isFeatureEnabled = useCallback((feature: string) => {
    // TODO: Implement user-based feature checking
    // For now, return true for development
    return true;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current);
      }
    };
  }, []);

  return {
    // State
    state,
    
    // Actions
    startCameraAI,
    stopCameraAI,
    updatePoseAnalysis,
    updateBodyPosition,
    updateOverlayConfig,
    updateVoiceConfig,
    updatePhotoConfig,
    addError,
    clearErrors,
    isFeatureEnabled,
    
    // Configuration
    config: mergedConfig,
    
    // Status helpers
    isActive: state.isActive,
    isAnalyzing: state.isAnalyzing,
    hasErrors: state.errors.length > 0,
    currentPose: state.currentPose,
    bodyPosition: state.bodyPosition,
  };
};
