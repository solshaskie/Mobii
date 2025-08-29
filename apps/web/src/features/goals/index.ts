// Goals Module - Main Export
// This module handles all goal management functionality including:
// - Goal setting and tracking
// - Progress monitoring
// - Achievement milestones
// - Goal recommendations

export { GoalManagement } from './components/goal-management';

// Feature gate for premium goals features
export const goalsFeatureGate = {
  isEnabled: (userId?: string) => {
    // TODO: Implement user-based feature checking
    // For now, always enabled for development
    return true;
  },
  requirePremium: true,
  features: {
    unlimitedGoals: true,
    advancedGoalTypes: true,
    goalTemplates: true,
    socialGoalSharing: true,
    goalAnalytics: true,
  }
};
