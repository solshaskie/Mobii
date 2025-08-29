// Weight tracking service with progress analytics and goal management
export interface WeightEntry {
  id: string;
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  waterWeight?: number;
  notes?: string;
  photoUrl?: string;
  mood?: 'great' | 'good' | 'okay' | 'tired' | 'stressed';
}

export interface WeightGoal {
  id: string;
  type: 'lose' | 'gain' | 'maintain';
  targetWeight: number;
  startWeight: number;
  startDate: string;
  targetDate: string;
  weeklyGoal: number; // pounds per week
  isActive: boolean;
  notes?: string;
}

export interface WeightProgress {
  currentWeight: number;
  startingWeight: number;
  totalChange: number;
  weeklyAverage: number;
  monthlyAverage: number;
  goalProgress: number; // percentage
  streak: number; // consecutive days
  trend: 'losing' | 'gaining' | 'maintaining';
  bmi: number;
  bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese';
}

export interface WeightAnalytics {
  totalEntries: number;
  averageWeight: number;
  lowestWeight: number;
  highestWeight: number;
  weightRange: number;
  consistency: number; // percentage of days tracked
  weeklyTrend: number;
  monthlyTrend: number;
  predictedGoalDate?: string;
  estimatedTimeToGoal?: number; // days
}

export class WeightTrackingService {
  private entries: WeightEntry[] = [];
  private goals: WeightGoal[] = [];
  private currentGoal: WeightGoal | null = null;

  constructor() {
    this.loadFromStorage();
  }

  // Add new weight entry
  addWeightEntry(entry: Omit<WeightEntry, 'id'>): WeightEntry {
    const newEntry: WeightEntry = {
      ...entry,
      id: this.generateId(),
      date: entry.date || new Date().toISOString().split('T')[0]
    };

    this.entries.push(newEntry);
    this.entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    this.saveToStorage();
    
    return newEntry;
  }

  // Get all weight entries
  getWeightEntries(limit?: number): WeightEntry[] {
    return limit ? this.entries.slice(0, limit) : this.entries;
  }

  // Get entries for date range
  getEntriesForDateRange(startDate: string, endDate: string): WeightEntry[] {
    return this.entries.filter(entry => 
      entry.date >= startDate && entry.date <= endDate
    );
  }

  // Get latest weight entry
  getLatestWeight(): WeightEntry | null {
    return this.entries[0] || null;
  }

  // Update weight entry
  updateWeightEntry(id: string, updates: Partial<WeightEntry>): WeightEntry | null {
    const index = this.entries.findIndex(entry => entry.id === id);
    if (index === -1) return null;

    this.entries[index] = { ...this.entries[index], ...updates };
    this.saveToStorage();
    return this.entries[index];
  }

