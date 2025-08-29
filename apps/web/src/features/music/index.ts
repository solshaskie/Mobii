// Music Module - Main Export
// This module handles all music and audio functionality including:
// - Background music during workouts
// - Playlist management
// - Audio controls and volume
// - Music recommendations

export { MusicService } from './services/music-service';

export type { MusicTrack, Playlist, MusicGenre } from './types';

// Feature gate for premium music features
export const musicFeatureGate = {
  isEnabled: (userId?: string) => {
    // TODO: Implement user-based feature checking
    // For now, always enabled for development
    return true;
  },
  requirePremium: true,
  features: {
    unlimitedMusicAccess: true,
    customPlaylists: true,
    highQualityAudio: true,
    musicRecommendations: true,
    offlineMusic: true,
  }
};
