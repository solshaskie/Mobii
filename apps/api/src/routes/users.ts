import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  avatar: z.string().url().optional(),
});

const updateFitnessProfileSchema = z.object({
  age: z.number().min(13).max(120).optional(),
  weight: z.number().min(20).max(300).optional(),
  height: z.number().min(100).max(250).optional(),
  gender: z.string().optional(),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  primaryGoal: z.string().optional(),
  secondaryGoal: z.string().optional(),
  medicalConditions: z.array(z.string()).optional(),
  injuries: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  preferredWorkoutDuration: z.number().min(5).max(180).optional(),
  preferredWorkoutTime: z.string().optional(),
  equipmentAvailable: z.array(z.string()).optional(),
});

const updatePreferencesSchema = z.object({
  theme: z.enum(['DARK', 'LIGHT', 'ACTIVE', 'MOTIVATING', 'LOW_STRAIN', 'ZEN', 'OCEAN', 'SUNSET']).optional(),
  ttsVoice: z.string().optional(),
  ttsSpeed: z.number().min(0.5).max(2.0).optional(),
  audioVolume: z.number().min(0).max(1).optional(),
  musicEnabled: z.boolean().optional(),
  notificationsEnabled: z.boolean().optional(),
  autoPlayVideos: z.boolean().optional(),
  showTimer: z.boolean().optional(),
  showCalories: z.boolean().optional(),
  language: z.string().optional(),
  highContrast: z.boolean().optional(),
  largeText: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
  screenReader: z.boolean().optional(),
});

// Get user profile
router.get('/profile', async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
        fitnessProfile: true,
        preferences: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    next(error);
  }
});

// Update fitness profile
router.put('/fitness-profile', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const data = updateFitnessProfileSchema.parse(req.body);

    const fitnessProfile = await prisma.fitnessProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });

    res.json({
      message: 'Fitness profile updated successfully',
      fitnessProfile,
    });
  } catch (error) {
    next(error);
  }
});

// Update user preferences
router.put('/preferences', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const data = updatePreferencesSchema.parse(req.body);

    const preferences = await prisma.userPreferences.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });

    res.json({
      message: 'Preferences updated successfully',
      preferences,
    });
  } catch (error) {
    next(error);
  }
});

// Get user statistics
router.get('/stats', async (req, res, next) => {
  try {
    const userId = req.user!.id;

    // Get workout statistics
    const workoutStats = await prisma.workoutSession.aggregate({
      where: { userId, status: 'completed' },
      _count: { id: true },
      _sum: { duration: true, calories: true },
    });

    // Get current streak
    const recentSessions = await prisma.workoutSession.findMany({
      where: { userId, status: 'completed' },
      select: { startTime: true },
      orderBy: { startTime: 'desc' },
      take: 30,
    });

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasWorkout = recentSessions.some(session => {
        const sessionDate = new Date(session.startTime);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === checkDate.getTime();
      });

      if (hasWorkout) {
        streak++;
      } else {
        break;
      }
    }

    // Get achievements
    const achievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Get recent progress
    const recentProgress = await prisma.progressEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 5,
    });

    res.json({
      stats: {
        totalWorkouts: workoutStats._count.id || 0,
        totalDuration: workoutStats._sum.duration || 0,
        totalCalories: workoutStats._sum.calories || 0,
        currentStreak: streak,
        achievements: achievements.length,
        recentProgress: recentProgress.length,
      },
      achievements,
      recentProgress,
    });
  } catch (error) {
    next(error);
  }
});

// Get user dashboard data
router.get('/dashboard', async (req, res, next) => {
  try {
    const userId = req.user!.id;

    // Get today's workout
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysWorkout = await prisma.workoutPlan.findFirst({
      where: {
        userId,
        scheduledDate: {
          gte: today,
          lt: tomorrow,
        },
        status: { in: ['draft', 'active'] },
      },
      include: {
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                category: true,
                duration: true,
                imageUrl: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    // Get recent workouts
    const recentWorkouts = await prisma.workoutSession.findMany({
      where: { userId, status: 'completed' },
      include: {
        workoutPlan: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
      orderBy: { startTime: 'desc' },
      take: 5,
    });

    // Get weekly progress
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyStats = await prisma.workoutSession.aggregate({
      where: {
        userId,
        status: 'completed',
        startTime: { gte: weekAgo },
      },
      _count: { id: true },
      _sum: { duration: true, calories: true },
    });

    res.json({
      todaysWorkout,
      recentWorkouts,
      weeklyStats: {
        workouts: weeklyStats._count.id || 0,
        duration: weeklyStats._sum.duration || 0,
        calories: weeklyStats._sum.calories || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
