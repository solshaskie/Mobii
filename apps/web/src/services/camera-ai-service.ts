import { Pose, PoseResults } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS } from '@mediapipe/pose';

// Types for pose detection and analysis
export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface PoseData {
  landmarks: PoseLandmark[];
  timestamp: number;
  confidence: number;
}

export interface FormCorrection {
  bodyPart: string;
  currentAngle: number;
  targetAngle: number;
  correction: string;
  severity: 'minor' | 'major' | 'critical';
  confidence: number;
}

export interface RepetitionData {
  count: number;
  total: number;
  currentPhase: 'setup' | 'execution' | 'return' | 'rest';
  formQuality: number;
  timestamp: number;
}

export interface VoiceFeedback {
  type: 'correction' | 'count' | 'motivation' | 'instruction';
  message: string;
  priority: 'low' | 'medium' | 'high';
  audioUrl?: string;
}

// Exercise-specific pose analysis configurations
export interface ExerciseConfig {
  name: string;
  targetMuscles: string[];
  keyLandmarks: number[];
  targetAngles: Record<string, number>;
  tolerance: number;
  repPattern: 'up-down' | 'in-out' | 'rotation' | 'hold';
  phases: {
    setup: number[];
    execution: number[];
    return: number[];
    rest: number[];
  };
}

export class CameraAIService {
  private pose: Pose | null = null;
  private camera: Camera | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private canvasElement: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  
  private isInitialized: boolean = false;
  private isActive: boolean = false;
  private currentExercise: ExerciseConfig | null = null;
  
  private poseHistory: PoseData[] = [];
  private corrections: FormCorrection[] = [];
  private repetitionData: RepetitionData | null = null;
  private voiceQueue: VoiceFeedback[] = [];
  
  // Configuration
  private readonly MAX_HISTORY = 60; // 2 seconds at 30fps
  private readonly CONFIDENCE_THRESHOLD = 0.7;
  private readonly CORRECTION_COOLDOWN = 2000; // 2 seconds
  private lastCorrectionTime: number = 0;

  constructor() {
    this.initializePose();
  }

  private async initializePose(): Promise<void> {
    try {
      this.pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      });

