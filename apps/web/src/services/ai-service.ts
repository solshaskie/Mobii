// Local type definitions to avoid import issues
interface WorkoutPreferences {
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
}

interface GeneratedWorkout {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: string;
  calories: number;
  exerciseCount: number;
  focusAreas: string[];
  exercises: {
    name: string;
    description: string;
    duration: number;
    sets: number;
    reps: string | number;
    category: string;
  }[];
}

export class AIService {
  private huggingFaceKey = process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY;
  private geminiKey = process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY;
  private perplexityKey = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY;

  // Primary AI provider - Hugging Face (most generous free tier)
  async generateWorkout(preferences: WorkoutPreferences): Promise<GeneratedWorkout> {
    try {
      // Try Hugging Face first
      if (this.huggingFaceKey) {
        return await this.generateWithHuggingFace(preferences);
      }
      
      // Fallback to Google Gemini
      if (this.geminiKey) {
        return await this.generateWithGemini(preferences);
      }
      
      // Fallback to Perplexity
      if (this.perplexityKey) {
        return await this.generateWithPerplexity(preferences);
      }
      
      // If no AI keys available, return a smart default workout
      return this.generateDefaultWorkout(preferences);
      
    } catch (error) {
      console.error('AI generation failed, using default workout:', error);
      return this.generateDefaultWorkout(preferences);
    }
  }

  private async generateWithHuggingFace(preferences: WorkoutPreferences): Promise<GeneratedWorkout> {
    const prompt = this.createWorkoutPrompt(preferences);
    
    const response = await fetch('https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.huggingFaceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 500,
          temperature: 0.7,
          do_sample: true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const data = await response.json();
    return this.parseWorkoutResponse(data[0]?.generated_text || '', preferences);
  }

  private async generateWithGemini(preferences: WorkoutPreferences): Promise<GeneratedWorkout> {
    const prompt = this.createWorkoutPrompt(preferences);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return this.parseWorkoutResponse(generatedText, preferences);
  }

  private async generateWithPerplexity(preferences: WorkoutPreferences): Promise<GeneratedWorkout> {
    const prompt = this.createWorkoutPrompt(preferences);
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.perplexityKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{
          role: 'user',
          content: prompt
        }],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content || '';
    return this.parseWorkoutResponse(generatedText, preferences);
  }

  private createWorkoutPrompt(preferences: WorkoutPreferences): string {
    return `Generate a ${preferences.duration}-minute ${preferences.difficulty} chair yoga and calisthenics workout focusing on ${preferences.focusAreas.join(', ')}. 
    
    Requirements:
    - Duration: ${preferences.duration} minutes
    - Difficulty: ${preferences.difficulty}
    - Focus areas: ${preferences.focusAreas.join(', ')}
    - Equipment: Chair-based exercises
    - Format: JSON with title, description, exercises array, and calories estimate
    
    Please provide a structured workout that's safe and effective for the specified fitness level.`;
  }

