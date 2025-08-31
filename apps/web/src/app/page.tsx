'use client';

import React from 'react';
import { HeroSection } from '../components/ui/hero-section';
import { Card, AnimatedButton, gradients } from '../components/ui/design-system';
import { 
  Camera, 
  Brain, 
  BarChart3, 
  Youtube, 
  User, 
  Target,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      title: 'Automated Photo Capture',
      description: 'AI-powered camera system with real-time form analysis and skeleton overlay',
      icon: Camera,
      href: '/automated-photo-capture',
      gradient: 'ocean' as keyof typeof gradients,
      badge: 'Camera AI'
    },
    {
      title: 'AI Movement Analysis',
      description: 'Advanced AI that analyzes your movements and provides real-time feedback',
      icon: Brain,
      href: '/ai-movement-analysis',
      gradient: 'royal' as keyof typeof gradients,
      badge: 'Movement AI'
    },
    {
      title: 'Enhanced Progress Tracking',
      description: 'Comprehensive progress tracking with photos, weight, and analytics',
      icon: BarChart3,
      href: '/progress-tracking',
      gradient: 'success' as keyof typeof gradients,
      badge: 'Progress'
    },
    {
      title: 'YouTube Video Summarization',
      description: 'AI-powered YouTube video analysis with workout summarization and narration',
      icon: Youtube,
      href: '/youtube-summarization',
      gradient: 'fire' as keyof typeof gradients,
      badge: 'YouTube AI'
    },
    {
      title: 'AI Personal Trainer',
      description: 'Choose from multiple AI trainer personalities with unique coaching styles',
      icon: User,
      href: '/ai-trainer-personality',
      gradient: 'primary' as keyof typeof gradients,
      badge: 'AI Trainer'
    },
    {
      title: 'Side-by-Side Training',
      description: 'Compare your form with reference videos in real-time',
      icon: Target,
      href: '/ai-trainer-personality',
      gradient: 'sunset' as keyof typeof gradients,
      badge: 'Training'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Revolutionary AI Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of fitness with cutting-edge AI technology that adapts to your needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-xl transition-all duration-300 group"
                  animation="slideUp"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${gradients[feature.gradient]} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                      {feature.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <Link href={feature.href}>
                    <AnimatedButton
                      variant="ghost"
                      className="group-hover:bg-gray-50 w-full justify-between"
                    >
                      <span>Try Now</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </AnimatedButton>
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the AI fitness revolution and experience personalized training like never before
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/ai-trainer-personality">
              <AnimatedButton
                size="lg"
                className="px-8 py-4 text-lg font-semibold bg-white text-blue-600 hover:bg-gray-100"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Your AI Journey
              </AnimatedButton>
            </Link>
            <Link href="/automated-photo-capture">
              <AnimatedButton
                variant="ghost"
                size="lg"
                className="px-8 py-4 text-lg font-semibold text-white border-2 border-white hover:bg-white hover:text-blue-600"
              >
                Try Camera AI
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
