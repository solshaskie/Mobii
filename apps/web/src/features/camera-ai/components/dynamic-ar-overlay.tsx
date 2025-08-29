'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DynamicAROverlayProps {
  videoElement: HTMLVideoElement | null;
  photoType: string;
  onPositionUpdate?: (isOptimal: boolean, adjustments: string[]) => void;
  className?: string;
  videoDimensions?: { width: number; height: number };
}

export const DynamicAROverlay: React.FC<DynamicAROverlayProps> = ({
  videoElement,
  photoType,
  onPositionUpdate,
  className = '',
  videoDimensions
}) => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [isOptimal, setIsOptimal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update position analysis
  useEffect(() => {
    // Simulate position analysis - in real implementation this would use pose detection
    const checkPosition = () => {
      // For now, assume optimal position after a delay
      setTimeout(() => {
        setIsOptimal(true);
        onPositionUpdate?.(true, ['Perfect position!']);
      }, 2000);
    };

    if (videoElement && videoElement.readyState >= 2) {
      checkPosition();
    }
  }, [videoElement, onPositionUpdate]);

  // Draw skeleton on canvas
  useEffect(() => {
    if (showSkeleton && canvasRef.current && videoElement) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size to match video container
        const container = containerRef.current;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = container.clientHeight;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw a simple skeleton outline
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        // Draw a simple stick figure
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const size = Math.min(canvas.width, canvas.height) * 0.3;
        
        // Head
        ctx.arc(centerX, centerY - size * 0.8, size * 0.15, 0, 2 * Math.PI);
        
        // Body
        ctx.moveTo(centerX, centerY - size * 0.6);
        ctx.lineTo(centerX, centerY + size * 0.4);
        
        // Arms
        ctx.moveTo(centerX - size * 0.3, centerY - size * 0.2);
        ctx.lineTo(centerX + size * 0.3, centerY - size * 0.2);
        
        // Legs
        ctx.moveTo(centerX, centerY + size * 0.4);
        ctx.lineTo(centerX - size * 0.2, centerY + size * 0.8);
        ctx.moveTo(centerX, centerY + size * 0.4);
        ctx.lineTo(centerX + size * 0.2, centerY + size * 0.8);
        
        ctx.stroke();
      }
    }
  }, [showSkeleton, videoElement]);

  if (!videoElement) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`} 
      style={{ 
        zIndex: 99999,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      }}
    >
      {/* Skeleton Overlay Canvas */}
      {showSkeleton && (
        <canvas
          ref={canvasRef}
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 99998,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* HUGE WHITE X MARK - Always visible and prominent */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 99999,
          fontSize: '6rem',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 0 20px white, 0 0 40px white, 0 0 60px white, 0 0 80px white',
          filter: 'drop-shadow(0 0 10px white) drop-shadow(0 0 20px white)',
          animation: 'pulse 2s infinite'
        }}
      >
        ✕
      </div>

      {/* Target Zone - Green border around the X */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80px',
          height: '80px',
          border: '3px solid #00ff00',
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
          borderRadius: '50%',
          zIndex: 99997,
          animation: isOptimal ? 'pulse 1s infinite' : 'none'
        }}
      />

      {/* Larger Target Area */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '85%',
          border: '2px dashed #00ff00',
          backgroundColor: 'rgba(0, 255, 0, 0.05)',
          borderRadius: '8px',
          zIndex: 99996
        }}
      />

      {/* Status Indicators */}
      <div 
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <div style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          backgroundColor: isOptimal ? '#00ff00' : '#ffaa00',
          animation: isOptimal ? 'pulse 1s infinite' : 'none'
        }} />
        {isOptimal ? 'Position: Optimal' : 'Position: Adjusting...'}
      </div>

      {/* Skeleton Toggle */}
      <button
        onClick={() => setShowSkeleton(!showSkeleton)}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 99999,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <div style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          backgroundColor: showSkeleton ? '#00ff00' : '#666' 
        }} />
        Skeleton: {showSkeleton ? 'ON' : 'OFF'}
      </button>

      {/* Instructions */}
      <div 
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          zIndex: 99999,
          textAlign: 'center',
          maxWidth: '80%'
        }}
      >
        Stand on the X mark • 6-8 feet from camera • Say "ready" when positioned
      </div>

      {/* CSS Animation for pulse effect */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};
