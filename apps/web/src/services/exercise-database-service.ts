// Comprehensive exercise database service
import { ExerciseDBService } from './exercisedb-service';
import { YouTubeService } from './youtube-service';
import { AIService } from './ai-service';

export class ExerciseDatabaseService {
  private exerciseDB: ExerciseDBService;
  private youtubeService: YouTubeService;
  private aiService: AIService;

  constructor() {
    this.exerciseDB = new ExerciseDBService();
    this.youtubeService = new YouTubeService();
    this.aiService = new AIService();
  }

  // Core chair exercise database
  private coreChairExercises = [
    {
      id: 'chair-breathing',
      name: 'Seated Deep Breathing',
      category: 'Warmup',
      difficulty: 'beginner',
      targetMuscles: ['Diaphragm', 'Core'],
      instructions: [
        'Sit tall in your chair with feet flat on the floor',
        'Place your hands on your belly',
        'Inhale deeply through your nose, feeling your belly expand',
        'Exhale slowly through your mouth',
        'Repeat 5-10 times'
      ],
      youtubeSearch: 'seated deep breathing chair yoga',
      duration: 60,
      sets: 1,
      reps: '5-10 breaths'
    },
    {
      id: 'chair-neck-stretches',
      name: 'Seated Neck Stretches',
      category: 'Warmup',
      difficulty: 'beginner',
      targetMuscles: ['Neck', 'Upper Trapezius'],
      instructions: [
        'Sit tall with your back straight',
        'Slowly tilt your head to the right',
        'Hold for 10-15 seconds',
        'Return to center',
        'Tilt to the left and repeat',
        'Do 3-5 repetitions each side'
      ],
      youtubeSearch: 'seated neck stretches chair exercise',
      duration: 45,
      sets: 1,
      reps: '3-5 each side'
    },
    {
      id: 'chair-shoulder-rolls',
      name: 'Seated Shoulder Rolls',
      category: 'Warmup',
      difficulty: 'beginner',
      targetMuscles: ['Shoulders', 'Upper Back'],
      instructions: [
        'Sit tall with arms relaxed at your sides',
        'Slowly roll your shoulders forward in a circular motion',
        'Do 5-10 forward rolls',
        'Then roll your shoulders backward',
        'Do 5-10 backward rolls'
      ],
      youtubeSearch: 'seated shoulder rolls chair exercise',
      duration: 45,
      sets: 1,
      reps: '5-10 each direction'
    },
    {
      id: 'chair-arm-circles',
      name: 'Seated Arm Circles',
      category: 'Strength',
      difficulty: 'beginner',
      targetMuscles: ['Shoulders', 'Arms'],
      instructions: [
        'Sit tall with arms extended to the sides',
        'Make small circles with your arms',
        'Gradually increase the size of the circles',
        'Do 10-15 forward circles',
        'Then do 10-15 backward circles'
      ],
      youtubeSearch: 'seated arm circles chair exercise',
      duration: 60,
      sets: 2,
      reps: '10-15 each direction'
    },
    {
      id: 'chair-knee-lifts',
      name: 'Seated Knee Lifts',
      category: 'Strength',
      difficulty: 'beginner',
      targetMuscles: ['Quadriceps', 'Core'],
      instructions: [
        'Sit tall with feet flat on the floor',
        'Lift your right knee toward your chest',
        'Hold for 2-3 seconds',
        'Lower slowly',
        'Repeat with left knee',
        'Do 10-15 repetitions each leg'
      ],
      youtubeSearch: 'seated knee lifts chair exercise',
      duration: 60,
      sets: 2,
      reps: '10-15 each leg'
    },
    {
      id: 'chair-side-bends',
      name: 'Seated Side Bends',
      category: 'Strength',
      difficulty: 'beginner',
      targetMuscles: ['Core', 'Obliques'],
      instructions: [
        'Sit tall with arms at your sides',
        'Lean to the right, sliding your right hand down your leg',
        'Hold for 5-10 seconds',
        'Return to center',
        'Lean to the left and repeat',
        'Do 8-10 repetitions each side'
      ],
      youtubeSearch: 'seated side bends chair exercise',
      duration: 45,
      sets: 2,
      reps: '8-10 each side'
    },
    {
      id: 'chair-leg-extensions',
      name: 'Seated Leg Extensions',
      category: 'Strength',
      difficulty: 'beginner',
      targetMuscles: ['Quadriceps'],
      instructions: [
        'Sit tall with feet flat on the floor',
        'Extend your right leg straight out',
        'Point your toes and hold for 3-5 seconds',
        'Lower slowly',
        'Repeat with left leg',
        'Do 12-15 repetitions each leg'
      ],
      youtubeSearch: 'seated leg extensions chair exercise',
      duration: 60,
      sets: 2,
      reps: '12-15 each leg'
    },
    {
      id: 'chair-cat-cow',
      name: 'Seated Cat-Cow Stretch',
      category: 'Warmup',
      difficulty: 'beginner',
      targetMuscles: ['Spine', 'Core'],
      instructions: [
        'Sit tall with hands on your knees',
        'Inhale and arch your back, lifting your chest (cow pose)',
        'Exhale and round your back, tucking your chin (cat pose)',
        'Move slowly and smoothly with your breath',
        'Do 8-10 cycles'
      ],
      youtubeSearch: 'seated cat cow stretch chair yoga',
      duration: 45,
      sets: 1,
      reps: '8-10 cycles'
    },
    {
      id: 'chair-twists',
      name: 'Seated Spinal Twists',
      category: 'Warmup',
      difficulty: 'beginner',
      targetMuscles: ['Spine', 'Core'],
      instructions: [
        'Sit tall with feet flat on the floor',
        'Place your right hand on your left knee',
        'Gently twist to the left',
        'Hold for 10-15 seconds',
        'Return to center',
        'Repeat on the other side'
      ],
      youtubeSearch: 'seated spinal twists chair yoga',
      duration: 45,
      sets: 1,
      reps: '3-5 each side'
    },
    {
      id: 'chair-heel-raises',
      name: 'Seated Heel Raises',
      category: 'Strength',
      difficulty: 'beginner',
      targetMuscles: ['Calves'],
      instructions: [
        'Sit tall with feet flat on the floor',
        'Lift your heels off the floor',
        'Hold for 2-3 seconds',
        'Lower slowly',
        'Do 15-20 repetitions'
      ],
      youtubeSearch: 'seated heel raises chair exercise',
      duration: 45,
      sets: 2,
      reps: '15-20'
    }
  ];

