'use client';

import React from 'react';
import { AIMovementAnalyzer } from '../../features/ai-movement-analysis/components/ai-movement-analyzer';

export default function AIMovementAnalysisPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <AIMovementAnalyzer />
      </div>
    </div>
  );
}
