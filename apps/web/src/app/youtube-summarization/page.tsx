'use client';

import React from 'react';
import { YouTubeSummarization } from '../../features/youtube-summarization/components/youtube-summarization';

export default function YouTubeSummarizationPage() {
  return (
    <div className="min-h-screen bg-background-primary">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        <YouTubeSummarization />
      </div>
    </div>
  );
}
