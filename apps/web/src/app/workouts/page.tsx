'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Plus, 
  Search, 
  Filter, 
  Dumbbell, 
  Clock, 
  Flame,
  Target,
  Star,
  Sparkles
} from 'lucide-react';
import { Button, Card } from '@mobii/ui';
import { Badge, Input } from '@mobii/ui';
import { WorkoutPlayer } from '../../components/workout/workout-player';

// Mock workout data for demonstration
const mockWorkouts = [
  {
    id: '1',
    name: 'Morning Chair Yoga',
    description: 'Gentle stretches to start your day with energy and focus',
    type: 'chair_yoga',
    difficulty: 'beginner',
    duration: 15,
    calories: 75,
    exercises: [
      {
        id: '1',
        exerciseId: 'ex1',
        order: 1,
        duration: 60,
        exercise: {
          id: 'ex1',
          name: 'Seated Cat-Cow Stretch',
          description: 'Gentle spinal movement to warm up your back',
          category: 'chair_yoga',
          difficulty: 'beginner',
          duration: 60,
          calories: 5,
          instructions: [
            'Sit tall in your chair with feet flat on the floor',
            'Place hands on your knees',
            'Inhale and arch your back, lifting your chest',
            'Exhale and round your back, tucking your chin',
            'Repeat for 5-10 breaths'
          ],
          equipmentRequired: ['chair'],
          targetMuscles: ['back', 'core'],
          setupInstructions: 'Find a comfortable chair with good back support',
          executionNotes: 'Move slowly and mindfully with your breath',
          safetyNotes: 'Stop if you feel any pain in your back'
        }
      },
      {
        id: '2',
        exerciseId: 'ex2',
        order: 2,
        duration: 45,
        exercise: {
          id: 'ex2',
          name: 'Seated Side Stretch',
          description: 'Lateral stretch to open your ribcage and shoulders',
          category: 'chair_yoga',
          difficulty: 'beginner',
          duration: 45,
          calories: 4,
          instructions: [
            'Sit tall with your feet flat on the floor',
            'Raise your right arm overhead',
            'Lean to the left, feeling the stretch in your right side',
            'Hold for 3-5 breaths',
            'Repeat on the other side'
          ],
          equipmentRequired: ['chair'],
          targetMuscles: ['shoulders', 'ribs', 'obliques'],
          setupInstructions: 'Ensure you have space to stretch your arms',
          executionNotes: 'Keep your hips grounded and stretch from the waist up',
          safetyNotes: 'Don\'t force the stretch beyond your comfort level'
        }
      },
      {
        id: '3',
        exerciseId: 'ex3',
        order: 3,
        duration: 90,
        exercise: {
          id: 'ex3',
          name: 'Seated Forward Fold',
          description: 'Calming forward bend to release tension',
          category: 'chair_yoga',
          difficulty: 'beginner',
          duration: 90,
          calories: 8,
          instructions: [
            'Sit at the edge of your chair',
            'Hinge forward from your hips',
            'Let your arms hang down toward the floor',
            'Relax your neck and shoulders',
            'Hold for 5-10 breaths'
          ],
          equipmentRequired: ['chair'],
          targetMuscles: ['hamstrings', 'back', 'shoulders'],
          setupInstructions: 'Scoot forward so your hips are near the edge',
          executionNotes: 'Focus on lengthening your spine as you fold forward',
          safetyNotes: 'Keep your back straight and don\'t round your spine'
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Quick Calisthenics',
    description: 'Fast-paced bodyweight exercises for strength and cardio',
    type: 'calisthenics',
    difficulty: 'intermediate',
    duration: 20,
    calories: 120,
    exercises: [
      {
        id: '4',
        exerciseId: 'ex4',
        order: 1,
        duration: 60,
        sets: 3,
        reps: 10,
        exercise: {
          id: 'ex4',
          name: 'Push-ups',
          description: 'Classic upper body strength exercise',
          category: 'calisthenics',
          difficulty: 'intermediate',
          duration: 60,
          calories: 8,
          instructions: [
            'Start in a plank position with hands shoulder-width apart',
            'Lower your body until your chest nearly touches the floor',
            'Push back up to the starting position',
            'Keep your core engaged throughout the movement',
            'Repeat for the specified number of reps'
          ],
          equipmentRequired: [],
          targetMuscles: ['chest', 'shoulders', 'triceps'],
          setupInstructions: 'Find a clear space on the floor',
          executionNotes: 'Maintain a straight line from head to heels',
          safetyNotes: 'Modify on knees if needed for proper form'
        }
      }
    ]
  },
  {
    id: '3',
    name: 'Mixed Fitness Flow',
    description: 'Combination of yoga and calisthenics for balanced fitness',
    type: 'mixed',
    difficulty: 'beginner',
    duration: 25,
    calories: 100,
    exercises: [
      {
        id: '5',
        exerciseId: 'ex5',
        order: 1,
        duration: 45,
        exercise: {
          id: 'ex5',
          name: 'Chair Squats',
          description: 'Lower body strength exercise using a chair',
          category: 'calisthenics',
          difficulty: 'beginner',
          duration: 45,
          calories: 6,
          instructions: [
            'Stand in front of a chair with feet shoulder-width apart',
            'Lower yourself down as if sitting in the chair',
            'Just before touching the chair, stand back up',
            'Keep your weight in your heels',
            'Repeat for the specified duration'
          ],
          equipmentRequired: ['chair'],
          targetMuscles: ['quadriceps', 'glutes', 'hamstrings'],
          setupInstructions: 'Position chair behind you for safety',
          executionNotes: 'Focus on pushing through your heels',
          safetyNotes: 'Don\'t let your knees go past your toes'
        }
      }
    ]
  }
];

export default function WorkoutsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeWorkout, setActiveWorkout] = useState<any>(null);

  // Filter workouts based on search and filters
  const filteredWorkouts = mockWorkouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || workout.difficulty === selectedDifficulty;
    const matchesType = selectedType === 'all' || workout.type === selectedType;
    
    return matchesSearch && matchesDifficulty && matchesType;
  });

  const handleStartWorkout = (workout: any) => {
    setActiveWorkout(workout);
  };

  const handleWorkoutComplete = (sessionData: any) => {
    console.log('Workout completed:', sessionData);
    setActiveWorkout(null);
    // Here you would typically save the session data to your backend
  };

  const handleWorkoutExit = () => {
    setActiveWorkout(null);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-500';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-500';
      case 'advanced': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chair_yoga': return '🧘';
      case 'calisthenics': return '💪';
      case 'mixed': return '⚡';
      default: return '🏃';
    }
  };

  if (activeWorkout) {
    return (
      <WorkoutPlayer
        workoutPlan={activeWorkout}
        onComplete={handleWorkoutComplete}
        onExit={handleWorkoutExit}
      />
    );
  }

  return (
    <div className="container-responsive py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Workouts</h1>
            <p className="text-text-secondary mt-2">
              Choose from our collection of chair yoga and calisthenics workouts
            </p>
          </div>
          <Button className="bg-accent hover:bg-accent/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Workout
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 bg-background-secondary border border-border rounded-lg text-text-primary"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 bg-background-secondary border border-border rounded-lg text-text-primary"
            >
              <option value="all">All Types</option>
              <option value="chair_yoga">Chair Yoga</option>
              <option value="calisthenics">Calisthenics</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>

        {/* Workout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group">
                <div className="p-6 space-y-4">
                  {/* Workout Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getTypeIcon(workout.type)}</div>
                      <div>
                        <h3 className="font-semibold text-text-primary group-hover:text-accent transition-colors">
                          {workout.name}
                        </h3>
                        <p className="text-sm text-text-secondary">
                          {workout.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Workout Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Clock className="h-4 w-4 text-text-muted" />
                      <div>
                        <div className="text-sm font-medium text-text-primary">{workout.duration}m</div>
                        <div className="text-xs text-text-muted">Duration</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 justify-center">
                      <Flame className="h-4 w-4 text-text-muted" />
                      <div>
                        <div className="text-sm font-medium text-text-primary">{workout.calories}</div>
                        <div className="text-xs text-text-muted">Calories</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 justify-center">
                      <Target className="h-4 w-4 text-text-muted" />
                      <div>
                        <div className="text-sm font-medium text-text-primary">{workout.exercises.length}</div>
                        <div className="text-xs text-text-muted">Exercises</div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className={getDifficultyColor(workout.difficulty)}>
                      {workout.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {workout.type.replace('_', ' ')}
                    </Badge>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleStartWorkout(workout)}
                    className="w-full bg-accent hover:bg-accent/90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Workout
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredWorkouts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Sparkles className="h-16 w-16 mx-auto text-text-muted mb-4" />
            <h3 className="text-lg font-semibold text-text-primary mb-2">No workouts found</h3>
            <p className="text-text-secondary">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
