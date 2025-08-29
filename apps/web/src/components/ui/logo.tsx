'use client';
import React from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'full' | 'icon' | 'simple' | 'white' | 'square';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32'
};

const logoSizeClasses = {
  xs: 'w-16 h-6',
  sm: 'w-20 h-8',
  md: 'w-32 h-12',
  lg: 'w-48 h-16',
  xl: 'w-64 h-24',
  '2xl': 'w-80 h-32'
};

const getLogoSrc = (variant: string) => {
  switch (variant) {
    case 'icon':
      return '/images/mobii_app_icon.svg';
    case 'simple':
      return '/images/mobii_logo_simple.svg';
    case 'white':
      return '/images/mobii_logo_white.svg';
    case 'square':
      return '/images/mobii_icon_square.svg';
    case 'full':
    default:
      return '/images/Mobii_logo.svg';
  }
};

const getLogoDimensions = (variant: string, size: string) => {
  const baseSizes = {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
    '2xl': 128
  };

  const baseSize = baseSizes[size as keyof typeof baseSizes] || 48;

  if (variant === 'full' || variant === 'simple' || variant === 'white') {
    return {
      width: baseSize * 2.5,
      height: baseSize
    };
  }

  return {
    width: baseSize,
    height: baseSize
  };
};

export default function Logo({ 
  variant = 'full', 
  size = 'md', 
  className = '' 
}: LogoProps) {
  const logoSrc = getLogoSrc(variant);
  const dimensions = getLogoDimensions(variant, size);
  
  const isIconVariant = variant === 'icon' || variant === 'square';
  const containerClass = isIconVariant ? sizeClasses[size as keyof typeof sizeClasses] : logoSizeClasses[size as keyof typeof logoSizeClasses];

  return (
    <div className={`${containerClass} ${className}`}>
      <Image
        src={logoSrc}
        alt={`Mobii ${variant} Logo`}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
        priority
      />
    </div>
  );
}
