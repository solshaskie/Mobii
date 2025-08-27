import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Validation schemas
const createWorkoutPlanSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  type: z.enum(['chair_yoga', 'calisthenics', 'mixed']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.number().min(5).max(180),
  exercises: z.array(z.object({
    exerciseId: z.string(),
    order: z.number(),
    duration: z.number().min(10),
    sets: z.number().optional(),
    reps: z.number().optional(),
    restTime: z.number().optional(),
    customInstructions: z.string().optional(),
  })),
  scheduledDate: z.string().datetime().optional(),
});

const updateWorkoutPlanSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed', 'archived']).optional(),
  userRating: z.number().min(1).max(5).optional(),
  userFeedback: z.string().optional(),
});

// Get all workout plans for user
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { status, type, difficulty } = req.query;

    const where: any = { userId };

    if (status) where.status = status;
    if (type) where.type = type;
    if (difficulty) where.difficulty = difficulty;

    const workoutPlans = await prisma.workoutPlan.findMany({
      where,
      include: {
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                category: true,
                difficulty: true,
                duration: true,
                imageUrl: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        sessions: {
          select: {
            id: true,
            startTime: true,
            endTime: true,
            status: true,
            duration: true,
          },
          orderBy: { startTime: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ workoutPlans });
  } catch (error) {
    next(error);
  }
});

// Get single workout plan
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const workoutPlan = await prisma.workoutPlan.findFirst({
      where: { id, userId },
      include: {
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                description: true,
                category: true,
                difficulty: true,
                duration: true,
                calories: true,
                videoUrl: true,
                imageUrl: true,
                instructions: true,
                equipmentRequired: true,
                targetMuscles: true,
                setupInstructions: true,
                executionNotes: true,
                safetyNotes: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
        sessions: {
          include: {
            exerciseSessions: {
              include: {
                exercise: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { startTime: 'desc' },
        },
      },
    });

    if (!workoutPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Workout plan not found',
      });
    }

    res.json({ workoutPlan });
  } catch (error) {
    next(error);
  }
});

// Create new workout plan
router.post('/', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const data = createWorkoutPlanSchema.parse(req.body);

    // Calculate estimated calories
    const totalDuration = data.exercises.reduce((sum, ex) => sum + ex.duration, 0);
    const estimatedCalories = Math.round((totalDuration / 60) * 5); // Rough estimate

    const workoutPlan = await prisma.workoutPlan.create({
      data: {
        userId,
        name: data.name,
        description: data.description,
        type: data.type,
        difficulty: data.difficulty,
        duration: data.duration,
        calories: estimatedCalories,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : null,
        exercises: {
          create: data.exercises.map((exercise, index) => ({
            exerciseId: exercise.exerciseId,
            order: exercise.order,
            duration: exercise.duration,
            sets: exercise.sets,
            reps: exercise.reps,
            restTime: exercise.restTime,
            customInstructions: exercise.customInstructions,
          })),
        },
      },
      include: {
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                category: true,
                difficulty: true,
                duration: true,
                imageUrl: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    res.status(201).json({
      message: 'Workout plan created successfully',
      workoutPlan,
    });
  } catch (error) {
    next(error);
  }
});

// Update workout plan
router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const data = updateWorkoutPlanSchema.parse(req.body);

    const workoutPlan = await prisma.workoutPlan.findFirst({
      where: { id, userId },
    });

    if (!workoutPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Workout plan not found',
      });
    }

    const updatedWorkoutPlan = await prisma.workoutPlan.update({
      where: { id },
      data,
      include: {
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                category: true,
                difficulty: true,
                duration: true,
                imageUrl: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    res.json({
      message: 'Workout plan updated successfully',
      workoutPlan: updatedWorkoutPlan,
    });
  } catch (error) {
    next(error);
  }
});

// Delete workout plan
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const workoutPlan = await prisma.workoutPlan.findFirst({
      where: { id, userId },
    });

    if (!workoutPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Workout plan not found',
      });
    }

    await prisma.workoutPlan.delete({
      where: { id },
    });

    res.json({
      message: 'Workout plan deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

// Start workout session
router.post('/:id/start', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const workoutPlan = await prisma.workoutPlan.findFirst({
      where: { id, userId },
      include: {
        exercises: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!workoutPlan) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Workout plan not found',
      });
    }

    const workoutSession = await prisma.workoutSession.create({
      data: {
        userId,
        workoutPlanId: id,
        startTime: new Date(),
        totalExercises: workoutPlan.exercises.length,
      },
    });

    res.status(201).json({
      message: 'Workout session started',
      session: workoutSession,
    });
  } catch (error) {
    next(error);
  }
});

// Complete exercise in session
router.post('/sessions/:sessionId/exercises/:exerciseId/complete', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { sessionId, exerciseId } = req.params;
    const { duration, setsCompleted, repsCompleted, difficulty, enjoyment, notes } = req.body;

    // Verify session belongs to user
    const session = await prisma.workoutSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Workout session not found',
      });
    }

    // Create or update exercise session
    const exerciseSession = await prisma.exerciseSession.upsert({
      where: {
        workoutSessionId_exerciseId: {
          workoutSessionId: sessionId,
          exerciseId,
        },
      },
      update: {
        endTime: new Date(),
        duration,
        setsCompleted,
        repsCompleted,
        difficulty,
        enjoyment,
        notes,
      },
      create: {
        workoutSessionId: sessionId,
        exerciseId,
        startTime: new Date(),
        endTime: new Date(),
        duration,
        setsCompleted,
        repsCompleted,
        difficulty,
        enjoyment,
        notes,
      },
    });

    // Update session progress
    const completedExercises = await prisma.exerciseSession.count({
      where: { workoutSessionId: sessionId },
    });

    await prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        exercisesCompleted: completedExercises,
      },
    });

    res.json({
      message: 'Exercise completed',
      exerciseSession,
    });
  } catch (error) {
    next(error);
  }
});

// Complete workout session
router.post('/sessions/:sessionId/complete', async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { sessionId } = req.params;
    const { notes } = req.body;

    const session = await prisma.workoutSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Workout session not found',
      });
    }

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - session.startTime.getTime()) / (1000 * 60));

    const updatedSession = await prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        endTime,
        duration,
        status: 'completed',
        notes,
      },
    });

    res.json({
      message: 'Workout session completed',
      session: updatedSession,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
