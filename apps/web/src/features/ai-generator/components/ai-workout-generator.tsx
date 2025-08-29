'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Clock, 
  Zap, 
  TrendingUp, 
  Sparkles,
  Lightbulb,
  Settings,
  Play,
  Heart,
  Dumbbell,
  Activity,
  Calendar,
  Star,
  ChevronRight,
  Loader2,
  Flame
} from 'lucide-react';
import { Card, Button } from '@mobii/ui';
import { Badge, Progress } from '@mobii/ui';
import { Switch, Input } from '@mobii/ui';

interface WorkoutPreferences {
  type: 'chair_yoga' | 'calisthenics' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  focus: string[];
  energy: 'low' | 'medium' | 'high';
  theme: string;
}

interface AIWorkoutSuggestion {
  id: string;
  name: string;
  description: string;
  type: 'chair_yoga' | 'calisthenics' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  estimatedCalories: number;
  focus: string[];
  exercises: number;
  aiScore: number; // 0-100
  personalization: {
    matchesGoals: number;
    matchesEnergy: number;
    matchesTheme: number;
    adaptiveDifficulty: number;
  };
  tags: string[];
  preview?: {
    exercises: Array<{
      name: string;
      duration: number;
      category: string;
    }>;
  };
}

interface AIWorkoutGeneratorProps {
  userId?: string;
  onWorkoutSelect?: (workout: AIWorkoutSuggestion) => void;
}

