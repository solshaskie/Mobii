'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardStats } from '@/components/dashboard/dashboard-stats';
import { TodayWorkout } from '@/components/dashboard/today-workout';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { WelcomeMessage } from '@/components/dashboard/welcome-message';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="container-responsive py-8">
        <div className="space-y-6">
          {/* Loading skeleton */}
          <div className="skeleton h-8 w-64 rounded-lg" />
          <div className="skeleton h-32 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-24 rounded-xl" />
            ))}
          </div>
          <div className="skeleton h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-responsive py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Welcome Message */}
        <WelcomeMessage />

        {/* Today's Workout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <TodayWorkout />
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DashboardStats />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <RecentActivity />
        </motion.div>
      </motion.div>
    </div>
  );
}
