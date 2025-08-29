// Analytics Module - Main Export
// This module handles all analytics and reporting functionality including:
// - Progress analytics and insights
// - Performance tracking
// - Data visualization
// - Trend analysis

export { AnalyticsDashboard } from './components/analytics-dashboard';

// Feature gate for premium analytics features
export const analyticsFeatureGate = {
  isEnabled: (userId?: string) => {
    // TODO: Implement user-based feature checking
    // For now, always enabled for development
    return true;
  },
  requirePremium: true,
  features: {
    advancedCharts: true,
    dataExport: true,
    customReports: true,
    trendAnalysis: true,
    predictiveInsights: true,
  }
};