  // Delete weight entry
  deleteWeightEntry(id: string): boolean {
    const index = this.entries.findIndex(entry => entry.id === id);
    if (index === -1) return false;

    this.entries.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Create weight goal
  createWeightGoal(goal: Omit<WeightGoal, 'id'>): WeightGoal {
    const newGoal: WeightGoal = {
      ...goal,
      id: this.generateId(),
      isActive: true
    };

    // Deactivate other goals
    this.goals.forEach(g => g.isActive = false);
    
    this.goals.push(newGoal);
    this.currentGoal = newGoal;
    this.saveToStorage();
    
    return newGoal;
  }

  // Get current active goal
  getCurrentGoal(): WeightGoal | null {
    return this.currentGoal || this.goals.find(g => g.isActive) || null;
  }

  // Update goal
  updateGoal(id: string, updates: Partial<WeightGoal>): WeightGoal | null {
    const index = this.goals.findIndex(goal => goal.id === id);
    if (index === -1) return null;

    this.goals[index] = { ...this.goals[index], ...updates };
    if (this.goals[index].isActive) {
      this.currentGoal = this.goals[index];
    }
    this.saveToStorage();
    return this.goals[index];
  }

  // Get weight progress analytics
  getWeightProgress(): WeightProgress {
    if (this.entries.length === 0) {
      return {
        currentWeight: 0,
        startingWeight: 0,
        totalChange: 0,
        weeklyAverage: 0,
        monthlyAverage: 0,
        goalProgress: 0,
        streak: 0,
        trend: 'maintaining',
        bmi: 0,
        bmiCategory: 'normal'
      };
    }

    const latest = this.entries[0];
    const first = this.entries[this.entries.length - 1];
    const totalChange = latest.weight - first.weight;
    
    // Calculate weekly average (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyEntries = this.entries.filter(entry => 
      new Date(entry.date) >= weekAgo
    );
    const weeklyAverage = weeklyEntries.length > 0 
      ? weeklyEntries.reduce((sum, entry) => sum + entry.weight, 0) / weeklyEntries.length
      : 0;

    // Calculate monthly average (last 30 days)
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    const monthlyEntries = this.entries.filter(entry => 
      new Date(entry.date) >= monthAgo
    );
    const monthlyAverage = monthlyEntries.length > 0
      ? monthlyEntries.reduce((sum, entry) => sum + entry.weight, 0) / monthlyEntries.length
      : 0;

    // Calculate streak
    const streak = this.calculateStreak();

    // Determine trend
    let trend: 'losing' | 'gaining' | 'maintaining' = 'maintaining';
    if (Math.abs(weeklyAverage - latest.weight) > 0.5) {
      trend = weeklyAverage > latest.weight ? 'losing' : 'gaining';
    }

    // Calculate BMI (assuming average height of 5'8" for demo)
    const heightInMeters = 1.73; // 5'8" in meters
    const bmi = latest.weight / (heightInMeters * heightInMeters);
    const bmiCategory = this.getBMICategory(bmi);

    // Calculate goal progress
    const goalProgress = this.currentGoal ? this.calculateGoalProgress() : 0;

    return {
      currentWeight: latest.weight,
      startingWeight: first.weight,
      totalChange,
      weeklyAverage,
      monthlyAverage,
      goalProgress,
      streak,
      trend,
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory
    };
  }

  // Get comprehensive analytics
  getWeightAnalytics(): WeightAnalytics {
    if (this.entries.length === 0) {
      return {
        totalEntries: 0,
        averageWeight: 0,
        lowestWeight: 0,
        highestWeight: 0,
        weightRange: 0,
        consistency: 0,
        weeklyTrend: 0,
        monthlyTrend: 0
      };
    }

    const weights = this.entries.map(entry => entry.weight);
    const averageWeight = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
    const lowestWeight = Math.min(...weights);
    const highestWeight = Math.max(...weights);
    const weightRange = highestWeight - lowestWeight;

    // Calculate consistency (entries in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentEntries = this.entries.filter(entry => 
      new Date(entry.date) >= thirtyDaysAgo
    );
    const consistency = (recentEntries.length / 30) * 100;

    // Calculate trends
    const weeklyTrend = this.calculateTrend(7);
    const monthlyTrend = this.calculateTrend(30);

    // Predict goal date
    const predictedGoalDate = this.currentGoal ? this.predictGoalDate() : undefined;
    const estimatedTimeToGoal = this.currentGoal ? this.estimateTimeToGoal() : undefined;

