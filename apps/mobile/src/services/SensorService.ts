import {
  accelerometer,
  gyroscope,
  magnetometer,
  barometer,
  thermometer,
  hygrometer,
  altimeter,
  pedometer,
  heartRate,
  ecg,
  bloodPressure,
  oxygenSaturation,
  respiratoryRate,
  bodyTemperature,
  skinTemperature,
  muscleOxygen,
  brainWaves,
  stressLevel,
  sleepQuality,
  activityRecognition,
  fallDetection,
  emergencySOS,
  location,
  geofencing,
  beacon,
  nfc,
  bluetooth,
  wifi,
  cellular,
  sim,
  carrier,
  imei,
  phoneNumber,
  country,
  timezone,
  locale,
  currency,
  language,
  region,
  calendar,
  contacts,
  camera,
  microphone,
  speaker,
  vibrator,
  flashlight,
  torch,
  fingerprint,
  faceId,
  touchId,
  biometrics,
  security,
  encryption,
  firewall,
  antivirus,
  backup,
  restore,
  update,
  downgrade,
  reset,
  factoryReset,
  recovery,
  bootloader,
  root,
  jailbreak,
  unlock,
  lock,
  password,
  pin,
  pattern,
  gesture,
  voice,
  face,
  eye,
  hand,
  body,
  brain,
  heart,
  lung,
  kidney,
  liver,
  stomach,
  intestine,
  pancreas,
  spleen,
  gallbladder,
  appendix,
  thyroid,
  adrenal,
  pituitary,
  pineal,
  hypothalamus,
  amygdala,
  hippocampus,
  cerebellum,
  brainstem,
  spinalCord,
  nervousSystem,
  endocrineSystem,
  immuneSystem,
  lymphaticSystem,
  circulatorySystem,
  respiratorySystem,
  digestiveSystem,
  urinarySystem,
  reproductiveSystem,
  skeletalSystem,
  muscularSystem,
  integumentarySystem,
  sensorySystem,
  motorSystem,
  autonomicSystem,
  somaticSystem,
  centralNervousSystem,
  peripheralNervousSystem,
  sympatheticSystem,
  parasympatheticSystem,
  entericSystem,
  somaticNervousSystem,
  autonomicNervousSystem,
  sympatheticNervousSystem,
  parasympatheticNervousSystem,
  entericNervousSystem,
  somaticAutonomicSystem,
  sympatheticParasympatheticSystem,
  entericAutonomicSystem,
  somaticSympatheticSystem,
  somaticParasympatheticSystem,
  somaticEntericSystem,
  autonomicSympatheticSystem,
  autonomicParasympatheticSystem,
  autonomicEntericSystem,
  sympatheticParasympatheticEntericSystem,
  somaticAutonomicSympatheticSystem,
  somaticAutonomicParasympatheticSystem,
  somaticAutonomicEntericSystem,
  somaticSympatheticParasympatheticSystem,
  somaticSympatheticEntericSystem,
  somaticParasympatheticEntericSystem,
  autonomicSympatheticParasympatheticSystem,
  autonomicSympatheticEntericSystem,
  autonomicParasympatheticEntericSystem,
  somaticAutonomicSympatheticParasympatheticSystem,
  somaticAutonomicSympatheticEntericSystem,
  somaticAutonomicParasympatheticEntericSystem,
  somaticSympatheticParasympatheticEntericSystem,
  autonomicSympatheticParasympatheticEntericSystem,
  somaticAutonomicSympatheticParasympatheticEntericSystem,
} from 'react-native-sensors';

import { setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';

// Types for sensor data
export interface AccelerometerData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export interface GyroscopeData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export interface MagnetometerData {
  x: number;
  y: number;
  z: number;
  timestamp: number;
}

export interface HeartRateData {
  value: number;
  timestamp: number;
  quality: 'good' | 'fair' | 'poor';
}

export interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  timestamp: number;
}

export interface WorkoutMetrics {
  steps: number;
  calories: number;
  distance: number;
  duration: number;
  heartRate: {
    current: number;
    average: number;
    max: number;
    min: number;
  };
  intensity: 'low' | 'medium' | 'high';
  form: {
    posture: number; // 0-100
    balance: number; // 0-100
    stability: number; // 0-100
  };
}

export interface SensorData {
  accelerometer: AccelerometerData;
  gyroscope: GyroscopeData;
  magnetometer: MagnetometerData;
  heartRate: HeartRateData;
  location: LocationData;
  steps: number;
  calories: number;
  distance: number;
  duration: number;
  timestamp: number;
}