  // Get core exercise database
  async getCoreExercises(): Promise<any[]> {
    return this.coreChairExercises;
  }

  // Get exercise with full details (ExerciseDB + YouTube + AI)
  async getExerciseWithDetails(exerciseId: string): Promise<any> {
    try {
      // Get core exercise data
      const coreExercise = this.coreChairExercises.find(ex => ex.id === exerciseId);
      if (!coreExercise) {
        throw new Error('Exercise not found');
      }

      // Get ExerciseDB data if available
      let exerciseDBData = null;
      try {
        const exerciseDBResults = await this.exerciseDB.searchExercises(coreExercise.name);
        if (exerciseDBResults.length > 0) {
          exerciseDBData = this.exerciseDB.transformExerciseData(exerciseDBResults[0]);
        }
      } catch (error) {
        console.warn('ExerciseDB data not available, using core data');
      }

      // Get YouTube video
      let youtubeVideo = null;
      try {
        youtubeVideo = await this.youtubeService.searchExerciseVideo(
          coreExercise.youtubeSearch || coreExercise.name,
          coreExercise.difficulty
        );
      } catch (error) {
        console.warn('YouTube video not available');
      }

      // Generate AI coaching tips
      let aiCoaching = null;
      try {
        aiCoaching = await this.aiService.analyzeFormFeedback(
          coreExercise.name,
          'Provide coaching tips for proper form'
        );
      } catch (error) {
        console.warn('AI coaching not available');
      }

      // Combine all data
      return {
        ...coreExercise,
        exerciseDB: exerciseDBData,
        youtubeVideo: youtubeVideo,
        aiCoaching: aiCoaching,
        fullInstructions: this.generateFullInstructions(coreExercise, exerciseDBData, aiCoaching)
      };
    } catch (error) {
      console.error('Failed to get exercise details:', error);
      return null;
    }
  }