    return {
      totalEntries: this.entries.length,
      averageWeight: Math.round(averageWeight * 10) / 10,
      lowestWeight,
      highestWeight,
      weightRange: Math.round(weightRange * 10) / 10,
      consistency: Math.round(consistency),
      weeklyTrend,
      monthlyTrend,
      predictedGoalDate,
      estimatedTimeToGoal
    };
  }

  // Get chart data for visualization
  getChartData(days: number = 30): { date: string; weight: number }[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.entries
      .filter(entry => new Date(entry.date) >= cutoffDate)
      .reverse()
      .map(entry => ({
        date: entry.date,
        weight: entry.weight
      }));
  }

  // Get BMI category
  private getBMICategory(bmi: number): 'underweight' | 'normal' | 'overweight' | 'obese' {
    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  // Calculate streak
  private calculateStreak(): number {
    if (this.entries.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) { // Check up to 1 year
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];
      
      const hasEntry = this.entries.some(entry => entry.date === dateString);
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Calculate trend over specified days
  private calculateTrend(days: number): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentEntries = this.entries.filter(entry => 
      new Date(entry.date) >= cutoffDate
    );

    if (recentEntries.length < 2) return 0;

    const firstWeight = recentEntries[recentEntries.length - 1].weight;
    const lastWeight = recentEntries[0].weight;
    const daysDiff = (new Date(recentEntries[0].date).getTime() - 
                     new Date(recentEntries[recentEntries.length - 1].date).getTime()) / 
                     (1000 * 60 * 60 * 24);

    return daysDiff > 0 ? (lastWeight - firstWeight) / daysDiff : 0;
  }

  // Calculate goal progress percentage
  private calculateGoalProgress(): number {
    if (!this.currentGoal) return 0;

    const latest = this.entries[0];
    if (!latest) return 0;

    const totalGoal = this.currentGoal.targetWeight - this.currentGoal.startWeight;
    const currentProgress = latest.weight - this.currentGoal.startWeight;

    if (totalGoal === 0) return 100;

    const progress = (currentProgress / totalGoal) * 100;
    return Math.max(0, Math.min(100, progress));
  }

  // Predict goal date based on current trend
  private predictGoalDate(): string | undefined {
    if (!this.currentGoal) return undefined;

    const latest = this.entries[0];
    if (!latest) return undefined;

    const remainingWeight = Math.abs(this.currentGoal.targetWeight - latest.weight);
    const weeklyTrend = Math.abs(this.calculateTrend(7));
    
    if (weeklyTrend === 0) return undefined;

    const weeksToGoal = remainingWeight / (weeklyTrend * 7);
    const daysToGoal = weeksToGoal * 7;

    const goalDate = new Date();
    goalDate.setDate(goalDate.getDate() + daysToGoal);

    return goalDate.toISOString().split('T')[0];
  }

  // Estimate time to goal in days
  private estimateTimeToGoal(): number | undefined {
    if (!this.currentGoal) return undefined;

    const latest = this.entries[0];
    if (!latest) return undefined;

    const remainingWeight = Math.abs(this.currentGoal.targetWeight - latest.weight);
    const weeklyTrend = Math.abs(this.calculateTrend(7));
    
    if (weeklyTrend === 0) return undefined;

    const weeksToGoal = remainingWeight / (weeklyTrend * 7);
    return Math.round(weeksToGoal * 7);
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Save to localStorage
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mobii_weight_entries', JSON.stringify(this.entries));
      localStorage.setItem('mobii_weight_goals', JSON.stringify(this.goals));
    }
  }

  // Load from localStorage
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const entriesData = localStorage.getItem('mobii_weight_entries');
      const goalsData = localStorage.getItem('mobii_weight_goals');

      if (entriesData) {
        this.entries = JSON.parse(entriesData);
      }

      if (goalsData) {
        this.goals = JSON.parse(goalsData);
        this.currentGoal = this.goals.find(g => g.isActive) || null;
      }
    }
  }

  // Clear all data (for testing)
  clearAllData(): void {
    this.entries = [];
    this.goals = [];
    this.currentGoal = null;
    this.saveToStorage();
  }

  // Add sample data for testing
  addSampleData(): void {
    const today = new Date();
    const sampleEntries: Omit<WeightEntry, 'id'>[] = [];

    // Generate 30 days of sample data
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simulate weight loss trend
      const baseWeight = 180;
      const dailyChange = -0.2 + (Math.random() - 0.5) * 0.4; // -0.2 to 0.2 lbs variation
      const weight = baseWeight - (29 - i) * 0.3 + dailyChange;

      sampleEntries.push({
        date: date.toISOString().split('T')[0],
        weight: Math.round(weight * 10) / 10,
        bodyFat: Math.round((25 - (29 - i) * 0.1 + (Math.random() - 0.5) * 2) * 10) / 10,
        muscleMass: Math.round((150 - (29 - i) * 0.05 + (Math.random() - 0.5) * 1) * 10) / 10,
        waterWeight: Math.round((55 + (Math.random() - 0.5) * 2) * 10) / 10,
        notes: i % 7 === 0 ? 'Weekly check-in' : undefined,
        mood: ['great', 'good', 'okay', 'tired', 'stressed'][Math.floor(Math.random() * 5)] as any
      });
    }

    sampleEntries.forEach(entry => this.addWeightEntry(entry));

    // Add sample goal
    this.createWeightGoal({
      type: 'lose',
      targetWeight: 165,
      startWeight: 180,
      startDate: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      targetDate: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      weeklyGoal: 1.5,
      notes: 'Goal: Lose 15 pounds in 3 months'
    });
  }
}

// Export singleton instance
export const weightTrackingService = new WeightTrackingService();
