// Automated progress photo capture service with AI guidance and voice narration
export interface PhotoCaptureSession {
  id: string;
  userId: string;
  date: string;
  status: 'preparing' | 'capturing' | 'processing' | 'completed' | 'failed';
  currentStep: PhotoCaptureStep;
  photos: CapturedPhoto[];
  instructions: string[];
  startTime: string;
  endTime?: string;
}

export interface PhotoCaptureStep {
  type: 'front' | 'side' | 'back' | 'full_body';
  name: string;
  description: string;
  instructions: string[];
  positioningGuide: PositioningGuide;
  isCompleted: boolean;
  photoId?: string;
}

export interface PositioningGuide {
  distance: number; // feet from camera
  height: number; // percentage of frame height
  width: number; // percentage of frame width
  posture: string[];
  clothing: string[];
  lighting: string[];
  background: string[];
}

export interface CapturedPhoto {
  id: string;
  type: 'front' | 'side' | 'back' | 'full_body';
  imageUrl: string;
  thumbnailUrl: string;
  metadata: {
    timestamp: string;
    quality: number; // 0-100
    lighting: number; // 0-100
    positioning: number; // 0-100
    blur: number; // 0-100 (lower is better)
  };
  analysis: {
    bodyDetected: boolean;
    faceDetected: boolean;
    poseQuality: number;
    recommendations: string[];
  };
}

export interface VoiceInstruction {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  timing: 'immediate' | 'before_capture' | 'after_capture';
  action?: 'pause' | 'resume' | 'retake' | 'next';
}

export class ProgressPhotoCaptureService {
  private currentSession: PhotoCaptureSession | null = null;
  private isCapturing = false;
  private voiceQueue: VoiceInstruction[] = [];
  private captureSteps: PhotoCaptureStep[] = [];

  constructor() {
    this.initializeCaptureSteps();
  }

  // Initialize capture steps with detailed positioning guides
  private initializeCaptureSteps(): void {
    this.captureSteps = [
      {
        type: 'front',
        name: 'Front View',
        description: 'Stand facing the camera with good posture',
        instructions: [
          'Stand 6-8 feet from the camera',
          'Face the camera directly',
          'Keep your arms slightly away from your body',
          'Stand with feet shoulder-width apart',
          'Look straight ahead',
          'Maintain natural posture'
        ],
        positioningGuide: {
          distance: 7,
          height: 80,
          width: 60,
          posture: [
            'Stand straight with shoulders back',
            'Keep your head level',
            'Arms slightly away from body',
            'Feet shoulder-width apart'
          ],
          clothing: [
            'Wear form-fitting but comfortable clothing',
            'Avoid baggy clothes that hide body shape',
            'Consider wearing the same outfit for consistency'
          ],
          lighting: [
            'Ensure even lighting from the front',
            'Avoid harsh shadows',
            'Natural light is preferred'
          ],
          background: [
            'Use a plain, neutral background',
            'Avoid cluttered or busy backgrounds',
            'Ensure good contrast with your clothing'
          ]
        },
        isCompleted: false
      },
      {
        type: 'side',
        name: 'Side View',
        description: 'Turn 90 degrees to show your profile',
        instructions: [
          'Turn 90 degrees to your right',
          'Keep your head facing forward',
          'Maintain the same posture as front view',
          'Arms slightly away from body',
          'Stand naturally'
        ],
        positioningGuide: {
          distance: 7,
          height: 80,
          width: 60,
          posture: [
            'Turn 90 degrees to the right',
            'Keep head facing forward',
            'Maintain straight posture',
            'Arms slightly away from body'
          ],
          clothing: [
            'Same clothing as front view',
            'Ensure clothing shows body shape clearly'
          ],
          lighting: [
            'Ensure even lighting from the side',
            'Avoid harsh shadows on face and body'
          ],
          background: [
            'Same background as front view',
            'Ensure good contrast'
          ]
        },
        isCompleted: false
      },
      {
        type: 'back',
        name: 'Back View',
        description: 'Turn to show your back view',
        instructions: [
          'Turn 180 degrees from front view',
          'Face away from the camera',
          'Keep your head level',
          'Maintain good posture',
          'Arms slightly away from body'
        ],
        positioningGuide: {
          distance: 7,
          height: 80,
          width: 60,
          posture: [
            'Turn 180 degrees from front position',
            'Face away from camera',
            'Keep head level and straight',
            'Maintain straight posture',
            'Arms slightly away from body'
          ],
          clothing: [
            'Same clothing as previous views',
            'Ensure back is clearly visible'
          ],
          lighting: [
            'Ensure even lighting on back',
            'Avoid shadows that hide definition'
          ],
          background: [
            'Same background as previous views',
            'Good contrast with clothing'
          ]
        },
        isCompleted: false
      },
      {
        type: 'full_body',
        name: 'Full Body View',
        description: 'Step back to show your full body',
        instructions: [
          'Step back 2-3 feet further',
          'Ensure your entire body is visible',
          'Maintain the same posture',
          'Keep your head level',
          'Arms slightly away from body'
        ],
        positioningGuide: {
          distance: 10,
          height: 90,
          width: 70,
          posture: [
            'Stand 10 feet from camera',
            'Ensure full body is in frame',
            'Maintain straight posture',
            'Head level, arms slightly away'
          ],
          clothing: [
            'Same clothing as all previous views',
            'Ensure full body is clearly visible'
          ],
          lighting: [
            'Ensure even lighting on entire body',
            'Avoid shadows that hide body shape'
          ],
          background: [
            'Same background as previous views',
            'Ensure full body stands out clearly'
          ]
        },
        isCompleted: false
      }
    ];
  }

