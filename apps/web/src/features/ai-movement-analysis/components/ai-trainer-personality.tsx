'use client';

import React, { useState } from 'react';
import { Button } from '@mobii/ui';
import { Brain, Target, Clock, Dumbbell, Sparkles } from 'lucide-react';
import { AITrainerService } from '../services/ai-trainer-service';
import type { AITrainerPersonality, WorkoutRequest, GeneratedWorkout } from '../services/ai-trainer-service';

interface AITrainerPersonalityProps {
  onTrainerSelect: (trainer: any) => void;
}

export const AITrainerPersonalitySelector: React.FC<AITrainerPersonalityProps> = ({ onTrainerSelect }) => {
  const [selectedTrainer, setSelectedTrainer] = useState<AITrainerPersonality | null>(null);
  const [userGoals, setUserGoals] = useState<string>('');
  const [fitnessLevel, setFitnessLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [availableTime, setAvailableTime] = useState<number>(30);
  const [equipment, setEquipment] = useState<string[]>(['bodyweight']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<GeneratedWorkout | null>(null);

  const aiTrainerService = new AITrainerService();
  const trainers = aiTrainerService.getTrainers();

  const equipmentOptions = [
    { id: 'bodyweight', label: 'Bodyweight Only', icon: '💪' },
    { id: 'dumbbells', label: 'Dumbbells', icon: '🏋️' },
    { id: 'resistance_bands', label: 'Resistance Bands', icon: '🎯' },
    { id: 'yoga_mat', label: 'Yoga Mat', icon: '🧘' },
    { id: 'pull_up_bar', label: 'Pull-up Bar', icon: '🏃' }
  ];

  const handleTrainerSelect = (trainer: AITrainerPersonality) => {
    setSelectedTrainer(trainer);
  };

  const handleEquipmentToggle = (equipmentId: string) => {
    setEquipment(prev => 
      prev.includes(equipmentId) 
        ? prev.filter(id => id !== equipmentId)
        : [...prev, equipmentId]
    );
  };

  const generateWorkout = async () => {
    if (!selectedTrainer || !userGoals.trim()) {
      alert('Please select a trainer and enter your goals');
      return;
    }

    setIsGenerating(true);
    try {
      const request: WorkoutRequest = {
        trainerId: selectedTrainer.id,
        userGoals: userGoals.split(',').map(goal => goal.trim()),
        fitnessLevel,
        availableTime,
        equipment
      };

      const workout = await aiTrainerService.generateWorkout(request);
      setGeneratedWorkout(workout);
      
      // Pass the trainer and workout to parent component
      onTrainerSelect({
        trainer: selectedTrainer,
        workout: workout
      });
    } catch (error) {
      console.error('Error generating workout:', error);
      alert('Failed to generate workout. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🤖 Choose Your AI Personal Trainer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Each trainer has a unique personality, coaching style, and expertise. 
          Select the one that matches your fitness goals and preferences.
        </p>
      </div>

      {/* Trainer Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            onClick={() => handleTrainerSelect(trainer)}
            className={`relative cursor-pointer rounded-xl p-6 transition-all duration-300 ${
              selectedTrainer?.id === trainer.id
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white hover:shadow-lg border-2 border-gray-200 hover:border-blue-300'
            }`}
          >
            {selectedTrainer?.id === trainer.id && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-2xl ${
                selectedTrainer?.id === trainer.id ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {trainer.name.charAt(0)}
              </div>
              
              <h3 className="font-bold text-lg mb-1">{trainer.name}</h3>
              <p className={`text-sm mb-3 ${
                selectedTrainer?.id === trainer.id ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {trainer.title}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center space-x-1">
                  <Target className="w-3 h-3" />
                  <span className={selectedTrainer?.id === trainer.id ? 'text-blue-100' : 'text-gray-600'}>
                    {trainer.specialties.slice(0, 2).join(', ')}
                  </span>
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  trainer.intensity === 'high' ? 'bg-red-100 text-red-800' :
                  trainer.intensity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {trainer.intensity.toUpperCase()} Intensity
                </div>
              </div>
              
              <p className={`text-xs mt-3 italic ${
                selectedTrainer?.id === trainer.id ? 'text-blue-100' : 'text-gray-400'
              }`}>
                "{trainer.catchphrase}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Workout Configuration */}
      {selectedTrainer && (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-blue-500" />
            Configure Your Workout with {selectedTrainer.name}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Goals and Level */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What are your fitness goals?
                </label>
                <textarea
                  value={userGoals}
                  onChange={(e) => setUserGoals(e.target.value)}
                  placeholder="e.g., Build strength, lose weight, improve flexibility, increase endurance"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fitness Level
                </label>
                <select
                  value={fitnessLevel}
                  onChange={(e) => setFitnessLevel(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            {/* Time and Equipment */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Available Time (minutes)
                </label>
                <select
                  value={availableTime}
                  onChange={(e) => setAvailableTime(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Dumbbell className="w-4 h-4 mr-1" />
                  Available Equipment
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {equipmentOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleEquipmentToggle(option.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
                        equipment.includes(option.id)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Generate Button */}
          <div className="mt-6 text-center">
            <Button
              onClick={generateWorkout}
              disabled={isGenerating || !userGoals.trim()}
              className="px-8 py-3 text-lg font-semibold"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {selectedTrainer.name} is creating your workout...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Workout with {selectedTrainer.name}
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Generated Workout Preview */}
      {generatedWorkout && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            🎉 Your Personalized Workout is Ready!
          </h3>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-lg mb-2">{generatedWorkout.name}</h4>
            <p className="text-gray-600 mb-3">{generatedWorkout.description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>⏱️ {generatedWorkout.duration} minutes</span>
              <span>📊 {generatedWorkout.difficulty} level</span>
              <span>💪 {generatedWorkout.exercises.length} exercises</span>
            </div>
            <p className="mt-3 text-sm italic text-gray-600">
              "{generatedWorkout.motivationalMessage}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
