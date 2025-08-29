'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Progress, Switch, Input } from '@mobii/ui';
import BrandHeader from '../../components/ui/brand-header';
import BrandFooter from '../../components/ui/brand-footer';
import { 
  Brain, 
  Target, 
  Clock, 
  Flame, 
  Activity, 
  Heart,
  Zap,
  Settings,
  Play,
  Sparkles,
  Dumbbell,
  Star
} from 'lucide-react';

interface WorkoutPreferences {
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
  energyLevel: 'low' | 'medium' | 'high';
  workoutType: 'chair-yoga' | 'calisthenics' | 'mixed';
  includeWarmup: boolean;
  includeCooldown: boolean;
}

interface GeneratedWorkout {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  calories: number;
  exerciseCount: number;
  focusAreas: string[];
  exercises: {
    name: string;
    duration: number;
    sets: number;
    reps: number;
    description: string;
    category: string;
  }[];
}

export default function AIGeneratorPage() {
  const [preferences, setPreferences] = useState<WorkoutPreferences>({
    duration: 20,
    difficulty: 'intermediate',
    focusAreas: ['core', 'upper-body'],
    energyLevel: 'medium',
    workoutType: 'mixed',
    includeWarmup: true,
    includeCooldown: true
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<GeneratedWorkout | null>(null);

  const focusAreaOptions = [
    { id: 'core', label: 'Core', icon: '💪' },
    { id: 'upper-body', label: 'Upper Body', icon: '🏋️' },
    { id: 'lower-body', label: 'Lower Body', icon: '🦵' },
    { id: 'flexibility', label: 'Flexibility', icon: '🧘' },
    { id: 'balance', label: 'Balance', icon: '⚖️' },
    { id: 'cardio', label: 'Cardio', icon: '❤️' }
  ];

  const difficultyColors = {
    beginner: 'bg-green-500',
    intermediate: 'bg-yellow-500',
    advanced: 'bg-red-500'
  };

  const energyLevelColors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };

  const handleFocusAreaToggle = (areaId: string) => {
    setPreferences(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(areaId)
        ? prev.focusAreas.filter(id => id !== areaId)
        : [...prev.focusAreas, areaId]
    }));
  };

  const generateWorkout = async () => {
    setIsGenerating(true);
    try {
      // Import the AI service dynamically to avoid SSR issues
      const { AIService } = await import('../../features/ai-generator');
      const aiService = new AIService();
      
      // Convert preferences to match the AI service interface
      const aiPreferences = {
        duration: preferences.duration,
        difficulty: preferences.difficulty,
        focusAreas: preferences.focusAreas.map(area => 
          area.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
        )
      };
      
      const generatedWorkout = await aiService.generateWorkout(aiPreferences);
      
      // Convert the AI response to match our interface
      const convertedWorkout: GeneratedWorkout = {
        id: generatedWorkout.id,
        title: generatedWorkout.title,
        description: generatedWorkout.description,
        duration: generatedWorkout.duration,
        difficulty: generatedWorkout.difficulty,
        calories: generatedWorkout.calories,
        exerciseCount: generatedWorkout.exerciseCount,
        focusAreas: generatedWorkout.focusAreas,
        exercises: generatedWorkout.exercises.map(exercise => ({
          name: exercise.name,
          duration: exercise.duration,
          sets: exercise.sets,
          reps: typeof exercise.reps === 'string' ? parseInt(exercise.reps) || 10 : exercise.reps,
          description: exercise.description,
          category: exercise.category.toLowerCase()
        }))
      };
      
      setGeneratedWorkout(convertedWorkout);
    } catch (error) {
      console.error('AI generation failed:', error);
      // Fallback to default workout
      const fallbackWorkout: GeneratedWorkout = {
        id: `fallback-${Date.now()}`,
        title: `Smart ${preferences.difficulty} Workout`,
        description: `A personalized ${preferences.difficulty} workout focusing on ${preferences.focusAreas.join(', ')}`,
        duration: preferences.duration,
        difficulty: preferences.difficulty,
        calories: Math.round(preferences.duration * 4.5),
        exerciseCount: 8,
        focusAreas: preferences.focusAreas,
        exercises: [
          {
            name: 'Chair Cat-Cow Stretch',
            duration: 2,
            sets: 1,
            reps: 10,
            description: 'Gentle spinal mobility exercise',
            category: 'warmup'
          },
          {
            name: 'Seated Arm Circles',
            duration: 1,
            sets: 1,
            reps: 10,
            description: 'Shoulder mobility and warmup',
            category: 'warmup'
          },
          {
            name: 'Chair Squats',
            duration: 3,
            sets: 3,
            reps: 12,
            description: 'Lower body strength exercise',
            category: 'strength'
          },
          {
            name: 'Seated Core Twists',
            duration: 2,
            sets: 3,
            reps: 15,
            description: 'Core rotation and stability',
            category: 'strength'
          },
          {
            name: 'Chair Push-ups',
            duration: 3,
            sets: 3,
            reps: 10,
            description: 'Upper body strength building',
            category: 'strength'
          },
          {
            name: 'Seated Leg Extensions',
            duration: 2,
            sets: 3,
            reps: 12,
            description: 'Quadriceps strengthening',
            category: 'strength'
          },
          {
            name: 'Deep Breathing',
            duration: 2,
            sets: 1,
            reps: 5,
            description: 'Relaxation and recovery',
            category: 'cooldown'
          },
          {
            name: 'Gentle Stretching',
            duration: 3,
            sets: 1,
            reps: 1,
            description: 'Full body flexibility',
            category: 'cooldown'
          }
        ]
      };
      setGeneratedWorkout(fallbackWorkout);
    } finally {
      setIsGenerating(false);
    }
  };

  const startGeneratedWorkout = () => {
    if (generatedWorkout) {
      window.location.href = `/workout/${generatedWorkout.id}`;
    }
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preferences Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Workout Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Duration */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    Duration: {preferences.duration} minutes
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={preferences.duration}
                    onChange={(e) => setPreferences(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-background-secondary rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>10 min</span>
                    <span>60 min</span>
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-3 block">
                    Difficulty Level
                  </label>
                  <div className="flex gap-2">
                    {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                      <Button
                        key={level}
                        variant={preferences.difficulty === level ? 'default' : 'outline'}
                        onClick={() => setPreferences(prev => ({ ...prev, difficulty: level }))}
                        className="capitalize"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Energy Level */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-3 block">
                    Energy Level
                  </label>
                  <div className="flex gap-2">
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <Button
                        key={level}
                        variant={preferences.energyLevel === level ? 'default' : 'outline'}
                        onClick={() => setPreferences(prev => ({ ...prev, energyLevel: level }))}
                        className="capitalize"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Workout Type */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-3 block">
                    Workout Type
                  </label>
                  <div className="flex gap-2">
                    {(['chair-yoga', 'calisthenics', 'mixed'] as const).map((type) => (
                      <Button
                        key={type}
                        variant={preferences.workoutType === type ? 'default' : 'outline'}
                        onClick={() => setPreferences(prev => ({ ...prev, workoutType: type }))}
                        className="capitalize"
                      >
                        {type.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Focus Areas */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-3 block">
                    Focus Areas
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {focusAreaOptions.map((area) => (
                      <Button
                        key={area.id}
                        variant={preferences.focusAreas.includes(area.id) ? 'default' : 'outline'}
                        onClick={() => handleFocusAreaToggle(area.id)}
                        className="justify-start"
                      >
                        <span className="mr-2">{area.icon}</span>
                        {area.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-text-primary">
                      Include Warmup
                    </label>
                    <Switch
                      checked={preferences.includeWarmup}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, includeWarmup: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-text-primary">
                      Include Cooldown
                    </label>
                    <Switch
                      checked={preferences.includeCooldown}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, includeCooldown: checked }))}
                    />
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateWorkout}
                  disabled={isGenerating || preferences.focusAreas.length === 0}
                  className="w-full bg-gradient-to-r from-teal-400 to-purple-600 hover:from-teal-500 hover:to-purple-700"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Workout...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Workout
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Generated Workout */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {generatedWorkout ? (
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Generated Workout
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {generatedWorkout.title}
                    </h3>
                    <p className="text-text-muted text-sm mb-4">
                      {generatedWorkout.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-background-secondary rounded-lg">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-text-muted" />
                      <div className="text-sm font-medium text-text-primary">{generatedWorkout.duration} min</div>
                    </div>
                    <div className="text-center p-3 bg-background-secondary rounded-lg">
                      <Flame className="h-5 w-5 mx-auto mb-1 text-text-muted" />
                      <div className="text-sm font-medium text-text-primary">{generatedWorkout.calories} cal</div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Badge className={difficultyColors[generatedWorkout.difficulty as keyof typeof difficultyColors]}>
                      {generatedWorkout.difficulty}
                    </Badge>
                    {generatedWorkout.focusAreas.map((area) => (
                      <Badge key={area} variant="outline">
                        {area.replace('-', ' ')}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-text-primary">Exercises ({generatedWorkout.exerciseCount})</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {generatedWorkout.exercises.map((exercise, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-background-secondary rounded">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-text-primary">{exercise.name}</div>
                            <div className="text-xs text-text-muted">{exercise.description}</div>
                          </div>
                          <div className="text-xs text-text-muted">
                            {exercise.sets}x{exercise.reps}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={startGeneratedWorkout}
                    className="w-full bg-gradient-to-r from-teal-400 to-purple-600 hover:from-teal-500 hover:to-purple-700"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start This Workout
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-fit">
                <CardContent className="text-center py-12">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-text-muted opacity-50" />
                  <h3 className="text-lg font-medium text-text-primary mb-2">No Workout Generated</h3>
                  <p className="text-text-muted text-sm">
                    Configure your preferences and click "Generate Workout" to create a personalized routine.
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
