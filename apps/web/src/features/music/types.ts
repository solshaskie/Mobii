// Music Module Types

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  url: string;
  thumbnail?: string;
  genre: MusicGenre;
  bpm?: number;
  energy?: number; // 0-1 scale
  mood?: 'energetic' | 'calm' | 'motivational' | 'relaxing' | 'intense';
  isExplicit?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: MusicTrack[];
  totalDuration: number;
  genre?: MusicGenre;
  mood?: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type MusicGenre = 
  | 'pop'
  | 'rock'
  | 'hip-hop'
  | 'electronic'
  | 'classical'
  | 'jazz'
  | 'country'
  | 'r&b'
  | 'reggae'
  | 'folk'
  | 'blues'
  | 'metal'
  | 'punk'
  | 'indie'
  | 'ambient'
  | 'workout'
  | 'meditation'
  | 'focus';

export interface MusicPreferences {
  favoriteGenres: MusicGenre[];
  preferredBPM: {
    min: number;
    max: number;
  };
  energyLevel: 'low' | 'medium' | 'high';
  mood: string[];
  explicitContent: boolean;
  autoPlay: boolean;
  crossfade: boolean;
  volume: number; // 0-1
}

export interface MusicQueue {
  currentTrack: MusicTrack | null;
  nextTracks: MusicTrack[];
  previousTracks: MusicTrack[];
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
}
