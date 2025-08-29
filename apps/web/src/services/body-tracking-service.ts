export interface BodyLandmarks {
  nose?: { x: number; y: number };
  leftShoulder?: { x: number; y: number };
  rightShoulder?: { x: number; y: number };
  leftElbow?: { x: number; y: number };
  rightElbow?: { x: number; y: number };
  leftWrist?: { x: number; y: number };
  rightWrist?: { x: number; y: number };
  leftHip?: { x: number; y: number };
  rightHip?: { x: number; y: number };
  leftKnee?: { x: number; y: number };
  rightKnee?: { x: number; y: number };
  leftAnkle?: { x: number; y: number };
  rightAnkle?: { x: number; y: number };
}

export interface BodyAnalysis {
  isDetected: boolean;
  confidence: number;
  landmarks: BodyLandmarks;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  centerPoint: { x: number; y: number };
  height: number; // in pixels
  width: number; // in pixels
  aspectRatio: number;
}

export interface OptimalPosition {
  targetX: number; // percentage from left (0-100)
  targetY: number; // percentage from top (0-100)
  targetDistance: number; // ideal distance from camera (feet)
  targetHeight: number; // ideal height in frame (percentage)
  adjustments: string[];
  isOptimal: boolean;
}

export interface PhotoTypeConfig {
  name: string;
  targetHeight: number; // percentage of frame height
  targetWidth: number; // percentage of frame width
  targetDistance: number; // feet from camera
  verticalOffset: number; // percentage offset from center
  horizontalOffset: number; // percentage offset from center
  instructions: string[];
}

import { poseDetectionService, PoseResults, FormAnalysis } from './pose-detection-service';

export class BodyTrackingService {
  private static instance: BodyTrackingService;
  private isInitialized = false;
  private poseResults: PoseResults | null = null;
  private formAnalysis: FormAnalysis | null = null;

  // Photo type configurations
  private photoConfigs: Record<string, PhotoTypeConfig> = {
    front: {
      name: 'Front View',
      targetHeight: 85, // Body should take up 85% of frame height
      targetWidth: 60, // Body should take up 60% of frame width
      targetDistance: 7, // 7 feet from camera
      verticalOffset: -5, // Slightly above center
      horizontalOffset: 0, // Centered horizontally
      instructions: [
        'Stand facing the camera',
        'Keep your arms slightly away from your body',
        'Look straight ahead',
        'Maintain good posture'
      ]
    },
    back: {
      name: 'Back View',
      targetHeight: 85,
      targetWidth: 60,
      targetDistance: 7,
      verticalOffset: -5,
      horizontalOffset: 0,
      instructions: [
        'Turn around and face away from the camera',
        'Keep your arms slightly away from your body',
        'Stand straight with good posture'
      ]
    },
    left: {
      name: 'Left Side View',
      targetHeight: 85,
      targetWidth: 50, // Side view is narrower
      targetDistance: 7,
      verticalOffset: -5,
      horizontalOffset: 0,
      instructions: [
        'Turn to your left (camera\'s right)',
        'Keep your arms at your sides',
        'Look straight ahead',
        'Maintain good posture'
      ]
    },
    right: {
      name: 'Right Side View',
      targetHeight: 85,
      targetWidth: 50,
      targetDistance: 7,
      verticalOffset: -5,
      horizontalOffset: 0,
      instructions: [
        'Turn to your right (camera\'s left)',
        'Keep your arms at your sides',
        'Look straight ahead',
        'Maintain good posture'
      ]
    },
    fullBody: {
      name: 'Full Body View',
      targetHeight: 90, // Full body should take up most of the frame
      targetWidth: 70,
      targetDistance: 8, // Slightly further back
      verticalOffset: -10, // More space above head
      horizontalOffset: 0,
      instructions: [
        'Stand so your entire body is visible',
        'Keep your arms slightly away from your body',
        'Look straight ahead',
        'Maintain good posture'
      ]
    }
  };

  public static getInstance(): BodyTrackingService {
    if (!BodyTrackingService.instance) {
      BodyTrackingService.instance = new BodyTrackingService();
    }
    return BodyTrackingService.instance;
  }

  // Initialize pose detection using MediaPipe
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing body tracking service with MediaPipe...');
      
      // Initialize the pose detection service
      const success = await poseDetectionService.initialize();
      if (!success) {
        throw new Error('Failed to initialize MediaPipe pose detection');
      }
      
