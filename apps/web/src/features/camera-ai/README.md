# Camera AI Module

## Overview

The Camera AI Module is a self-contained feature module that handles all camera-related functionality in the Mobii app. It provides pose detection, body tracking, AR overlays, voice feedback, and automated photo capture capabilities.

## Architecture

```
camera-ai/
├── components/          # React components
├── services/           # Business logic and API calls
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types.ts            # TypeScript type definitions
├── config.ts           # Module configuration
├── index.ts            # Main exports
└── README.md           # This file
```

## Features

### Core Features (Free)
- Basic pose detection
- Simple AR overlay
- Camera access and video streaming

### Premium Features
- Advanced pose detection with form correction
- Real-time voice coaching
- Automated photo capture
- Custom AR overlays
- Advanced progress tracking

## Usage

### Basic Implementation

```typescript
import { useCameraAI, CameraWorkoutPlayer } from '@/features/camera-ai';

function MyComponent() {
  const cameraAI = useCameraAI({
    config: {
      enablePoseDetection: true,
      enableVoiceFeedback: true,
    },
    events: {
      onPoseDetected: (result) => console.log('Pose detected:', result),
      onError: (error) => console.error('Camera AI error:', error),
    },
  });

  return (
    <CameraWorkoutPlayer
      isActive={cameraAI.isActive}
      onStart={cameraAI.startCameraAI}
      onStop={cameraAI.stopCameraAI}
    />
  );
}
```

### Feature Flag Usage

```typescript
import { checkFeatureFlag } from '@/features/camera-ai/utils/featureFlags';

function MyComponent() {
  const hasVoiceCoaching = checkFeatureFlag('voiceCoaching', userId);
  
  return (
    <div>
      {hasVoiceCoaching ? (
        <VoiceCoachingComponent />
      ) : (
        <UpgradePrompt />
      )}
    </div>
  );
}
```

## Configuration

### Default Configuration

```typescript
const defaultConfig = {
  enablePoseDetection: true,
  enableVoiceFeedback: true,
  enableAROverlay: true,
  enablePhotoCapture: true,
  analysisFrequency: 100, // milliseconds
  confidenceThreshold: 0.7, // 70%
};
```

### Custom Configuration

```typescript
const customConfig = {
  enablePoseDetection: true,
  enableVoiceFeedback: false, // Disable voice for testing
  analysisFrequency: 200, // Slower analysis for performance
  confidenceThreshold: 0.8, // Higher confidence requirement
};
```

## State Management

The module uses a centralized state management system through the `useCameraAI` hook:

```typescript
const {
  state,              // Full state object
  isActive,           // Boolean status
  isAnalyzing,        // Analysis status
  hasErrors,          // Error status
  currentPose,        // Current pose data
  bodyPosition,       // Body position data
  startCameraAI,      // Start function
  stopCameraAI,       // Stop function
  updatePoseAnalysis, // Update pose data
  addError,           // Add error
  clearErrors,        // Clear errors
} = useCameraAI();
```

## Event Handling

The module provides a comprehensive event system:

```typescript
const events = {
  onPoseDetected: (result: PoseAnalysisResult) => {
    // Handle pose detection
  },
  onBodyPositionChanged: (data: BodyPositionData) => {
    // Handle body position changes
  },
  onPhotoCaptured: (photoData: string, position: string) => {
    // Handle photo capture
  },
  onError: (error: string) => {
    // Handle errors
  },
  onStatusChanged: (status: string) => {
    // Handle status changes
  },
};
```

## Error Handling

The module includes comprehensive error handling:

```typescript
// Automatic error handling
const cameraAI = useCameraAI({
  events: {
    onError: (error) => {
      // Log error, show user notification, etc.
      console.error('Camera AI Error:', error);
      showNotification('Camera AI Error', error);
    },
  },
});

// Manual error handling
cameraAI.addError('Custom error message');
cameraAI.clearErrors();
```

## Performance Considerations

### Analysis Frequency
- Default: 100ms between analyses
- Adjustable via `analysisFrequency` config
- Minimum: 50ms (performance limit)

### Video Resolution
- Default: 1280x720
- Configurable via `maxVideoResolution`
- Lower resolution = better performance

### Caching
- Results cached for 100 entries
- Configurable via `cacheSize`
- Disable with `enableCaching: false`

## Testing

### Unit Testing
```typescript
import { renderHook } from '@testing-library/react';
import { useCameraAI } from '@/features/camera-ai';

test('should initialize with default state', () => {
  const { result } = renderHook(() => useCameraAI());
  
  expect(result.current.isActive).toBe(false);
  expect(result.current.hasErrors).toBe(false);
});
```

### Integration Testing
```typescript
import { render, screen } from '@testing-library/react';
import { CameraWorkoutPlayer } from '@/features/camera-ai';

test('should render camera player', () => {
  render(<CameraWorkoutPlayer isActive={false} />);
  
  expect(screen.getByText('Start Camera')).toBeInTheDocument();
});
```

## Troubleshooting

### Common Issues

1. **Camera not starting**
   - Check browser permissions
   - Verify HTTPS (required for camera access)
   - Check for other apps using camera

2. **Poor performance**
   - Reduce analysis frequency
   - Lower video resolution
   - Disable unnecessary features

3. **Overlay not showing**
   - Check z-index values
   - Verify canvas positioning
   - Ensure video element is properly sized

### Debug Mode

Enable debug mode for detailed logging:

```typescript
const cameraAI = useCameraAI({
  config: {
    debug: true, // Enable debug logging
  },
});
```

## Future Enhancements

- [ ] Multi-camera support
- [ ] Advanced pose estimation models
- [ ] Real-time collaboration features
- [ ] Integration with wearable devices
- [ ] AI-powered exercise recommendations
- [ ] Social sharing features

## Contributing

When contributing to this module:

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include error handling
4. Add unit tests
5. Update documentation
6. Consider feature flag implications

## License

This module is part of the Mobii app and follows the same license terms.
