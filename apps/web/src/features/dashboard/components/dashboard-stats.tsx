'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@mobii/ui';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Flame,
  Activity,
  Calendar
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

function StatCard({ title, value, icon, trend, color = 'text-accent' }: StatCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-text-muted">
          {title}
        </CardTitle>
        <div className={`h-4 w-4 ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-text-primary">{value}</div>
        {trend && (
          <p className="text-xs text-text-muted mt-1">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  // Mock data - in a real app, this would come from the API
  const stats = [
    {
      title: 'Weekly Workouts',
      value: '5',
      icon: <Activity className="h-4 w-4" />,
      trend: '+2 from last week',
      color: 'text-accent-green'
    },
    {
      title: 'Total Minutes',
      value: '180',
      icon: <Clock className="h-4 w-4" />,
      trend: '+45 from last week',
      color: 'text-accent-blue'
    },
    {
      title: 'Calories Burned',
      value: '1,240',
      icon: <Flame className="h-4 w-4" />,
      trend: '+320 from last week',
      color: 'text-accent-orange'
    },
    {
      title: 'Goal Progress',
      value: '78%',
      icon: <Target className="h-4 w-4" />,
      trend: 'On track for monthly goal',
      color: 'text-accent-purple'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">Your Progress</h2>
        <div className="text-sm text-text-muted">
          Last 7 days
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
