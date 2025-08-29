'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Progress, Badge } from '@mobii/ui';
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
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  weightTrackingService, 
  WeightEntry, 
  WeightGoal, 
  WeightProgress, 
  WeightAnalytics 
} from '../../services/weight-tracking-service';

interface WeightTrackingProps {
  className?: string;
}

export const WeightTracking: React.FC<WeightTrackingProps> = ({ className = '' }) => {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [currentGoal, setCurrentGoal] = useState<WeightGoal | null>(null);
  const [progress, setProgress] = useState<WeightProgress | null>(null);
  const [analytics, setAnalytics] = useState<WeightAnalytics | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: '',
    waterWeight: '',
    notes: '',
    mood: 'good' as const
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
      mood: 'good'
    });
    setShowAddForm(false);
    loadData();
  };

  const handleCreateGoal = (goal: Omit<WeightGoal, 'id'>) => {
    weightTrackingService.createWeightGoal(goal);
    setShowGoalForm(false);
    loadData();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'losing': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'gaining': return <TrendingUp className="h-4 w-4 text-red-500" />;
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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Weight Tracking</h2>
          <p className="text-gray-600">Monitor your progress and achieve your goals</p>
        </div>
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
        </div>
      </div>

      {/* Progress Overview */}
      {progress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-teal-500" />
              Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            {/* Goal Progress */}
            {currentGoal && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Goal Progress: {currentGoal.targetWeight} lbs
                  </span>
                  <span className="text-sm text-gray-600">
                    {progress.goalProgress.toFixed(1)}%
                  </span>
                </div>
                <Progress value={progress.goalProgress} className="h-2" />
                <div className="mt-2 text-xs text-gray-500">
                  {currentGoal.startWeight} lbs → {currentGoal.targetWeight} lbs
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Analytics */}
      {analytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">
                  {analytics.totalEntries}
                </div>
                <div className="text-sm text-gray-600">Total Entries</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">
                  {analytics.consistency}%
                </div>
                <div className="text-sm text-gray-600">Consistency</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">
                  {analytics.averageWeight}
                </div>
                <div className="text-sm text-gray-600">Avg Weight</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">
                  {analytics.weightRange}
                </div>
                <div className="text-sm text-gray-600">Weight Range</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-500" />
            Recent Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {entries.slice(0, 10).map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="font-bold text-gray-800">
                      {entry.weight} lbs
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {entry.bodyFat && (
                      <div className="text-xs text-gray-600">
                        Body Fat: {entry.bodyFat}%
                      </div>
                    )}
                    {entry.muscleMass && (
                      <div className="text-xs text-gray-600">
                        Muscle: {entry.muscleMass} lbs
                      </div>
                    )}
                    {entry.notes && (
                      <div className="text-xs text-gray-500 italic">
                        "{entry.notes}"
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {entry.mood && (
                    <Badge variant="outline" className={getMoodColor(entry.mood)}>
                      {entry.mood}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Handle edit
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

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
                    placeholder="180.5"
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
                      placeholder="25.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Muscle Mass (lbs)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newEntry.muscleMass}
                      onChange={(e) => setNewEntry({ ...newEntry, muscleMass: e.target.value })}
                      placeholder="150.0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <Input
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    placeholder="How are you feeling today?"
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
                <div className="flex gap-2">
                  <Button onClick={handleAddEntry} className="flex-1">
                    Add Entry
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Goal Form Modal */}
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
                onSubmit={handleCreateGoal}
                onCancel={() => setShowGoalForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Goal Form Component
interface GoalFormProps {
  onSubmit: (goal: Omit<WeightGoal, 'id'>) => void;
  onCancel: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, onCancel }) => {
  const [goal, setGoal] = useState({
    type: 'lose' as const,
    targetWeight: '',
    startWeight: '',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    weeklyGoal: '',
    notes: ''
  });

  const handleSubmit = () => {
    if (!goal.targetWeight || !goal.startWeight || !goal.targetDate || !goal.weeklyGoal) return;

         onSubmit({
       type: goal.type,
       targetWeight: parseFloat(goal.targetWeight),
       startWeight: parseFloat(goal.startWeight),
       startDate: goal.startDate,
       targetDate: goal.targetDate,
       weeklyGoal: parseFloat(goal.weeklyGoal),
       isActive: true,
       notes: goal.notes || undefined
     });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Goal Type</label>
        <select
          value={goal.type}
          onChange={(e) => setGoal({ ...goal, type: e.target.value as any })}
          className="w-full p-2 border rounded-md"
        >
          <option value="lose">Lose Weight</option>
          <option value="gain">Gain Weight</option>
          <option value="maintain">Maintain Weight</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Weight (lbs)</label>
          <Input
            type="number"
            step="0.1"
            value={goal.startWeight}
            onChange={(e) => setGoal({ ...goal, startWeight: e.target.value })}
            placeholder="180.0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target Weight (lbs)</label>
          <Input
            type="number"
            step="0.1"
            value={goal.targetWeight}
            onChange={(e) => setGoal({ ...goal, targetWeight: e.target.value })}
            placeholder="165.0"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input
            type="date"
            value={goal.startDate}
            onChange={(e) => setGoal({ ...goal, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target Date</label>
          <Input
            type="date"
            value={goal.targetDate}
            onChange={(e) => setGoal({ ...goal, targetDate: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Weekly Goal (lbs)</label>
        <Input
          type="number"
          step="0.1"
          value={goal.weeklyGoal}
          onChange={(e) => setGoal({ ...goal, weeklyGoal: e.target.value })}
          placeholder="1.5"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <Input
          value={goal.notes}
          onChange={(e) => setGoal({ ...goal, notes: e.target.value })}
          placeholder="Optional notes about your goal"
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
