'use client';

import { motion } from 'framer-motion';
import { Play, Clock, Target, Zap } from 'lucide-react';
import { Button } from '@mobii/ui';
import { Badge } from '@mobii/ui';

export function TodayWorkout() {
  // Mock workout data - in real app this would come from API
  const workout = {
    id: '1',
    name: 'Morning Chair Yoga Flow',
    type: 'chair_yoga',
    difficulty: 'beginner',
    duration: 20,
    exercises: 8,
    calories: 120,
    description: 'A gentle morning routine to wake up your body and mind with seated yoga poses.',
    targetAreas: ['Upper Body', 'Core', 'Flexibility'],
    equipment: ['Chair'],
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-accent-green text-black';
      case 'intermediate':
        return 'bg-accent-orange text-white';
      case 'advanced':
        return 'bg-accent-pink text-white';
      default:
        return 'bg-accent-green text-black';
    }
  };

  return (
    <div className="card card-hover">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Workout Image/Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="lg:w-1/3"
        >
          <div className="relative aspect-video bg-gradient-to-br from-accent-pink/20 to-accent-purple/20 rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🧘‍♀️</div>
                <div className="text-text-secondary text-sm">Chair Yoga</div>
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className={getDifficultyColor(workout.difficulty)}>
                {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Workout Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1"
        >
          <div className="space-y-4">
            {/* Title and Description */}
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2">
                {workout.name}
              </h2>
              <p className="text-text-secondary">
                {workout.description}
              </p>
            </div>

            {/* Workout Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent-blue" />
                <div>
                  <div className="text-sm text-text-muted">Duration</div>
                  <div className="font-semibold text-text-primary">{workout.duration} min</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-accent-green" />
                <div>
                  <div className="text-sm text-text-muted">Exercises</div>
                  <div className="font-semibold text-text-primary">{workout.exercises}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent-orange" />
                <div>
                  <div className="text-sm text-text-muted">Calories</div>
                  <div className="font-semibold text-text-primary">~{workout.calories}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full bg-accent-purple" />
                <div>
                  <div className="text-sm text-text-muted">Type</div>
                  <div className="font-semibold text-text-primary">Chair Yoga</div>
                </div>
              </div>
            </div>

            {/* Target Areas */}
            <div>
              <div className="text-sm text-text-muted mb-2">Target Areas</div>
              <div className="flex flex-wrap gap-2">
                {workout.targetAreas.map((area) => (
                  <Badge key={area} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <div className="text-sm text-text-muted mb-2">Equipment Needed</div>
              <div className="flex flex-wrap gap-2">
                {workout.equipment.map((item) => (
                  <Badge key={item} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button className="btn-primary flex-1">
                <Play className="h-4 w-4 mr-2" />
                Start Workout
              </Button>
              <Button variant="outline" className="flex-1">
                Preview Exercises
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 pt-6 border-t border-border"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse" />
            <span className="text-sm text-text-secondary">Ready to start</span>
          </div>
          <div className="text-sm text-text-muted">
            Estimated completion: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
