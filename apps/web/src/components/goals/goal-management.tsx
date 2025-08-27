'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Trophy, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  TrendingUp,
  Award,
  Star,
  CheckCircle,
  Clock,
  Flame,
  Activity,
  Zap,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import { Card, Button } from '@mobii/ui';
import { Badge, Progress } from '@mobii/ui';
import { Input } from '@mobii/ui';

interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'workout' | 'strength' | 'flexibility' | 'endurance' | 'weight' | 'streak' | 'custom';
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  status: 'active' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  category: string;
  progress: number; // 0-100
  milestones: Milestone[];
  createdAt: Date;
}

interface Milestone {
  id: string;
  title: string;
  target: number;
  achieved: boolean;
  achievedAt?: Date;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number; // 0-100
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface GoalManagementProps {
  userId?: string;
}

export function GoalManagement({ userId }: GoalManagementProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data
  useEffect(() => {
    const mockGoals: Goal[] = [
      {
        id: '1',
        title: 'Complete 30 Workouts',
        description: 'Build a consistent workout routine',
        type: 'workout',
        target: 30,
        current: 18,
        unit: 'workouts',
        deadline: new Date('2024-03-15'),
        status: 'active',
        priority: 'high',
        category: 'fitness',
        progress: 60,
        milestones: [
          { id: '1-1', title: 'First 10 workouts', target: 10, achieved: true, achievedAt: new Date('2024-01-10') },
          { id: '1-2', title: 'Halfway there', target: 15, achieved: true, achievedAt: new Date('2024-01-25') },
          { id: '1-3', title: 'Final stretch', target: 25, achieved: false },
        ],
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        title: 'Improve Flexibility',
        description: 'Touch toes and increase range of motion',
        type: 'flexibility',
        target: 15,
        current: 8,
        unit: 'cm',
        deadline: new Date('2024-04-01'),
        status: 'active',
        priority: 'medium',
        category: 'wellness',
        progress: 53,
        milestones: [
          { id: '2-1', title: 'First 5cm improvement', target: 5, achieved: true, achievedAt: new Date('2024-01-15') },
          { id: '2-2', title: '10cm milestone', target: 10, achieved: false },
        ],
        createdAt: new Date('2024-01-05'),
      },
      {
        id: '3',
        title: '7-Day Workout Streak',
        description: 'Work out for 7 consecutive days',
        type: 'streak',
        target: 7,
        current: 5,
        unit: 'days',
        deadline: new Date('2024-01-20'),
        status: 'active',
        priority: 'high',
        category: 'consistency',
        progress: 71,
        milestones: [
          { id: '3-1', title: '3-day streak', target: 3, achieved: true, achievedAt: new Date('2024-01-17') },
          { id: '3-2', title: '5-day streak', target: 5, achieved: true, achievedAt: new Date('2024-01-19') },
        ],
        createdAt: new Date('2024-01-14'),
      },
    ];

    const mockAchievements: Achievement[] = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first workout',
        icon: '👟',
        category: 'beginner',
        unlocked: true,
        unlockedAt: new Date('2024-01-01'),
        progress: 100,
        rarity: 'common',
      },
      {
        id: '2',
        name: 'Week Warrior',
        description: 'Complete 5 workouts in a week',
        icon: '🏆',
        category: 'consistency',
        unlocked: true,
        unlockedAt: new Date('2024-01-15'),
        progress: 100,
        rarity: 'rare',
      },
      {
        id: '3',
        name: 'Flexibility Master',
        description: 'Improve flexibility by 10cm',
        icon: '🧘',
        category: 'wellness',
        unlocked: false,
        progress: 80,
        rarity: 'epic',
      },
      {
        id: '4',
        name: 'Calorie Crusher',
        description: 'Burn 1000 calories in a week',
        icon: '🔥',
        category: 'fitness',
        unlocked: false,
        progress: 65,
        rarity: 'rare',
      },
      {
        id: '5',
        name: 'Consistency King',
        description: 'Maintain a 30-day workout streak',
        icon: '👑',
        category: 'consistency',
        unlocked: false,
        progress: 20,
        rarity: 'legendary',
      },
    ];

    setGoals(mockGoals);
    setAchievements(mockAchievements);
  }, []);

  const categories = [
    { id: 'all', label: 'All Goals', icon: '🎯' },
    { id: 'fitness', label: 'Fitness', icon: '💪' },
    { id: 'wellness', label: 'Wellness', icon: '🧘' },
    { id: 'consistency', label: 'Consistency', icon: '📅' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'overdue': return 'text-error';
      case 'active': return 'text-accent';
      default: return 'text-text-secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-purple-400';
      case 'epic': return 'text-purple-300';
      case 'rare': return 'text-blue-400';
      case 'common': return 'text-green-400';
      default: return 'text-text-secondary';
    }
  };

  const getDaysRemaining = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const filteredGoals = goals.filter(goal => 
    selectedCategory === 'all' || goal.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-full">
            <Target className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Goals & Achievements</h1>
            <p className="text-text-secondary">Set goals, track progress, and unlock achievements</p>
          </div>
        </div>
        <Button onClick={() => setShowAddGoal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              selectedCategory === category.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border bg-background-secondary text-text-secondary hover:border-accent/50'
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            {category.label}
          </button>
        ))}
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-secondary">Active Goals</p>
              <p className="text-2xl font-bold text-text-primary">
                {goals.filter(g => g.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-accent/10 rounded-full">
              <Target className="h-6 w-6 text-accent" />
            </div>
          </div>
          <Progress 
            value={goals.filter(g => g.status === 'completed').length / goals.length * 100} 
            className="h-2"
          />
          <p className="text-xs text-text-muted mt-2">
            {goals.filter(g => g.status === 'completed').length} of {goals.length} completed
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-secondary">Achievements</p>
              <p className="text-2xl font-bold text-text-primary">
                {achievements.filter(a => a.unlocked).length}
              </p>
            </div>
            <div className="p-3 bg-accent/10 rounded-full">
              <Trophy className="h-6 w-6 text-accent" />
            </div>
          </div>
          <Progress 
            value={achievements.filter(a => a.unlocked).length / achievements.length * 100} 
            className="h-2"
          />
          <p className="text-xs text-text-muted mt-2">
            {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-text-secondary">Average Progress</p>
              <p className="text-2xl font-bold text-text-primary">
                {Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)}%
              </p>
            </div>
            <div className="p-3 bg-accent/10 rounded-full">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
          </div>
          <Progress 
            value={goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length} 
            className="h-2"
          />
          <p className="text-xs text-text-muted mt-2">
            Across all active goals
          </p>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Your Goals</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredGoals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-text-primary">{goal.title}</h3>
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(goal.status)}
                      >
                        {goal.status}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={getPriorityColor(goal.priority)}
                      >
                        {goal.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-text-secondary mb-3">{goal.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
                      <div className="flex items-center gap-1">
                        <Activity className="h-4 w-4" />
                        {goal.current}/{goal.target} {goal.unit}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {getDaysRemaining(goal.deadline)} days left
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-text-secondary">Progress</span>
                        <span className="text-xs font-medium text-text-primary">
                          {goal.progress}%
                        </span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>

                    {/* Milestones */}
                    {goal.milestones.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-text-secondary mb-2">Milestones</p>
                        <div className="flex gap-2">
                          {goal.milestones.map(milestone => (
                            <div
                              key={milestone.id}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                                milestone.achieved
                                  ? 'bg-success/10 text-success'
                                  : 'bg-background-tertiary text-text-muted'
                              }`}
                            >
                              {milestone.achieved ? (
                                <CheckCircle className="h-3 w-3" />
                              ) : (
                                <Clock className="h-3 w-3" />
                              )}
                              {milestone.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingGoal(goal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-error hover:text-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">Achievements</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-6 transition-all ${
                achievement.unlocked 
                  ? 'border-accent/50 bg-accent/5' 
                  : 'border-border bg-background-secondary'
              }`}>
                <div className="text-center">
                  <div className={`text-4xl mb-3 ${
                    achievement.unlocked ? 'filter-none' : 'filter grayscale opacity-50'
                  }`}>
                    {achievement.icon}
                  </div>
                  
                  <h3 className={`font-semibold mb-2 ${
                    achievement.unlocked ? 'text-text-primary' : 'text-text-muted'
                  }`}>
                    {achievement.name}
                  </h3>
                  
                  <p className="text-sm text-text-secondary mb-3">
                    {achievement.description}
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Badge 
                      variant="outline" 
                      className={getRarityColor(achievement.rarity)}
                    >
                      {achievement.rarity}
                    </Badge>
                    <Badge variant="secondary">
                      {achievement.category}
                    </Badge>
                  </div>

                  {achievement.unlocked ? (
                    <div className="flex items-center justify-center gap-2 text-success">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Unlocked</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">Progress</span>
                        <span className="text-text-primary">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-1" />
                    </div>
                  )}

                  {achievement.unlockedAt && (
                    <p className="text-xs text-text-muted mt-2">
                      Unlocked {achievement.unlockedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <Card className="p-6 bg-gradient-to-r from-accent/10 to-purple-500/10 border-accent/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-accent/20 rounded-full">
            <Lightbulb className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">AI Recommendations</h3>
            <p className="text-sm text-text-secondary">Personalized suggestions to help you reach your goals</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg">
            <TrendingUp className="h-4 w-4 text-success" />
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Increase workout frequency</p>
              <p className="text-xs text-text-secondary">You're close to your 30-workout goal. Try adding 2 more sessions this week.</p>
            </div>
            <Button size="sm" variant="outline">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg">
            <Zap className="h-4 w-4 text-warning" />
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Focus on flexibility</p>
              <p className="text-xs text-text-secondary">Add more stretching exercises to reach your flexibility goal faster.</p>
            </div>
            <Button size="sm" variant="outline">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg">
            <Star className="h-4 w-4 text-accent" />
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Achievement opportunity</p>
              <p className="text-xs text-text-secondary">Complete 2 more workouts to unlock the "Week Warrior" achievement.</p>
            </div>
            <Button size="sm" variant="outline">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
