import OpenAI from 'openai';

export interface AITrainerPersonality {
  id: string;
  name: string;
  title: string;
  personality: string;
  specialties: string[];
  intensity: 'low' | 'medium' | 'high';
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
          motivation: 'energetic',
          feedback: 'casual',
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
            content: "You are an expert fitness trainer creating personalized workouts."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      const response = completion.choices[0]?.message?.content;
      return this.parseWorkoutResponse(response || '', trainer, request);
    } catch (error) {
      console.error('Error generating workout:', error);
      return this.generateFallbackWorkout(trainer, request);
    }
  }

  private parseWorkoutResponse(response: string, trainer: AITrainerPersonality, request: WorkoutRequest): GeneratedWorkout {
    const exercises: WorkoutExercise[] = [
      {
        name: 'Bodyweight Squats',
        sets: 3,
        reps: '12-15',
        rest: '60 seconds',
        instructions: ['Stand with feet shoulder-width apart', 'Lower your body', 'Keep your chest up'],
        targetMuscles: ['quads', 'glutes'],
        difficulty: 'beginner',
        formTips: ['Keep knees behind toes', 'Engage your core']
      }
    ];

    return {
      id: `workout_${Date.now()}`,
      trainer,
      name: `${trainer.name}'s Workout`,
      description: `A ${request.availableTime}-minute workout designed by ${trainer.name}.`,
      duration: request.availableTime,
      difficulty: request.fitnessLevel,
      exercises,
      warmup: ['5 minutes of light cardio'],
      cooldown: ['Stretching'],
      tips: ['Focus on form', 'Stay hydrated'],
      motivationalMessage: trainer.catchphrase
    };
  }

  private generateFallbackWorkout(trainer: AITrainerPersonality, request: WorkoutRequest): GeneratedWorkout {
    return {
      id: `fallback_${Date.now()}`,
      trainer,
      name: `${trainer.name}'s Quick Workout`,
      description: `A solid ${request.availableTime}-minute workout.`,
      duration: request.availableTime,
      difficulty: request.fitnessLevel,
      exercises: [],
      warmup: ['5 minutes of light cardio'],
      cooldown: ['Stretching'],
      tips: ['Focus on form'],
      motivationalMessage: trainer.catchphrase
    };
  }
}
