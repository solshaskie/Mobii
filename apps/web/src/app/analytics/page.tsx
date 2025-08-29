'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Progress } from '@mobii/ui';
import BrandHeader from '../../components/ui/brand-header';
import BrandFooter from '../../components/ui/brand-footer';
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Flame, 
  Clock, 
  Trophy,
  BarChart3,
  Activity,
  Heart,
  Zap,
  Award,
  Star
} from 'lucide-react';

interface AnalyticsData {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  currentStreak: number;
  longestStreak: number;
  weeklyProgress: {
    date: string;
    workouts: number;
    minutes: number;
    calories: number;
  }[];
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress: number;
    maxProgress: number;
  }[];
  monthlyStats: {
    workouts: number;
    minutes: number;
    calories: number;
    avgRating: number;
  };
}

const mockAnalyticsData: AnalyticsData = {
  totalWorkouts: 47,
  totalMinutes: 1240,
  totalCalories: 8920,
  currentStreak: 8,
  longestStreak: 21,
  weeklyProgress: [
    { date: 'Mon', workouts: 2, minutes: 45, calories: 320 },
    { date: 'Tue', workouts: 1, minutes: 25, calories: 180 },
    { date: 'Wed', workouts: 3, minutes: 65, calories: 450 },
    { date: 'Thu', workouts: 2, minutes: 40, calories: 280 },
    { date: 'Fri', workouts: 1, minutes: 20, calories: 140 },
    { date: 'Sat', workouts: 2, minutes: 35, calories: 240 },
    { date: 'Sun', workouts: 1, minutes: 15, calories: 100 }
  ],
  achievements: [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first workout',
      icon: '🎯',
      unlocked: true,
      progress: 1,
      maxProgress: 1
    },
    {
      id: '2',
      title: 'Week Warrior',
      description: 'Complete 7 workouts in a week',
      icon: '🔥',
      unlocked: true,
      progress: 7,
      maxProgress: 7
    },
    {
      id: '3',
      title: 'Consistency King',
      description: 'Maintain a 21-day streak',
      icon: '👑',
      unlocked: false,
      progress: 8,
      maxProgress: 21
    },
    {
      id: '4',
      title: 'Calorie Crusher',
      description: 'Burn 10,000 total calories',
      icon: '💪',
      unlocked: false,
      progress: 8920,
      maxProgress: 10000
    },
    {
      id: '5',
      title: 'Time Master',
      description: 'Complete 1000 minutes of workouts',
      icon: '⏰',
      unlocked: true,
      progress: 1240,
      maxProgress: 1000
    }
  ],
  monthlyStats: {
    workouts: 47,
    minutes: 1240,
    calories: 8920,
    avgRating: 4.7
  }
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const data = mockAnalyticsData;

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                onClick={() => setTimeRange(range)}
                className="capitalize"
              >
                {range}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 border-teal-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Total Workouts</p>
                  <p className="text-2xl font-bold text-text-primary">{data.totalWorkouts}</p>
                </div>
                <div className="p-3 rounded-lg bg-teal-400/20">
                  <Activity className="h-6 w-6 text-teal-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-400/10 to-purple-600/10 border-purple-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Total Minutes</p>
                  <p className="text-2xl font-bold text-text-primary">{data.totalMinutes}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-400/20">
                  <Clock className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-400/10 to-orange-600/10 border-orange-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Calories Burned</p>
                  <p className="text-2xl font-bold text-text-primary">{data.totalCalories.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-400/20">
                  <Flame className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-yellow-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Current Streak</p>
                  <p className="text-2xl font-bold text-text-primary">{data.currentStreak} days</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-400/20">
                  <Zap className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weekly Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.weeklyProgress.map((day, index) => (
                  <div key={day.date} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium text-text-muted">
                      {day.date}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-primary">{day.workouts} workouts</span>
                        <span className="text-text-muted">{day.minutes} min</span>
                      </div>
                      <Progress 
                        value={(day.workouts / 3) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3">
                    <div className={`text-2xl ${achievement.unlocked ? 'opacity-100' : 'opacity-30'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${achievement.unlocked ? 'text-text-primary' : 'text-text-muted'}`}>
                          {achievement.title}
                        </h4>
                        {achievement.unlocked && (
                          <Badge className="bg-green-500 text-white text-xs">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-text-muted mb-2">
                        {achievement.description}
                      </p>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100}
                        className={`h-2 ${getProgressColor((achievement.progress / achievement.maxProgress) * 100)}`}
                      />
                      <p className="text-xs text-text-muted mt-1">
                        {achievement.progress} / {achievement.maxProgress}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Monthly Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-text-primary mb-2">
                    {data.monthlyStats.workouts}
                  </div>
                  <div className="text-sm text-text-muted">Workouts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-text-primary mb-2">
                    {data.monthlyStats.minutes}
                  </div>
                  <div className="text-sm text-text-muted">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-text-primary mb-2">
                    {data.monthlyStats.calories.toLocaleString()}
                  </div>
                  <div className="text-sm text-text-muted">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-text-primary mb-2 flex items-center justify-center gap-1">
                    {data.monthlyStats.avgRating}
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  </div>
                  <div className="text-sm text-text-muted">Avg Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button 
            onClick={() => window.location.href = '/workouts'}
            className="bg-gradient-to-r from-teal-400 to-purple-600 hover:from-teal-500 hover:to-purple-700"
          >
            <Activity className="mr-2 h-4 w-4" />
            Start New Workout
          </Button>
          <Button variant="outline">
            <Target className="mr-2 h-4 w-4" />
            Set New Goals
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
