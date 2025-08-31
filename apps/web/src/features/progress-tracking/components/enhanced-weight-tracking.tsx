'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Progress, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@mobii/ui';
import { 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2,
  BarChart3,
  Award,
  Zap,
  LineChart,
  PieChart,
  Activity,
  Clock,
  Star,
  Trophy,
  AlertCircle,
  CheckCircle,
  Info,
  Download,
  Upload,
  Settings,
  Filter,
  Search,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Heart,
  Brain,
  Droplets,
  Dumbbell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { weightTrackingService } from '../services/weight-tracking-service';
import {
  WeightEntry,
  WeightGoal,
  WeightProgress,
  WeightAnalytics
} from '../types';

interface EnhancedWeightTrackingProps {
  className?: string;
}

interface WeightInsight {
  type: 'positive' | 'negative' | 'neutral';
  title: string;
  description: string;
  icon: React.ReactNode;
  value?: string;
}

interface WeightPrediction {
  date: string;
  predictedWeight: number;
  confidence: number;
  factors: string[];
}

export const EnhancedWeightTracking: React.FC<EnhancedWeightTrackingProps> = ({ className = '' }) => {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [currentGoal, setCurrentGoal] = useState<WeightGoal | null>(null);
  const [progress, setProgress] = useState<WeightProgress | null>(null);
  const [analytics, setAnalytics] = useState<WeightAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState<string>('all');
  const [newEntry, setNewEntry] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: '',
    waterWeight: '',
    notes: '',
    mood: 'good' as const,
    sleepHours: '',
    stressLevel: 'medium' as const,
    hydrationLevel: 'good' as const
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const entries = weightTrackingService.getWeightEntries();
    const goal = weightTrackingService.getCurrentGoal();
    const progress = weightTrackingService.getWeightProgress();
    const analytics = weightTrackingService.getWeightAnalytics();

    setEntries(entries);
    setCurrentGoal(goal);
    setProgress(progress);
    setAnalytics(analytics);
  };

  const handleAddEntry = () => {
    if (!newEntry.weight) return;

    weightTrackingService.addWeightEntry({
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(newEntry.weight),
      bodyFat: newEntry.bodyFat ? parseFloat(newEntry.bodyFat) : undefined,
      muscleMass: newEntry.muscleMass ? parseFloat(newEntry.muscleMass) : undefined,
      waterWeight: newEntry.waterWeight ? parseFloat(newEntry.waterWeight) : undefined,
      notes: newEntry.notes || undefined,
      mood: newEntry.mood
    });

    setNewEntry({
      weight: '',
      bodyFat: '',
      muscleMass: '',
      waterWeight: '',
      notes: '',
      mood: 'good',
      sleepHours: '',
      stressLevel: 'medium',
      hydrationLevel: 'good'
    });
    setShowAddForm(false);
    loadData();
  };

  const handleCreateGoal = (goal: Omit<WeightGoal, 'id'>) => {
    weightTrackingService.createWeightGoal(goal);
    setShowGoalForm(false);
    loadData();
  };

  const getFilteredEntries = () => {
    return entries.filter(entry => {
      const matchesSearch = entry.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           entry.date.includes(searchTerm);
      const matchesMood = filterMood === 'all' || entry.mood === filterMood;
      return matchesSearch && matchesMood;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getWeightInsights = (): WeightInsight[] => {
    if (!progress || !analytics) return [];

    const insights: WeightInsight[] = [];

    // Streak insight
    if (progress.streak >= 7) {
      insights.push({
        type: 'positive',
        title: 'Consistent Tracking',
        description: `You've been tracking for ${progress.streak} days straight!`,
        icon: <Trophy className="h-4 w-4" />,
        value: `${progress.streak} days`
      });
    }

    // Goal progress insight
    if (currentGoal && progress.goalProgress > 50) {
      insights.push({
        type: 'positive',
        title: 'Goal Progress',
        description: `You're ${progress.goalProgress.toFixed(1)}% to your goal!`,
        icon: <Target className="h-4 w-4" />,
        value: `${progress.goalProgress.toFixed(1)}%`
      });
    }

               // Trend insight
           if (progress.trend === 'decreasing' && progress.totalChange < -5) {
      insights.push({
        type: 'positive',
        title: 'Great Progress',
        description: `You've lost ${Math.abs(progress.totalChange).toFixed(1)} lbs!`,
        icon: <TrendingDown className="h-4 w-4" />,
        value: `${Math.abs(progress.totalChange).toFixed(1)} lbs`
      });
    }

    // Consistency insight
    if (analytics.consistency > 0.8) {
      insights.push({
        type: 'positive',
        title: 'High Consistency',
        description: 'You\'re tracking very consistently',
        icon: <CheckCircle className="h-4 w-4" />,
        value: `${(analytics.consistency * 100).toFixed(0)}%`
      });
    }

               // Warning insights
           if (progress.trend === 'increasing' && progress.totalChange > 5) {
      insights.push({
        type: 'negative',
        title: 'Weight Gain',
        description: 'Consider reviewing your nutrition and exercise',
        icon: <AlertCircle className="h-4 w-4" />,
        value: `+${progress.totalChange.toFixed(1)} lbs`
      });
    }

    return insights.slice(0, 4);
  };

  const getWeightPrediction = (): WeightPrediction | null => {
    if (entries.length < 7) return null;

    const recentEntries = entries.slice(0, 7);
    const avgChange = recentEntries.reduce((sum, entry, index) => {
      if (index === 0) return 0;
      return sum + (entry.weight - recentEntries[index - 1].weight);
    }, 0) / (recentEntries.length - 1);

    const predictedDate = new Date();
    predictedDate.setDate(predictedDate.getDate() + 30);

    return {
      date: predictedDate.toISOString().split('T')[0],
      predictedWeight: progress ? progress.currentWeight + (avgChange * 30) : 0,
      confidence: Math.max(0.3, Math.min(0.9, 1 - Math.abs(avgChange) / 2)),
      factors: [
        'Recent weight trend',
        'Consistency in tracking',
        'Goal alignment'
      ]
    };
  };

           const getTrendIcon = (trend: string) => {
           switch (trend) {
             case 'decreasing': return <TrendingDown className="h-4 w-4 text-green-500" />;
             case 'increasing': return <TrendingUp className="h-4 w-4 text-red-500" />;
             default: return <Target className="h-4 w-4 text-blue-500" />;
           }
         };

  const getBMIColor = (category: string) => {
    switch (category) {
      case 'underweight': return 'text-blue-600';
      case 'normal': return 'text-green-600';
      case 'overweight': return 'text-yellow-600';
      case 'obese': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'great': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'okay': return 'text-yellow-500';
      case 'tired': return 'text-orange-500';
      case 'stressed': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const insights = getWeightInsights();
  const prediction = getWeightPrediction();
  const filteredEntries = getFilteredEntries();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-teal-500" />
              Enhanced Weight Tracking
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Entry
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowGoalForm(true)}
                className="flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                Set Goal
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowInsights(true)}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Insights
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {progress && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {progress.currentWeight} lbs
                </div>
                <div className="text-sm text-gray-600">Current Weight</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                  progress.totalChange > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {progress.totalChange > 0 ? '+' : ''}{progress.totalChange.toFixed(1)} lbs
                  {getTrendIcon(progress.trend)}
                </div>
                <div className="text-sm text-gray-600">Total Change</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {progress.streak}
                </div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getBMIColor(progress.bmiCategory)}`}>
                  {progress.bmi}
                </div>
                <div className="text-sm text-gray-600 capitalize">{progress.bmiCategory}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="entries" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Entries
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Goal Progress */}
            {currentGoal && progress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-500" />
                    Goal Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Target: {currentGoal.targetWeight} lbs
                      </span>
                      <span className="text-sm text-gray-600">
                        {progress.goalProgress.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={progress.goalProgress} className="w-full" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Start Weight</div>
                        <div className="font-medium">{currentGoal.startWeight} lbs</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Remaining</div>
                        <div className="font-medium">
                          {Math.abs(progress.currentWeight - currentGoal.targetWeight).toFixed(1)} lbs
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weight Prediction */}
            {prediction && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CrystalBall className="h-5 w-5 text-blue-500" />
                    30-Day Prediction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {prediction.predictedWeight.toFixed(1)} lbs
                      </div>
                      <div className="text-sm text-gray-600">Predicted Weight</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-medium text-gray-700">
                        {Math.round(prediction.confidence * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Confidence</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Based on: {prediction.factors.join(', ')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Quick Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Quick Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-lg border ${
                      insight.type === 'positive' ? 'border-green-200 bg-green-50' :
                      insight.type === 'negative' ? 'border-red-200 bg-red-50' :
                      'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {insight.icon}
                      <span className="font-medium text-sm">{insight.title}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                    {insight.value && (
                      <div className="text-lg font-bold text-gray-800">{insight.value}</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Entries Tab */}
        <TabsContent value="entries" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search entries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterMood}
                    onChange={(e) => setFilterMood(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Moods</option>
                    <option value="great">Great</option>
                    <option value="good">Good</option>
                    <option value="okay">Okay</option>
                    <option value="tired">Tired</option>
                    <option value="stressed">Stressed</option>
                  </select>
                  <select
                    value={selectedTimeframe}
                    onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entries List */}
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-800">{entry.weight} lbs</div>
                      <div className="text-xs text-gray-500">{new Date(entry.date).toLocaleDateString()}</div>
                    </div>
                    <div className="space-y-1">
                      {entry.bodyFat && (
                        <div className="text-sm">
                          <span className="text-gray-600">Body Fat:</span>
                          <span className="font-medium ml-1">{entry.bodyFat}%</span>
                        </div>
                      )}
                      {entry.muscleMass && (
                        <div className="text-sm">
                          <span className="text-gray-600">Muscle:</span>
                          <span className="font-medium ml-1">{entry.muscleMass} lbs</span>
                        </div>
                      )}
                      {entry.waterWeight && (
                        <div className="text-sm">
                          <span className="text-gray-600">Water:</span>
                          <span className="font-medium ml-1">{entry.waterWeight}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getMoodColor(entry.mood)}>
                      {entry.mood}
                    </Badge>
                    {entry.notes && (
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {entry.notes}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="text-center py-12">
              <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Entries Found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <Button onClick={() => setShowAddForm(true)}>
                Add First Entry
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weight Range */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Weight Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{analytics.weightRange.highest}</div>
                        <div className="text-sm text-gray-600">Highest</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{analytics.weightRange.lowest}</div>
                        <div className="text-sm text-gray-600">Lowest</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {analytics.weightRange.range.toFixed(1)} lbs
                      </div>
                      <div className="text-sm text-gray-600">Total Range</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Consistency */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Tracking Consistency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {(analytics.consistency * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-600">Consistency Score</div>
                    </div>
                    <Progress value={analytics.consistency * 100} className="w-full" />
                    <div className="text-xs text-gray-500 text-center">
                      Based on regular tracking patterns
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-4">
          {currentGoal ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  Current Goal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-800">{currentGoal.targetWeight} lbs</div>
                      <div className="text-sm text-gray-600">Target Weight</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{currentGoal.weeklyGoal} lbs</div>
                      <div className="text-sm text-gray-600">Weekly Goal</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {progress ? progress.goalProgress.toFixed(1) : 0}%
                      </div>
                      <div className="text-sm text-gray-600">Progress</div>
                    </div>
                  </div>
                  
                  {progress && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Goal Progress</span>
                        <span className="text-sm text-gray-600">{progress.goalProgress.toFixed(1)}%</span>
                      </div>
                      <Progress value={progress.goalProgress} className="w-full" />
                    </div>
                  )}
                  
                  {currentGoal.notes && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-1">Notes</div>
                      <div className="text-sm text-gray-600">{currentGoal.notes}</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Goal Set</h3>
              <p className="text-gray-500 mb-4">Set a weight goal to track your progress</p>
              <Button onClick={() => setShowGoalForm(true)}>
                Set Goal
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <div className={`p-2 rounded-full ${
                        insight.type === 'positive' ? 'bg-green-100 text-green-600' :
                        insight.type === 'negative' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {insight.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{insight.title}</div>
                        <div className="text-xs text-gray-600">{insight.description}</div>
                        {insight.value && (
                          <div className="text-sm font-bold text-gray-800 mt-1">{insight.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Heart className="h-4 w-4 text-red-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Stay Consistent</div>
                      <div className="text-xs text-gray-600">Track your weight daily for better insights</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Droplets className="h-4 w-4 text-blue-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Monitor Hydration</div>
                      <div className="text-xs text-gray-600">Water weight can fluctuate daily</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Dumbbell className="h-4 w-4 text-green-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">Track Body Composition</div>
                      <div className="text-xs text-gray-600">Muscle gain can offset weight loss</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Entry Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Add Weight Entry</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (lbs)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newEntry.weight}
                    onChange={(e) => setNewEntry({ ...newEntry, weight: e.target.value })}
                    placeholder="150.0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Body Fat (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newEntry.bodyFat}
                      onChange={(e) => setNewEntry({ ...newEntry, bodyFat: e.target.value })}
                      placeholder="20.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Muscle Mass (lbs)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newEntry.muscleMass}
                      onChange={(e) => setNewEntry({ ...newEntry, muscleMass: e.target.value })}
                      placeholder="120.0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Water Weight (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={newEntry.waterWeight}
                    onChange={(e) => setNewEntry({ ...newEntry, waterWeight: e.target.value })}
                    placeholder="60.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mood</label>
                  <select
                    value={newEntry.mood}
                    onChange={(e) => setNewEntry({ ...newEntry, mood: e.target.value as any })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="great">Great</option>
                    <option value="good">Good</option>
                    <option value="okay">Okay</option>
                    <option value="tired">Tired</option>
                    <option value="stressed">Stressed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <Input
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    placeholder="Optional notes about today..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddEntry} className="flex-1">
                    Add Entry
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Set Goal Modal */}
      <AnimatePresence>
        {showGoalForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowGoalForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Set Weight Goal</h3>
              <GoalForm
                currentWeight={progress?.currentWeight || 0}
                onSave={handleCreateGoal}
                onCancel={() => setShowGoalForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper component for Crystal Ball icon
const CrystalBall: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

// Goal Form Component
interface GoalFormProps {
  currentWeight: number;
  onSave: (goal: Omit<WeightGoal, 'id'>) => void;
  onCancel: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ currentWeight, onSave, onCancel }) => {
  const [goal, setGoal] = useState({
    targetWeight: currentWeight,
    startWeight: currentWeight,
    weeklyGoal: 1.0,
    notes: ''
  });

           const handleSubmit = () => {
           onSave({
             type: 'lose',
             targetWeight: goal.targetWeight,
             currentWeight: goal.targetWeight,
             startWeight: goal.startWeight,
             startDate: new Date().toISOString().split('T')[0],
             weeklyGoal: goal.weeklyGoal,
             notes: goal.notes || undefined,
             isActive: true
           });
         };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Target Weight (lbs)</label>
        <Input
          type="number"
          step="0.1"
          value={goal.targetWeight}
          onChange={(e) => setGoal({ ...goal, targetWeight: parseFloat(e.target.value) || 0 })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Weekly Goal (lbs)</label>
        <Input
          type="number"
          step="0.1"
          value={goal.weeklyGoal}
          onChange={(e) => setGoal({ ...goal, weeklyGoal: parseFloat(e.target.value) || 0 })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <Input
          value={goal.notes}
          onChange={(e) => setGoal({ ...goal, notes: e.target.value })}
          placeholder="Optional notes about your goal..."
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="flex-1">
          Set Goal
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};
