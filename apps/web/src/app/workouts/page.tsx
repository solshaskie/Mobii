'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Input } from '@mobii/ui';
import BrandHeader from '../../components/ui/brand-header';
import BrandFooter from '../../components/ui/brand-footer';
import { 
  Search, 
  Filter, 
  Play, 
  Clock, 
  Flame, 
  Target,
  Dumbbell,
  Activity,
  Heart,
  Star
} from 'lucide-react';

interface Workout {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'chair-yoga' | 'calisthenics' | 'strength' | 'flexibility';
  calories: number;
  rating: number;
  exercises: number;
  image: string;
}

const mockWorkouts: Workout[] = [
  {
    id: '1',
    title: 'Morning Chair Yoga Flow',
    description: 'Gentle stretches and breathing exercises to start your day',
    duration: 15,
    difficulty: 'beginner',
    category: 'chair-yoga',
    calories: 45,
    rating: 4.8,
    exercises: 8,
    image: '/api/placeholder/300/200'
  },
  {
    id: '2',
    title: 'Upper Body Strength',
    description: 'Build strength in your arms, shoulders, and chest',
    duration: 25,
    difficulty: 'intermediate',
    category: 'calisthenics',
    calories: 120,
    rating: 4.6,
    exercises: 12,
    image: '/api/placeholder/300/200'
  },
  {
    id: '3',
    title: 'Core Stability & Balance',
    description: 'Improve your core strength and balance',
    duration: 20,
    difficulty: 'intermediate',
    category: 'strength',
    calories: 95,
    rating: 4.7,
    exercises: 10,
    image: '/api/placeholder/300/200'
  },
  {
    id: '4',
    title: 'Flexibility & Mobility',
    description: 'Enhance your flexibility and joint mobility',
    duration: 18,
    difficulty: 'beginner',
    category: 'flexibility',
    calories: 60,
    rating: 4.9,
    exercises: 9,
    image: '/api/placeholder/300/200'
  },
  {
    id: '5',
    title: 'Advanced Calisthenics',
    description: 'Challenging bodyweight exercises for strength',
    duration: 35,
    difficulty: 'advanced',
    category: 'calisthenics',
    calories: 180,
    rating: 4.5,
    exercises: 15,
    image: '/api/placeholder/300/200'
  },
  {
    id: '6',
    title: 'Stress Relief Yoga',
    description: 'Relaxing poses and meditation techniques',
    duration: 22,
    difficulty: 'beginner',
    category: 'chair-yoga',
    calories: 70,
    rating: 4.8,
    exercises: 7,
    image: '/api/placeholder/300/200'
  }
];

const difficultyColors = {
  beginner: 'bg-green-500',
  intermediate: 'bg-yellow-500',
  advanced: 'bg-red-500'
};

const categoryIcons = {
  'chair-yoga': Activity,
  'calisthenics': Dumbbell,
  'strength': Target,
  'flexibility': Heart
};

export default function WorkoutsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredWorkouts = mockWorkouts.filter(workout => {
    const matchesSearch = workout.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || workout.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'all' || workout.category === selectedCategory;
    
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const handleStartWorkout = (workoutId: string) => {
    // Navigate to workout player
    window.location.href = `/workout/${workoutId}`;
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
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
                className="px-4 py-2 bg-background-secondary border border-border-primary rounded-lg text-text-primary"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-background-secondary border border-border-primary rounded-lg text-text-primary"
              >
                <option value="all">All Categories</option>
                <option value="chair-yoga">Chair Yoga</option>
                <option value="calisthenics">Calisthenics</option>
                <option value="strength">Strength</option>
                <option value="flexibility">Flexibility</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Workouts Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredWorkouts.map((workout, index) => {
            const CategoryIcon = categoryIcons[workout.category];
            return (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-background-secondary border-border-primary hover:border-teal-400/30 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-teal-400 to-purple-600 text-white">
                          <CategoryIcon className="h-4 w-4" />
                        </div>
                        <Badge 
                          className={`${difficultyColors[workout.difficulty]} text-white`}
                        >
                          {workout.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{workout.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg font-semibold bg-gradient-to-r from-teal-400 to-purple-600 bg-clip-text text-transparent">
                      {workout.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-text-muted text-sm">
                      {workout.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-text-muted">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{workout.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Flame className="h-4 w-4" />
                        <span>{workout.calories} cal</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>{workout.exercises} exercises</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleStartWorkout(workout.id)}
                      className="w-full bg-gradient-to-r from-teal-400 to-purple-600 hover:from-teal-500 hover:to-purple-700"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Workout
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredWorkouts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-text-muted">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No workouts found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