  // Start a new photo capture session
  startCaptureSession(userId: string): PhotoCaptureSession {
    const session: PhotoCaptureSession = {
      id: this.generateId(),
      userId,
      date: new Date().toISOString().split('T')[0],
      status: 'preparing',
      currentStep: this.captureSteps[0],
      photos: [],
      instructions: [],
      startTime: new Date().toISOString()
    };

    this.currentSession = session;
    this.isCapturing = true;
    
    // Add initial instructions
    this.addVoiceInstruction({
      id: this.generateId(),
      text: "Welcome to your progress photo session! I'll guide you through each position to ensure consistent, high-quality photos.",
      priority: 'high',
      timing: 'immediate'
    });

    this.addVoiceInstruction({
      id: this.generateId(),
      text: "Let's start with the front view. Please stand 6-8 feet from the camera and face me directly.",
      priority: 'high',
      timing: 'immediate'
    });

    return session;
  }

  // Get current session
  getCurrentSession(): PhotoCaptureSession | null {
    return this.currentSession;
  }

  // Add voice instruction to queue
  addVoiceInstruction(instruction: VoiceInstruction): void {
    this.voiceQueue.push(instruction);
    this.speakInstruction(instruction);
  }

  // Speak instruction using Web Speech API
  private speakInstruction(instruction: VoiceInstruction): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(instruction.text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      // Get available voices and select a good one
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.includes('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      speechSynthesis.speak(utterance);
    }
  }