export function AIWorkoutGenerator({ userId, onWorkoutSelect }: AIWorkoutGeneratorProps) {
  const [preferences, setPreferences] = useState<WorkoutPreferences>({
    type: 'mixed',
    difficulty: 'intermediate',
    duration: 30,
    focus: ['flexibility', 'strength'],
    energy: 'medium',
    theme: 'dark',
  });

  const [suggestions, setSuggestions] = useState<AIWorkoutSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AIWorkoutSuggestion | null>(null);

  const focusOptions = [
    { id: 'flexibility', label: 'Flexibility', icon: '🧘' },
    { id: 'strength', label: 'Strength', icon: '💪' },
    { id: 'balance', label: 'Balance', icon: '⚖️' },
    { id: 'mobility', label: 'Mobility', icon: '🔄' },
    { id: 'relaxation', label: 'Relaxation', icon: '😌' },
    { id: 'energy', label: 'Energy Boost', icon: '⚡' },
    { id: 'core', label: 'Core Strength', icon: '🎯' },
    { id: 'posture', label: 'Posture', icon: '📏' },
  ];

  const energyLevels = [
    { id: 'low', label: 'Low Energy', description: 'Gentle, restorative' },
    { id: 'medium', label: 'Medium Energy', description: 'Balanced, moderate' },
    { id: 'high', label: 'High Energy', description: 'Dynamic, challenging' },
  ];

  // Mock AI suggestions
  useEffect(() => {
    const generateMockSuggestions = (): AIWorkoutSuggestion[] => [
      {
        id: '1',
        name: 'Morning Flow & Strength',
        description: 'A balanced morning routine combining gentle yoga flows with bodyweight strength exercises to energize your day.',
        type: 'mixed',
        difficulty: 'intermediate',
        duration: 30,
        estimatedCalories: 180,
        focus: ['flexibility', 'strength', 'energy'],
        exercises: 8,
        aiScore: 94,
        personalization: {
          matchesGoals: 95,
          matchesEnergy: 90,
          matchesTheme: 88,
          adaptiveDifficulty: 92,
        },
        tags: ['morning', 'energizing', 'balanced'],
        preview: {
          exercises: [
            { name: 'Sun Salutation Flow', duration: 5, category: 'yoga' },
            { name: 'Chair Squats', duration: 4, category: 'strength' },
            { name: 'Seated Twists', duration: 3, category: 'flexibility' },
            { name: 'Wall Push-ups', duration: 4, category: 'strength' },
            { name: 'Neck & Shoulder Stretches', duration: 3, category: 'mobility' },
            { name: 'Core Engagement Series', duration: 4, category: 'core' },
            { name: 'Breathing & Relaxation', duration: 3, category: 'relaxation' },
            { name: 'Cool Down Stretches', duration: 4, category: 'flexibility' },
          ],
        },
      },
      {
        id: '2',
        name: 'Zen Chair Yoga',
        description: 'A calming session focused on mindfulness, breathing, and gentle stretches perfect for stress relief.',
        type: 'chair_yoga',
        difficulty: 'beginner',
        duration: 25,
        estimatedCalories: 120,
        focus: ['relaxation', 'flexibility', 'balance'],
        exercises: 6,
        aiScore: 89,
        personalization: {
          matchesGoals: 85,
          matchesEnergy: 95,
          matchesTheme: 92,
          adaptiveDifficulty: 88,
        },
        tags: ['zen', 'relaxing', 'mindfulness'],
      },
      {
        id: '3',
        name: 'Power Calisthenics',
        description: 'High-intensity bodyweight exercises designed to build strength and endurance with chair support.',
        type: 'calisthenics',
        difficulty: 'advanced',
        duration: 35,
        estimatedCalories: 250,
        focus: ['strength', 'energy', 'core'],
        exercises: 10,
        aiScore: 87,
        personalization: {
          matchesGoals: 80,
          matchesEnergy: 85,
          matchesTheme: 90,
          adaptiveDifficulty: 95,
        },
        tags: ['power', 'intense', 'strength'],
      },
    ];

    setSuggestions(generateMockSuggestions());
  }, [preferences]);

  const handleGenerateWorkouts = async () => {
    setLoading(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  const handleFocusToggle = (focusId: string) => {
    setPreferences(prev => ({
      ...prev,
      focus: prev.focus.includes(focusId)
        ? prev.focus.filter(f => f !== focusId)
        : [...prev.focus, focusId],
    }));
  };

  const getPersonalizationScore = (suggestion: AIWorkoutSuggestion) => {
    const { personalization } = suggestion;
    return Math.round(
      (personalization.matchesGoals + 
       personalization.matchesEnergy + 
       personalization.matchesTheme + 
       personalization.adaptiveDifficulty) / 4
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-success';
      case 'intermediate': return 'text-warning';
      case 'advanced': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-accent/10 rounded-full">
          <Brain className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">AI Workout Generator</h1>
          <p className="text-text-secondary">Get personalized workout recommendations powered by AI</p>
        </div>
      </div>

      {/* Preferences Panel */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Workout Preferences</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings className="h-4 w-4 mr-2" />
            {showAdvanced ? 'Basic' : 'Advanced'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Workout Type */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Type</label>
            <select
              value={preferences.type}
              onChange={(e) => setPreferences(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full p-2 bg-background-secondary border border-border rounded-md text-text-primary"
            >
              <option value="mixed">Mixed</option>
              <option value="chair_yoga">Chair Yoga</option>
              <option value="calisthenics">Calisthenics</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Difficulty</label>
            <select
              value={preferences.difficulty}
              onChange={(e) => setPreferences(prev => ({ ...prev, difficulty: e.target.value as any }))}
              className="w-full p-2 bg-background-secondary border border-border rounded-md text-text-primary"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Duration (min)</label>
            <Input
              type="number"
              value={preferences.duration}
              onChange={(e) => setPreferences(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
              min="10"
              max="90"
              className="w-full"
            />
          </div>

          {/* Energy Level */}
          <div>
            <label className="text-sm font-medium text-text-secondary mb-2 block">Energy Level</label>
            <select
              value={preferences.energy}
              onChange={(e) => setPreferences(prev => ({ ...prev, energy: e.target.value as any }))}
              className="w-full p-2 bg-background-secondary border border-border rounded-md text-text-primary"
            >
              {energyLevels.map(level => (
                <option key={level.id} value={level.id}>{level.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="mb-6">
          <label className="text-sm font-medium text-text-secondary mb-3 block">Focus Areas</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {focusOptions.map(option => (
              <button
                key={option.id}
                onClick={() => handleFocusToggle(option.id)}
                className={`p-3 rounded-lg border transition-all ${
                  preferences.focus.includes(option.id)
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border bg-background-secondary text-text-secondary hover:border-accent/50'
                }`}
              >
                <div className="text-lg mb-1">{option.icon}</div>
                <div className="text-xs font-medium">{option.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleGenerateWorkouts}
            disabled={loading}
            className="px-8 py-3"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Workouts
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* AI Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-semibold text-text-primary">AI Recommendations</h2>
              <Badge variant="secondary" className="ml-2">
                {suggestions.length} suggestions
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-all cursor-pointer border-2 hover:border-accent/50"
                        onClick={() => setSelectedSuggestion(suggestion)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-text-primary">{suggestion.name}</h3>
                          <Badge 
                            variant="outline" 
                            className={getDifficultyColor(suggestion.difficulty)}
                          >
                            {suggestion.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-text-secondary mb-3">{suggestion.description}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {suggestion.duration}m
                          </div>
                          <div className="flex items-center gap-1">
                            <Dumbbell className="h-4 w-4" />
                            {suggestion.exercises} exercises
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="h-4 w-4" />
                            ~{suggestion.estimatedCalories} cal
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {suggestion.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent mb-1">
                          {suggestion.aiScore}
                        </div>
                        <div className="text-xs text-text-muted">AI Score</div>
                      </div>
                    </div>

                    {/* Personalization Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-text-secondary">Personalization</span>
                        <span className="text-xs font-medium text-text-primary">
                          {getPersonalizationScore(suggestion)}%
                        </span>
                      </div>
                      <Progress value={getPersonalizationScore(suggestion)} className="h-1" />
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onWorkoutSelect?.(suggestion);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Workout
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workout Preview Modal */}
      <AnimatePresence>
        {selectedSuggestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background-primary/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSuggestion(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-text-primary">Workout Preview</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedSuggestion(null)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">{selectedSuggestion.name}</h3>
                    <p className="text-text-secondary">{selectedSuggestion.description}</p>
                  </div>

                  {selectedSuggestion.preview && (
                    <div>
                      <h4 className="font-medium text-text-primary mb-3">Exercise Breakdown</h4>
                      <div className="space-y-2">
                        {selectedSuggestion.preview.exercises.map((exercise, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-background-secondary rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-sm font-medium text-accent">
                                {index + 1}
                              </div>
                              <div>
                                <div className="font-medium text-text-primary">{exercise.name}</div>
                                <div className="text-xs text-text-muted capitalize">{exercise.category}</div>
                              </div>
                            </div>
                            <div className="text-sm text-text-secondary">{exercise.duration}m</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button 
                      className="flex-1"
                      onClick={() => {
                        onWorkoutSelect?.(selectedSuggestion);
                        setSelectedSuggestion(null);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Workout
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedSuggestion(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
