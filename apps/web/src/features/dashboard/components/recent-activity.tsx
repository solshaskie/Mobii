'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@mobii/ui';
import { Badge } from '@mobii/ui';
import { 
  Clock, 
  Target, 
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'workout' | 'goal' | 'achievement';
  title: string;
  description: string;
  time: string;
  duration?: string;
  calories?: number;
  icon: React.ReactNode;
  color: string;
}

export function RecentActivity() {
  // Mock data - in a real app, this would come from the API
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'workout',
      title: 'Chair Yoga Flow',
      description: 'Completed 15-minute morning session',
      time: '2 hours ago',
      duration: '15 min',
      calories: 85,
      icon: <Activity className="h-4 w-4" />,
      color: 'text-accent-green'
    },
    {
      id: '2',
      type: 'goal',
      title: 'Weekly Goal Achieved',
      description: 'Completed 5 workouts this week',
      time: '1 day ago',
      icon: <Target className="h-4 w-4" />,
      color: 'text-accent-purple'
    },
    {
      id: '3',
      type: 'workout',
      title: 'Core Strength Training',
      description: 'Completed 20-minute core session',
      time: '2 days ago',
      duration: '20 min',
      calories: 120,
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'text-accent-blue'
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Consistency Badge',
      description: 'Worked out 7 days in a row',
      time: '3 days ago',
      icon: <Calendar className="h-4 w-4" />,
      color: 'text-accent-orange'
    }
  ];

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'workout':
        return <Badge variant="default" className="text-xs">Workout</Badge>;
      case 'goal':
        return <Badge variant="secondary" className="text-xs">Goal</Badge>;
      case 'achievement':
        return <Badge variant="outline" className="text-xs">Achievement</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold text-text-primary">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-background-tertiary transition-colors duration-200"
            >
              <div className={`p-2 rounded-lg bg-background-tertiary ${activity.color}`}>
                {activity.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-text-primary truncate">
                    {activity.title}
                  </h4>
                  {getActivityBadge(activity.type)}
                </div>
                <p className="text-xs text-text-muted mb-2">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-muted">
                    {activity.time}
                  </span>
                  <div className="flex items-center space-x-2">
                    {activity.duration && (
                      <div className="flex items-center space-x-1 text-xs text-text-muted">
                        <Clock className="h-3 w-3" />
                        <span>{activity.duration}</span>
                      </div>
                    )}
                    {activity.calories && (
                      <div className="flex items-center space-x-1 text-xs text-text-muted">
                        <span>{activity.calories} cal</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <button className="w-full text-sm text-accent hover:text-accent/80 transition-colors duration-200">
            View All Activity
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