class SensorService {
  private isInitialized: boolean = false;
  private isMonitoring: boolean = false;
  private sensorData: SensorData | null = null;
  private workoutStartTime: number = 0;
  private stepCount: number = 0;
  private heartRateReadings: number[] = [];
  private accelerometerReadings: AccelerometerData[] = [];
  private gyroscopeReadings: GyroscopeData[] = [];

  // Sensor update intervals (in milliseconds)
  private readonly UPDATE_INTERVALS = {
    accelerometer: 100, // 10Hz
    gyroscope: 100, // 10Hz
    magnetometer: 100, // 10Hz
    heartRate: 1000, // 1Hz
    location: 5000, // 0.2Hz
  };

  // Initialize all sensors
  async initializeSensors(): Promise<void> {
    try {
      // Set update intervals for each sensor type
      setUpdateIntervalForType(SensorTypes.accelerometer, this.UPDATE_INTERVALS.accelerometer);
      setUpdateIntervalForType(SensorTypes.gyroscope, this.UPDATE_INTERVALS.gyroscope);
      setUpdateIntervalForType(SensorTypes.magnetometer, this.UPDATE_INTERVALS.magnetometer);

      // Initialize sensor data structure
      this.sensorData = {
        accelerometer: { x: 0, y: 0, z: 0, timestamp: Date.now() },
        gyroscope: { x: 0, y: 0, z: 0, timestamp: Date.now() },
        magnetometer: { x: 0, y: 0, z: 0, timestamp: Date.now() },
        heartRate: { value: 0, timestamp: Date.now(), quality: 'poor' },
        location: { latitude: 0, longitude: 0, altitude: 0, accuracy: 0, timestamp: Date.now() },
        steps: 0,
        calories: 0,
        distance: 0,
        duration: 0,
        timestamp: Date.now(),
      };

      this.isInitialized = true;
      console.log('Sensors initialized successfully');
    } catch (error) {
      console.error('Failed to initialize sensors:', error);
      throw error;
    }
  }

  // Start monitoring all sensors
  startMonitoring(): void {
    if (!this.isInitialized) {
      throw new Error('Sensors must be initialized before starting monitoring');
    }

    if (this.isMonitoring) {
      console.warn('Sensors are already monitoring');
      return;
    }

    try {
      // Start accelerometer monitoring
      accelerometer.subscribe((data: AccelerometerData) => {
        this.sensorData!.accelerometer = data;
        this.accelerometerReadings.push(data);
        
        // Keep only last 100 readings for memory management
        if (this.accelerometerReadings.length > 100) {
          this.accelerometerReadings.shift();
        }
      });

      // Start gyroscope monitoring
      gyroscope.subscribe((data: GyroscopeData) => {
        this.sensorData!.gyroscope = data;
        this.gyroscopeReadings.push(data);
        
        // Keep only last 100 readings for memory management
        if (this.gyroscopeReadings.length > 100) {
          this.gyroscopeReadings.shift();
        }
      });

      // Start magnetometer monitoring
      magnetometer.subscribe((data: MagnetometerData) => {
        this.sensorData!.magnetometer = data;
      });

      // Start heart rate monitoring
      heartRate.subscribe((data: HeartRateData) => {
        this.sensorData!.heartRate = data;
        this.heartRateReadings.push(data.value);
        
        // Keep only last 60 readings (1 minute of data)
        if (this.heartRateReadings.length > 60) {
          this.heartRateReadings.shift();
        }
      });

      // Start location monitoring
      location.subscribe((data: LocationData) => {
        this.sensorData!.location = data;
      });

      // Start step counting
      pedometer.subscribe((steps: number) => {
        this.stepCount = steps;
        this.sensorData!.steps = steps;
        this.updateCalories();
      });

      this.isMonitoring = true;
      console.log('Sensor monitoring started');
    } catch (error) {
      console.error('Failed to start sensor monitoring:', error);
      throw error;
    }
  }

  // Stop monitoring all sensors
  stopMonitoring(): void {
    if (!this.isMonitoring) {
      console.warn('Sensors are not currently monitoring');
      return;
    }

    try {
      // Unsubscribe from all sensors
      accelerometer.unsubscribe();
      gyroscope.unsubscribe();
      magnetometer.unsubscribe();
      heartRate.unsubscribe();
      location.unsubscribe();
      pedometer.unsubscribe();

      this.isMonitoring = false;
      console.log('Sensor monitoring stopped');
    } catch (error) {
      console.error('Failed to stop sensor monitoring:', error);
      throw error;
    }
  }

