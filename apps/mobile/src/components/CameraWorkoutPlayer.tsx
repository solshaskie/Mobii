import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-camera';
import { Card, Title, Button } from 'react-native-paper';
import { Camera as CameraIcon, Video, VideoOff, RotateCcw, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const { width, height } = Dimensions.get('window');

interface CameraWorkoutPlayerProps {
  exerciseName: string;
  instructions: string[];
  onFormFeedback?: (feedback: string) => void;
  onRepCount?: (count: number) => void;
  onComplete?: () => void;
}

export default function CameraWorkoutPlayer({
  exerciseName,
  instructions,
  onFormFeedback,
  onRepCount,
  onComplete,
}: CameraWorkoutPlayerProps) {
  const { colors } = useTheme();
  const devices = useCameraDevices();
  const device = devices.front;
  
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [formFeedback, setFormFeedback] = useState<string>('');
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const cameraRef = useRef<Camera>(null);

  // Request camera permissions
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera for AI form analysis.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } catch (err) {
        console.warn(err);
        setHasPermission(false);
      }
    } else {
      setHasPermission(true);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  // Start camera
  const startCamera = () => {
    if (hasPermission) {
      setIsCameraOn(true);
      setIsAnalyzing(true);
      startPoseAnalysis();
    } else {
      Alert.alert('Permission Required', 'Camera permission is required for AI form analysis.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    setIsCameraOn(false);
    setIsAnalyzing(false);
  };

  // Simulate pose analysis (replace with actual MediaPipe integration)
  const startPoseAnalysis = () => {
    // Simulate real-time analysis
    const analysisInterval = setInterval(() => {
      if (!isAnalyzing) {
        clearInterval(analysisInterval);
        return;
      }

      // Simulate rep counting
      if (Math.random() < 0.1) {
        const newCount = repCount + 1;
        setRepCount(newCount);
        onRepCount?.(newCount);
      }

      // Simulate form feedback
      if (Math.random() < 0.05) {
        const feedbacks = [
          'Great form! Keep your back straight.',
          'Try to keep your shoulders relaxed.',
          'Excellent posture!',
          'Remember to breathe deeply.',
          'Keep your core engaged.',
          'Perfect alignment!'
        ];
        const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
        setFormFeedback(feedback);
        onFormFeedback?.(feedback);
      }
    }, 1000);

    return () => clearInterval(analysisInterval);
  };

  // Toggle camera
  const toggleCamera = () => {
    if (isCameraOn) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  // Reset rep count
  const resetReps = () => {
    setRepCount(0);
    onRepCount?.(0);
  };

  // Toggle audio
  const toggleAudio = () => {
    setIsMuted(!isMuted);
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={[styles.errorText, { color: colors.textSecondary }]}>
          Camera not available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Camera Controls */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <View style={styles.headerRow}>
            <CameraIcon size={20} color={colors.primary} />
            <Title style={[styles.title, { color: colors.textPrimary }]}>
              AI Form Analysis
            </Title>
          </View>

          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={[
                styles.controlButton,
                isCameraOn ? styles.stopButton : styles.startButton
              ]}
              onPress={toggleCamera}
            >
              {isCameraOn ? <VideoOff size={16} color="white" /> : <CameraIcon size={16} color="white" />}
              <Text style={styles.buttonText}>
                {isCameraOn ? 'Stop Camera' : 'Start Camera'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.secondaryButton]}
              onPress={togglePlay}
            >
              {isPlaying ? <Pause size={16} color={colors.textPrimary} /> : <Play size={16} color={colors.textPrimary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.secondaryButton]}
              onPress={toggleAudio}
            >
              {isMuted ? <VolumeX size={16} color={colors.textPrimary} /> : <Volume2 size={16} color={colors.textPrimary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, styles.secondaryButton]}
              onPress={resetReps}
            >
              <RotateCcw size={16} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Camera Status */}
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, isCameraOn ? styles.activeDot : styles.inactiveDot]} />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              {isCameraOn ? 'Camera Active - AI Analysis Running' : 'Camera Inactive'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Camera View */}
      {isCameraOn && (
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Title style={[styles.title, { color: colors.textPrimary }]}>Live Camera Feed</Title>
            <View style={styles.cameraContainer}>
              <Camera
                ref={cameraRef}
                style={styles.camera}
                device={device}
                isActive={isCameraOn}
                photo={false}
                video={false}
              />
              
              {/* Overlay for pose landmarks (simulated) */}
              {isAnalyzing && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>AI Analysis Active</Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Rep Counter */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Title style={[styles.title, { color: colors.textPrimary }]}>Repetition Counter</Title>
          <View style={styles.repCounter}>
            <Text style={[styles.repCount, { color: colors.primary }]}>{repCount}</Text>
            <Text style={[styles.repLabel, { color: colors.textSecondary }]}>
              Repetitions Completed
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Form Feedback */}
      {formFeedback && (
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <Card.Content>
            <Title style={[styles.title, { color: colors.textPrimary }]}>AI Form Feedback</Title>
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackText}>{formFeedback}</Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Instructions */}
      <Card style={[styles.card, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <Title style={[styles.title, { color: colors.textPrimary }]}>Exercise Instructions</Title>
          <View style={styles.instructionsContainer}>
            {instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={[styles.instructionNumber, { color: colors.primary }]}>
                  {index + 1}.
                </Text>
                <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
                  {instruction}
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Complete Button */}
      <Button
        mode="contained"
        onPress={onComplete}
        disabled={!isCameraOn}
        style={[styles.completeButton, { backgroundColor: colors.primary }]}
        labelStyle={styles.completeButtonText}
      >
        Complete Exercise
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    marginLeft: 8,
    fontSize: 18,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  controlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#10b981',
  },
  stopButton: {
    backgroundColor: '#ef4444',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  activeDot: {
    backgroundColor: '#10b981',
  },
  inactiveDot: {
    backgroundColor: '#ef4444',
  },
  statusText: {
    fontSize: 14,
  },
  cameraContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  camera: {
    width: '100%',
    height: 300,
  },
  overlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  overlayText: {
    color: 'white',
    fontSize: 12,
  },
  repCounter: {
    alignItems: 'center',
    padding: 20,
  },
  repCount: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  repLabel: {
    fontSize: 14,
  },
  feedbackContainer: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 8,
    padding: 16,
  },
  feedbackText: {
    color: '#065f46',
    fontSize: 14,
  },
  instructionsContainer: {
    marginTop: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  instructionNumber: {
    fontWeight: 'bold',
    marginRight: 8,
    fontSize: 14,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  completeButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
