'use client';

import OpenAI from 'openai';

export interface AITrainerPersonality {
  id: string;
  name: string;
  title: string;
  personality: string;
  specialties: string[];
  intensity: 'low' | 'medium' | 'high' | 'very_high';
  catchphrase: string;
  coachingStyle: {
    motivation: 'encouraging' | 'tough' | 'calm' | 'energetic';
    feedback: 'detailed' | 'simple' | 'technical' | 'casual';
    pace: 'slow' | 'moderate' | 'fast';
  };
}

export interface WorkoutRequest {
  trainerId: string;
  userGoals: string[];
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  availableTime: number;
  equipment: string[];
  targetMuscles?: string[];
  preferences?: {
    workoutType?: string;
    intensity?: string;
    focus?: string;
  };
}

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  instructions: string[];
  targetMuscles: string[];
  difficulty: string;
  formTips: string[];
}

export interface GeneratedWorkout {
  id: string;
  trainer: AITrainerPersonality;
  name: string;
  description: string;
  duration: number;
  difficulty: string;
  exercises: WorkoutExercise[];
  warmup: string[];
  cooldown: string[];
  tips: string[];
  motivationalMessage: string;
}

export interface RealTimeFeedback {
  type: 'form' | 'motivation';
  message: string;
  urgency: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export class AITrainerService {
  private openai: OpenAI;
  private trainers: AITrainerPersonality[];

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true
    });

    this.trainers = [
      {
        id: 'sarah',
        name: 'Sarah',
        title: 'Mindful Movement Specialist',
        personality: 'Sarah is a certified yoga instructor who focuses on proper form, breathing, and mind-body connection.',
        specialties: ['yoga', 'pilates', 'mindfulness', 'flexibility'],
        intensity: 'low',
        catchphrase: 'Breathe deeply, move mindfully, transform completely.',
        coachingStyle: {
          motivation: 'calm',
          feedback: 'detailed',
          pace: 'slow'
        }
      },
      {
        id: 'mike',
        name: 'Mike',
        title: 'Strength & Performance Coach',
        personality: 'Mike is a former professional athlete who believes in building functional strength and pushing limits.',
        specialties: ['strength training', 'powerlifting', 'functional fitness'],
        intensity: 'high',
        catchphrase: 'Strength isn\'t just physical - it\'s mental. Let\'s build both.',
        coachingStyle: {
          motivation: 'tough',
          feedback: 'technical',
          pace: 'fast'
        }
      },
      {
        id: 'zena',
        name: 'Zena',
        title: 'Cardio & HIIT Queen',
        personality: 'Zena is an energetic fitness enthusiast who loves high-intensity workouts and making fitness fun.',
        specialties: ['HIIT', 'cardio', 'dance fitness', 'weight loss'],
        intensity: 'high',
        catchphrase: 'Sweat is your fat crying! Let\'s make it rain!',
        coachingStyle: {
          motivation: 'encouraging',
          feedback: 'simple',
          pace: 'fast'
        }
      },
      {
        id: 'tyson',
        name: 'Tyson',
        title: 'Boxing & Combat Fitness Expert',
        personality: 'Tyson is a former boxing champion who focuses on boxing fitness and building confidence.',
        specialties: ['boxing', 'kickboxing', 'self-defense', 'core strength'],
        intensity: 'medium',
        catchphrase: 'Every punch is progress. Every round makes you stronger.',
        coachingStyle: {
          motivation: 'encouraging',
          feedback: 'simple',
          pace: 'moderate'
        }
      }
    ];
  }

  getTrainers(): AITrainerPersonality[] {
    return this.trainers;
  }

  getTrainer(trainerId: string): AITrainerPersonality | null {
    return this.trainers.find(trainer => trainer.id === trainerId) || null;
  }

  async generateWorkout(request: WorkoutRequest): Promise<GeneratedWorkout> {
    const trainer = this.getTrainer(request.trainerId);
    if (!trainer) {
      throw new Error('Trainer not found');
    }

    const prompt = `
Create a ${request.availableTime}-minute workout for a ${request.fitnessLevel} level user.

Trainer: ${trainer.name} - ${trainer.personality}
Goals: ${request.userGoals.join(', ')}
Equipment: ${request.equipment.join(', ')}

Include warmup, main exercises, and cooldown. Match the trainer's coaching style.
`;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert fitness trainer creating personalized workouts. Respond with detailed, actionable workout plans that match the trainer's personality and coaching style."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const response = completion.choices[0]?.message?.content;
      return this.parseWorkoutResponse(response || '', trainer, request);
    } catch (error) {
      console.error('Error generating workout:', error);
      return this.generateFallbackWorkout(trainer, request);
    }
  }

  // Generate real-time coaching feedback
  async generateFeedback(
    trainerId: string,
    exercise: string,
    formQuality: number,
    userProgress: any
  ): Promise<RealTimeFeedback> {
    const trainer = this.getTrainer(trainerId);
    if (!trainer) {
      throw new Error('Trainer not found');
    }

    const prompt = `
      As ${trainer.name}, the ${trainer.title}, provide real-time coaching feedback for a user doing ${exercise}.
      
      Form quality: ${formQuality}/100
      Trainer personality: ${trainer.personality}
      Coaching style: ${trainer.coachingStyle.motivation}, ${trainer.coachingStyle.feedback}
      
      Provide one specific, actionable piece of feedback that matches your coaching style.
      Keep it under 100 words and make it encouraging but helpful.
    `;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a fitness trainer providing real-time coaching feedback. Be encouraging, specific, and match the trainer's personality."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 150
      });

      const response = completion.choices[0]?.message?.content;
      
      return {
        type: formQuality < 70 ? 'form' : 'motivation',
        message: response || trainer.catchphrase,
        urgency: formQuality < 60 ? 'high' : formQuality < 80 ? 'medium' : 'low',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Error generating feedback:', error);
      return {
        type: 'motivation',
        message: trainer.catchphrase,
        urgency: 'low',
        timestamp: new Date()
      };
    }
  }

  // Generate motivational messages
  async generateMotivation(trainerId: string, context: string): Promise<string> {
    const trainer = this.getTrainer(trainerId);
    if (!trainer) {
      return 'Keep pushing forward!';
    }

    const prompt = `
      As ${trainer.name}, the ${trainer.title}, provide a motivational message for: ${context}
      
      Personality: ${trainer.personality}
      Style: ${trainer.coachingStyle.motivation}
      Catchphrase: ${trainer.catchphrase}
      
      Keep it under 50 words and make it inspiring.
    `;

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a motivational fitness trainer. Provide inspiring, personalized messages."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.9,
        max_tokens: 100
      });

      return completion.choices[0]?.message?.content || trainer.catchphrase;
    } catch (error) {
      console.error('Error generating motivation:', error);
      return trainer.catchphrase;
    }
  }

  // Build workout generation prompt
  private buildWorkoutPrompt(request: WorkoutRequest, trainer: AITrainerPersonality): string {
    return `
      Create a personalized workout for a user with the following details:
      
      TRAINER: ${trainer.name} - ${trainer.title}
      Personality: ${trainer.personality}
      Specialties: ${trainer.specialties.join(', ')}
      Coaching Style: ${trainer.coachingStyle.motivation}, ${trainer.coachingStyle.feedback}, ${trainer.coachingStyle.pace}
      
      USER GOALS: ${request.userGoals.join(', ')}
      FITNESS LEVEL: ${request.fitnessLevel}
      AVAILABLE TIME: ${request.availableTime} minutes
      EQUIPMENT: ${request.equipment.join(', ')}
      TARGET MUSCLES: ${request.targetMuscles?.join(', ') || 'general'}
      
      PREFERENCES:
      - Workout Type: ${request.preferences?.workoutType || 'mixed'}
      - Intensity: ${request.preferences?.intensity || 'medium'}
      - Focus: ${request.preferences?.focus || 'general_fitness'}
      
      Create a detailed workout plan that:
      1. Matches the trainer's personality and coaching style
      2. Includes warmup, main exercises, and cooldown
      3. Provides specific instructions for each exercise
      4. Includes form tips and variations
      5. Ends with a motivational message from the trainer
      
      Format the response as a structured workout plan with clear sections.
    `;
  }

  // Parse AI response into structured workout
  private parseWorkoutResponse(
    response: string,
    trainer: AITrainerPersonality,
    request: WorkoutRequest
  ): GeneratedWorkout {
    // This is a simplified parser - in a real implementation, you'd want more robust parsing
    const exercises: WorkoutExercise[] = [
      {
        name: 'Dynamic Stretching',
        sets: 1,
        reps: '5 minutes',
        rest: 'none',
        instructions: ['Start with arm circles', 'Follow with leg swings', 'Include hip rotations'],
        targetMuscles: ['full body'],
        difficulty: 'beginner',
        formTips: ['Move slowly and controlled', 'Don\'t force any movements']
      }
    ];

    return {
      id: `workout_${Date.now()}`,
      trainer,
      name: `${trainer.name}'s ${request.preferences?.workoutType || 'Mixed'} Workout`,
      description: `A personalized ${request.availableTime}-minute workout designed by ${trainer.name} to help you achieve your fitness goals.`,
      duration: request.availableTime,
      difficulty: request.fitnessLevel,
      exercises,
      warmup: ['5 minutes of light cardio', 'Dynamic stretching'],
      cooldown: ['Static stretching', 'Deep breathing exercises'],
      tips: ['Listen to your body', 'Maintain proper form', 'Stay hydrated'],
      motivationalMessage: trainer.catchphrase
    };
  }

  // Fallback workout if AI generation fails
  private generateFallbackWorkout(trainer: AITrainerPersonality, request: WorkoutRequest): GeneratedWorkout {
    const exercises: WorkoutExercise[] = [
      {
        name: 'Bodyweight Squats',
        sets: 3,
        reps: '12-15',
        rest: '60 seconds',
        instructions: ['Stand with feet shoulder-width apart', 'Lower your body as if sitting back', 'Keep your chest up'],
        targetMuscles: ['quads', 'glutes', 'hamstrings'],
        difficulty: 'beginner',
        formTips: ['Keep knees behind toes', 'Engage your core']
      },
      {
        name: 'Push-ups',
        sets: 3,
        reps: '8-12',
        rest: '60 seconds',
        instructions: ['Start in plank position', 'Lower your body', 'Push back up'],
        targetMuscles: ['chest', 'triceps', 'shoulders'],
        difficulty: 'intermediate',
        formTips: ['Keep your body straight', 'Engage your core']
      }
    ];

    return {
      id: `fallback_${Date.now()}`,
      trainer,
      name: `${trainer.name}'s Quick Workout`,
      description: `A solid ${request.availableTime}-minute workout.`,
      duration: request.availableTime,
      difficulty: request.fitnessLevel,
      exercises,
      warmup: ['5 minutes of light cardio'],
      cooldown: ['Stretching'],
      tips: ['Focus on form', 'Take breaks as needed'],
      motivationalMessage: trainer.catchphrase
    };
  }
}