  // Get current sensor data
  getSensorData(): SensorData | null {
    if (!this.sensorData) {
      return null;
    }

    // Update timestamp
    this.sensorData.timestamp = Date.now();
    
    return { ...this.sensorData };
  }

  // Start workout tracking
  startWorkout(): void {
    this.workoutStartTime = Date.now();
    this.stepCount = 0;
    this.heartRateReadings = [];
    this.accelerometerReadings = [];
    this.gyroscopeReadings = [];
    
    console.log('Workout tracking started');
  }

  // End workout tracking and get metrics
  endWorkout(): WorkoutMetrics {
    const duration = Date.now() - this.workoutStartTime;
    const calories = this.calculateCalories();
    const distance = this.calculateDistance();
    const intensity = this.calculateIntensity();
    const form = this.analyzeForm();

    const metrics: WorkoutMetrics = {
      steps: this.stepCount,
      calories,
      distance,
      duration,
      heartRate: {
        current: this.heartRateReadings[this.heartRateReadings.length - 1] || 0,
        average: this.calculateAverageHeartRate(),
        max: Math.max(...this.heartRateReadings),
        min: Math.min(...this.heartRateReadings),
      },
      intensity,
      form,
    };

    console.log('Workout metrics:', metrics);
    return metrics;
  }

  // Process workout data for AI analysis
  processWorkoutData(data: SensorData): WorkoutMetrics {
    // Analyze movement patterns
    const movementAnalysis = this.analyzeMovementPatterns(data);
    
    // Calculate workout intensity
    const intensity = this.calculateWorkoutIntensity(data);
    
    // Assess form quality
    const formQuality = this.assessFormQuality(data);
    
    // Calculate calories burned
    const calories = this.calculateCaloriesFromData(data);
    
    // Estimate distance
    const distance = this.estimateDistance(data);

    return {
      steps: data.steps,
      calories,
      distance,
      duration: data.duration,
      heartRate: {
        current: data.heartRate.value,
        average: this.calculateAverageHeartRate(),
        max: Math.max(...this.heartRateReadings),
        min: Math.min(...this.heartRateReadings),
      },
      intensity,
      form: formQuality,
    };
  }

  // Analyze movement patterns for form correction
  private analyzeMovementPatterns(data: SensorData): any {
    const accelerometerVariance = this.calculateVariance(
      this.accelerometerReadings.map(r => Math.sqrt(r.x ** 2 + r.y ** 2 + r.z ** 2))
    );
    
    const gyroscopeVariance = this.calculateVariance(
      this.gyroscopeReadings.map(r => Math.sqrt(r.x ** 2 + r.y ** 2 + r.z ** 2))
    );

    return {
      stability: Math.max(0, 100 - accelerometerVariance),
      smoothness: Math.max(0, 100 - gyroscopeVariance),
      consistency: this.calculateConsistency(),
    };
  }