  // Get exercises by category
  async getExercisesByCategory(category: string): Promise<any[]> {
    return this.coreChairExercises.filter(exercise => exercise.category === category);
  }

  // Get exercises by difficulty
  async getExercisesByDifficulty(difficulty: string): Promise<any[]> {
    return this.coreChairExercises.filter(exercise => exercise.difficulty === difficulty);
  }

  // Search exercises
  async searchExercises(query: string): Promise<any[]> {
    const searchTerm = query.toLowerCase();
    return this.coreChairExercises.filter(exercise => 
      exercise.name.toLowerCase().includes(searchTerm) ||
      exercise.targetMuscles.some(muscle => muscle.toLowerCase().includes(searchTerm)) ||
      exercise.category.toLowerCase().includes(searchTerm)
    );
  }

  // Generate workout from core exercises
  async generateWorkoutFromCore(preferences: any): Promise<any> {
    const { duration, difficulty, focusAreas } = preferences;
    
    // Filter exercises based on preferences
    let availableExercises = this.coreChairExercises;
    
    if (difficulty !== 'all') {
      availableExercises = availableExercises.filter(ex => ex.difficulty === difficulty);
    }

    // Calculate how many exercises we need
    const avgExerciseTime = 3; // minutes per exercise
    const numExercises = Math.min(Math.ceil(duration / avgExerciseTime), availableExercises.length);
    
    // Select exercises
    const selectedExercises = this.selectExercises(availableExercises, numExercises, focusAreas);
    
    // Calculate total duration
    const totalDuration = selectedExercises.reduce((sum, ex) => sum + ex.duration, 0);
    
    return {
      id: `core-${Date.now()}`,
      title: `Core ${difficulty} Chair Workout`,
      description: `A structured ${difficulty} workout using proven chair exercises`,
      duration: Math.ceil(totalDuration / 60), // Convert to minutes
      difficulty: difficulty,
      calories: Math.round(totalDuration / 60 * 4.5),
      exerciseCount: selectedExercises.length,
      focusAreas: focusAreas,
      exercises: selectedExercises,
      source: 'core-database'
    };
  }

  // Select exercises based on focus areas
  private selectExercises(exercises: any[], count: number, focusAreas: string[]): any[] {
    const selected: any[] = [];
    const categories = ['Warmup', 'Strength', 'Balance'];
    
    // Always include warmup exercises
    const warmupExercises = exercises.filter(ex => ex.category === 'Warmup');
    selected.push(...warmupExercises.slice(0, 2));
    
    // Add strength exercises based on focus areas
    const strengthExercises = exercises.filter(ex => ex.category === 'Strength');
    const remainingSlots = count - selected.length;
    
    if (remainingSlots > 0) {
      selected.push(...strengthExercises.slice(0, remainingSlots));
    }
    
    return selected.slice(0, count);
  }

  // Generate comprehensive instructions
  private generateFullInstructions(coreExercise: any, exerciseDBData: any, aiCoaching: string): string[] {
    const instructions = [...coreExercise.instructions];
    
    // Add ExerciseDB instructions if available
    if (exerciseDBData?.instructions) {
      instructions.push(...exerciseDBData.instructions);
    }
    
    // Add AI coaching if available
    if (aiCoaching) {
      instructions.push(`💡 Coaching Tip: ${aiCoaching}`);
    }
    
    // Add safety reminders
    instructions.push('⚠️ Stop if you feel any pain or discomfort');
    instructions.push('🔄 Breathe naturally throughout the exercise');
    
    return instructions;
  }

  // Get exercise statistics
  getExerciseStats(): any {
    const stats = {
      totalExercises: this.coreChairExercises.length,
      byCategory: {},
      byDifficulty: {},
      byTargetMuscle: {}
    };

    this.coreChairExercises.forEach(exercise => {
      // Count by category
      stats.byCategory[exercise.category] = (stats.byCategory[exercise.category] || 0) + 1;
      
      // Count by difficulty
      stats.byDifficulty[exercise.difficulty] = (stats.byDifficulty[exercise.difficulty] || 0) + 1;
      
      // Count by target muscle
      exercise.targetMuscles.forEach(muscle => {
        stats.byTargetMuscle[muscle] = (stats.byTargetMuscle[muscle] || 0) + 1;
      });
    });

    return stats;
  }
}
