'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  positioningOverlayService,
  PositioningTarget,
  PositionFeedback,
  OverlayConfig
} from '../services/positioning-overlay-service';

interface PositioningOverlayProps {
  videoElement: HTMLVideoElement | null;
  photoType: 'front' | 'side' | 'back' | 'full_body';
  className?: string;
  onPositionUpdate?: (feedback: PositionFeedback) => void;
}

export const PositioningOverlay: React.FC<PositioningOverlayProps> = ({
  videoElement,
  photoType,
  className = '',
  onPositionUpdate
}) => {
  const [target, setTarget] = useState<PositioningTarget | null>(null);
  const [feedback, setFeedback] = useState<PositionFeedback | null>(null);
  const [config, setConfig] = useState<OverlayConfig>(positioningOverlayService.getConfig());
  const [isFlashing, setIsFlashing] = useState(false);
  
  const analysisIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const flashIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set target for current photo type
    const newTarget = positioningOverlayService.setTarget(photoType);
    setTarget(newTarget);

    // Start analysis
    startAnalysis();

    // Start flash state monitoring
    startFlashMonitoring();

    return () => {
      stopAnalysis();
      stopFlashMonitoring();
    };
  }, [photoType]);

  const startAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
    }

    analysisIntervalRef.current = setInterval(() => {
      if (videoElement) {
        const newFeedback = positioningOverlayService.analyzePosition(videoElement);
        setFeedback(newFeedback);
        onPositionUpdate?.(newFeedback);
      }
    }, 500); // Update every 500ms
  };

  const stopAnalysis = () => {
    if (analysisIntervalRef.current) {
      clearInterval(analysisIntervalRef.current);
      analysisIntervalRef.current = null;
    }
  };

  const startFlashMonitoring = () => {
    if (flashIntervalRef.current) {
      clearInterval(flashIntervalRef.current);
    }

    flashIntervalRef.current = setInterval(() => {
      setIsFlashing(positioningOverlayService.getFlashState());
    }, 100);
  };

  const stopFlashMonitoring = () => {
    if (flashIntervalRef.current) {
      clearInterval(flashIntervalRef.current);
      flashIntervalRef.current = null;
    }
  };

  if (!target) {
    console.log('PositioningOverlay: No target set');
    return null;
  }

  console.log('PositioningOverlay: Rendering with target:', target);
  console.log('PositioningOverlay: Current feedback:', feedback);

  const targetStyle = {
    left: `${target.x - target.width / 2}%`,
    top: `${target.y - target.height / 2}%`,
    width: `${target.width}%`,
    height: `${target.height}%`
  };

  const toleranceStyle = {
    left: `${target.x - target.width / 2 - target.tolerance}%`,
    top: `${target.y - target.height / 2 - target.tolerance}%`,
    width: `${target.width + target.tolerance * 2}%`,
    height: `${target.height + target.tolerance * 2}%`
  };

  const getTargetColor = () => {
    if (!feedback) return '#00ff00';
    return feedback.isInPosition ? '#00ff00' : '#ff4444';
  };

  const getBorderColor = () => {
    if (!feedback) return '#ffffff';
    return feedback.isInPosition ? '#ffffff' : '#ff0000';
  };

  const getBorderWidth = () => {
    return feedback?.isInPosition ? '6px' : '8px';
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Tolerance Zone */}
      <div
        className="absolute border-2 border-dashed border-gray-400 opacity-30"
        style={toleranceStyle}
      />

             {/* Target Area */}
       <motion.div
         className="absolute rounded-lg"
         style={{
           ...targetStyle,
           borderColor: getBorderColor(),
           borderWidth: getBorderWidth(),
           borderStyle: 'solid',
           backgroundColor: `${getTargetColor()}30`,
           boxShadow: `0 0 20px ${getTargetColor()}80`
         }}
        animate={{
          scale: isFlashing ? [1, 1.05, 1] : 1,
          opacity: isFlashing ? [0.7, 1, 0.7] : 0.8
        }}
        transition={{
          duration: 0.5,
          repeat: isFlashing ? Infinity : 0
        }}
      >
        {/* Center X Mark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* X Mark */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 relative">
                <div 
                  className="absolute w-full h-1 bg-white rounded-full"
                  style={{ 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%) rotate(45deg)',
                    boxShadow: '0 0 10px rgba(255,255,255,0.8)'
                  }}
                />
                <div 
                  className="absolute w-full h-1 bg-white rounded-full"
                  style={{ 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%) rotate(-45deg)',
                    boxShadow: '0 0 10px rgba(255,255,255,0.8)'
                  }}
                />
              </div>
            </div>

            {/* Pulse Ring */}
            <motion.div
              className="absolute inset-0 border-2 border-white rounded-full"
              style={{ 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px'
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </div>

                 {/* Position Text */}
         <div className="absolute top-2 left-2 bg-black bg-opacity-90 text-white px-3 py-2 rounded text-sm font-bold">
           {feedback?.isInPosition ? '✅ PERFECT!' : '⚠️ ADJUST'}
         </div>
      </motion.div>

      {/* Guidelines */}
      {config.showGuidelines && (
        <>
          {/* Vertical Center Line */}
          <div 
            className="absolute top-0 bottom-0 w-px bg-white opacity-50"
            style={{ left: '50%' }}
          />
          {/* Horizontal Center Line */}
          <div 
            className="absolute left-0 right-0 h-px bg-white opacity-50"
            style={{ top: '50%' }}
          />
        </>
      )}

      {/* Direction Arrows */}
      {feedback && !feedback.isInPosition && (
        <DirectionArrows direction={feedback.direction} />
      )}

             {/* Debug Panel - Always show for testing */}
       <div className="absolute top-2 right-2 bg-black bg-opacity-90 text-white px-3 py-2 rounded text-xs">
         <div>Target: {photoType}</div>
         <div>Position: {feedback?.isInPosition ? '✅' : '❌'}</div>
         <div>Distance: {feedback?.distance?.toFixed(1)}%</div>
         <div>Confidence: {feedback?.confidence?.toFixed(0)}%</div>
       </div>

       {/* Feedback Panel */}
       {feedback && (
         <FeedbackPanel feedback={feedback} />
       )}
    </div>
  );
};