      this.pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      this.pose.onResults(this.onPoseResults.bind(this));
      console.log('MediaPipe Pose initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MediaPipe Pose:', error);
      throw error;
    }
  }

  public async initializeCamera(
    videoElement: HTMLVideoElement,
    canvasElement: HTMLCanvasElement
  ): Promise<void> {
    try {
      this.videoElement = videoElement;
      this.canvasElement = canvasElement;
      this.ctx = canvasElement.getContext('2d');

      if (!this.ctx) {
        throw new Error('Failed to get canvas context');
      }

      this.camera = new Camera(this.videoElement, {
        onFrame: async () => {
          if (this.pose && this.videoElement) {
            await this.pose.send({ image: this.videoElement });
          }
        },
        width: 640,
        height: 480
      });

      await this.camera.start();
      this.isInitialized = true;
      console.log('Camera initialized successfully');
    } catch (error) {
      console.error('Failed to initialize camera:', error);
      throw error;
    }
  }

  private onPoseResults(results: PoseResults): void {
    if (!this.ctx || !this.canvasElement || !this.videoElement) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    // Draw video frame
    this.ctx.save();
    this.ctx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);
    this.ctx.restore();

    // Draw pose landmarks
    if (results.poseLandmarks) {
      drawConnectors(this.ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 2
      });
      drawLandmarks(this.ctx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 1,
        radius: 3
      });
    }

    // Process pose data
    this.processPoseData(results);
  }

  private processPoseData(results: PoseResults): void {
    if (!results.poseLandmarks) return;

    const poseData: PoseData = {
      landmarks: results.poseLandmarks.map(landmark => ({
        x: landmark.x,
        y: landmark.y,
        z: landmark.z,
        visibility: landmark.visibility
      })),
      timestamp: Date.now(),
      confidence: this.calculateConfidence(results.poseLandmarks)
    };

    // Add to history
    this.poseHistory.push(poseData);
    if (this.poseHistory.length > this.MAX_HISTORY) {
      this.poseHistory.shift();
    }

    // Analyze form if exercise is active
    if (this.currentExercise && this.isActive) {
      this.analyzeForm(poseData);
      this.countRepetitions(poseData);
    }
  }

  private calculateConfidence(landmarks: any[]): number {
    const visibilities = landmarks.map(l => l.visibility || 0);
    return visibilities.reduce((sum, v) => sum + v, 0) / visibilities.length;
  }

  private analyzeForm(poseData: PoseData): void {
    if (!this.currentExercise || poseData.confidence < this.CONFIDENCE_THRESHOLD) return;

    const corrections: FormCorrection[] = [];

    // Analyze each target muscle group
    for (const muscle of this.currentExercise.targetMuscles) {
      const correction = this.analyzeMuscleGroup(muscle, poseData);
      if (correction) {
        corrections.push(correction);
      }
    }

    // Filter and prioritize corrections
    const validCorrections = corrections.filter(c => 
      c.confidence > this.CONFIDENCE_THRESHOLD &&
      Date.now() - this.lastCorrectionTime > this.CORRECTION_COOLDOWN
    );

    if (validCorrections.length > 0) {
      const highestPriority = validCorrections.reduce((prev, current) => 
        this.getSeverityPriority(current.severity) > this.getSeverityPriority(prev.severity) ? current : prev
      );

      this.corrections.push(highestPriority);
      this.lastCorrectionTime = Date.now();
      this.queueVoiceFeedback(highestPriority);
    }
  }

  private analyzeMuscleGroup(muscle: string, poseData: PoseData): FormCorrection | null {
    const landmarkIndices = this.getMuscleLandmarks(muscle);
    if (!landmarkIndices) return null;

    const angles = this.calculateAngles(poseData.landmarks, landmarkIndices);
    const targetAngles = this.currentExercise!.targetAngles[muscle] || 0;
    const tolerance = this.currentExercise!.tolerance;

    const deviation = Math.abs(angles.current - targetAngles);
    const severity = this.getSeverity(deviation, tolerance);

    if (deviation > tolerance) {
      return {
        bodyPart: muscle,
        currentAngle: angles.current,
        targetAngle: targetAngles,
        correction: this.generateCorrection(muscle, angles.current, targetAngles),
        severity,
        confidence: poseData.confidence
      };
    }

    return null;
  }

  private getMuscleLandmarks(muscle: string): number[] | null {
    const muscleLandmarks: Record<string, number[]> = {
      'shoulders': [11, 12, 23, 24], // Left and right shoulders
      'arms': [11, 12, 13, 14, 15, 16], // Shoulders to wrists
      'core': [11, 12, 23, 24], // Shoulders and hips
      'legs': [23, 24, 25, 26, 27, 28], // Hips to ankles
      'back': [11, 12, 23, 24], // Shoulders and hips
      'neck': [0, 11, 12], // Nose and shoulders
      'hips': [23, 24], // Left and right hips
      'knees': [25, 26] // Left and right knees
    };

    return muscleLandmarks[muscle] || null;
  }

  private calculateAngles(landmarks: PoseLandmark[], indices: number[]): { current: number } {
    if (indices.length < 3) return { current: 0 };

    const points = indices.map(i => landmarks[i]).filter(p => p && p.visibility && p.visibility > 0.5);
    
    if (points.length < 3) return { current: 0 };

    // Calculate angle between three points
    const angle = this.calculateAngleBetweenPoints(points[0], points[1], points[2]);
    
    return { current: angle };
  }

  private calculateAngleBetweenPoints(p1: PoseLandmark, p2: PoseLandmark, p3: PoseLandmark): number {
    const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    
    return angle;
  }

  private getSeverity(deviation: number, tolerance: number): 'minor' | 'major' | 'critical' {
    if (deviation <= tolerance * 1.5) return 'minor';
    if (deviation <= tolerance * 2.5) return 'major';
    return 'critical';
  }

  private getSeverityPriority(severity: 'minor' | 'major' | 'critical'): number {
    const priorities = { minor: 1, major: 2, critical: 3 };
    return priorities[severity];
  }

  private generateCorrection(muscle: string, current: number, target: number): string {
    const corrections: Record<string, string[]> = {
      'shoulders': [
        'Keep your shoulders relaxed and down',
        'Square your shoulders',
        'Don\'t hunch your shoulders'
      ],
      'arms': [
        'Straighten your arms',
        'Bend your arms more',
        'Keep your arms at shoulder level'
      ],
      'core': [
        'Engage your core',
        'Keep your back straight',
        'Don\'t arch your back'
      ],
      'legs': [
        'Bend your knees slightly',
        'Keep your legs straight',
        'Don\'t lock your knees'
      ],
      'back': [
        'Keep your back straight',
        'Don\'t round your back',
        'Engage your back muscles'
      ],
      'neck': [
        'Keep your neck neutral',
        'Don\'t tilt your head',
        'Look straight ahead'
      ]
    };

    const muscleCorrections = corrections[muscle] || ['Adjust your position'];
    return muscleCorrections[Math.floor(Math.random() * muscleCorrections.length)];
  }

  private countRepetitions(poseData: PoseData): void {
    if (!this.currentExercise) return;

    const pattern = this.currentExercise.repPattern;
    const phases = this.currentExercise.phases;
    
    // Analyze movement pattern based on exercise type
    const currentPhase = this.detectMovementPhase(poseData, phases);
    
    if (currentPhase !== this.repetitionData?.currentPhase) {
      // Phase change detected
      if (currentPhase === 'execution' && this.repetitionData?.currentPhase === 'setup') {
        // Repetition started
        this.repetitionData = {
          count: (this.repetitionData?.count || 0) + 1,
          total: this.repetitionData?.total || 0,
          currentPhase,
          formQuality: this.calculateFormQuality(),
          timestamp: Date.now()
        };

        // Queue count announcement
        this.queueVoiceFeedback({
          type: 'count',
          message: `${this.repetitionData.count}`,
          priority: 'medium'
        });
      } else if (currentPhase === 'rest' && this.repetitionData?.currentPhase === 'return') {
        // Repetition completed
        this.queueVoiceFeedback({
          type: 'motivation',
          message: this.getMotivationalPhrase(),
          priority: 'low'
        });
      }

      if (this.repetitionData) {
        this.repetitionData.currentPhase = currentPhase;
      }
    }
  }

  private detectMovementPhase(poseData: PoseData, phases: any): 'setup' | 'execution' | 'return' | 'rest' {
    // Simplified phase detection - in practice, this would use more sophisticated ML
    const recentPoses = this.poseHistory.slice(-10);
    const movement = this.calculateMovement(recentPoses);
    
    if (movement < 0.1) return 'rest';
    if (movement < 0.3) return 'setup';
    if (movement < 0.7) return 'execution';
    return 'return';
  }

  private calculateMovement(poses: PoseData[]): number {
    if (poses.length < 2) return 0;
    
    let totalMovement = 0;
    for (let i = 1; i < poses.length; i++) {
      const prev = poses[i - 1];
      const curr = poses[i];
      
      for (let j = 0; j < Math.min(prev.landmarks.length, curr.landmarks.length); j++) {
        const dx = curr.landmarks[j].x - prev.landmarks[j].x;
        const dy = curr.landmarks[j].y - prev.landmarks[j].y;
        totalMovement += Math.sqrt(dx * dx + dy * dy);
      }
    }
    
    return totalMovement / (poses.length - 1);
  }

  private calculateFormQuality(): number {
    if (this.corrections.length === 0) return 100;
    
    const recentCorrections = this.corrections.slice(-10);
    const severityScores = recentCorrections.map(c => {
      switch (c.severity) {
        case 'minor': return 0.1;
        case 'major': return 0.3;
        case 'critical': return 0.5;
        default: return 0;
      }
    });
    
    const averageSeverity = severityScores.reduce((sum, score) => sum + score, 0) / severityScores.length;
    return Math.max(0, 100 - (averageSeverity * 100));
  }

  private getMotivationalPhrase(): string {
    const phrases = [
      'Great job!',
      'Keep it up!',
      'You\'re doing amazing!',
      'Stay strong!',
      'Excellent form!',
      'You\'ve got this!',
      'Keep pushing!',
      'Fantastic work!'
    ];
    
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  private queueVoiceFeedback(feedback: VoiceFeedback): void {
    this.voiceQueue.push(feedback);
    this.processVoiceQueue();
  }

  private async processVoiceQueue(): Promise<void> {
    if (this.voiceQueue.length === 0) return;

    const feedback = this.voiceQueue.shift();
    if (!feedback) return;

    // In a real implementation, this would use TTS service
    await this.synthesizeSpeech(feedback.message);
  }

  private async synthesizeSpeech(text: string): Promise<void> {
    // Placeholder for TTS integration
    // In practice, this would use Eleven Labs, OpenAI TTS, or similar
    console.log('TTS: ', text);
    
    // For now, use browser's built-in speech synthesis
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  }

  public startExercise(exercise: ExerciseConfig): void {
    this.currentExercise = exercise;
    this.isActive = true;
    this.corrections = [];
    this.repetitionData = {
      count: 0,
      total: 0,
      currentPhase: 'setup',
      formQuality: 100,
      timestamp: Date.now()
    };
    
    console.log(`Started exercise: ${exercise.name}`);
  }

  public stopExercise(): void {
    this.isActive = false;
    this.currentExercise = null;
    console.log('Exercise stopped');
  }

  public getCurrentData(): {
    corrections: FormCorrection[];
    repetitionData: RepetitionData | null;
    formQuality: number;
  } {
    return {
      corrections: this.corrections.slice(-5), // Last 5 corrections
      repetitionData: this.repetitionData,
      formQuality: this.calculateFormQuality()
    };
  }

  public async stop(): Promise<void> {
    this.isActive = false;
    this.isInitialized = false;
    
    if (this.camera) {
      await this.camera.stop();
    }
    
    if (this.pose) {
      this.pose.close();
    }
    
    console.log('Camera AI Service stopped');
  }
}

