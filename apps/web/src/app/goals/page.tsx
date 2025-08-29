'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, Progress, Input } from '@mobii/ui';
import BrandHeader from '../../components/ui/brand-header';
import BrandFooter from '../../components/ui/brand-footer';
import { 
  Target, 
  Plus, 
  Calendar, 
  TrendingUp, 
  Award,
  Clock,
  Flame,
  Activity,
  Star,
  Edit,
  Trash2,
  CheckCircle,
  Circle
} from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'strength' | 'flexibility' | 'endurance' | 'weight' | 'streak';
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Complete 50 Workouts',
    description: 'Build a consistent fitness routine',
    category: 'fitness',
    target: 50,
    current: 32,
    unit: 'workouts',
    deadline: new Date('2024-12-31'),
    priority: 'high',
    completed: false,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Maintain 30-Day Streak',
    description: 'Work out every day for 30 consecutive days',
    category: 'streak',
    target: 30,
    current: 8,
    unit: 'days',
    deadline: new Date('2024-12-31'),
    priority: 'medium',
    completed: false,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    title: 'Burn 10,000 Calories',
    description: 'Achieve total calorie burn milestone',
    category: 'fitness',
    target: 10000,
    current: 8920,
    unit: 'calories',
    deadline: new Date('2024-12-31'),
    priority: 'medium',
    completed: false,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '4',
    title: 'Improve Flexibility',
    description: 'Touch toes while standing',
    category: 'flexibility',
    target: 1,
    current: 0,
    unit: 'achievement',
    deadline: new Date('2024-06-30'),
    priority: 'low',
    completed: false,
    createdAt: new Date('2024-01-01')
  }
];

const categoryIcons = {
  fitness: Activity,
  strength: Target,
  flexibility: Award,
  endurance: TrendingUp,
  weight: Flame,
  streak: Clock
};

const priorityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-red-500'
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'fitness' as Goal['category'],
    target: 0,
    unit: '',
    deadline: '',
    priority: 'medium' as Goal['priority']
  });

  const filteredGoals = goals.filter(goal => 
    selectedCategory === 'all' || goal.category === selectedCategory
  );

  const completedGoals = goals.filter(goal => goal.completed);
  const activeGoals = goals.filter(goal => !goal.completed);

  const addGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.unit) return;

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      target: newGoal.target,
      current: 0,
      unit: newGoal.unit,
      deadline: new Date(newGoal.deadline),
      priority: newGoal.priority,
      completed: false,
      createdAt: new Date()
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      description: '',
      category: 'fitness',
      target: 0,
      unit: '',
      deadline: '',
      priority: 'medium'
    });
    setShowAddForm(false);
  };

  const toggleGoalCompletion = (goalId: string) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getDaysRemaining = (deadline: Date) => {
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-background-primary">
      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 border-teal-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Total Goals</p>
                  <p className="text-2xl font-bold text-text-primary">{goals.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-teal-400/20">
                  <Target className="h-6 w-6 text-teal-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-400/10 to-green-600/10 border-green-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Completed</p>
                  <p className="text-2xl font-bold text-text-primary">{completedGoals.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-400/20">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-yellow-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Active</p>
                  <p className="text-2xl font-bold text-text-primary">{activeGoals.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-400/20">
                  <Circle className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-400/10 to-purple-600/10 border-purple-400/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">Success Rate</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-400/20">
                  <Star className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-background-secondary border border-border-primary rounded-lg text-text-primary"
            >
              <option value="all">All Categories</option>
              <option value="fitness">Fitness</option>
              <option value="strength">Strength</option>
              <option value="flexibility">Flexibility</option>
              <option value="endurance">Endurance</option>
              <option value="weight">Weight</option>
              <option value="streak">Streak</option>
            </select>
          </div>
          
          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-teal-400 to-purple-600 hover:from-teal-500 hover:to-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Goal
          </Button>
        </motion.div>

        {/* Add Goal Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Add New Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Goal Title
                    </label>
                    <Input
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                      placeholder="e.g., Complete 50 workouts"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Category
                    </label>
                    <select
                      value={newGoal.category}
                      onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value as Goal['category'] })}
                      className="w-full px-4 py-2 bg-background-secondary border border-border-primary rounded-lg text-text-primary"
                    >
                      <option value="fitness">Fitness</option>
                      <option value="strength">Strength</option>
                      <option value="flexibility">Flexibility</option>
                      <option value="endurance">Endurance</option>
                      <option value="weight">Weight</option>
                      <option value="streak">Streak</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    Description
                  </label>
                  <Input
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    placeholder="Describe your goal..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Target
                    </label>
                    <Input
                      type="number"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 0 })}
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Unit
                    </label>
                    <Input
                      value={newGoal.unit}
                      onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                      placeholder="workouts, days, etc."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      Priority
                    </label>
                    <select
                      value={newGoal.priority}
                      onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as Goal['priority'] })}
                      className="w-full px-4 py-2 bg-background-secondary border border-border-primary rounded-lg text-text-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    Deadline
                  </label>
                  <Input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={addGoal} className="flex-1">
                    Add Goal
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Goals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredGoals.map((goal, index) => {
            const CategoryIcon = categoryIcons[goal.category];
            const progressPercentage = getProgressPercentage(goal);
            const daysRemaining = getDaysRemaining(goal.deadline);
            
            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${goal.completed ? 'bg-green-400/5 border-green-400/20' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-teal-400 to-purple-600 text-white">
                          <CategoryIcon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className={`font-semibold ${goal.completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                              {goal.title}
                            </h3>
                            <Badge className={priorityColors[goal.priority]}>
                              {goal.priority}
                            </Badge>
                            {goal.completed && (
                              <Badge className="bg-green-500 text-white">
                                Completed
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-text-muted text-sm mb-3">
                            {goal.description}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-text-muted">
                                Progress: {goal.current} / {goal.target} {goal.unit}
                              </span>
                              <span className="text-text-primary font-medium">
                                {Math.round(progressPercentage)}%
                              </span>
                            </div>
                            <Progress value={progressPercentage} className="h-2" />
                          </div>
                          
                          <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Created {goal.createdAt.toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleGoalCompletion(goal.id)}
                        >
                          {goal.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Circle className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredGoals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Target className="h-12 w-12 mx-auto mb-4 text-text-muted opacity-50" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No goals found</h3>
            <p className="text-text-muted text-sm">
              {selectedCategory === 'all' 
                ? 'Create your first goal to get started!' 
                : 'No goals in this category yet.'}
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
