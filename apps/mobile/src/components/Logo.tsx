import React from 'react';
import { Image, ImageSourcePropType, ViewStyle, ImageStyle } from 'react-native';

interface LogoProps {
  variant?: 'full' | 'icon' | 'simple' | 'white' | 'square';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  style?: ViewStyle;
  imageStyle?: ImageStyle;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
  '2xl': 128
};

const getLogoSrc = (variant: string): ImageSourcePropType => {
  switch (variant) {
    case 'icon':
      return require('../../assets/images/mobii_app_icon.svg');
    case 'simple':
      return require('../../assets/images/mobii_logo_simple.svg');
    case 'white':
      return require('../../assets/images/mobii_logo_white.svg');
    case 'square':
      return require('../../assets/images/mobii_icon_square.svg');
    case 'full':
    default:
      return require('../../assets/images/Mobii_logo.svg');
  }
};

const getLogoDimensions = (variant: string, size: string) => {
  const baseSize = sizeMap[size as keyof typeof sizeMap] || 48;

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
  style,
  imageStyle
}: LogoProps) {
  const logoSrc = getLogoSrc(variant);
  const dimensions = getLogoDimensions(variant, size);

  return (
    <Image
      source={logoSrc}
      style={[
        {
          width: dimensions.width,
          height: dimensions.height,
        },
        imageStyle
      ]}
      resizeMode="contain"
    />
  );
}