  // Analyze current camera feed for positioning
  analyzePositioning(videoElement: HTMLVideoElement): {
    isInPosition: boolean;
    quality: number;
    recommendations: string[];
  } {
    // This would integrate with computer vision for real-time analysis
    // For now, return mock analysis
    const mockAnalysis = {
      isInPosition: Math.random() > 0.3, // 70% chance of being in position
      quality: Math.floor(Math.random() * 40) + 60, // 60-100 quality
      recommendations: [
        'Move slightly to the left',
        'Stand a bit closer to the camera',
        'Straighten your posture'
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    };

    return mockAnalysis;
  }

  // Capture photo for current step
  async capturePhoto(videoElement: HTMLVideoElement): Promise<CapturedPhoto | null> {
    if (!this.currentSession || !this.isCapturing) {
      return null;
    }

    try {
      // Create canvas to capture video frame
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Could not get canvas context');
      }

      // Set canvas size to video size
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      // Draw video frame to canvas
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, 'image/jpeg', 0.9);
      });

      // Create URLs for the captured image
      const imageUrl = URL.createObjectURL(blob);
      const thumbnailUrl = await this.createThumbnail(blob);

      // Analyze the captured photo
      const analysis = this.analyzeCapturedPhoto(blob);

      // Create captured photo object
      const capturedPhoto: CapturedPhoto = {
        id: this.generateId(),
        type: this.currentSession.currentStep.type,
        imageUrl,
        thumbnailUrl,
        metadata: {
          timestamp: new Date().toISOString(),
          quality: analysis.quality,
          lighting: Math.floor(Math.random() * 30) + 70, // 70-100
          positioning: Math.floor(Math.random() * 30) + 70, // 70-100
          blur: Math.floor(Math.random() * 20) + 10 // 10-30 (lower is better)
        },
        analysis: {
          bodyDetected: analysis.bodyDetected,
          faceDetected: analysis.faceDetected,
          poseQuality: analysis.poseQuality,
          recommendations: analysis.recommendations
        }
      };

      // Add to session
      this.currentSession.photos.push(capturedPhoto);
      this.currentSession.currentStep.photoId = capturedPhoto.id;
      this.currentSession.currentStep.isCompleted = true;

      // Add success instruction
      this.addVoiceInstruction({
        id: this.generateId(),
        text: `Great! ${this.currentSession.currentStep.name} captured successfully.`,
        priority: 'medium',
        timing: 'after_capture'
      });

      return capturedPhoto;

    } catch (error) {
      console.error('Error capturing photo:', error);
      
      this.addVoiceInstruction({
        id: this.generateId(),
        text: "There was an issue capturing the photo. Let's try again.",
        priority: 'high',
        timing: 'immediate',
        action: 'retake'
      });

      return null;
    }
  }

  // Create thumbnail from blob
  private async createThumbnail(blob: Blob): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        if (!context) {
          resolve(URL.createObjectURL(blob));
          return;
        }

        // Set thumbnail size
        const maxSize = 200;
        const ratio = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw resized image
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to blob and create URL
        canvas.toBlob((thumbnailBlob) => {
          if (thumbnailBlob) {
            resolve(URL.createObjectURL(thumbnailBlob));
          } else {
            resolve(URL.createObjectURL(blob));
          }
        }, 'image/jpeg', 0.8);
      };

      img.src = URL.createObjectURL(blob);
    });
  }

  // Analyze captured photo (mock implementation)
  private analyzeCapturedPhoto(blob: Blob): {
    bodyDetected: boolean;
    faceDetected: boolean;
    poseQuality: number;
    quality: number;
    recommendations: string[];
  } {
    // This would integrate with computer vision APIs
    // For now, return mock analysis
    return {
      bodyDetected: Math.random() > 0.1,
      faceDetected: Math.random() > 0.2,
      poseQuality: Math.floor(Math.random() * 40) + 60,
      quality: Math.floor(Math.random() * 30) + 70,
      recommendations: [
        'Good positioning!',
        'Lighting looks great',
        'Posture is excellent'
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    };
  }

  // Move to next capture step
  nextStep(): PhotoCaptureStep | null {
    if (!this.currentSession) return null;

    const currentIndex = this.captureSteps.findIndex(
      step => step.type === this.currentSession!.currentStep.type
    );

    if (currentIndex < this.captureSteps.length - 1) {
      const nextStep = this.captureSteps[currentIndex + 1];
      this.currentSession.currentStep = nextStep;

      // Add instructions for next step
      this.addVoiceInstruction({
        id: this.generateId(),
        text: `Now let's capture the ${nextStep.name.toLowerCase()}. ${nextStep.instructions[0]}`,
        priority: 'high',
        timing: 'immediate'
      });

      return nextStep;
    } else {
      // Session completed
      this.completeSession();
      return null;
    }
  }

  // Complete the capture session
  completeSession(): void {
    if (!this.currentSession) return;

    this.currentSession.status = 'completed';
    this.currentSession.endTime = new Date().toISOString();
    this.isCapturing = false;

    this.addVoiceInstruction({
      id: this.generateId(),
      text: "Excellent! All progress photos have been captured successfully. Your photos are now saved to your profile.",
      priority: 'high',
      timing: 'immediate'
    });

    // Save photos to user profile
    this.savePhotosToProfile();
  }

  // Save captured photos to user profile
  private savePhotosToProfile(): void {
    if (!this.currentSession) return;

    // Import user profile service
    import('./user-profile-service').then(({ userProfileService }) => {
      this.currentSession!.photos.forEach(photo => {
        const photoData = {
          userId: this.currentSession!.userId,
          date: this.currentSession!.date,
          type: photo.type,
          imageUrl: photo.imageUrl,
          thumbnailUrl: photo.thumbnailUrl,
          weight: undefined, // Could be added from weight tracking
          bodyFat: undefined,
          muscleMass: undefined,
          notes: `Automated capture - ${photo.type} view`,
          isPrivate: true,
          tags: [photo.type, 'automated', 'progress']
        };

        userProfileService.addProgressPhoto(photoData);
      });
    });
  }

  // Retake current step
  retakeCurrentStep(): void {
    if (!this.currentSession) return;

    this.currentSession.currentStep.isCompleted = false;
    this.currentSession.currentStep.photoId = undefined;

    // Remove the last photo
    const lastPhoto = this.currentSession.photos[this.currentSession.photos.length - 1];
    if (lastPhoto && lastPhoto.type === this.currentSession.currentStep.type) {
      this.currentSession.photos.pop();
    }

    this.addVoiceInstruction({
      id: this.generateId(),
      text: `Let's retake the ${this.currentSession.currentStep.name.toLowerCase()}. ${this.currentSession.currentStep.instructions[0]}`,
      priority: 'high',
      timing: 'immediate'
    });
  }

  // Get positioning feedback
  getPositioningFeedback(videoElement: HTMLVideoElement): {
    isInPosition: boolean;
    feedback: string[];
    nextInstruction: string;
  } {
    const analysis = this.analyzePositioning(videoElement);
    
    if (analysis.isInPosition) {
      return {
        isInPosition: true,
        feedback: ['Perfect position!', 'Ready to capture'],
        nextInstruction: 'Hold still, capturing in 3... 2... 1...'
      };
    } else {
      return {
        isInPosition: false,
        feedback: analysis.recommendations,
        nextInstruction: 'Please adjust your position and try again'
      };
    }
  }

  // Stop current session
  stopSession(): void {
    if (this.currentSession) {
      this.currentSession.status = 'failed';
      this.currentSession.endTime = new Date().toISOString();
    }
    
    this.isCapturing = false;
    this.currentSession = null;
    
    // Stop any ongoing speech
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  // Get session progress
  getSessionProgress(): {
    currentStep: number;
    totalSteps: number;
    percentage: number;
    remainingSteps: string[];
  } {
    if (!this.currentSession) {
      return {
        currentStep: 0,
        totalSteps: this.captureSteps.length,
        percentage: 0,
        remainingSteps: this.captureSteps.map(step => step.name)
      };
    }

    const currentIndex = this.captureSteps.findIndex(
      step => step.type === this.currentSession!.currentStep.type
    );

    const completedSteps = this.captureSteps.filter(step => step.isCompleted).length;
    const percentage = (completedSteps / this.captureSteps.length) * 100;

    const remainingSteps = this.captureSteps
      .slice(currentIndex + 1)
      .map(step => step.name);

    return {
      currentStep: currentIndex + 1,
      totalSteps: this.captureSteps.length,
      percentage: Math.round(percentage),
      remainingSteps
    };
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Export singleton instance
export const progressPhotoCaptureService = new ProgressPhotoCaptureService();
