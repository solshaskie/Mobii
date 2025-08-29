'use client';

import { motion } from 'framer-motion';
import { Clock, Target, TrendingUp } from 'lucide-react';
import { Button } from '@mobii/ui';

export function WelcomeMessage() {
  // Mock user data - in real app this would come from user context/state
  const user = {
    name: 'Alex',
    streak: 7,
    totalWorkouts: 23,
    weeklyGoal: 5,
    completedThisWeek: 3,
  };

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="card card-hover">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Welcome Text */}
        <div className="flex-1">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl lg:text-4xl font-bold text-text-primary mb-2"
          >
            {greeting}, {user.name}! 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-text-secondary text-lg"
          >
            Ready to crush your fitness goals today? Let's get moving!
          </motion.p>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          {/* Streak */}
          <div className="flex items-center gap-3 bg-background-tertiary rounded-lg p-3">
            <div className="p-2 bg-accent-pink/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-accent-pink" />
            </div>
            <div>
              <div className="text-sm text-text-muted">Current Streak</div>
              <div className="text-xl font-bold text-accent-pink">{user.streak} days</div>
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="flex items-center gap-3 bg-background-tertiary rounded-lg p-3">
            <div className="p-2 bg-accent-green/10 rounded-lg">
              <Target className="h-5 w-5 text-accent-green" />
            </div>
            <div>
              <div className="text-sm text-text-muted">This Week</div>
              <div className="text-xl font-bold text-accent-green">
                {user.completedThisWeek}/{user.weeklyGoal}
              </div>
            </div>
          </div>

          {/* Total Workouts */}
          <div className="flex items-center gap-3 bg-background-tertiary rounded-lg p-3">
            <div className="p-2 bg-accent-blue/10 rounded-lg">
              <Clock className="h-5 w-5 text-accent-blue" />
            </div>
            <div>
              <div className="text-sm text-text-muted">Total Workouts</div>
              <div className="text-xl font-bold text-accent-blue">{user.totalWorkouts}</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Weekly Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">Weekly Goal Progress</span>
          <span className="text-sm font-medium text-accent-green">
            {Math.round((user.completedThisWeek / user.weeklyGoal) * 100)}%
          </span>
        </div>
        <div className="progress-bar h-2">
          <div
            className="progress-fill"
            style={{ width: `${(user.completedThisWeek / user.weeklyGoal) * 100}%` }}
          />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 mt-6"
      >
        <Button className="btn-primary flex-1">
          Start Today's Workout
        </Button>
        <Button variant="outline" className="flex-1">
          View Progress
        </Button>
      </motion.div>
    </div>
  );
}
