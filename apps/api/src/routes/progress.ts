import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createProgressEntrySchema = z.object({
  date: z.string().datetime(),
  weight: z.number().min(20).max(300).optional(),
  bodyFat: z.number().min(0).max(50).optional(),
  muscleMass: z.number().min(0).max(200).optional(),
  chest: z.number().min(50).max(200).optional(),
  waist: z.number().min(50).max(200).optional(),
  hips: z.number().min(50).max(200).optional(),
  arms: z.number().min(20).max(100).optional(),
  thighs: z.number().min(30).max(150).optional(),
  maxPushUps: z.number().min(0).max(1000).optional(),
  maxSquats: z.number().min(0).max(1000).optional(),
  plankDuration: z.number().min(0).max(3600).optional(),
  flexibility: z.number().min(0).max(100).optional(),
  notes: z.string().optional(),
});

const updateProgressEntrySchema = createProgressEntrySchema.partial();

// Get all progress entries
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { limit = '50', offset = '0' } = req.query;

    const progressEntries = await prisma.progressEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
    });

    const total = await prisma.progressEntry.count({
      where: { userId },
    });

    res.json({
      progressEntries,
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        hasMore: parseInt(offset as string) + parseInt(limit as string) < total,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get single progress entry
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const progressEntry = await prisma.progressEntry.findFirst({
      where: { id, userId },
    });

    if (!progressEntry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Progress entry not found',
      });
    }

    res.json({ progressEntry });
  } catch (error) {
    next(error);
  }
});

// Create progress entry
router.post('/', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const data = createProgressEntrySchema.parse(req.body);

    const progressEntry = await prisma.progressEntry.create({
      data: {
        userId,
        ...data,
        date: new Date(data.date),
      },
    });

    res.status(201).json({
      message: 'Progress entry created successfully',
      progressEntry,
    });
  } catch (error) {
    next(error);
  }
});

// Update progress entry
router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const data = updateProgressEntrySchema.parse(req.body);

    const progressEntry = await prisma.progressEntry.findFirst({
      where: { id, userId },
    });

    if (!progressEntry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Progress entry not found',
      });
    }

    const updatedProgressEntry = await prisma.progressEntry.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined,
      },
    });

    res.json({
      message: 'Progress entry updated successfully',
      progressEntry: updatedProgressEntry,
    });
  } catch (error) {
    next(error);
  }
});

// Delete progress entry
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const progressEntry = await prisma.progressEntry.findFirst({
      where: { id, userId },
    });

    if (!progressEntry) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Progress entry not found',
      });
    }

    await prisma.progressEntry.delete({
      where: { id },
    });

    res.json({
      message: 'Progress entry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Get progress analytics
router.get('/analytics/overview', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { period = '30' } = req.query;

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period as string));

    const entries = await prisma.progressEntry.findMany({
      where: {
        userId,
        date: { gte: daysAgo },
      },
      orderBy: { date: 'asc' },
    });

    if (entries.length === 0) {
      return res.json({
        analytics: {
          weightChange: 0,
          bodyFatChange: 0,
          muscleMassChange: 0,
          strengthImprovement: 0,
          flexibilityImprovement: 0,
          trends: [],
        },
      });
    }

    const firstEntry = entries[0];
    const lastEntry = entries[entries.length - 1];

    const analytics = {
      weightChange: lastEntry.weight && firstEntry.weight 
        ? lastEntry.weight - firstEntry.weight 
        : 0,
      bodyFatChange: lastEntry.bodyFat && firstEntry.bodyFat 
        ? lastEntry.bodyFat - firstEntry.bodyFat 
        : 0,
      muscleMassChange: lastEntry.muscleMass && firstEntry.muscleMass 
        ? lastEntry.muscleMass - firstEntry.muscleMass 
        : 0,
      strengthImprovement: lastEntry.maxPushUps && firstEntry.maxPushUps 
        ? lastEntry.maxPushUps - firstEntry.maxPushUps 
        : 0,
      flexibilityImprovement: lastEntry.flexibility && firstEntry.flexibility 
        ? lastEntry.flexibility - firstEntry.flexibility 
        : 0,
      trends: entries.map(entry => ({
        date: entry.date,
        weight: entry.weight,
        bodyFat: entry.bodyFat,
        muscleMass: entry.muscleMass,
        maxPushUps: entry.maxPushUps,
        flexibility: entry.flexibility,
      })),
    };

    res.json({ analytics });
  } catch (error) {
    next(error);
  }
});

// Get achievements
router.get('/achievements', async (req, res, next) => {
  try {
    const userId = req.user!.id;

    const achievements = await prisma.achievement.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ achievements });
  } catch (error) {
    next(error);
  }
});

// Get achievement progress
router.get('/achievements/progress', async (req, res, next) => {
  try {
    const userId = req.user!.id;

    // Get user stats
    const workoutStats = await prisma.workoutSession.aggregate({
      where: { userId, status: 'completed' },
      _count: { id: true },
      _sum: { duration: true, calories: true },
    });

    const totalWorkouts = workoutStats._count.id || 0;
    const totalDuration = workoutStats._sum.duration || 0;
    const totalCalories = workoutStats._sum.calories || 0;

    // Calculate current streak
    const recentSessions = await prisma.workoutSession.findMany({
      where: { userId, status: 'completed' },
      select: { startTime: true },
      orderBy: { startTime: 'desc' },
      take: 30,
    });

    let currentStreak = 0;
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
        currentStreak++;
      } else {
        break;
      }
    }

    // Define achievement types and their progress
    const achievementProgress = [
      {
        type: 'first_workout',
        title: 'First Steps',
        description: 'Complete your first workout',
        currentValue: totalWorkouts > 0 ? 1 : 0,
        targetValue: 1,
        isCompleted: totalWorkouts > 0,
        icon: '🎯',
      },
      {
        type: 'workout_streak_7',
        title: 'Week Warrior',
        description: 'Complete workouts for 7 days in a row',
        currentValue: Math.min(currentStreak, 7),
        targetValue: 7,
        isCompleted: currentStreak >= 7,
        icon: '🔥',
      },
      {
        type: 'workout_streak_30',
        title: 'Monthly Master',
        description: 'Complete workouts for 30 days in a row',
        currentValue: Math.min(currentStreak, 30),
        targetValue: 30,
        isCompleted: currentStreak >= 30,
        icon: '🏆',
      },
      {
        type: 'total_workouts_10',
        title: 'Dedicated',
        description: 'Complete 10 workouts',
        currentValue: Math.min(totalWorkouts, 10),
        targetValue: 10,
        isCompleted: totalWorkouts >= 10,
        icon: '💪',
      },
      {
        type: 'total_workouts_50',
        title: 'Fitness Enthusiast',
        description: 'Complete 50 workouts',
        currentValue: Math.min(totalWorkouts, 50),
        targetValue: 50,
        isCompleted: totalWorkouts >= 50,
        icon: '🌟',
      },
      {
        type: 'total_calories_1000',
        title: 'Calorie Burner',
        description: 'Burn 1,000 total calories',
        currentValue: Math.min(totalCalories, 1000),
        targetValue: 1000,
        isCompleted: totalCalories >= 1000,
        icon: '🔥',
      },
      {
        type: 'total_duration_300',
        title: 'Time Warrior',
        description: 'Complete 300 minutes of workouts',
        currentValue: Math.min(totalDuration, 300),
        targetValue: 300,
        isCompleted: totalDuration >= 300,
        icon: '⏰',
      },
    ];

    res.json({ achievementProgress });
  } catch (error) {
    next(error);
  }
});

export default router;
