// Positioning overlay service for real-time camera positioning feedback
export interface PositioningTarget {
  x: number; // percentage from left (0-100)
  y: number; // percentage from top (0-100)
  width: number; // percentage of frame width
  height: number; // percentage of frame height
  tolerance: number; // percentage tolerance for "in position"
}

export interface PositionFeedback {
  isInPosition: boolean;
  distance: number; // distance from target center (0-100)
  direction: 'center' | 'left' | 'right' | 'up' | 'down' | 'up-left' | 'up-right' | 'down-left' | 'down-right';
  adjustments: string[];
  confidence: number; // 0-100
  quality: number; // 0-100
}

export interface OverlayConfig {
  targetColor: string;
  targetBorderColor: string;
  targetSize: number;
  flashDuration: number;
  toleranceZone: number;
  showGuidelines: boolean;
  showDistance: boolean;
  voiceEnabled: boolean;
}

export class PositioningOverlayService {
  private config: OverlayConfig = {
    targetColor: '#00ff00',
    targetBorderColor: '#ffffff',
    targetSize: 60,
    flashDuration: 1000,
    toleranceZone: 15,
    showGuidelines: true,
    showDistance: true,
    voiceEnabled: true
  };

  private currentTarget: PositioningTarget | null = null;
  private isFlashing = false;
  private flashInterval: NodeJS.Timeout | null = null;
  private lastFeedback: PositionFeedback | null = null;

  // Set positioning target for current photo type
  setTarget(photoType: 'front' | 'side' | 'back' | 'full_body'): PositioningTarget {
    const targets: Record<string, PositioningTarget> = {
      front: {
        x: 50, // center
        y: 40, // slightly above center
        width: 40, // 40% of frame width
        height: 70, // 70% of frame height
        tolerance: 10
      },
      side: {
        x: 50,
        y: 40,
        width: 35,
        height: 70,
        tolerance: 12
      },
      back: {
        x: 50,
        y: 40,
        width: 40,
        height: 70,
        tolerance: 10
      },
      full_body: {
        x: 50,
        y: 35, // higher up to capture full body
        width: 50,
        height: 80,
        tolerance: 15
      }
    };

    this.currentTarget = targets[photoType];
    this.startFlashing();
    return this.currentTarget;
  }

  // Analyze current position from video feed
  analyzePosition(videoElement: HTMLVideoElement): PositionFeedback {
    if (!this.currentTarget) {
      return {
        isInPosition: false,
        distance: 100,
        direction: 'center',
        adjustments: ['No target set'],
        confidence: 0,
        quality: 0
      };
    }

    // Mock body detection - in real implementation, this would use computer vision
    const mockBodyPosition = this.detectBodyPosition(videoElement);
    const distance = this.calculateDistance(mockBodyPosition, this.currentTarget);
    const direction = this.calculateDirection(mockBodyPosition, this.currentTarget);
    const isInPosition = distance <= this.currentTarget.tolerance;
    const adjustments = this.generateAdjustments(distance, direction, isInPosition);
    const confidence = Math.max(0, 100 - distance * 2);
    const quality = this.assessImageQuality(videoElement);

    const feedback: PositionFeedback = {
      isInPosition,
      distance,
      direction,
      adjustments,
      confidence,
      quality
    };

    this.lastFeedback = feedback;
    this.provideVoiceFeedback(feedback);
    return feedback;
  }

  // Mock body position detection (would use computer vision in real implementation)
  private detectBodyPosition(videoElement: HTMLVideoElement): { x: number; y: number; width: number; height: number } {
    // Simulate body detection with some randomness
    // Make it more likely to be in position for testing
    const baseX = 50 + (Math.random() - 0.5) * 15; // 42.5-57.5 range (closer to center)
    const baseY = 40 + (Math.random() - 0.5) * 15; // 32.5-47.5 range (closer to center)
    const baseWidth = 40 + (Math.random() - 0.5) * 8; // 36-44 range
    const baseHeight = 70 + (Math.random() - 0.5) * 8; // 66-74 range

    return {
      x: Math.max(0, Math.min(100, baseX)),
      y: Math.max(0, Math.min(100, baseY)),
      width: Math.max(10, Math.min(80, baseWidth)),
      height: Math.max(20, Math.min(90, baseHeight))
    };
  }

