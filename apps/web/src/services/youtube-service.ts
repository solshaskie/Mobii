// YouTube service for exercise videos
export class YouTubeService {
  private apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  // Curated channels for high-quality fitness content
  private curatedChannels = [
    'Yoga With Adriene',
    'Fitness Blender',
    'Move With Nicole',
    'Calisthenic Movement',
    'Chloe Ting',
    'Pamela Reif',
    'MadFit',
    'Heather Robertson',
    'Growing Annanas',
    'Emi Wong'
  ];

  constructor() {
    if (!this.apiKey) {
      console.warn('YouTube API key not found. Video features will be disabled.');
    }
  }

  // Enhanced search for exercise videos with better queries
  async searchExerciseVideo(exerciseName: string, difficulty: string = 'beginner', category: string = 'general'): Promise<any> {
    try {
      if (!this.apiKey) {
        return null;
      }

      // Create optimized search queries based on exercise type
      const queries = this.generateSearchQueries(exerciseName, difficulty, category);
      
      // Try each query until we find a good video
      for (const query of queries) {
        const response = await fetch(
          `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoDuration=short&maxResults=3&key=${this.apiKey}`
        );

        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        const video = data.items?.[0];

        if (video && this.isQualityVideo(video)) {
          return {
            id: video.id.videoId,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.medium.url,
            channelTitle: video.snippet.channelTitle,
            publishedAt: video.snippet.publishedAt,
            url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            embedUrl: `https://www.youtube.com/embed/${video.id.videoId}`,
            searchQuery: query
          };
        }
      }

      return null;
    } catch (error) {
      console.error('Failed to search YouTube video:', error);
      return null;
    }
  }

  // Generate optimized search queries
  private generateSearchQueries(exerciseName: string, difficulty: string, category: string): string[] {
    const queries = [];
    
    // Base exercise name
    const baseName = exerciseName.toLowerCase();
    
    // Category-specific queries
    if (category === 'chair-yoga') {
      queries.push(`${baseName} chair yoga tutorial`);
      queries.push(`${baseName} seated yoga pose`);
      queries.push(`chair yoga ${baseName} for beginners`);
    } else if (category === 'calisthenics') {
      queries.push(`${baseName} calisthenics tutorial`);
      queries.push(`${baseName} bodyweight exercise`);
      queries.push(`${baseName} no equipment workout`);
    } else if (category === 'mobility') {
      queries.push(`${baseName} mobility exercise`);
      queries.push(`${baseName} flexibility stretch`);
      queries.push(`${baseName} range of motion`);
    } else if (category === 'strength') {
      queries.push(`${baseName} strength training`);
      queries.push(`${baseName} muscle building`);
      queries.push(`${baseName} resistance exercise`);
    }

    // Difficulty-specific queries
    if (difficulty === 'beginner') {
      queries.push(`${baseName} for beginners tutorial`);
      queries.push(`how to do ${baseName} properly`);
      queries.push(`${baseName} step by step guide`);
    } else if (difficulty === 'intermediate') {
      queries.push(`${baseName} intermediate level`);
      queries.push(`${baseName} advanced technique`);
    } else if (difficulty === 'advanced') {
      queries.push(`${baseName} advanced tutorial`);
      queries.push(`${baseName} expert level`);
    }

    // General queries
    queries.push(`${baseName} exercise tutorial`);
    queries.push(`${baseName} workout guide`);
    queries.push(`${baseName} fitness instruction`);

    return queries;
  }

  // Check if video is high quality
  private isQualityVideo(video: any): boolean {
    const title = video.snippet.title.toLowerCase();
    const channel = video.snippet.channelTitle.toLowerCase();
    
    // Check if it's from a curated channel
    const isCuratedChannel = this.curatedChannels.some(channelName => 
      channel.includes(channelName.toLowerCase())
    );
    
    // Check for quality indicators
    const hasQualityIndicators = 
      title.includes('tutorial') ||
      title.includes('how to') ||
      title.includes('guide') ||
      title.includes('instruction') ||
      isCuratedChannel;
    
    // Avoid low-quality content
    const hasLowQualityIndicators = 
      title.includes('compilation') ||
      title.includes('fail') ||
      title.includes('funny') ||
      title.includes('viral');
    
    return hasQualityIndicators && !hasLowQualityIndicators;
  }

  // Get multiple exercise videos
  async getExerciseVideos(exercises: string[], difficulty: string = 'beginner'): Promise<{ [key: string]: any }> {
    const videos: { [key: string]: any } = {};

    for (const exercise of exercises) {
      try {
        const video = await this.searchExerciseVideo(exercise, difficulty);
        if (video) {
          videos[exercise] = video;
        }
      } catch (error) {
        console.error(`Failed to get video for ${exercise}:`, error);
      }
    }

    return videos;
  }

  // Get workout playlist
  async getWorkoutPlaylist(workoutTitle: string, exercises: string[]): Promise<any[]> {
    try {
      if (!this.apiKey) {
        return [];
      }

      const query = `${workoutTitle} chair yoga workout`;
      const response = await fetch(
        `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoDuration=medium&maxResults=5&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      return data.items?.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
      })) || [];
    } catch (error) {
      console.error('Failed to get workout playlist:', error);
      return [];
    }
  }

  // Get curated fitness videos
  async getCuratedFitnessVideos(category: string = 'chair-yoga', limit: number = 10): Promise<any[]> {
    try {
      if (!this.apiKey) {
        return [];
      }

      const queries = [
        `${category} workout tutorial`,
        `${category} exercise guide`,
        `${category} fitness routine`,
        `${category} for beginners`
      ];

      const allVideos: any[] = [];

      for (const query of queries) {
        const response = await fetch(
          `${this.baseUrl}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoDuration=short&maxResults=5&key=${this.apiKey}`
        );

        if (response.ok) {
          const data = await response.json();
          const videos = data.items?.filter((item: any) => this.isQualityVideo(item)).map((item: any) => ({
            id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            channelTitle: item.snippet.channelTitle,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
            category: category
          })) || [];
          
          allVideos.push(...videos);
        }
      }

      // Remove duplicates and return limited results
      const uniqueVideos = allVideos.filter((video, index, self) => 
        index === self.findIndex(v => v.id === video.id)
      );

      return uniqueVideos.slice(0, limit);
    } catch (error) {
      console.error('Failed to get curated fitness videos:', error);
      return [];
    }
  }

  // Get video details
  async getVideoDetails(videoId: string): Promise<any> {
    try {
      if (!this.apiKey) {
        return null;
      }

      const response = await fetch(
        `${this.baseUrl}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      const video = data.items?.[0];

      if (video) {
        return {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          duration: this.parseDuration(video.contentDetails.duration),
          viewCount: video.statistics.viewCount,
          likeCount: video.statistics.likeCount,
          thumbnail: video.snippet.thumbnails.high.url,
          channelTitle: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          embedUrl: `https://www.youtube.com/embed/${video.id}`
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to get video details:', error);
      return null;
    }
  }

  private parseDuration(duration: string): number {
    // Parse ISO 8601 duration format (PT4M13S) to seconds
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    return hours * 3600 + minutes * 60 + seconds;
  }
}
