'use client';

// Remove OpenAI import and replace with local workout generation
// import OpenAI from 'openai';

export interface AITrainerPersonality {
  id: string;
  name: string;
  title: string;
  personality: string;
  specialties: string[];
  intensity: 'low' | 'medium' | 'high' | 'very_high';
  catchphrase: string;
  coachingStyle: {
    motivation: 'encouraging' | 'direct' | 'calm';
    feedback: 'simple' | 'detailed' | 'technical';
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

export class AITrainerService {
  // Remove OpenAI dependency
  // private openai: OpenAI;
  private trainers: AITrainerPersonality[];

  constructor() {
    // Remove OpenAI initialization
    // this.openai = new OpenAI({
    //   apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    //   dangerouslyAllowBrowser: true
    // });

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
          motivation: 'direct',
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

    // Generate workout locally without API calls
    return this.generateLocalWorkout(trainer, request);
  }

  private generateLocalWorkout(trainer: AITrainerPersonality, request: WorkoutRequest): GeneratedWorkout {
    const exercises = this.getExercisesForTrainer(trainer, request);
    
    return {
      id: `workout_${Date.now()}`,
      trainer,
      name: `${trainer.name}'s ${request.availableTime}-Minute Workout`,
      description: `A personalized ${request.availableTime}-minute workout designed by ${trainer.name} to help you achieve your fitness goals.`,
      duration: request.availableTime,
      difficulty: request.fitnessLevel,
      exercises,
      warmup: this.getWarmupForTrainer(trainer),
      cooldown: this.getCooldownForTrainer(trainer),
      tips: this.getTipsForTrainer(trainer),
      motivationalMessage: trainer.catchphrase
    };
  }

  private getExercisesForTrainer(trainer: AITrainerPersonality, request: WorkoutRequest): WorkoutExercise[] {
    const exerciseLibrary = {
      sarah: [
        {
          name: 'Chair Cat-Cow Stretch',
          sets: 1,
          reps: '10 breaths',
          rest: '30 seconds',
          instructions: ['Sit tall in your chair', 'Inhale and arch your back', 'Exhale and round your back'],
          targetMuscles: ['core', 'back'],
          difficulty: 'beginner',
          formTips: ['Keep your feet flat on the ground', 'Move slowly with your breath']
        },
        {
          name: 'Seated Spinal Twist',
          sets: 2,
          reps: '5 each side',
          rest: '30 seconds',
          instructions: ['Sit tall', 'Place right hand on left knee', 'Twist to the left', 'Hold for 3 breaths'],
          targetMuscles: ['core', 'back'],
          difficulty: 'beginner',
          formTips: ['Keep your hips facing forward', 'Breathe deeply']
        }
      ],
      mike: [
        {
          name: 'Chair Squats',
          sets: 3,
          reps: '12-15',
          rest: '60 seconds',
          instructions: ['Stand in front of chair', 'Lower yourself slowly', 'Just before sitting, stand back up'],
          targetMuscles: ['quads', 'glutes'],
          difficulty: 'intermediate',
          formTips: ['Keep your chest up', 'Don\'t let knees go past toes']
        },
        {
          name: 'Push-ups (Modified)',
          sets: 3,
          reps: '8-12',
          rest: '60 seconds',
          instructions: ['Place hands on chair seat', 'Lower your body', 'Push back up'],
          targetMuscles: ['chest', 'triceps'],
          difficulty: 'intermediate',
          formTips: ['Keep your body straight', 'Engage your core']
        }
      ],
      zena: [
        {
          name: 'Jumping Jacks',
          sets: 3,
          reps: '30 seconds',
          rest: '30 seconds',
          instructions: ['Stand with feet together', 'Jump feet apart', 'Raise arms overhead', 'Jump back to start'],
          targetMuscles: ['full body'],
          difficulty: 'intermediate',
          formTips: ['Land softly', 'Keep moving throughout']
        },
        {
          name: 'Mountain Climbers',
          sets: 3,
          reps: '20 each leg',
          rest: '30 seconds',
          instructions: ['Start in plank position', 'Drive knees toward chest', 'Alternate legs quickly'],
          targetMuscles: ['core', 'shoulders'],
          difficulty: 'intermediate',
          formTips: ['Keep your core engaged', 'Maintain plank position']
        }
      ],
      tyson: [
        {
          name: 'Shadow Boxing',
          sets: 3,
          reps: '60 seconds',
          rest: '30 seconds',
          instructions: ['Stand in boxing stance', 'Throw jabs and crosses', 'Move around lightly'],
          targetMuscles: ['shoulders', 'arms', 'core'],
          difficulty: 'beginner',
          formTips: ['Keep your guard up', 'Stay light on your feet']
        },
        {
          name: 'Boxing Footwork',
          sets: 2,
          reps: '45 seconds',
          rest: '30 seconds',
          instructions: ['Bounce on balls of feet', 'Move forward and back', 'Side to side movement'],
          targetMuscles: ['calves', 'quads'],
          difficulty: 'beginner',
          formTips: ['Stay on balls of feet', 'Keep movements quick']
        }
      ]
    };

    return exerciseLibrary[trainer.id as keyof typeof exerciseLibrary] || exerciseLibrary.sarah;
  }

  private getWarmupForTrainer(trainer: AITrainerPersonality): string[] {
    const warmups = {
      sarah: ['5 minutes of gentle breathing', 'Neck and shoulder rolls', 'Seated spinal twists'],
      mike: ['5 minutes of light cardio', 'Dynamic stretching', 'Joint mobility exercises'],
      zena: ['5 minutes of jumping jacks', 'High knees in place', 'Arm circles'],
      tyson: ['5 minutes of shadow boxing', 'Footwork drills', 'Shoulder rolls']
    };

    return warmups[trainer.id as keyof typeof warmups] || warmups.sarah;
  }

  private getCooldownForTrainer(trainer: AITrainerPersonality): string[] {
    const cooldowns = {
      sarah: ['Gentle stretching', 'Deep breathing exercises', 'Meditation'],
      mike: ['Static stretching', 'Foam rolling', 'Cool-down walk'],
      zena: ['Light stretching', 'Walking in place', 'Deep breathing'],
      tyson: ['Gentle stretching', 'Shadow boxing slowly', 'Deep breathing']
    };

    return cooldowns[trainer.id as keyof typeof cooldowns] || cooldowns.sarah;
  }

  private getTipsForTrainer(trainer: AITrainerPersonality): string[] {
    const tips = {
      sarah: ['Focus on your breath', 'Move mindfully', 'Listen to your body'],
      mike: ['Maintain proper form', 'Push your limits safely', 'Stay consistent'],
      zena: ['Keep the energy high', 'Have fun with it', 'Stay hydrated'],
      tyson: ['Keep your guard up', 'Stay light on your feet', 'Focus on technique']
    };

    return tips[trainer.id as keyof typeof tips] || tips.sarah;
  }
}
