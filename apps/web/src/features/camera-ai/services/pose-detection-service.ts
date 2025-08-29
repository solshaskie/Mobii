import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

export interface PoseLandmarks {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface PoseResults {
  poseLandmarks: PoseLandmarks[];
  poseWorldLandmarks: PoseLandmarks[];
  image: HTMLCanvasElement;
}

export interface FormAnalysis {
  posture: 'good' | 'needs_improvement' | 'poor';
  feedback: string;
  confidence: number;
  repDetected: boolean;
  repCount: number;
}

export class PoseDetectionService {
  private pose: Pose | null = null;
  private camera: Camera | null = null;
  private isInitialized = false;
  private repCount = 0;
  private lastPoseState = '';
  private lastRepTime = 0;
  private poseHistory: PoseLandmarks[][] = [];

  getInitialized(): boolean {
    return this.isInitialized;
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('Initializing MediaPipe Pose...');
      
      this.pose = new Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      this.pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.pose.onResults((results: Results) => {
        this.onPoseResults(results);
      });

      this.isInitialized = true;
      console.log('MediaPipe Pose initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize MediaPipe Pose:', error);
      return false;
    }
  }

  private onPoseResults(results: Results) {
    if (!results.poseLandmarks) return;

    const landmarks = results.poseLandmarks;
    this.poseHistory.push(landmarks);
    
    // Keep only last 30 frames for analysis
    if (this.poseHistory.length > 30) {
      this.poseHistory.shift();
    }

    // Analyze form and detect reps
    const analysis = this.analyzeForm(landmarks);
    
    // Emit results
    this.emitResults(results, analysis);
  }

  private analyzeForm(landmarks: PoseLandmarks[]): FormAnalysis {
    const analysis: FormAnalysis = {
      posture: 'good',
      feedback: '',
      confidence: 0,
      repDetected: false,
      repCount: this.repCount
    };

    // Calculate confidence based on landmark visibility
    const visibleLandmarks = landmarks.filter(lm => lm.visibility && lm.visibility > 0.5);
    analysis.confidence = visibleLandmarks.length / landmarks.length;

    // Analyze posture (shoulders, back, head alignment)
    const postureScore = this.analyzePosture(landmarks);
    if (postureScore > 0.8) {
      analysis.posture = 'good';
      analysis.feedback = 'Excellent posture! Keep it up!';
    } else if (postureScore > 0.6) {
      analysis.posture = 'needs_improvement';
      analysis.feedback = 'Try to straighten your back and align your shoulders.';
    } else {
      analysis.posture = 'poor';
      analysis.feedback = 'Please correct your posture. Stand tall with shoulders back.';
    }

    // Detect repetitions based on arm movement
    const repDetected = this.detectRepetition(landmarks);
    if (repDetected) {
      this.repCount++;
      analysis.repDetected = true;
      analysis.repCount = this.repCount;
    }

    return analysis;
  }

  private analyzePosture(landmarks: PoseLandmarks[]): number {
    if (landmarks.length < 33) return 0;

    // Key landmarks for posture analysis
    const nose = landmarks[0];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    let score = 0;
    let checks = 0;

    // Check shoulder alignment
    if (leftShoulder && rightShoulder) {
      const shoulderDiff = Math.abs(leftShoulder.y - rightShoulder.y);
      const shoulderScore = Math.max(0, 1 - shoulderDiff * 10);
      score += shoulderScore;
      checks++;
    }

    // Check if shoulders are level with hips
    if (leftShoulder && rightShoulder && leftHip && rightHip) {
      const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const hipY = (leftHip.y + rightHip.y) / 2;
      const alignmentDiff = Math.abs(shoulderY - hipY);
      const alignmentScore = Math.max(0, 1 - alignmentDiff * 5);
      score += alignmentScore;
      checks++;
    }

    // Check head position relative to shoulders
    if (nose && leftShoulder && rightShoulder) {
      const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
      const headPosition = Math.abs(nose.y - shoulderY);
      const headScore = Math.max(0, 1 - headPosition * 3);
      score += headScore;
      checks++;
    }

    return checks > 0 ? score / checks : 0;
  }

  private detectRepetition(landmarks: PoseLandmarks[]): boolean {
    if (this.poseHistory.length < 10) return false;

    // Analyze arm movement for rep detection
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];

    if (!leftWrist || !rightWrist || !leftElbow || !rightElbow) return false;

    // Calculate arm angles
    const leftArmAngle = this.calculateAngle(leftWrist, leftElbow, landmarks[11]); // left shoulder
    const rightArmAngle = this.calculateAngle(rightWrist, rightElbow, landmarks[12]); // right shoulder

    // Check for significant arm movement (rep pattern)
    const currentState = `${leftArmAngle > 90 ? 'up' : 'down'}_${rightArmAngle > 90 ? 'up' : 'down'}`;
    
    if (this.lastPoseState && this.lastPoseState !== currentState) {
      // State change detected - potential rep
      const timeSinceLastRep = Date.now() - (this.lastRepTime || 0);
      if (timeSinceLastRep > 1000) { // Minimum 1 second between reps
        this.lastRepTime = Date.now();
        this.lastPoseState = currentState;
        return true;
      }
    }

    this.lastPoseState = currentState;
    return false;
  }

  private calculateAngle(point1: PoseLandmarks, point2: PoseLandmarks, point3: PoseLandmarks): number {
    const angle = Math.atan2(point3.y - point2.y, point3.x - point2.x) -
                  Math.atan2(point1.y - point2.y, point1.x - point2.x);
    return Math.abs(angle * 180 / Math.PI);
  }

  private emitResults(results: Results, analysis: FormAnalysis) {
    // This will be connected to the UI component
    if (this.onResultsCallback) {
      this.onResultsCallback(results, analysis);
    }
  }

  private onResultsCallback: ((results: Results, analysis: FormAnalysis) => void) | null = null;

  setOnResults(callback: (results: Results, analysis: FormAnalysis) => void) {
    this.onResultsCallback = callback;
  }

  async startDetection(videoElement: HTMLVideoElement, canvasElement: HTMLCanvasElement): Promise<boolean> {
    if (!this.pose || !this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) return false;
    }

    try {
      console.log('Starting pose detection...');
      
      this.camera = new Camera(videoElement, {
        onFrame: async () => {
          if (this.pose) {
            await this.pose.send({ image: videoElement });
          }
        },
        width: 640,
        height: 480
      });

      await this.camera.start();
      console.log('Pose detection started successfully');
      return true;
    } catch (error) {
      console.error('Failed to start pose detection:', error);
      return false;
    }
  }

  stopDetection() {
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }
    this.repCount = 0;
    this.poseHistory = [];
    this.lastPoseState = '';
    console.log('Pose detection stopped');
  }

  resetRepCount() {
    this.repCount = 0;
  }

  getRepCount(): number {
    return this.repCount;
  }

  async sendImage(image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): Promise<void> {
    if (this.pose && this.isInitialized) {
      await this.pose.send({ image });
    }
  }

  // Utility function to draw pose landmarks on canvas
  drawPoseLandmarks(canvas: HTMLCanvasElement, results: Results) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks) {
      // Draw pose landmarks
      drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 2
      });
      drawLandmarks(ctx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 1,
        radius: 3
      });
    }
  }
}

// Export singleton instance
export const poseDetectionService = new PoseDetectionService();
