'use client';

import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@mobii/ui';
import { Brain, Heart, Shield, Sparkles, Flame, Play, Loader2, Crown } from 'lucide-react';

interface AITrainerPersonalityProps {
  onTrainerSelect: (trainer: any) => void;
  className?: string;
}

export const AITrainerPersonality: React.FC<AITrainerPersonalityProps> = ({ 
  onTrainerSelect,
  className = '' 
}) => {
  const [selectedTrainer, setSelectedTrainer] = useState<string>('');
  const [letTrainerChoose, setLetTrainerChoose] = useState(false);
  const [userGoals, setUserGoals] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const aiTrainers = [
    {
      id: 'sarah',
      name: 'Sarah',
      title: 'The Motivational Coach',
      personality: 'Enthusiastic and encouraging',
      specialties: ['Weight loss', 'Cardio', 'Motivation'],
      intensity: 'High',
      catchphrase: "You've got this! Let's crush those goals together! 💪"
    },
    {
      id: 'mike',
      name: 'Mike',
      title: 'The Strength Specialist',
      personality: 'Serious and focused on form',
      specialties: ['Strength training', 'Muscle building', 'Form correction'],
      intensity: 'Medium-High',
      catchphrase: "Form first, strength follows. Let's build something amazing! 🏋️"
    },
    {
      id: 'zena',
      name: 'Zena',
      title: 'The Wellness Guide',
      personality: 'Calm and mindful',
      specialties: ['Yoga', 'Flexibility', 'Mind-body connection'],
      intensity: 'Low-Medium',
      catchphrase: "Breathe, move, and find your inner strength. Namaste! 🧘‍♀️"
    },
    {
      id: 'tyson',
      name: 'Tyson',
      title: 'The Boxing Coach',
      personality: 'Intense and passionate',
      specialties: ['Boxing', 'HIIT', 'Power training'],
      intensity: 'Very High',
      catchphrase: "Time to unleash the beast! Let's get those gloves on! 🥊"
    }
  ];

  const handleLetTrainerChoose = async () => {
    if (!selectedTrainer || !userGoals.trim()) {
      alert('Please select a trainer and describe your goals');
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const trainer = aiTrainers.find(t => t.id === selectedTrainer);
      onTrainerSelect(trainer);
    } catch (error) {
      console.error('Error generating workout:', error);
      alert('Failed to generate workout. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-4">
          🤖 Choose Your AI Personal Trainer
        </h2>
        <p className="text-lg text-text-muted mb-6">
          Let your AI trainer take control and create the perfect workout for you
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Select Your AI Trainer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aiTrainers.map((trainer) => (
              <div
                key={trainer.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 ${
                  selectedTrainer === trainer.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedTrainer(trainer.id)}
              >
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-lg text-text-primary">{trainer.name}</h3>
                    <p className="text-sm font-medium text-primary">{trainer.title}</p>
                  </div>
                  
                  <p className="text-sm text-text-muted">{trainer.personality}</p>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-text-muted">Specialties:</span>
                      <p className="text-sm text-text-primary">{trainer.specialties.join(', ')}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs font-medium text-text-muted">Intensity:</span>
                      <span className="text-sm text-text-primary">{trainer.intensity}</span>
                    </div>
                  </div>

                  <div className="bg-background-secondary p-3 rounded-lg">
                    <p className="text-sm italic text-text-muted">"{trainer.catchphrase}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Let Your AI Trainer Choose Everything
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="let-trainer-choose"
              checked={letTrainerChoose}
              onChange={(e) => setLetTrainerChoose(e.target.checked)}
              className="w-4 h-4 text-primary bg-background-secondary border-border rounded focus:ring-primary"
            />
            <label htmlFor="let-trainer-choose" className="text-sm font-medium text-text-primary">
              Let my AI trainer choose my workout, exercises, and training plan
            </label>
          </div>

          {letTrainerChoose && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Tell your trainer about your goals:
                </label>
                <Input
                  placeholder="e.g., 'I want to lose weight and get stronger', 'I need to improve my flexibility'"
                  value={userGoals}
                  onChange={(e) => setUserGoals(e.target.value)}
                  className="w-full"
                />
              </div>

              <Button
                onClick={handleLetTrainerChoose}
                disabled={!selectedTrainer || !userGoals.trim() || isGenerating}
                className="w-full flex items-center gap-2"
                size="lg"
              >
                {isGenerating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
                {isGenerating ? 'Creating Your Perfect Workout...' : 'Let My Trainer Choose My Workout'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
