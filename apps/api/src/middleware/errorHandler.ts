import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError | ZodError | Prisma.PrismaClientKnownRequestError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return res.status(409).json({
          error: 'Conflict',
          message: 'A record with this unique field already exists',
        });
      case 'P2025':
        return res.status(404).json({
          error: 'Not Found',
          message: 'Record not found',
        });
      case 'P2003':
        return res.status(400).json({
          error: 'Bad Request',
          message: 'Foreign key constraint failed',
        });
      default:
        return res.status(500).json({
          error: 'Database Error',
          message: 'An unexpected database error occurred',
        });
    }
  }

  // Custom app errors
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      error: error.name || 'App Error',
      message: error.message,
    });
  }

  // Default error
  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : error.message,
  });
};

export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};
