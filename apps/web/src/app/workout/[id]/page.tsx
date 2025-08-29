'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle, Progress, Badge } from '@mobii/ui';
import BrandHeader from '../../../components/ui/brand-header';
import { CompactYouTubeVideo } from '../../../features/workout-player/components/youtube-video';
import { YouTubeService } from '../../../features/workout-player/services/youtube-service';
import { CompactVoiceCoaching } from '../../../features/voice-coaching/components/voice-coaching';
import { CompactVoiceCommand } from '../../../features/voice-coaching/components/voice-command';
import { CameraWorkoutPlayer } from '../../../features/camera-ai/components/camera-workout-player';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  RotateCcw,
  CheckCircle,
  Clock,
  Flame,
  Target,
  ArrowLeft,
  Video,
  Camera
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  description: string;
  duration: number;
  sets: number;
  reps: number;
  category: 'warmup' | 'strength' | 'cooldown';
  instructions: string[];
  image?: string;
}

interface Workout {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  calories: number;
  exercises: Exercise[];
  focusAreas: string[];
}

const mockWorkouts: Record<string, Workout> = {
  '1': {
    id: '1',
    title: 'Morning Chair Yoga Flow',
    description: 'Gentle stretches and breathing exercises to start your day',
    duration: 15,
    difficulty: 'beginner',
    calories: 45,
    focusAreas: ['flexibility', 'core'],
    exercises: [
      {
        id: '1-1',
        name: 'Seated Cat-Cow Stretch',
        description: 'Gentle spinal mobility exercise',
        duration: 2,
        sets: 1,
        reps: 10,
        category: 'warmup',
        instructions: [
          'Sit comfortably in your chair with feet flat on the floor',
          'Place hands on your knees',
          'Inhale and arch your back, lifting your chest',
          'Exhale and round your back, tucking your chin',
          'Repeat for 10 breaths'
        ]
      },
      {
        id: '1-2',
        name: 'Seated Arm Circles',
        description: 'Shoulder mobility and warmup',
        duration: 1,
        sets: 1,
        reps: 10,
        category: 'warmup',
        instructions: [
          'Sit with your back straight',
          'Extend your arms out to the sides',
          'Make small circles with your arms',
          'Do 10 forward circles, then 10 backward circles'
        ]
      },
      {
        id: '1-3',
        name: 'Chair Squats',
        description: 'Lower body strength exercise',
        duration: 3,
        sets: 3,
        reps: 12,
        category: 'strength',
        instructions: [
          'Stand in front of your chair',
          'Lower yourself as if sitting down',
          'Just before touching the chair, stand back up',
          'Keep your weight in your heels',
          'Repeat 12 times for 3 sets'
        ]
      },
      {
        id: '1-4',
        name: 'Seated Core Twists',
        description: 'Core rotation and stability',
        duration: 2,
        sets: 3,
        reps: 15,
        category: 'strength',
        instructions: [
          'Sit with your back straight',
          'Place your hands behind your head',
          'Rotate your torso to the right',
          'Hold for 2 seconds, then rotate to the left',
          'Repeat 15 times for each side'
        ]
      },
      {
        id: '1-5',
        name: 'Deep Breathing',
        description: 'Relaxation and recovery',
        duration: 2,
        sets: 1,
        reps: 5,
        category: 'cooldown',
        instructions: [
          'Sit comfortably with your eyes closed',
          'Place one hand on your chest, one on your belly',
          'Inhale deeply through your nose for 4 counts',
          'Hold for 4 counts',
          'Exhale slowly for 6 counts',
          'Repeat 5 times'
        ]
      }
    ]
  },
  '2': {
    id: '2',
    title: 'Upper Body Strength',
    description: 'Build strength in your arms, shoulders, and chest',
    duration: 25,
    difficulty: 'intermediate',
    calories: 120,
    focusAreas: ['upper-body', 'strength'],
    exercises: [
      {
        id: '2-1',
        name: 'Chair Push-ups',
        description: 'Upper body strength building',
        duration: 3,
        sets: 3,
        reps: 10,
        category: 'strength',
        instructions: [
          'Place your hands on the edge of your chair',
          'Walk your feet out so your body is at an angle',
          'Lower your chest toward the chair',
          'Push back up to starting position',
          'Keep your core engaged throughout'
        ]
      },
      {
        id: '2-2',
        name: 'Seated Shoulder Press',
        description: 'Shoulder strength and stability',
        duration: 3,
        sets: 3,
        reps: 12,
        category: 'strength',
        instructions: [
          'Sit with your back straight',
          'Hold imaginary weights at shoulder level',
          'Press your arms up overhead',
          'Lower back to shoulder level',
          'Keep your core engaged'
        ]
      }
    ]
  }
};

