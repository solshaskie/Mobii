'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Target, 
  Award, 
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  Zap,
  Clock,
  Flame
} from 'lucide-react';
import { Card, Badge, Progress, Button } from '@mobii/ui';

interface AnalyticsData {
  overview: {
    totalWorkouts: number;
    totalDuration: number;
    totalCalories: number;
    currentStreak: number;
    averageRating: number;
    completionRate: number;
  };
  trends: {
    weeklyWorkouts: number[];
    weeklyCalories: number[];
    weeklyDuration: number[];
    labels: string[];
  };
  goals: {
    workoutsThisWeek: number;
    targetWorkouts: number;
    caloriesThisWeek: number;
    targetCalories: number;
    streakGoal: number;
    currentStreak: number;
  };
  achievements: {
    unlocked: number;
    total: number;
    recent: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      unlockedAt: string;
    }>;
  };
  aiInsights: Array<{
    id: string;
    type: 'improvement' | 'suggestion' | 'achievement' | 'warning';
    title: string;
    message: string;
    action?: string;
  }>;
}

interface AnalyticsDashboardProps {
  userId?: string;
}

export function AnalyticsDashboard({ userId }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Mock data for demonstration
  useEffect(() => {
    const mockData: AnalyticsData = {
      overview: {
        totalWorkouts: 47,
        totalDuration: 2840, // minutes
        totalCalories: 12450,
        currentStreak: 8,
        averageRating: 4.2,
        completionRate: 87,
      },
      trends: {
        weeklyWorkouts: [3, 4, 2, 5, 3, 4, 6],
        weeklyCalories: [450, 600, 300, 750, 450, 600, 900],
        weeklyDuration: [45, 60, 30, 75, 45, 60, 90],
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      goals: {
        workoutsThisWeek: 6,
        targetWorkouts: 5,
        caloriesThisWeek: 900,
        targetCalories: 1000,
        streakGoal: 10,
        currentStreak: 8,
      },
      achievements: {
        unlocked: 12,
        total: 25,
        recent: [
          {
            id: '1',
            name: 'Week Warrior',
            description: 'Complete 5 workouts in a week',
            icon: '🏆',
            unlockedAt: '2024-01-15',
          },
          {
            id: '2',
            name: 'Calorie Crusher',
            description: 'Burn 1000 calories in a week',
            icon: '🔥',
            unlockedAt: '2024-01-14',
          },
        ],
      },
      aiInsights: [
        {
          id: '1',
          type: 'improvement',
          title: 'Great Progress!',
          message: 'Your flexibility has improved by 15% this month. Consider trying more advanced yoga poses.',
          action: 'View Recommendations',
        },
        {
          id: '2',
          type: 'suggestion',
          title: 'Workout Optimization',
          message: 'Based on your performance, try increasing workout intensity on Tuesdays and Thursdays.',
          action: 'Adjust Schedule',
        },
        {
          id: '3',
          type: 'achievement',
          title: 'Streak Milestone',
          message: 'You\'re 2 workouts away from your longest streak! Keep up the momentum.',
        },
      ],
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatCalories = (calories: number) => {
    return calories >= 1000 ? `${(calories / 1000).toFixed(1)}k` : calories.toString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-background-tertiary rounded mb-2"></div>
              <div className="h-8 bg-background-tertiary rounded"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Analytics Dashboard</h1>
          <p className="text-text-secondary">Track your progress and get AI-powered insights</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'year'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Workouts</p>
                <p className="text-2xl font-bold text-text-primary">{data.overview.totalWorkouts}</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-full">
                <Activity className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Total Duration</p>
                <p className="text-2xl font-bold text-text-primary">
                  {formatDuration(data.overview.totalDuration)}
                </p>
              </div>
              <div className="p-3 bg-accent/10 rounded-full">
                <Clock className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Calories Burned</p>
                <p className="text-2xl font-bold text-text-primary">
                  {formatCalories(data.overview.totalCalories)}
                </p>
              </div>
              <div className="p-3 bg-accent/10 rounded-full">
                <Flame className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Current Streak</p>
                <p className="text-2xl font-bold text-text-primary">{data.overview.currentStreak} days</p>
              </div>
              <div className="p-3 bg-accent/10 rounded-full">
                <Zap className="h-6 w-6 text-accent" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Goals Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold text-text-primary">Weekly Goals</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Workouts</span>
                <span className="text-sm font-medium text-text-primary">
                  {data.goals.workoutsThisWeek}/{data.goals.targetWorkouts}
                </span>
              </div>
              <Progress 
                value={(data.goals.workoutsThisWeek / data.goals.targetWorkouts) * 100} 
                className="mb-2"
              />
              <p className="text-xs text-text-muted">
                {data.goals.targetWorkouts - data.goals.workoutsThisWeek} more to reach goal
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Calories</span>
                <span className="text-sm font-medium text-text-primary">
                  {data.goals.caloriesThisWeek}/{data.goals.targetCalories}
                </span>
              </div>
              <Progress 
                value={(data.goals.caloriesThisWeek / data.goals.targetCalories) * 100} 
                className="mb-2"
              />
              <p className="text-xs text-text-muted">
                {data.goals.targetCalories - data.goals.caloriesThisWeek} more to reach goal
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">Streak</span>
                <span className="text-sm font-medium text-text-primary">
                  {data.goals.currentStreak}/{data.goals.streakGoal}
                </span>
              </div>
              <Progress 
                value={(data.goals.currentStreak / data.goals.streakGoal) * 100} 
                className="mb-2"
              />
              <p className="text-xs text-text-muted">
                {data.goals.streakGoal - data.goals.currentStreak} more days to reach goal
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* AI Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-accent" />
            <h2 className="text-lg font-semibold text-text-primary">AI Insights</h2>
          </div>
          
          <div className="space-y-4">
            {data.aiInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-3 p-4 bg-background-secondary rounded-lg border border-border"
              >
                <div className={`p-2 rounded-full ${
                  insight.type === 'improvement' ? 'bg-success/10' :
                  insight.type === 'suggestion' ? 'bg-accent/10' :
                  insight.type === 'achievement' ? 'bg-warning/10' :
                  'bg-error/10'
                }`}>
                  {insight.type === 'improvement' && <TrendingUp className="h-4 w-4 text-success" />}
                  {insight.type === 'suggestion' && <Target className="h-4 w-4 text-accent" />}
                  {insight.type === 'achievement' && <Award className="h-4 w-4 text-warning" />}
                  {insight.type === 'warning' && <TrendingDown className="h-4 w-4 text-error" />}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium text-text-primary mb-1">{insight.title}</h3>
                  <p className="text-sm text-text-secondary mb-2">{insight.message}</p>
                  {insight.action && (
                    <Button variant="outline" size="sm">
                      {insight.action}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recent Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" />
              <h2 className="text-lg font-semibold text-text-primary">Recent Achievements</h2>
            </div>
            <Badge variant="secondary">
              {data.achievements.unlocked}/{data.achievements.total}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.achievements.recent.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-center gap-3 p-4 bg-background-secondary rounded-lg border border-border"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-text-primary">{achievement.name}</h3>
                  <p className="text-sm text-text-secondary">{achievement.description}</p>
                  <p className="text-xs text-text-muted mt-1">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
