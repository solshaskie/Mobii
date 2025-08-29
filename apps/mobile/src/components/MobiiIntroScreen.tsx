import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Logo from './Logo';

const { width, height } = Dimensions.get('window');

interface MobiiIntroScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export default function MobiiIntroScreen({
  onComplete,
  duration = 3000,
}: MobiiIntroScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const logoAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Scale animation for logo
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();

    // Logo text animation
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Auto-complete timer
    const timer = setTimeout(() => {
      handleComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      onComplete?.();
    });
  };

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <LinearGradient
        colors={['#2DD4BF', '#7C3AED']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Pulsing Ring Animation */}
        <View style={styles.ringContainer}>
          <LottieView
            source={require('../../assets/mobii_ring.json')}
            autoPlay
            loop
            style={styles.ring}
          />
        </View>

        {/* Mobii Logo */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Logo variant="full" size="xl" />
        </Animated.View>

        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: logoAnim,
              transform: [
                {
                  translateY: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          Mobility · Ability · Strength
        </Animated.Text>

        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleComplete}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringContainer: {
    position: 'absolute',
    top: height / 2 - 250,
  },
  ring: {
    width: 500,
    height: 500,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: -140,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 12,
    letterSpacing: 1,
    fontFamily: 'Poppins-Regular',
  },
  skipButton: {
    position: 'absolute',
    bottom: 40,
    right: 32,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  skipText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});
