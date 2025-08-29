// ExerciseDB service for structured exercise data
export class ExerciseDBService {
  private apiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
  private baseUrl = 'https://exercisedb.p.rapidapi.com';

  constructor() {
    if (!this.apiKey) {
      console.warn('ExerciseDB API key not found. Exercise database features will be disabled.');
    }
  }

  // Get all exercises
  async getAllExercises(): Promise<any[]> {
    try {
      if (!this.apiKey) {
        return [];
      }

      const response = await fetch(`${this.baseUrl}/exercises`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`ExerciseDB API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch exercises:', error);
      return [];
    }
  }

  // Search exercises by name
  async searchExercises(name: string): Promise<any[]> {
    try {
      if (!this.apiKey) {
        return [];
      }

      const response = await fetch(`${this.baseUrl}/exercises/name/${encodeURIComponent(name)}`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`ExerciseDB API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to search exercises:', error);
      return [];
    }
  }

  // Get exercises by body part
  async getExercisesByBodyPart(bodyPart: string): Promise<any[]> {
    try {
      if (!this.apiKey) {
        return [];
      }

      const response = await fetch(`${this.baseUrl}/exercises/bodyPart/${bodyPart}`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`ExerciseDB API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch exercises by body part:', error);
      return [];
    }
  }

  // Get exercises by target muscle
  async getExercisesByTarget(target: string): Promise<any[]> {
    try {
      if (!this.apiKey) {
        return [];
      }

      const response = await fetch(`${this.baseUrl}/exercises/target/${target}`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`ExerciseDB API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch exercises by target:', error);
      return [];
    }
  }

  // Get exercise by ID
  async getExerciseById(id: string): Promise<any> {
    try {
      if (!this.apiKey) {
        return null;
      }

      const response = await fetch(`${this.baseUrl}/exercises/exercise/${id}`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`ExerciseDB API error: ${response.status}`);
      }

      const exercises = await response.json();
      return exercises[0] || null;
    } catch (error) {
      console.error('Failed to fetch exercise by ID:', error);
      return null;
    }
  }

  // Get body parts list
  async getBodyParts(): Promise<string[]> {
    try {
      if (!this.apiKey) {
        return [];
      }

      const response = await fetch(`${this.baseUrl}/exercises/bodyPartList`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`ExerciseDB API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch body parts:', error);
      return [];
    }
  }

  // Get target muscles list
  async getTargetMuscles(): Promise<string[]> {
    try {
      if (!this.apiKey) {
        return [];
      }

      const response = await fetch(`${this.baseUrl}/exercises/targetList`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`ExerciseDB API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch target muscles:', error);
      return [];
    }
  }

  // Get equipment list
  async getEquipment(): Promise<string[]> {
    try {
      if (!this.apiKey) {
        return [];
      }

      const response = await fetch(`${this.baseUrl}/exercises/equipmentList`, {
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
        }
      });

      if (!response.ok) {
        throw new Error(`ExerciseDB API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
      return [];
    }
  }

  // Get chair-specific exercises (custom filter)
  async getChairExercises(): Promise<any[]> {
    try {
      if (!this.apiKey) {
        return this.getDefaultChairExercises();
      }

      // Search for chair-related exercises
      const chairKeywords = ['chair', 'seated', 'sitting'];
      let chairExercises: any[] = [];

      for (const keyword of chairKeywords) {
        const exercises = await this.searchExercises(keyword);
        chairExercises = [...chairExercises, ...exercises];
      }

      // Remove duplicates and filter for chair exercises
      const uniqueExercises = chairExercises.filter((exercise, index, self) => 
        index === self.findIndex(e => e.id === exercise.id)
      );

      return uniqueExercises.length > 0 ? uniqueExercises : this.getDefaultChairExercises();
    } catch (error) {
      console.error('Failed to fetch chair exercises:', error);
      return this.getDefaultChairExercises();
    }
  }

  // Default chair exercises (fallback)
  private getDefaultChairExercises(): any[] {
    return [
      {
        id: 'chair-001',
        name: 'Seated Deep Breathing',
        target: 'diaphragm',
        bodyPart: 'chest',
        equipment: 'chair',
        gifUrl: '/images/exercises/seated-breathing.gif',
        instructions: [
          'Sit tall in your chair with feet flat on the floor',
          'Place your hands on your belly',
          'Inhale deeply through your nose, feeling your belly expand',
          'Exhale slowly through your mouth',
          'Repeat 5-10 times'
        ]
      },
      {
        id: 'chair-002',
        name: 'Seated Neck Stretches',
        target: 'neck',
        bodyPart: 'neck',
        equipment: 'chair',
        gifUrl: '/images/exercises/neck-stretches.gif',
        instructions: [
          'Sit tall with your back straight',
          'Slowly tilt your head to the right',
          'Hold for 10-15 seconds',
          'Return to center',
          'Tilt to the left and repeat',
          'Do 3-5 repetitions each side'
        ]
      },
      {
        id: 'chair-003',
        name: 'Seated Shoulder Rolls',
        target: 'shoulders',
        bodyPart: 'shoulders',
        equipment: 'chair',
        gifUrl: '/images/exercises/shoulder-rolls.gif',
        instructions: [
          'Sit tall with arms relaxed at your sides',
          'Slowly roll your shoulders forward in a circular motion',
          'Do 5-10 forward rolls',
          'Then roll your shoulders backward',
          'Do 5-10 backward rolls'
        ]
      },
      {
        id: 'chair-004',
        name: 'Seated Arm Circles',
        target: 'shoulders',
        bodyPart: 'shoulders',
        equipment: 'chair',
        gifUrl: '/images/exercises/arm-circles.gif',
        instructions: [
          'Sit tall with arms extended to the sides',
          'Make small circles with your arms',
          'Gradually increase the size of the circles',
          'Do 10-15 forward circles',
          'Then do 10-15 backward circles'
        ]
      },
      {
        id: 'chair-005',
        name: 'Seated Knee Lifts',
        target: 'quadriceps',
        bodyPart: 'upper legs',
        equipment: 'chair',
        gifUrl: '/images/exercises/knee-lifts.gif',
        instructions: [
          'Sit tall with feet flat on the floor',
          'Lift your right knee toward your chest',
          'Hold for 2-3 seconds',
          'Lower slowly',
          'Repeat with left knee',
          'Do 10-15 repetitions each leg'
        ]
      }
    ];
  }

  // Transform ExerciseDB data to app format
  transformExerciseData(exercise: any): any {
    return {
      id: exercise.id,
      name: exercise.name,
      target: exercise.target,
      bodyPart: exercise.bodyPart,
      equipment: exercise.equipment,
      gifUrl: exercise.gifUrl,
      instructions: exercise.instructions || [],
      secondaryMuscles: exercise.secondaryMuscles || [],
      category: this.categorizeExercise(exercise),
      difficulty: this.assessDifficulty(exercise),
      duration: this.estimateDuration(exercise)
    };
  }

  private categorizeExercise(exercise: any): string {
    const name = exercise.name.toLowerCase();
    const target = exercise.target.toLowerCase();

    if (name.includes('breathing') || name.includes('stretch')) {
      return 'Warmup';
    } else if (name.includes('lift') || name.includes('push') || name.includes('pull')) {
      return 'Strength';
    } else if (name.includes('balance') || name.includes('coordination')) {
      return 'Balance';
    } else {
      return 'General';
    }
  }

  private assessDifficulty(exercise: any): string {
    const name = exercise.name.toLowerCase();
    const instructions = exercise.instructions?.length || 0;

    if (name.includes('basic') || name.includes('simple') || instructions <= 3) {
      return 'beginner';
    } else if (name.includes('advanced') || instructions >= 8) {
      return 'advanced';
    } else {
      return 'intermediate';
    }
  }

  private estimateDuration(exercise: any): number {
    const instructions = exercise.instructions?.length || 5;
    return Math.max(30, instructions * 15); // 15 seconds per instruction, minimum 30 seconds
  }
}
