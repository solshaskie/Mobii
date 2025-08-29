// Feature Flag System for Camera AI Module
// Manages which features are available based on user subscription

export interface FeatureFlag {
  name: string;
  description: string;
  isEnabled: (userId?: string) => boolean;
  requirePremium: boolean;
  fallback?: string; // What to show when disabled
}

export interface UserSubscription {
  userId: string;
  tier: 'free' | 'premium' | 'enterprise';
  features: string[];
  expiresAt?: Date;
}

// Feature definitions
export const cameraAIFeatures: Record<string, FeatureFlag> = {
  basicPoseDetection: {
    name: 'Basic Pose Detection',
    description: 'Simple pose detection with basic feedback',
    isEnabled: () => true, // Always available
    requirePremium: false,
  },
  
  advancedPoseDetection: {
    name: 'Advanced Pose Detection',
    description: 'Real-time form correction and detailed analysis',
    isEnabled: (userId) => {
      // TODO: Check user subscription
      return true; // For development
    },
    requirePremium: true,
    fallback: 'Upgrade to Premium for advanced pose detection',
  },
  
  voiceCoaching: {
    name: 'Voice Coaching',
    description: 'Real-time voice feedback and instructions',
    isEnabled: (userId) => {
      // TODO: Check user subscription
      return true; // For development
    },
    requirePremium: true,
    fallback: 'Upgrade to Premium for voice coaching',
  },
  
  automatedPhotoCapture: {
    name: 'Automated Photo Capture',
    description: 'AI-guided progress photo capture',
    isEnabled: (userId) => {
      // TODO: Check user subscription
      return true; // For development
    },
    requirePremium: true,
    fallback: 'Upgrade to Premium for automated photo capture',
  },
  
  customOverlays: {
    name: 'Custom AR Overlays',
    description: 'Customizable augmented reality overlays',
    isEnabled: (userId) => {
      // TODO: Check user subscription
      return true; // For development
    },
    requirePremium: true,
    fallback: 'Upgrade to Premium for custom overlays',
  },
  
  progressTracking: {
    name: 'Advanced Progress Tracking',
    description: 'Detailed progress analytics and insights',
    isEnabled: (userId) => {
      // TODO: Check user subscription
      return true; // For development
    },
    requirePremium: true,
    fallback: 'Upgrade to Premium for advanced progress tracking',
  },
};

// Feature flag checker
export const checkFeatureFlag = (featureName: string, userId?: string): boolean => {
  const feature = cameraAIFeatures[featureName];
  if (!feature) {
    console.warn(`Feature flag not found: ${featureName}`);
    return false;
  }
  
  return feature.isEnabled(userId);
};

// Get all enabled features for a user
export const getEnabledFeatures = (userId?: string): string[] => {
  return Object.entries(cameraAIFeatures)
    .filter(([_, feature]) => feature.isEnabled(userId))
    .map(([name, _]) => name);
};

// Get premium features that are disabled
export const getDisabledPremiumFeatures = (userId?: string): string[] => {
  return Object.entries(cameraAIFeatures)
    .filter(([_, feature]) => feature.requirePremium && !feature.isEnabled(userId))
    .map(([name, _]) => name);
};

// Check if user has premium access
export const hasPremiumAccess = (userId?: string): boolean => {
  const premiumFeatures = Object.values(cameraAIFeatures)
    .filter(feature => feature.requirePremium);
  
  return premiumFeatures.every(feature => feature.isEnabled(userId));
};

// Get feature information
export const getFeatureInfo = (featureName: string): FeatureFlag | null => {
  return cameraAIFeatures[featureName] || null;
};

// Mock user subscription (for development)
export const mockUserSubscription: UserSubscription = {
  userId: 'dev-user',
  tier: 'premium',
  features: Object.keys(cameraAIFeatures),
  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
};
