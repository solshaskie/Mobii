import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all exercises (public)
router.get('/', async (req, res, next) => {
  try {
    const {
      category,
      difficulty,
      search,
      limit = '50',
      offset = '0',
    } = req.query;

    const where: any = { isActive: true };

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { tags: { has: search as string } },
      ];
    }

    const exercises = await prisma.exercise.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        difficulty: true,
        duration: true,
        calories: true,
        imageUrl: true,
        equipmentRequired: true,
        targetMuscles: true,
        tags: true,
      },
      take: parseInt(limit as string),
      skip: parseInt(offset as string),
      orderBy: { name: 'asc' },
    });

    const total = await prisma.exercise.count({ where });

    res.json({
      exercises,
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

// Get single exercise
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const exercise = await prisma.exercise.findUnique({
      where: { id },
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
        equipmentOptional: true,
        targetMuscles: true,
        targetAreas: true,
        setupInstructions: true,
        executionNotes: true,
        safetyNotes: true,
        tags: true,
      },
    });

    if (!exercise) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Exercise not found',
      });
    }

    res.json({ exercise });
  } catch (error) {
    next(error);
  }
});

// Get exercise categories
router.get('/categories', async (req, res, next) => {
  try {
    const categories = await prisma.exercise.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: {
        category: true,
      },
    });

    res.json({
      categories: categories.map(cat => ({
        name: cat.category,
        count: cat._count.category,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Get exercise difficulties
router.get('/difficulties', async (req, res, next) => {
  try {
    const difficulties = await prisma.exercise.groupBy({
      by: ['difficulty'],
      where: { isActive: true },
      _count: {
        difficulty: true,
      },
    });

    res.json({
      difficulties: difficulties.map(diff => ({
        name: diff.difficulty,
        count: diff._count.difficulty,
      })),
    });
  } catch (error) {
    next(error);
  }
});

// Get exercise tags
router.get('/tags', async (req, res, next) => {
  try {
    const exercises = await prisma.exercise.findMany({
      where: { isActive: true },
      select: { tags: true },
    });

    const tagCounts: Record<string, number> = {};
    exercises.forEach(exercise => {
      exercise.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const tags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json({ tags });
  } catch (error) {
    next(error);
  }
});

// Get exercises by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const { category } = req.params;
    const { difficulty, limit = '20' } = req.query;

    const where: any = {
      category,
      isActive: true,
    };

    if (difficulty) where.difficulty = difficulty;

    const exercises = await prisma.exercise.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        difficulty: true,
        duration: true,
        calories: true,
        imageUrl: true,
        equipmentRequired: true,
        targetMuscles: true,
        tags: true,
      },
      take: parseInt(limit as string),
      orderBy: { name: 'asc' },
    });

    res.json({ exercises });
  } catch (error) {
    next(error);
  }
});

// Search exercises
router.get('/search', async (req, res, next) => {
  try {
    const { q, category, difficulty, limit = '20' } = req.query;

    if (!q) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Search query is required',
      });
    }

    const where: any = {
      isActive: true,
      OR: [
        { name: { contains: q as string, mode: 'insensitive' } },
        { description: { contains: q as string, mode: 'insensitive' } },
        { tags: { has: q as string } },
        { targetMuscles: { has: q as string } },
      ],
    };

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;

    const exercises = await prisma.exercise.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        difficulty: true,
        duration: true,
        calories: true,
        imageUrl: true,
        equipmentRequired: true,
        targetMuscles: true,
        tags: true,
      },
      take: parseInt(limit as string),
      orderBy: { name: 'asc' },
    });

    res.json({ exercises });
  } catch (error) {
    next(error);
  }
});

export default router;
