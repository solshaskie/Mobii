'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DynamicAROverlayProps {
  videoElement: HTMLVideoElement | null;
  photoType: string;
  onPositionUpdate?: (isOptimal: boolean, adjustments: string[]) => void;
  className?: string;
}

export const DynamicAROverlay: React.FC<DynamicAROverlayProps> = ({
  videoElement,
  photoType,
  onPositionUpdate,
  className = ''
}) => {
  const [showSkeleton, setShowSkeleton] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simple test - draw skeleton on canvas
  useEffect(() => {
    if (showSkeleton && canvasRef.current && videoElement) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas size to match video
        canvas.width = videoElement.videoWidth || videoElement.clientWidth;
        canvas.height = videoElement.videoHeight || videoElement.clientHeight;

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

      {/* Simple X Mark - Always visible */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 99999,
          fontSize: '4rem',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 0 20px white, 0 0 40px white, 0 0 60px white',
          filter: 'drop-shadow(0 0 10px white)'
        }}
      >
        ✕
      </div>

      {/* Test Status */}
      <div 
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 99999
        }}
      >
        Overlay Active
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
          padding: '8px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 99999,
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Skeleton: {showSkeleton ? 'ON' : 'OFF'}
      </button>

      {/* Target Zone */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '85%',
          border: '2px dashed #00ff00',
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
          borderRadius: '8px',
          zIndex: 99997
        }}
      />
    </div>
  );
};