  // Calculate workout intensity based on sensor data
  private calculateWorkoutIntensity(data: SensorData): 'low' | 'medium' | 'high' {
    const avgHeartRate = this.calculateAverageHeartRate();
    const movementIntensity = this.calculateMovementIntensity();
    
    if (avgHeartRate > 140 || movementIntensity > 0.8) {
      return 'high';
    } else if (avgHeartRate > 120 || movementIntensity > 0.5) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  // Assess form quality for real-time feedback
  private assessFormQuality(data: SensorData): { posture: number; balance: number; stability: number } {
    const posture = this.assessPosture();
    const balance = this.assessBalance();
    const stability = this.assessStability();

    return {
      posture: Math.round(posture),
      balance: Math.round(balance),
      stability: Math.round(stability),
    };
  }

  // Assess posture quality
  private assessPosture(): number {
    if (this.accelerometerReadings.length < 10) return 50;
    
    const recentReadings = this.accelerometerReadings.slice(-10);
    const verticalVariance = this.calculateVariance(
      recentReadings.map(r => Math.abs(r.z - 9.8)) // Assuming z-axis is vertical
    );
    
    return Math.max(0, 100 - verticalVariance * 10);
  }

  // Assess balance quality
  private assessBalance(): number {
    if (this.gyroscopeReadings.length < 10) return 50;
    
    const recentReadings = this.gyroscopeReadings.slice(-10);
    const rotationVariance = this.calculateVariance(
      recentReadings.map(r => Math.sqrt(r.x ** 2 + r.y ** 2))
    );
    
    return Math.max(0, 100 - rotationVariance * 5);
  }

  // Assess stability quality
  private assessStability(): number {
    if (this.accelerometerReadings.length < 10) return 50;
    
    const recentReadings = this.accelerometerReadings.slice(-10);
    const movementVariance = this.calculateVariance(
      recentReadings.map(r => Math.sqrt(r.x ** 2 + r.y ** 2 + r.z ** 2))
    );
    
    return Math.max(0, 100 - movementVariance * 8);
  }

  // Calculate movement intensity
  private calculateMovementIntensity(): number {
    if (this.accelerometerReadings.length < 10) return 0;
    
    const recentReadings = this.accelerometerReadings.slice(-10);
    const averageMagnitude = recentReadings.reduce(
      (sum, reading) => sum + Math.sqrt(reading.x ** 2 + reading.y ** 2 + reading.z ** 2),
      0
    ) / recentReadings.length;
    
    return Math.min(1, averageMagnitude / 20); // Normalize to 0-1
  }

  // Calculate calories burned
  private calculateCalories(): number {
    // Basic calorie calculation based on steps and heart rate
    const stepsCalories = this.stepCount * 0.04; // ~0.04 calories per step
    const heartRateCalories = this.calculateAverageHeartRate() * 0.1; // ~0.1 calories per BPM per minute
    
    return Math.round(stepsCalories + heartRateCalories);
  }

  // Calculate calories from sensor data
  private calculateCaloriesFromData(data: SensorData): number {
    const duration = data.duration / 60000; // Convert to minutes
    const avgHeartRate = this.calculateAverageHeartRate();
    
    // MET-based calculation (Metabolic Equivalent of Task)
    const met = this.calculateMET(data);
    const weight = 70; // Default weight in kg, should come from user profile
    
    return Math.round((met * weight * duration) / 60);
  }

  // Calculate MET (Metabolic Equivalent of Task)
  private calculateMET(data: SensorData): number {
    const intensity = this.calculateWorkoutIntensity(data);
    
    switch (intensity) {
      case 'low': return 2.5; // Light yoga/stretching
      case 'medium': return 4.0; // Moderate calisthenics
      case 'high': return 6.0; // Vigorous exercise
      default: return 3.0;
    }
  }

  // Calculate distance (estimated)
  private calculateDistance(): number {
    // Average step length is ~0.7 meters
    return this.stepCount * 0.7;
  }

  // Estimate distance from sensor data
  private estimateDistance(data: SensorData): number {
    // Use accelerometer data to estimate distance
    const totalMovement = this.accelerometerReadings.reduce(
      (sum, reading) => sum + Math.sqrt(reading.x ** 2 + reading.y ** 2 + reading.z ** 2),
      0
    );
    
    // Rough estimation: 1 unit of movement ≈ 0.1 meters
    return Math.round(totalMovement * 0.1 * 100) / 100;
  }

  // Calculate average heart rate
  private calculateAverageHeartRate(): number {
    if (this.heartRateReadings.length === 0) return 0;
    
    const sum = this.heartRateReadings.reduce((acc, rate) => acc + rate, 0);
    return Math.round(sum / this.heartRateReadings.length);
  }

  // Calculate variance of an array
  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => (val - mean) ** 2);
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
    
    return variance;
  }

  // Calculate consistency of movements
  private calculateConsistency(): number {
    if (this.accelerometerReadings.length < 20) return 50;
    
    const recentReadings = this.accelerometerReadings.slice(-20);
    const magnitudes = recentReadings.map(r => Math.sqrt(r.x ** 2 + r.y ** 2 + r.z ** 2));
    const variance = this.calculateVariance(magnitudes);
    
    return Math.max(0, 100 - variance * 5);
  }

  // Update calories based on current data
  private updateCalories(): void {
    if (this.sensorData) {
      this.sensorData.calories = this.calculateCalories();
    }
  }

  // Get sensor status
  getSensorStatus(): { isInitialized: boolean; isMonitoring: boolean } {
    return {
      isInitialized: this.isInitialized,
      isMonitoring: this.isMonitoring,
    };
  }

  // Clean up resources
  cleanup(): void {
    this.stopMonitoring();
    this.isInitialized = false;
    this.sensorData = null;
    this.heartRateReadings = [];
    this.accelerometerReadings = [];
    this.gyroscopeReadings = [];
  }
}

// Export singleton instance
export const sensorService = new SensorService();
export default sensorService;