// Direction Arrows Component
interface DirectionArrowsProps {
  direction: PositionFeedback['direction'];
}

const DirectionArrows: React.FC<DirectionArrowsProps> = ({ direction }) => {
  const getArrowStyle = () => {
    const baseStyle = "absolute w-8 h-8 text-white opacity-80";
    
    switch (direction) {
      case 'left':
        return `${baseStyle} left-4 top-1/2 transform -translate-y-1/2`;
      case 'right':
        return `${baseStyle} right-4 top-1/2 transform -translate-y-1/2`;
      case 'up':
        return `${baseStyle} top-4 left-1/2 transform -translate-x-1/2`;
      case 'down':
        return `${baseStyle} bottom-4 left-1/2 transform -translate-x-1/2`;
      case 'up-left':
        return `${baseStyle} top-4 left-4`;
      case 'up-right':
        return `${baseStyle} top-4 right-4`;
      case 'down-left':
        return `${baseStyle} bottom-4 left-4`;
      case 'down-right':
        return `${baseStyle} bottom-4 right-4`;
      default:
        return baseStyle;
    }
  };

  const getArrowIcon = () => {
    switch (direction) {
      case 'left': return '←';
      case 'right': return '→';
      case 'up': return '↑';
      case 'down': return '↓';
      case 'up-left': return '↖';
      case 'up-right': return '↗';
      case 'down-left': return '↙';
      case 'down-right': return '↘';
      default: return '•';
    }
  };

  return (
    <motion.div
      className={getArrowStyle()}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.5, 1, 0.5]
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="text-2xl font-bold text-center bg-black bg-opacity-50 rounded-full w-full h-full flex items-center justify-center">
        {getArrowIcon()}
      </div>
    </motion.div>
  );
};

// Feedback Panel Component
interface FeedbackPanelProps {
  feedback: PositionFeedback;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ feedback }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              feedback.isInPosition ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="font-semibold">
            {feedback.isInPosition ? 'Perfect Position!' : 'Adjust Position'}
          </span>
        </div>
        <div className="text-sm opacity-70">
          Confidence: {feedback.confidence}%
        </div>
      </div>

      <div className="space-y-1">
        {feedback.adjustments.map((adjustment, index) => (
          <div key={index} className="text-sm flex items-center gap-2">
            <span className="text-blue-400">•</span>
            {adjustment}
          </div>
        ))}
      </div>

      {feedback.distance > 0 && (
        <div className="mt-2">
          <div className="flex justify-between text-xs mb-1">
            <span>Distance from target</span>
            <span>{Math.round(feedback.distance)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, feedback.distance)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};