  // Calculate distance from target center
  private calculateDistance(bodyPos: { x: number; y: number }, target: PositioningTarget): number {
    const dx = bodyPos.x - target.x;
    const dy = bodyPos.y - target.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Calculate direction from target
  private calculateDirection(bodyPos: { x: number; y: number }, target: PositioningTarget): PositionFeedback['direction'] {
    const dx = bodyPos.x - target.x;
    const dy = bodyPos.y - target.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx < 5 && absDy < 5) return 'center';
    if (absDx > absDy) {
      return dx > 0 ? 'right' : 'left';
    } else {
      if (absDx > 5) {
        return dy > 0 ? (dx > 0 ? 'down-right' : 'down-left') : (dx > 0 ? 'up-right' : 'up-left');
      }
      return dy > 0 ? 'down' : 'up';
    }
  }

  // Generate adjustment instructions
  private generateAdjustments(distance: number, direction: PositionFeedback['direction'], isInPosition: boolean): string[] {
    if (isInPosition) {
      return ['Perfect position!', 'Hold still', 'Ready to capture'];
    }

    const adjustments: string[] = [];
    
    switch (direction) {
      case 'left':
        adjustments.push('Move slightly to the right');
        break;
      case 'right':
        adjustments.push('Move slightly to the left');
        break;
      case 'up':
        adjustments.push('Step back a bit');
        break;
      case 'down':
        adjustments.push('Step forward a bit');
        break;
      case 'up-left':
        adjustments.push('Step back and to the right');
        break;
      case 'up-right':
        adjustments.push('Step back and to the left');
        break;
      case 'down-left':
        adjustments.push('Step forward and to the right');
        break;
      case 'down-right':
        adjustments.push('Step forward and to the left');
        break;
      default:
        adjustments.push('Adjust your position');
    }

    if (distance > 30) {
      adjustments.push('You\'re too far from the target area');
    } else if (distance > 15) {
      adjustments.push('Make smaller adjustments');
    }

    return adjustments;
  }

  // Assess image quality
  private assessImageQuality(videoElement: HTMLVideoElement): number {
    // Mock quality assessment
    const baseQuality = 70 + Math.random() * 20; // 70-90 range
    return Math.min(100, Math.max(0, baseQuality));
  }

  // Provide voice feedback
  private provideVoiceFeedback(feedback: PositionFeedback): void {
    // Disable voice feedback from positioning service to avoid conflicts
    // Voice feedback is now handled by the main component
    return;
  }

  // Start flashing animation
  private startFlashing(): void {
    if (this.flashInterval) {
      clearInterval(this.flashInterval);
    }

    this.isFlashing = true;
    this.flashInterval = setInterval(() => {
      this.isFlashing = !this.isFlashing;
    }, this.config.flashDuration);
  }

  // Stop flashing
  stopFlashing(): void {
    if (this.flashInterval) {
      clearInterval(this.flashInterval);
      this.flashInterval = null;
    }
    this.isFlashing = false;
  }

  // Get current flash state
  getFlashState(): boolean {
    return this.isFlashing;
  }

  // Get current target
  getCurrentTarget(): PositioningTarget | null {
    return this.currentTarget;
  }

  // Get last feedback
  getLastFeedback(): PositionFeedback | null {
    return this.lastFeedback;
  }

  // Update configuration
  updateConfig(newConfig: Partial<OverlayConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): OverlayConfig {
    return { ...this.config };
  }

  // Cleanup
  cleanup(): void {
    this.stopFlashing();
    this.currentTarget = null;
    this.lastFeedback = null;
  }
}

// Export singleton instance
export const positioningOverlayService = new PositioningOverlayService();
