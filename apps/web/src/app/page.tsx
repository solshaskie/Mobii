'use client';
import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@mobii/ui';
import { motion } from 'framer-motion';
import MobiiIntroScreen from '../components/ui/MobiiIntroScreen';
import Logo from '../components/ui/logo';
import BrandCard from '../components/ui/brand-card';
import {
  Dumbbell,
  Activity,
  Target,
  TrendingUp,
  Heart,
  Clock,
  Play,
  BarChart3,
  Zap,
  Award,
  Calendar,
  Users,
  CheckCircle,
  Flame,
  Youtube,
  Brain,
  User
} from 'lucide-react';

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return <MobiiIntroScreen onComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen bg-background-primary">
      <main className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <Logo variant="full" size="xl" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-text-primary mb-4">
            Transform Your Fitness with{' '}
            <span className="bg-gradient-to-r from-teal-400 to-purple-600 bg-clip-text text-transparent">
              AI-Powered Workouts
            </span>
          </h1>

          <p className="text-lg lg:text-xl text-text-muted mb-8 max-w-3xl mx-auto">
            Get personalized chair yoga and calisthenics routines tailored to your fitness level,
            goals, and preferences. Start your journey to better mobility, strength, and wellness.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-teal-400 to-purple-600 hover:from-teal-500 hover:to-purple-700"
              onClick={() => window.location.href = '/workouts'}
            >
              <Play className="mr-2 h-5 w-5" />
              Start Your Journey
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.href = '/analytics'}
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              View Progress
            </Button>
          </div>
        </motion.section>

        {/* Quick Stats */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <Card className="bg-gradient-to-br from-teal-400/10 to-teal-600/10 border-teal-400/20">
            <CardContent className="p-4 text-center">
              <Activity className="h-6 w-6 mx-auto mb-2 text-teal-400" />
              <div className="text-2xl font-bold text-text-primary">47</div>
              <div className="text-sm text-text-muted">Workouts</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-400/10 to-purple-600/10 border-purple-400/20">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold text-text-primary">1,240</div>
              <div className="text-sm text-text-muted">Minutes</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-400/10 to-orange-600/10 border-orange-400/20">
            <CardContent className="p-4 text-center">
              <Flame className="h-6 w-6 mx-auto mb-2 text-orange-400" />
              <div className="text-2xl font-bold text-text-primary">8,920</div>
              <div className="text-sm text-text-muted">Calories</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-yellow-400/20">
            <CardContent className="p-4 text-center">
              <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold text-text-primary">8</div>
              <div className="text-sm text-text-muted">Day Streak</div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12"
        >
          <BrandCard
            title="AI-Powered Workouts"
            icon={<Activity className="h-5 w-5" />}
            variant="gradient"
          >
            <p className="text-text-muted mb-4">
              Get intelligent workout recommendations based on your fitness level, goals, and progress.
            </p>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => window.location.href = '/ai-generator'}
            >
              Explore AI Features
            </Button>
          </BrandCard>

          <BrandCard
            title="Chair Yoga & Calisthenics"
            icon={<Dumbbell className="h-5 w-5" />}
            variant="gradient"
          >
            <p className="text-text-muted mb-4">
              Accessible exercises that build strength, flexibility, and mobility from the comfort of your chair.
            </p>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => window.location.href = '/workouts'}
            >
              Browse Workouts
            </Button>
          </BrandCard>

          <BrandCard
            title="Progress Tracking"
            icon={<TrendingUp className="h-5 w-5" />}
            variant="gradient"
          >
            <p className="text-text-muted mb-4">
              Monitor your fitness journey with detailed analytics and achievement tracking.
            </p>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => window.location.href = '/analytics'}
            >
              View Analytics
            </Button>
          </BrandCard>

          <BrandCard
            title="YouTube Video Summarization"
            icon={<Youtube className="h-5 w-5" />}
            variant="gradient"
          >
            <p className="text-text-muted mb-4">
              Transform any YouTube fitness video into an AI-narrated workout session with personalized instructions.
            </p>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => window.location.href = '/youtube-summarization'}
            >
              Try Video Summarization
            </Button>
          </BrandCard>

          <BrandCard
            title="AI Movement Analysis"
            icon={<Brain className="h-5 w-5" />}
            variant="gradient"
          >
            <p className="text-text-muted mb-4">
              Revolutionary AI that analyzes any fitness video and automatically classifies exercises with real-time form feedback.
            </p>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => window.location.href = '/ai-movement-analysis'}
            >
              Try AI Movement Analysis
            </Button>
          </BrandCard>

          <BrandCard
            title="AI Personal Trainer"
            icon={<User className="h-5 w-5" />}
            variant="gradient"
          >
            <p className="text-text-muted mb-4">
              Choose your AI trainer personality and let them take complete control of your workout planning and coaching.
            </p>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => window.location.href = '/ai-trainer-personality'}
            >
              Meet Your AI Trainer
            </Button>
          </BrandCard>

          <BrandCard
            title="Personalized Goals"
            icon={<Target className="h-5 w-5" />}
            variant="gradient"
          >
            <p className="text-text-muted mb-4">
              Set and achieve fitness milestones with AI-driven goal recommendations.
            </p>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => window.location.href = '/goals'}
            >
              Set Goals
            </Button>
          </BrandCard>

          <BrandCard
            title="Health Monitoring"
            icon={<Heart className="h-5 w-5" />}
            variant="gradient"
          >
            <p className="text-text-muted mb-4">
              Track vital metrics and get insights into your overall health and wellness.
            </p>
            <Button variant="ghost" className="w-full">
              Monitor Health
            </Button>
          </BrandCard>

          <BrandCard
            title="Flexible Scheduling"
            icon={<Calendar className="h-5 w-5" />}
            variant="gradient"
          >
            <p className="text-text-muted mb-4">
              Workouts that fit your schedule, from quick 5-minute sessions to comprehensive routines.
            </p>
            <Button variant="ghost" className="w-full">
              Schedule Workout
            </Button>
          </BrandCard>
        </motion.section>

        {/* Recent Activity */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">First Steps</div>
                    <div className="text-sm text-text-muted">Completed first workout</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">Week Warrior</div>
                    <div className="text-sm text-text-muted">7 workouts in a week</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-background-secondary rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">Time Master</div>
                    <div className="text-sm text-text-muted">1000+ minutes completed</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Enhanced Features Showcase */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Enhanced Progress Tracking Features
            </h2>
            <p className="text-lg text-text-muted max-w-3xl mx-auto">
              Explore our advanced progress tracking capabilities with AI-powered insights and comprehensive analytics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/enhanced-profile-demo'}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Enhanced Profile</h3>
                <p className="text-text-muted mb-4">
                  Comprehensive fitness profile management with privacy controls, fitness assessments, and data export.
                </p>
                <Button variant="outline" className="w-full">
                  View Demo
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/enhanced-weight-tracking-demo'}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Enhanced Weight Tracking</h3>
                <p className="text-text-muted mb-4">
                  AI-powered weight predictions, insights, analytics, and comprehensive goal management.
                </p>
                <Button variant="outline" className="w-full">
                  View Demo
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.location.href = '/enhanced-progress-photos-demo'}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">Enhanced Progress Photos</h3>
                <p className="text-text-muted mb-4">
                  AI analysis, session organization, privacy controls, and comprehensive progress analytics.
                </p>
                <Button variant="outline" className="w-full">
                  View Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Call to Action */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-teal-400/10 to-purple-600/10 border-teal-400/20">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-text-primary mb-4">
                Ready to Transform Your Fitness?
              </h2>
              <p className="text-lg text-text-muted mb-6 max-w-2xl mx-auto">
                Join thousands of users who have already improved their mobility, strength, and overall wellness with Mobii.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-400 to-purple-600 hover:from-teal-500 hover:to-purple-700"
                  onClick={() => window.location.href = '/workouts'}
                >
                  Get Started Today
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
    </div>
  );
}