  private parseWorkoutResponse(response: string, preferences: WorkoutPreferences): GeneratedWorkout {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          id: `ai-${Date.now()}`,
          title: parsed.title || `AI Generated ${preferences.difficulty} Workout`,
          description: parsed.description || `A personalized ${preferences.difficulty} workout`,
          duration: preferences.duration,
          difficulty: preferences.difficulty,
          calories: parsed.calories || Math.round(preferences.duration * 4.5),
          exerciseCount: parsed.exercises?.length || 8,
          focusAreas: preferences.focusAreas,
          exercises: parsed.exercises || this.getDefaultExercises(preferences)
        };
      }
    } catch (error) {
      console.warn('Failed to parse AI response as JSON, using default:', error);
    }

    // Fallback to default workout
    return this.generateDefaultWorkout(preferences);
  }

  private generateDefaultWorkout(preferences: WorkoutPreferences): GeneratedWorkout {
    const exercises = this.getDefaultExercises(preferences);
    
    return {
      id: `default-${Date.now()}`,
      title: `Smart ${preferences.difficulty} Workout`,
      description: `A personalized ${preferences.difficulty} workout focusing on ${preferences.focusAreas.join(', ')}`,
      duration: preferences.duration,
      difficulty: preferences.difficulty,
      calories: Math.round(preferences.duration * 4.5),
      exerciseCount: exercises.length,
      focusAreas: preferences.focusAreas,
      exercises: exercises
    };
  }

  private getDefaultExercises(preferences: WorkoutPreferences) {
    const baseExercises = [
      {
        name: 'Seated Deep Breathing',
        description: 'Sit tall, inhale deeply through nose, exhale slowly through mouth',
        duration: 60,
        sets: 1,
        reps: '5 breaths',
        category: 'Warmup'
      },
      {
        name: 'Seated Neck Stretches',
        description: 'Gently tilt head side to side, forward and back',
        duration: 45,
        sets: 1,
        reps: '5 each direction',
        category: 'Warmup'
      },
      {
        name: 'Seated Shoulder Rolls',
        description: 'Roll shoulders forward and backward in circular motion',
        duration: 45,
        sets: 1,
        reps: '10 each direction',
        category: 'Warmup'
      },
      {
        name: 'Seated Arm Circles',
        description: 'Make small circles with arms, gradually increasing size',
        duration: 60,
        sets: 2,
        reps: '10 each direction',
        category: 'Upper Body'
      },
      {
        name: 'Seated Knee Lifts',
        description: 'Lift knees alternately while sitting tall',
        duration: 60,
        sets: 2,
        reps: '15 each leg',
        category: 'Lower Body'
      },
      {
        name: 'Seated Side Bends',
        description: 'Lean to each side while keeping back straight',
        duration: 45,
        sets: 2,
        reps: '8 each side',
        category: 'Core'
      },
      {
        name: 'Seated Leg Extensions',
        description: 'Extend legs straight out, hold, then lower',
        duration: 60,
        sets: 2,
        reps: '12 each leg',
        category: 'Lower Body'
      },
      {
        name: 'Seated Cat-Cow Stretch',
        description: 'Round and arch back while seated',
        duration: 45,
        sets: 1,
        reps: '8 cycles',
        category: 'Core'
      }
    ];

    // Filter exercises based on focus areas
    const focusAreaMap: { [key: string]: string[] } = {
      'Upper Body': ['Upper Body'],
      'Lower Body': ['Lower Body'],
      'Core': ['Core'],
      'Flexibility': ['Warmup'],
      'Strength': ['Upper Body', 'Lower Body', 'Core'],
      'Balance': ['Core', 'Lower Body']
    };

    const relevantCategories = preferences.focusAreas.flatMap(area => 
      focusAreaMap[area] || ['Warmup']
    );

    return baseExercises.filter(exercise => 
      relevantCategories.includes(exercise.category)
    ).slice(0, Math.min(8, Math.ceil(preferences.duration / 5)));
  }

  // Additional AI features
  async generateMotivationalMessage(): Promise<string> {
    const messages = [
      "You're doing amazing! Every movement counts towards your goals.",
      "Your body is capable of incredible things. Keep pushing forward!",
      "Remember: progress, not perfection. You've got this!",
      "Each workout makes you stronger, both physically and mentally.",
      "You're building a healthier, stronger version of yourself today.",
      "Consistency beats intensity. You're showing up, and that's what matters!",
      "Your future self will thank you for this workout.",
      "You're not just exercising, you're investing in your wellbeing."
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }

  async analyzeFormFeedback(exerciseName: string, feedback: string): Promise<string> {
    // Simple form analysis - in a real app, this would use computer vision
    const commonFeedback = {
      'Seated Deep Breathing': 'Focus on breathing from your diaphragm, not your chest.',
      'Seated Neck Stretches': 'Move slowly and gently. Don\'t force the stretch.',
      'Seated Shoulder Rolls': 'Keep your movements smooth and controlled.',
      'Seated Arm Circles': 'Start small and gradually increase the circle size.',
      'Seated Knee Lifts': 'Keep your back straight and engage your core.',
      'Seated Side Bends': 'Don\'t lean forward or backward, just to the side.',
      'Seated Leg Extensions': 'Point your toes and engage your thigh muscles.',
      'Seated Cat-Cow Stretch': 'Move with your breath for better flow.'
    };

    return commonFeedback[exerciseName as keyof typeof commonFeedback] || 
           'Keep good form and listen to your body.';
  }
}