// Predefined exercise configurations
export const EXERCISE_CONFIGS: Record<string, ExerciseConfig> = {
  'chair-yoga-stretch': {
    name: 'Chair Yoga Stretch',
    targetMuscles: ['shoulders', 'arms', 'core'],
    keyLandmarks: [11, 12, 13, 14, 23, 24],
    targetAngles: {
      'shoulders': 90,
      'arms': 180,
      'core': 90
    },
    tolerance: 15,
    repPattern: 'up-down',
    phases: {
      setup: [0, 1, 2],
      execution: [3, 4, 5],
      return: [6, 7, 8],
      rest: [9, 10]
    }
  },
  'seated-twist': {
    name: 'Seated Twist',
    targetMuscles: ['core', 'back'],
    keyLandmarks: [11, 12, 23, 24],
    targetAngles: {
      'core': 45,
      'back': 90
    },
    tolerance: 20,
    repPattern: 'rotation',
    phases: {
      setup: [0, 1],
      execution: [2, 3, 4],
      return: [5, 6],
      rest: [7, 8]
    }
  },
  'arm-circles': {
    name: 'Arm Circles',
    targetMuscles: ['shoulders', 'arms'],
    keyLandmarks: [11, 12, 13, 14],
    targetAngles: {
      'shoulders': 90,
      'arms': 180
    },
    tolerance: 10,
    repPattern: 'rotation',
    phases: {
      setup: [0],
      execution: [1, 2, 3, 4],
      return: [5],
      rest: [6]
    }
  }
};
