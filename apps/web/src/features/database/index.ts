// Database Module - Main Export
// This module handles all database and data persistence functionality including:
// - Supabase integration
// - Data synchronization
// - User data management
// - Analytics and reporting

export { SupabaseService } from './services/supabase-service';

export type { DatabaseConfig, UserData, WorkoutData, ProgressData } from './types';

// Feature gate for premium database features
export const databaseFeatureGate = {
  isEnabled: (userId?: string) => {
    // TODO: Implement user-based feature checking
    // For now, always enabled for development
    return true;
  },
  requirePremium: true,
  features: {
    unlimitedStorage: true,
    dataExport: true,
    advancedAnalytics: true,
    dataBackup: true,
    crossDeviceSync: true,
  }
};
