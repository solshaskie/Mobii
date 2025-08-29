// Dashboard Module - Main Export
// This module handles all dashboard functionality including:
// - Welcome messages and user onboarding
// - Dashboard statistics and metrics
// - Recent activity tracking
// - Today's workout suggestions

export { WelcomeMessage } from './components/welcome-message';
export { DashboardStats } from './components/dashboard-stats';
export { RecentActivity } from './components/recent-activity';
export { TodayWorkout } from './components/today-workout';

// Feature gate for premium dashboard features
export const dashboardFeatureGate = {
  isEnabled: (userId?: string) => {
    // TODO: Implement user-based feature checking
    // For now, always enabled for development
    return true;
  },
  requirePremium: true,
  features: {
    advancedAnalytics: true,
    customDashboard: true,
    dataExport: true,
    realTimeUpdates: true,
    personalizedInsights: true,
  }
};
