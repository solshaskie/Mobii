'use client';

import React, { useState } from 'react';
import { AITrainerPersonality } from '../../features/ai-movement-analysis/components/ai-trainer-personality';
import { SideBySideTrainer } from '../../features/ai-movement-analysis/components/side-by-side-trainer';

export default function AITrainerPersonalityPage() {
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);

  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {!selectedTrainer ? (
          <AITrainerPersonality onTrainerSelect={setSelectedTrainer} />
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-text-primary mb-4">
                🎯 Training with {selectedTrainer.name}
              </h1>
              <p className="text-lg text-text-muted mb-6">
                Your AI personal trainer is ready to guide you through your workout!
              </p>
            </div>
            <SideBySideTrainer />
          </div>
        )}
      </div>
    </div>
  );
}
