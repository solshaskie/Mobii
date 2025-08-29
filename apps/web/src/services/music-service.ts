// Music service for workout background music
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: 'motivational' | 'calm' | 'energetic' | 'focus' | 'recovery';
  duration: number;
  url: string;
  bpm?: number;
}

export class MusicService {
  private audio: HTMLAudioElement | null = null;
  private currentTrack: MusicTrack | null = null;
  private isPlaying = false;
  private volume = 0.5;
  private playlist: MusicTrack[] = [];

  // Sample workout music tracks (in a real app, these would come from a music API)
  private sampleTracks: MusicTrack[] = [
    {
      id: '1',
      title: 'Workout Motivation',
      artist: 'Fitness Beats',
      genre: 'motivational',
      duration: 180,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder
      bpm: 140
    },
    {
      id: '2',
      title: 'Calm Flow',
      artist: 'Yoga Vibes',
      genre: 'calm',
      duration: 240,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder
      bpm: 80
    },
    {
      id: '3',
      title: 'Energy Boost',
      artist: 'Power Music',
      genre: 'energetic',
      duration: 200,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder
      bpm: 160
    },
    {
      id: '4',
      title: 'Focus Zone',
      artist: 'Concentration',
      genre: 'focus',
      duration: 300,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder
      bpm: 120
    },
    {
      id: '5',
      title: 'Recovery Time',
      artist: 'Relaxation',
      genre: 'recovery',
      duration: 180,
      url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', // Placeholder
      bpm: 60
    }
  ];

  constructor() {
    this.playlist = [...this.sampleTracks];
  }

  // Get tracks by genre
  getTracksByGenre(genre: MusicTrack['genre']): MusicTrack[] {
    return this.sampleTracks.filter(track => track.genre === genre);
  }

  // Get all tracks
  getAllTracks(): MusicTrack[] {
    return this.sampleTracks;
  }

  // Create custom playlist
  createPlaylist(tracks: MusicTrack[]): void {
    this.playlist = [...tracks];
  }

  // Play a specific track
  async playTrack(track: MusicTrack): Promise<void> {
    try {
      if (this.audio) {
        this.audio.pause();
        this.audio = null;
      }

      this.audio = new Audio(track.url);
      this.audio.volume = this.volume;
      this.currentTrack = track;

      // Set up event listeners
      this.audio.onended = () => {
        this.isPlaying = false;
        this.playNextTrack();
      };

      this.audio.onerror = () => {
        console.error('Failed to play track:', track.title);
        this.isPlaying = false;
      };

      await this.audio.play();
      this.isPlaying = true;
    } catch (error) {
      console.error('Error playing track:', error);
      this.isPlaying = false;
    }
  }

  // Play next track in playlist
  playNextTrack(): void {
    if (this.playlist.length === 0) return;

    const currentIndex = this.currentTrack 
      ? this.playlist.findIndex(track => track.id === this.currentTrack!.id)
      : -1;
    
    const nextIndex = (currentIndex + 1) % this.playlist.length;
    const nextTrack = this.playlist[nextIndex];
    
    if (nextTrack) {
      this.playTrack(nextTrack);
    }
  }

  // Play previous track in playlist
  playPreviousTrack(): void {
    if (this.playlist.length === 0) return;

    const currentIndex = this.currentTrack 
      ? this.playlist.findIndex(track => track.id === this.currentTrack!.id)
      : -1;
    
    const prevIndex = currentIndex <= 0 ? this.playlist.length - 1 : currentIndex - 1;
    const prevTrack = this.playlist[prevIndex];
    
    if (prevTrack) {
      this.playTrack(prevTrack);
    }
  }

  // Play/pause current track
  togglePlayPause(): void {
    if (!this.audio) return;

    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  // Stop music
  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
    }
  }

  // Set volume (0-1)
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  // Get current volume
  getVolume(): number {
    return this.volume;
  }

  // Get current track
  getCurrentTrack(): MusicTrack | null {
    return this.currentTrack;
  }

  // Check if music is playing
  isMusicPlaying(): boolean {
    return this.isPlaying;
  }

  // Get current playlist
  getPlaylist(): MusicTrack[] {
    return this.playlist;
  }

  // Shuffle playlist
  shufflePlaylist(): void {
    this.playlist = [...this.playlist].sort(() => Math.random() - 0.5);
  }

  // Get recommended tracks for workout type
  getRecommendedTracks(workoutType: string): MusicTrack[] {
    const recommendations: Record<string, MusicTrack['genre']> = {
      'yoga': 'calm',
      'strength': 'motivational',
      'cardio': 'energetic',
      'stretching': 'recovery',
      'focus': 'focus'
    };

    const genre = recommendations[workoutType] || 'motivational';
    return this.getTracksByGenre(genre);
  }
}

// Export singleton instance
export const musicService = new MusicService();
