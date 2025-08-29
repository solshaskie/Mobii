// Supabase service for database operations
export class SupabaseService {
  private supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  private supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  constructor() {
    if (!this.supabaseUrl || !this.supabaseKey) {
      console.warn('Supabase credentials not found. Database features will be disabled.');
    }
  }

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      if (!this.supabaseUrl || !this.supabaseKey) {
        return false;
      }

      // Simple test query
      const response = await fetch(`${this.supabaseUrl}/rest/v1/`, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }

  // Save workout to database
  async saveWorkout(workout: any): Promise<boolean> {
    try {
      if (!this.supabaseUrl || !this.supabaseKey) {
        console.warn('Supabase not configured, workout not saved');
        return false;
      }

      const response = await fetch(`${this.supabaseUrl}/rest/v1/workouts`, {
        method: 'POST',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          id: workout.id,
          title: workout.title,
          description: workout.description,
          duration: workout.duration,
          difficulty: workout.difficulty,
          calories: workout.calories,
          focus_areas: workout.focusAreas,
          exercises: workout.exercises,
          created_at: new Date().toISOString()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to save workout:', error);
      return false;
    }
  }

  // Get user's workout history
  async getWorkoutHistory(): Promise<any[]> {
    try {
      if (!this.supabaseUrl || !this.supabaseKey) {
        return [];
      }

      const response = await fetch(`${this.supabaseUrl}/rest/v1/workouts?order=created_at.desc&limit=10`, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`
        }
      });

      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Failed to get workout history:', error);
      return [];
    }
  }

  // Save workout progress
  async saveProgress(progress: any): Promise<boolean> {
    try {
      if (!this.supabaseUrl || !this.supabaseKey) {
        console.warn('Supabase not configured, progress not saved');
        return false;
      }

      const response = await fetch(`${this.supabaseUrl}/rest/v1/progress`, {
        method: 'POST',
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          workout_id: progress.workoutId,
          duration: progress.duration,
          calories_burned: progress.caloriesBurned,
          exercises_completed: progress.exercisesCompleted,
          completed_at: new Date().toISOString()
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to save progress:', error);
      return false;
    }
  }

  // Get user analytics
  async getAnalytics(): Promise<any> {
    try {
      if (!this.supabaseUrl || !this.supabaseKey) {
        return {
          totalWorkouts: 0,
          totalMinutes: 0,
          totalCalories: 0,
          averageDuration: 0,
          streak: 0
        };
      }

      // Get basic analytics from progress table
      const response = await fetch(`${this.supabaseUrl}/rest/v1/progress?select=*`, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`
        }
      });

      if (response.ok) {
        const progress = await response.json();
        
        const totalWorkouts = progress.length;
        const totalMinutes = progress.reduce((sum: number, p: any) => sum + (p.duration || 0), 0);
        const totalCalories = progress.reduce((sum: number, p: any) => sum + (p.calories_burned || 0), 0);
        const averageDuration = totalWorkouts > 0 ? totalMinutes / totalWorkouts : 0;

        return {
          totalWorkouts,
          totalMinutes,
          totalCalories,
          averageDuration,
          streak: this.calculateStreak(progress)
        };
      }

      return {
        totalWorkouts: 0,
        totalMinutes: 0,
        totalCalories: 0,
        averageDuration: 0,
        streak: 0
      };
    } catch (error) {
      console.error('Failed to get analytics:', error);
      return {
        totalWorkouts: 0,
        totalMinutes: 0,
        totalCalories: 0,
        averageDuration: 0,
        streak: 0
      };
    }
  }

  private calculateStreak(progress: any[]): number {
    if (!progress.length) return 0;

    // Sort by completion date
    const sortedProgress = progress
      .map(p => new Date(p.completed_at))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedProgress.length; i++) {
      const workoutDate = new Date(sortedProgress[i]);
      workoutDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}
