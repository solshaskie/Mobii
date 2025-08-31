// Weight Tracking Service
// Handles weight tracking data management, analytics, and goal tracking

import { WeightEntry, WeightGoal, WeightProgress, WeightAnalytics } from '../types';

class WeightTrackingService {
  private readonly STORAGE_KEY = 'mobii_weight_tracking';
  private readonly GOAL_STORAGE_KEY = 'mobii_weight_goals';

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    if (typeof window === 'undefined') return;
    
    // Initialize weight entries if not exists
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
    
    // Initialize goals if not exists
    if (!localStorage.getItem(this.GOAL_STORAGE_KEY)) {
      localStorage.setItem(this.GOAL_STORAGE_KEY, JSON.stringify([]));
    }
  }

  // Weight Entries Management
  getWeightEntries(): WeightEntry[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading weight entries:', error);
      return [];
    }
  }

  addWeightEntry(entry: Omit<WeightEntry, 'id' | 'timestamp'>): WeightEntry {
    const newEntry: WeightEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: Date.now()
    };

    const entries = this.getWeightEntries();
    entries.push(newEntry);
    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
    return newEntry;
  }

  updateWeightEntry(id: string, updates: Partial<WeightEntry>): WeightEntry | null {
    const entries = this.getWeightEntries();
    const index = entries.findIndex(entry => entry.id === id);
    
    if (index === -1) return null;
    
    entries[index] = { ...entries[index], ...updates };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries));
    return entries[index];
  }

  deleteWeightEntry(id: string): boolean {
    const entries = this.getWeightEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    
    if (filteredEntries.length === entries.length) return false;
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredEntries));
    return true;
  }

  // Goal Management
  getCurrentGoal(): WeightGoal | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const data = localStorage.getItem(this.GOAL_STORAGE_KEY);
      const goals: WeightGoal[] = data ? JSON.parse(data) : [];
      return goals.find(goal => goal.isActive) || null;
    } catch (error) {
      console.error('Error loading weight goals:', error);
      return null;
    }
  }

  createWeightGoal(goal: Omit<WeightGoal, 'id'>): WeightGoal {
    const newGoal: WeightGoal = {
      ...goal,
      id: this.generateId()
    };

    const goals = this.getAllGoals();
    
    // Deactivate other goals
    goals.forEach(g => g.isActive = false);
    
    goals.push(newGoal);
    localStorage.setItem(this.GOAL_STORAGE_KEY, JSON.stringify(goals));
    return newGoal;
  }

  updateWeightGoal(id: string, updates: Partial<WeightGoal>): WeightGoal | null {
    const goals = this.getAllGoals();
    const index = goals.findIndex(goal => goal.id === id);
    
    if (index === -1) return null;
    
    goals[index] = { ...goals[index], ...updates };
    localStorage.setItem(this.GOAL_STORAGE_KEY, JSON.stringify(goals));
    return goals[index];
  }

  deleteWeightGoal(id: string): boolean {
    const goals = this.getAllGoals();
    const filteredGoals = goals.filter(goal => goal.id !== id);
    
    if (filteredGoals.length === goals.length) return false;
    
    localStorage.setItem(this.GOAL_STORAGE_KEY, JSON.stringify(filteredGoals));
    return true;
  }

  getAllGoals(): WeightGoal[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(this.GOAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading weight goals:', error);
      return [];
    }
  }

  // Analytics and Progress
  getWeightProgress(): WeightProgress {
    const entries = this.getWeightEntries();
    if (entries.length < 2) {
      return {
        totalChange: 0,
        weeklyChange: 0,
        monthlyChange: 0,
        trend: 'stable',
        progressPercentage: 0,
        currentWeight: 0,
        streak: 0,
        bmiCategory: 'normal',
        bmi: 0,
        goalProgress: 0
      };
    }

    const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstEntry = sortedEntries[0];
    const lastEntry = sortedEntries[sortedEntries.length - 1];
    const totalChange = lastEntry.weight - firstEntry.weight;

    // Calculate weekly change (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyEntries = entries.filter(entry => new Date(entry.date) >= oneWeekAgo);
    const weeklyChange = weeklyEntries.length >= 2 
      ? weeklyEntries[weeklyEntries.length - 1].weight - weeklyEntries[0].weight 
      : 0;

    // Calculate monthly change (last 30 days)
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const monthlyEntries = entries.filter(entry => new Date(entry.date) >= oneMonthAgo);
    const monthlyChange = monthlyEntries.length >= 2 
      ? monthlyEntries[monthlyEntries.length - 1].weight - monthlyEntries[0].weight 
      : 0;

    const trend = totalChange > 0.5 ? 'increasing' : totalChange < -0.5 ? 'decreasing' : 'stable';
    
    // Calculate current weight
    const currentWeight = lastEntry.weight;
    
    // Calculate streak (consecutive days with entries)
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    for (let i = 0; i < sortedEntries.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      
      if (sortedEntries[i].date === expectedDateStr) {
        streak++;
      } else {
        break;
      }
    }
    
    // Calculate BMI (assuming average height of 5'8" for demo)
    const heightInMeters = 1.73; // 5'8" in meters
    const bmi = currentWeight / (heightInMeters * heightInMeters);
    let bmiCategory = 'normal';
    if (bmi < 18.5) bmiCategory = 'underweight';
    else if (bmi < 25) bmiCategory = 'normal';
    else if (bmi < 30) bmiCategory = 'overweight';
    else bmiCategory = 'obese';
    
    // Calculate progress percentage based on current goal
    const currentGoal = this.getCurrentGoal();
    let progressPercentage = 0;
    let goalProgress = 0;
    
    if (currentGoal) {
      const startWeight = currentGoal.startWeight;
      const targetWeight = currentGoal.targetWeight;
      
      if (currentGoal.type === 'lose') {
        const totalToLose = startWeight - targetWeight;
        const lostSoFar = startWeight - currentWeight;
        progressPercentage = Math.min(100, Math.max(0, (lostSoFar / totalToLose) * 100));
        goalProgress = progressPercentage;
      } else if (currentGoal.type === 'gain') {
        const totalToGain = targetWeight - startWeight;
        const gainedSoFar = currentWeight - startWeight;
        progressPercentage = Math.min(100, Math.max(0, (gainedSoFar / totalToGain) * 100));
        goalProgress = progressPercentage;
      }
    }

    return {
      totalChange,
      weeklyChange,
      monthlyChange,
      trend,
      progressPercentage,
      currentWeight,
      streak,
      bmiCategory,
      bmi: Math.round(bmi * 10) / 10,
      goalProgress
    };
  }

  getWeightAnalytics(): WeightAnalytics {
    const entries = this.getWeightEntries();
    if (entries.length === 0) {
      return {
        averageWeight: 0,
        minWeight: 0,
        maxWeight: 0,
        totalEntries: 0,
        streakDays: 0,
        weeklyAverage: 0,
        monthlyAverage: 0,
        consistency: 0,
        weightRange: {
          highest: 0,
          lowest: 0,
          range: 0
        }
      };
    }

    const weights = entries.map(entry => entry.weight);
    const averageWeight = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);

    // Calculate streak days
    const sortedEntries = entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    let streakDays = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];
      
      if (sortedEntries[i].date === expectedDateStr) {
        streakDays++;
      } else {
        break;
      }
    }

    // Calculate weekly average (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weeklyEntries = entries.filter(entry => new Date(entry.date) >= oneWeekAgo);
    const weeklyAverage = weeklyEntries.length > 0 
      ? weeklyEntries.reduce((sum, entry) => sum + entry.weight, 0) / weeklyEntries.length 
      : 0;

    // Calculate monthly average (last 30 days)
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const monthlyEntries = entries.filter(entry => new Date(entry.date) >= oneMonthAgo);
    const monthlyAverage = monthlyEntries.length > 0 
      ? monthlyEntries.reduce((sum, entry) => sum + entry.weight, 0) / monthlyEntries.length 
      : 0;

    // Calculate consistency (percentage of days with entries in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEntries = entries.filter(entry => new Date(entry.date) >= thirtyDaysAgo);
    const consistency = Math.round((recentEntries.length / 30) * 100);

    // Calculate weight range
    const weightRange = {
      highest: Math.round(maxWeight * 10) / 10,
      lowest: Math.round(minWeight * 10) / 10,
      range: Math.round((maxWeight - minWeight) * 10) / 10
    };

    return {
      averageWeight: Math.round(averageWeight * 10) / 10,
      minWeight: Math.round(minWeight * 10) / 10,
      maxWeight: Math.round(maxWeight * 10) / 10,
      totalEntries: entries.length,
      streakDays,
      weeklyAverage: Math.round(weeklyAverage * 10) / 10,
      monthlyAverage: Math.round(monthlyAverage * 10) / 10,
      consistency,
      weightRange
    };
  }

  // Utility Methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Sample Data for Development
  addSampleData(): void {
    const sampleEntries: Omit<WeightEntry, 'id' | 'timestamp'>[] = [
      { date: '2024-01-01', weight: 180.5, bodyFat: 22.5, notes: 'New Year resolution start' },
      { date: '2024-01-08', weight: 179.2, bodyFat: 22.1, notes: 'Good week, feeling motivated' },
      { date: '2024-01-15', weight: 177.8, bodyFat: 21.8, notes: 'Consistent progress' },
      { date: '2024-01-22', weight: 176.5, bodyFat: 21.5, notes: 'Reached first milestone' },
      { date: '2024-01-29', weight: 175.1, bodyFat: 21.2, notes: 'Great month overall' },
      { date: '2024-02-05', weight: 174.3, bodyFat: 21.0, notes: 'Continuing strong' },
      { date: '2024-02-12', weight: 173.7, bodyFat: 20.8, notes: 'Steady progress' },
      { date: '2024-02-19', weight: 172.9, bodyFat: 20.6, notes: 'Feeling lighter' },
      { date: '2024-02-26', weight: 172.1, bodyFat: 20.4, notes: 'Almost at goal' },
      { date: '2024-03-05', weight: 171.5, bodyFat: 20.2, notes: 'Goal weight achieved!' }
    ];

    sampleEntries.forEach(entry => this.addWeightEntry(entry));

    // Add sample goal
    const sampleGoal: Omit<WeightGoal, 'id'> = {
      type: 'lose',
      targetWeight: 170,
      currentWeight: 180.5,
      startWeight: 180.5,
      startDate: '2024-01-01',
      targetDate: '2024-03-31',
      isActive: true
    };

    this.createWeightGoal(sampleGoal);
  }

  clearAllData(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.GOAL_STORAGE_KEY);
    this.initializeData();
  }
}

// Export singleton instance
export const weightTrackingService = new WeightTrackingService();
export default WeightTrackingService;
