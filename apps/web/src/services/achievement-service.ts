// Achievement system for tracking user progress and milestones
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'workout' | 'streak' | 'milestone' | 'social' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  xpReward: number;
}

export interface UserStats {
  totalWorkouts: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  totalCalories: number;
  favoriteExercise: string;
  totalReps: number;
  perfectFormCount: number;
}

export class AchievementService {
  private achievements: Achievement[] = [];
  private userStats: UserStats = {
    totalWorkouts: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalCalories: 0,
    favoriteExercise: '',
    totalReps: 0,
    perfectFormCount: 0
  };

  constructor() {
    this.initializeAchievements();
  }

  private initializeAchievements(): void {
    this.achievements = [
      // Workout achievements
      {
        id: 'first-workout',
        title: 'First Steps',
        description: 'Complete your first workout',
        icon: '🎯',
        category: 'workout',
        rarity: 'common',
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        xpReward: 50
      },
      {
        id: 'workout-warrior',
        title: 'Workout Warrior',
        description: 'Complete 10 workouts',
        icon: '💪',
        category: 'workout',
        rarity: 'common',
        progress: 0,
        maxProgress: 10,
        unlocked: false,
        xpReward: 100
      },
      {
        id: 'fitness-master',
        title: 'Fitness Master',
        description: 'Complete 50 workouts',
        icon: '🏆',
        category: 'workout',
        rarity: 'rare',
        progress: 0,
        maxProgress: 50,
        unlocked: false,
        xpReward: 250
      },
      {
        id: 'century-club',
        title: 'Century Club',
        description: 'Complete 100 workouts',
        icon: '👑',
        category: 'workout',
        rarity: 'epic',
        progress: 0,
        maxProgress: 100,
        unlocked: false,
        xpReward: 500
      },

      // Streak achievements
      {
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Maintain a 7-day workout streak',
        icon: '🔥',
        category: 'streak',
        rarity: 'common',
        progress: 0,
        maxProgress: 7,
        unlocked: false,
        xpReward: 75
      },
      {
        id: 'month-master',
        title: 'Month Master',
        description: 'Maintain a 30-day workout streak',
        icon: '🌟',
        category: 'streak',
        rarity: 'rare',
        progress: 0,
        maxProgress: 30,
        unlocked: false,
        xpReward: 300
      },
      {
        id: 'streak-legend',
        title: 'Streak Legend',
        description: 'Maintain a 100-day workout streak',
        icon: '⚡',
        category: 'streak',
        rarity: 'legendary',
        progress: 0,
        maxProgress: 100,
        unlocked: false,
        xpReward: 1000
      },

      // Milestone achievements
      {
        id: 'time-investor',
        title: 'Time Investor',
        description: 'Spend 10 hours working out',
        icon: '⏰',
        category: 'milestone',
        rarity: 'common',
        progress: 0,
        maxProgress: 600, // 10 hours in minutes
        unlocked: false,
        xpReward: 150
      },
      {
        id: 'calorie-burner',
        title: 'Calorie Burner',
        description: 'Burn 1000 total calories',
        icon: '🔥',
        category: 'milestone',
        rarity: 'common',
        progress: 0,
        maxProgress: 1000,
        unlocked: false,
        xpReward: 200
      },
      {
        id: 'rep-counter',
        title: 'Rep Counter',
        description: 'Complete 1000 total repetitions',
        icon: '🔢',
        category: 'milestone',
        rarity: 'rare',
        progress: 0,
        maxProgress: 1000,
        unlocked: false,
        xpReward: 300
      },

      // Form achievements
      {
        id: 'form-perfect',
        title: 'Form Perfect',
        description: 'Achieve perfect form 50 times',
        icon: '✨',
        category: 'milestone',
        rarity: 'rare',
        progress: 0,
        maxProgress: 50,
        unlocked: false,
        xpReward: 400
      },

      // Special achievements
      {
        id: 'early-bird',
        title: 'Early Bird',
        description: 'Complete a workout before 7 AM',
        icon: '🌅',
        category: 'special',
        rarity: 'rare',
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        xpReward: 100
      },
      {
        id: 'night-owl',
        title: 'Night Owl',
        description: 'Complete a workout after 10 PM',
        icon: '🦉',
        category: 'special',
        rarity: 'rare',
        progress: 0,
        maxProgress: 1,
        unlocked: false,
        xpReward: 100
      },
      {
        id: 'weekend-warrior',
        title: 'Weekend Warrior',
        description: 'Complete workouts on 5 consecutive weekends',
        icon: '🎉',
        category: 'special',
        rarity: 'epic',
        progress: 0,
        maxProgress: 5,
        unlocked: false,
        xpReward: 350
      }
    ];
  }