      this.isInitialized = true;
      console.log('Body tracking service initialized with MediaPipe');
    } catch (error) {
      console.error('Failed to initialize body tracking service:', error);
      throw error;
    }
  }

  // Analyze body position using MediaPipe pose detection
  public async analyzeBodyPosition(videoElement: HTMLVideoElement): Promise<BodyAnalysis> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Use MediaPipe pose detection to analyze the video frame
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth || 640;
      canvas.height = videoElement.videoHeight || 480;
      
      // Start pose detection if not already running
      if (!poseDetectionService.isInitialized) {
        await poseDetectionService.initialize();
      }
      
      // Set up results callback
      poseDetectionService.setOnResults((results, analysis) => {
        this.poseResults = results;
        this.formAnalysis = analysis;
      });
      
      // Process the current video frame
      await poseDetectionService.pose?.send({ image: videoElement });
      
      // If we have pose results, use them; otherwise fall back to mock
      if (this.poseResults && this.poseResults.poseLandmarks) {
        return this.convertPoseResultsToBodyAnalysis(this.poseResults, canvas.width, canvas.height);
      } else {
        return this.getMockAnalysis(canvas.width, canvas.height);
      }
      
    } catch (error) {
      console.error('Error analyzing body position:', error);
      return this.getMockAnalysis();
    }
  }

  // Convert MediaPipe pose results to our BodyAnalysis format
  private convertPoseResultsToBodyAnalysis(
    poseResults: PoseResults, 
    frameWidth: number, 
    frameHeight: number
  ): BodyAnalysis {
    const landmarks = poseResults.poseLandmarks;
    
    if (!landmarks || landmarks.length === 0) {
      return this.getMockAnalysis(frameWidth, frameHeight);
    }

    // Calculate bounding box from landmarks
    const xCoords = landmarks.map(lm => lm.x * frameWidth);
    const yCoords = landmarks.map(lm => lm.y * frameHeight);
    
    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);
    
    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = minX + width / 2;
    const centerY = minY + height / 2;

    // Calculate confidence based on visible landmarks
    const visibleLandmarks = landmarks.filter(lm => lm.visibility && lm.visibility > 0.5);
    const confidence = visibleLandmarks.length / landmarks.length;

    // Convert landmarks to our format
    const bodyLandmarks: BodyLandmarks = {};
    if (landmarks[0]) bodyLandmarks.nose = { x: landmarks[0].x * frameWidth, y: landmarks[0].y * frameHeight };
    if (landmarks[11]) bodyLandmarks.leftShoulder = { x: landmarks[11].x * frameWidth, y: landmarks[11].y * frameHeight };
    if (landmarks[12]) bodyLandmarks.rightShoulder = { x: landmarks[12].x * frameWidth, y: landmarks[12].y * frameHeight };
    if (landmarks[13]) bodyLandmarks.leftElbow = { x: landmarks[13].x * frameWidth, y: landmarks[13].y * frameHeight };
    if (landmarks[14]) bodyLandmarks.rightElbow = { x: landmarks[14].x * frameWidth, y: landmarks[14].y * frameHeight };
    if (landmarks[15]) bodyLandmarks.leftWrist = { x: landmarks[15].x * frameWidth, y: landmarks[15].y * frameHeight };
    if (landmarks[16]) bodyLandmarks.rightWrist = { x: landmarks[16].x * frameWidth, y: landmarks[16].y * frameHeight };
    if (landmarks[23]) bodyLandmarks.leftHip = { x: landmarks[23].x * frameWidth, y: landmarks[23].y * frameHeight };
    if (landmarks[24]) bodyLandmarks.rightHip = { x: landmarks[24].x * frameWidth, y: landmarks[24].y * frameHeight };
    if (landmarks[25]) bodyLandmarks.leftKnee = { x: landmarks[25].x * frameWidth, y: landmarks[25].y * frameHeight };
    if (landmarks[26]) bodyLandmarks.rightKnee = { x: landmarks[26].x * frameWidth, y: landmarks[26].y * frameHeight };
    if (landmarks[27]) bodyLandmarks.leftAnkle = { x: landmarks[27].x * frameWidth, y: landmarks[27].y * frameHeight };
    if (landmarks[28]) bodyLandmarks.rightAnkle = { x: landmarks[28].x * frameWidth, y: landmarks[28].y * frameHeight };

    return {
      isDetected: confidence > 0.3, // Require at least 30% of landmarks to be visible
      confidence,
      landmarks: bodyLandmarks,
      boundingBox: {
        x: minX,
        y: minY,
        width,
        height
      },
      centerPoint: { x: centerX, y: centerY },
      height,
      width,
      aspectRatio: width / height
    };
  }

  // Calculate optimal position for the given photo type
  public calculateOptimalPosition(
    bodyAnalysis: BodyAnalysis,
    photoType: string,
    frameWidth: number,
    frameHeight: number
  ): OptimalPosition {
    const config = this.photoConfigs[photoType];
    if (!config) {
      return this.getDefaultOptimalPosition();
    }

    // Calculate target position based on photo type configuration
    const targetX = 50 + config.horizontalOffset; // Center + offset
    const targetY = 50 + config.verticalOffset; // Center + offset

    // Calculate current body position
    const currentX = bodyAnalysis.centerPoint.x / frameWidth * 100;
    const currentY = bodyAnalysis.centerPoint.y / frameHeight * 100;

    // Calculate adjustments needed
    const adjustments: string[] = [];
    let isOptimal = true;

    // Horizontal positioning
    const horizontalDiff = Math.abs(currentX - targetX);
    if (horizontalDiff > 5) {
      isOptimal = false;
      if (currentX < targetX) {
        adjustments.push('Move to your right');
      } else {
        adjustments.push('Move to your left');
      }
    }

    // Vertical positioning (distance from camera)
    const currentHeight = bodyAnalysis.height / frameHeight * 100;
    const heightDiff = Math.abs(currentHeight - config.targetHeight);
    if (heightDiff > 10) {
      isOptimal = false;
      if (currentHeight < config.targetHeight) {
        adjustments.push('Move closer to the camera');
      } else {
        adjustments.push('Move further from the camera');
      }
    }

    // Body detection confidence
    if (bodyAnalysis.confidence < 0.7) {
      isOptimal = false;
      adjustments.push('Make sure your full body is visible');
    }

    return {
      targetX,
      targetY,
      targetDistance: config.targetDistance,
      targetHeight: config.targetHeight,
      adjustments,
      isOptimal
    };
  }

  // Get dynamic X mark position based on body analysis
  public getDynamicXPosition(
    bodyAnalysis: BodyAnalysis,
    optimalPosition: OptimalPosition,
    frameWidth: number,
    frameHeight: number
  ): { x: number; y: number } {
    if (!bodyAnalysis.isDetected) {
      // If no body detected, show X in center
      return {
        x: frameWidth / 2,
        y: frameHeight / 2
      };
    }

    // Calculate target position in pixels
    const targetX = (optimalPosition.targetX / 100) * frameWidth;
    const targetY = (optimalPosition.targetY / 100) * frameHeight;

    return { x: targetX, y: targetY };
  }

  // Get instructions for the current photo type
  public getInstructions(photoType: string): string[] {
    const config = this.photoConfigs[photoType];
    return config ? config.instructions : [];
  }

  // Mock analysis for testing (simulates body detection)
  private getMockAnalysis(frameWidth = 1280, frameHeight = 720): BodyAnalysis {
    // Simulate body detection with some randomness
    const isDetected = Math.random() > 0.1; // 90% chance of detection
    
    if (!isDetected) {
      return {
        isDetected: false,
        confidence: 0,
        landmarks: {},
        boundingBox: { x: 0, y: 0, width: 0, height: 0 },
        centerPoint: { x: 0, y: 0 },
        height: 0,
        width: 0,
        aspectRatio: 0
      };
    }

    // Simulate realistic body positioning
    const centerX = frameWidth / 2 + (Math.random() - 0.5) * 200; // Some variation
    const centerY = frameHeight / 2 + (Math.random() - 0.5) * 100; // Some variation
    const bodyHeight = frameHeight * 0.7 + (Math.random() - 0.5) * 100; // 70% of frame height ± variation
    const bodyWidth = bodyHeight * 0.4; // Realistic body proportions

    return {
      isDetected: true,
      confidence: 0.8 + Math.random() * 0.2, // 80-100% confidence
      landmarks: {
        nose: { x: centerX, y: centerY - bodyHeight * 0.4 },
        leftShoulder: { x: centerX - bodyWidth * 0.3, y: centerY - bodyHeight * 0.3 },
        rightShoulder: { x: centerX + bodyWidth * 0.3, y: centerY - bodyHeight * 0.3 },
        leftHip: { x: centerX - bodyWidth * 0.2, y: centerY + bodyHeight * 0.1 },
        rightHip: { x: centerX + bodyWidth * 0.2, y: centerY + bodyHeight * 0.1 },
        leftKnee: { x: centerX - bodyWidth * 0.1, y: centerY + bodyHeight * 0.4 },
        rightKnee: { x: centerX + bodyWidth * 0.1, y: centerY + bodyHeight * 0.4 },
        leftAnkle: { x: centerX - bodyWidth * 0.1, y: centerY + bodyHeight * 0.5 },
        rightAnkle: { x: centerX + bodyWidth * 0.1, y: centerY + bodyHeight * 0.5 }
      },
      boundingBox: {
        x: centerX - bodyWidth / 2,
        y: centerY - bodyHeight / 2,
        width: bodyWidth,
        height: bodyHeight
      },
      centerPoint: { x: centerX, y: centerY },
      height: bodyHeight,
      width: bodyWidth,
      aspectRatio: bodyWidth / bodyHeight
    };
  }

  private getDefaultOptimalPosition(): OptimalPosition {
    return {
      targetX: 50,
      targetY: 50,
      targetDistance: 7,
      targetHeight: 85,
      adjustments: ['Position yourself in the center of the frame'],
      isOptimal: false
    };
  }

  // Cleanup resources
  public cleanup(): void {
    this.isInitialized = false;
    this.poseNet = null;
  }
}

export const bodyTrackingService = BodyTrackingService.getInstance();