export default function WorkoutPlayerPage() {
  const params = useParams();
  const workoutId = params.id as string;
  const workout = mockWorkouts[workoutId];

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [youtubeService] = useState(() => new YouTubeService());
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showCameraAI, setShowCameraAI] = useState(false);
  const [aiFormFeedback, setAiFormFeedback] = useState<string[]>([]);
  const [aiRepCount, setAiRepCount] = useState(0);

  const currentExercise = workout?.exercises[currentExerciseIndex];

  useEffect(() => {
    if (workout) {
      setTotalTime(workout.exercises.reduce((acc, ex) => acc + ex.duration, 0) * 60);
      setTimeRemaining(workout.exercises.reduce((acc, ex) => acc + ex.duration, 0) * 60);
    }
  }, [workout]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Move to next exercise or finish workout
            if (currentExerciseIndex < (workout?.exercises.length || 0) - 1) {
              setCurrentExerciseIndex(prev => prev + 1);
              const nextExercise = workout?.exercises[currentExerciseIndex + 1];
              return nextExercise ? nextExercise.duration * 60 : 0;
            } else {
              setIsPlaying(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, timeRemaining, currentExerciseIndex, workout]);

  if (!workout) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Workout Not Found</h1>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((totalTime - timeRemaining) / totalTime) * 100;
  const exerciseProgress = (currentExerciseIndex / workout.exercises.length) * 100;

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipToNext = () => {
    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      const nextExercise = workout.exercises[currentExerciseIndex + 1];
      setTimeRemaining(nextExercise.duration * 60);
    }
  };

  const skipToPrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      const prevExercise = workout.exercises[currentExerciseIndex - 1];
      setTimeRemaining(prevExercise.duration * 60);
    }
  };

  const resetWorkout = () => {
    setCurrentExerciseIndex(0);
    setTimeRemaining(totalTime);
    setIsPlaying(false);
    setCompletedExercises(new Set());
  };

  const markExerciseComplete = (exerciseId: string) => {
    setCompletedExercises(prev => new Set(Array.from(prev).concat(exerciseId)));
  };

  // AI Camera handlers
  const handleAiFormFeedback = (feedback: string) => {
    setAiFormFeedback(prev => [...prev, feedback]);
  };

  const handleAiRepCount = (count: number) => {
    setAiRepCount(count);
  };

  const handleAiComplete = () => {
    if (currentExercise) {
      markExerciseComplete(currentExercise.id);
    }
  };

  // Fetch YouTube video for current exercise
  const fetchExerciseVideo = async (exerciseName: string) => {
    try {
      const video = await youtubeService.searchExerciseVideo(
        exerciseName, 
        workout.difficulty, 
        currentExercise?.category || 'general'
      );
      setCurrentVideo(video);
    } catch (error) {
      console.error('Failed to fetch exercise video:', error);
      setCurrentVideo(null);
    }
  };

  // Fetch video when exercise changes
  useEffect(() => {
    if (currentExercise) {
      fetchExerciseVideo(currentExercise.name);
    }
  }, [currentExercise]);

  return (
    <div className="min-h-screen bg-background-primary">
      <main className="max-w-4xl mx-auto p-6 lg:p-8">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-teal-400" />
                  <div className="text-2xl font-bold text-text-primary">{formatTime(timeRemaining)}</div>
                  <div className="text-sm text-text-muted">Time Remaining</div>
                </div>
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-2xl font-bold text-text-primary">{currentExerciseIndex + 1}/{workout.exercises.length}</div>
                  <div className="text-sm text-text-muted">Exercise</div>
                </div>
                <div className="text-center">
                  <Flame className="h-8 w-8 mx-auto mb-2 text-orange-400" />
                  <div className="text-2xl font-bold text-text-primary">{Math.round((totalTime - timeRemaining) / 60 * 3)}</div>
                  <div className="text-sm text-text-muted">Calories</div>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
                  <div className="text-2xl font-bold text-text-primary">{completedExercises.size}</div>
                  <div className="text-sm text-text-muted">Completed</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Overall Progress</span>
                  <span className="text-text-primary font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Current Exercise */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Current Exercise</span>
                <Badge className={currentExercise?.category === 'warmup' ? 'bg-blue-500' : 
                                 currentExercise?.category === 'strength' ? 'bg-orange-500' : 'bg-green-500'}>
                  {currentExercise?.category}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary mb-2">{currentExercise?.name}</h2>
                <p className="text-text-muted mb-4">{currentExercise?.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-text-primary">{currentExercise?.duration}</div>
                    <div className="text-sm text-text-muted">Minutes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-text-primary">{currentExercise?.sets}</div>
                    <div className="text-sm text-text-muted">Sets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-text-primary">{currentExercise?.reps}</div>
                    <div className="text-sm text-text-muted">Reps</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Exercise Progress</span>
                    <span className="text-text-primary font-medium">{Math.round(exerciseProgress)}%</span>
                  </div>
                  <Progress value={exerciseProgress} className="h-2" />
                </div>
              </div>

              {/* Exercise Video */}
              {currentVideo && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Video className="h-5 w-5 text-teal-400" />
                    <h3 className="font-semibold text-text-primary">Video Demonstration</h3>
                  </div>
                  <CompactYouTubeVideo
                    videoId={currentVideo.id}
                    title={currentVideo.title}
                    onClose={() => setShowVideo(false)}
                    className="w-full"
                  />
                </div>
              )}

              {/* Instructions */}
              <div className="mb-6">
                <h3 className="font-semibold text-text-primary mb-3">Instructions:</h3>
                <ol className="space-y-2">
                  {currentExercise?.instructions.map((instruction, index) => (
                    <li key={index} className="text-text-muted text-sm flex items-start gap-2">
                      <span className="text-teal-400 font-bold">{index + 1}.</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Exercise Actions */}
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => markExerciseComplete(currentExercise?.id || '')}
                  disabled={completedExercises.has(currentExercise?.id || '')}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Complete
                </Button>
                
                {/* Voice Coaching */}
                <CompactVoiceCoaching
                  exerciseName={currentExercise?.name}
                  instructions={currentExercise?.instructions}
                  className="ml-4"
                />

                {/* Voice Commands */}
                <CompactVoiceCommand
                  onCommand={(result) => {
                    console.log('Voice command received:', result);
                    // Handle voice commands here
                    switch (result.action) {
                      case 'pause_workout':
                        setIsPlaying(false);
                        break;
                      case 'resume_workout':
                        setIsPlaying(true);
                        break;
                      case 'check_form':
                        // Trigger form check
                        break;
                      default:
                        break;
                    }
                  }}
                  className="ml-4"
                />

                {/* Camera AI Toggle */}
                <Button
                  variant={showCameraAI ? "default" : "outline"}
                  onClick={() => setShowCameraAI(!showCameraAI)}
                  className="ml-4"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  {showCameraAI ? 'Hide AI' : 'Show AI'}
                </Button>
              </div>

              {/* AI Form Feedback Display */}
              {aiFormFeedback.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">AI Form Feedback:</h4>
                  <div className="space-y-1">
                    {aiFormFeedback.slice(-3).map((feedback, index) => (
                      <div key={index} className="text-sm text-blue-700">
                        • {feedback}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Rep Counter */}
              {aiRepCount > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{aiRepCount}</div>
                    <div className="text-sm text-green-700">AI Counted Reps</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Camera AI Integration */}
        {showCameraAI && currentExercise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-teal-400" />
                  AI Form Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CameraWorkoutPlayer
                  exerciseName={currentExercise.name}
                  instructions={currentExercise.instructions}
                  onFormFeedback={handleAiFormFeedback}
                  onRepCount={handleAiRepCount}
                  onComplete={handleAiComplete}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={skipToPrevious}
                  disabled={currentExerciseIndex === 0}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button
                  size="lg"
                  onClick={togglePlayPause}
                  className="bg-gradient-to-r from-teal-400 to-purple-600 hover:from-teal-500 hover:to-purple-700"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={skipToNext}
                  disabled={currentExerciseIndex === workout.exercises.length - 1}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  onClick={resetWorkout}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Exercise List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Workout Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {workout.exercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                      index === currentExerciseIndex 
                        ? 'bg-gradient-to-r from-teal-400/20 to-purple-600/20 border border-teal-400/30' 
                        : 'bg-background-secondary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        completedExercises.has(exercise.id)
                          ? 'bg-green-500 text-white'
                          : index === currentExerciseIndex
                          ? 'bg-gradient-to-r from-teal-400 to-purple-600 text-white'
                          : 'bg-background-primary text-text-muted'
                      }`}>
                        {completedExercises.has(exercise.id) ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{exercise.name}</div>
                        <div className="text-sm text-text-muted">{exercise.duration} min • {exercise.sets}x{exercise.reps}</div>
                      </div>
                    </div>
                    <Badge className={
                      exercise.category === 'warmup' ? 'bg-blue-500' : 
                      exercise.category === 'strength' ? 'bg-orange-500' : 'bg-green-500'
                    }>
                      {exercise.category}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