  // Update user stats
  updateStats(stats: Partial<UserStats>): void {
    this.userStats = { ...this.userStats, ...stats };
    this.checkAchievements();
  }

  // Record a completed workout
  recordWorkout(duration: number, calories: number, reps: number, perfectFormCount: number): void {
    this.userStats.totalWorkouts++;
    this.userStats.totalMinutes += duration;
    this.userStats.totalCalories += calories;
    this.userStats.totalReps += reps;
    this.userStats.perfectFormCount += perfectFormCount;

    // Check for time-based achievements
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 7) {
      this.updateAchievementProgress('early-bird', 1);
    }
    
    if (hour >= 22) {
      this.updateAchievementProgress('night-owl', 1);
    }

    this.checkAchievements();
  }

  // Update streak
  updateStreak(currentStreak: number, longestStreak: number): void {
    this.userStats.currentStreak = currentStreak;
    this.userStats.longestStreak = Math.max(this.userStats.longestStreak, longestStreak);
    this.checkAchievements();
  }

  // Check and update achievements
  private checkAchievements(): void {
    // Workout count achievements
    this.updateAchievementProgress('first-workout', this.userStats.totalWorkouts);
    this.updateAchievementProgress('workout-warrior', this.userStats.totalWorkouts);
    this.updateAchievementProgress('fitness-master', this.userStats.totalWorkouts);
    this.updateAchievementProgress('century-club', this.userStats.totalWorkouts);

    // Streak achievements
    this.updateAchievementProgress('week-warrior', this.userStats.currentStreak);
    this.updateAchievementProgress('month-master', this.userStats.currentStreak);
    this.updateAchievementProgress('streak-legend', this.userStats.currentStreak);

    // Milestone achievements
    this.updateAchievementProgress('time-investor', this.userStats.totalMinutes);
    this.updateAchievementProgress('calorie-burner', this.userStats.totalCalories);
    this.updateAchievementProgress('rep-counter', this.userStats.totalReps);
    this.updateAchievementProgress('form-perfect', this.userStats.perfectFormCount);
  }

  // Update achievement progress
  private updateAchievementProgress(achievementId: string, progress: number): void {
    const achievement = this.achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
      achievement.progress = Math.min(progress, achievement.maxProgress);
      
      if (achievement.progress >= achievement.maxProgress) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
        this.onAchievementUnlocked(achievement);
      }
    }
  }

  // Handle achievement unlock
  private onAchievementUnlocked(achievement: Achievement): void {
    console.log(`🎉 Achievement Unlocked: ${achievement.title}!`);
    // In a real app, you might show a notification, play a sound, etc.
  }

  // Get all achievements
  getAchievements(): Achievement[] {
    return this.achievements;
  }

  // Get unlocked achievements
  getUnlockedAchievements(): Achievement[] {
    return this.achievements.filter(a => a.unlocked);
  }

  // Get achievements by category
  getAchievementsByCategory(category: Achievement['category']): Achievement[] {
    return this.achievements.filter(a => a.category === category);
  }

  // Get achievements by rarity
  getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
    return this.achievements.filter(a => a.rarity === rarity);
  }

  // Get user stats
  getUserStats(): UserStats {
    return { ...this.userStats };
  }

  // Get total XP earned
  getTotalXP(): number {
    return this.getUnlockedAchievements().reduce((total, achievement) => total + achievement.xpReward, 0);
  }

  // Get achievement progress percentage
  getProgressPercentage(): number {
    const totalAchievements = this.achievements.length;
    const unlockedAchievements = this.getUnlockedAchievements().length;
    return totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;
  }

  // Get recent achievements (last 5 unlocked)
  getRecentAchievements(): Achievement[] {
    return this.getUnlockedAchievements()
      .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
      .slice(0, 5);
  }

  // Reset all achievements (for testing)
  resetAchievements(): void {
    this.achievements.forEach(achievement => {
      achievement.progress = 0;
      achievement.unlocked = false;
      achievement.unlockedAt = undefined;
    });
    this.userStats = {
      totalWorkouts: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalCalories: 0,
      favoriteExercise: '',
      totalReps: 0,
      perfectFormCount: 0
    };
  }
}

// Export singleton instance
export const achievementService = new AchievementService();
