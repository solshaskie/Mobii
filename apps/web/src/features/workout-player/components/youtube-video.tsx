'use client';

import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, X } from 'lucide-react';
import { Button } from '@mobii/ui';

interface YouTubeVideoProps {
  videoId?: string;
  title?: string;
  channelTitle?: string;
  thumbnail?: string;
  embedUrl?: string;
  onClose?: () => void;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
}

export function YouTubeVideo({
  videoId,
  title,
  channelTitle,
  thumbnail,
  embedUrl,
  onClose,
  autoPlay = false,
  showControls = true,
  className = ''
}: YouTubeVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Auto-play when component mounts if autoPlay is true
  useEffect(() => {
    if (autoPlay && videoId) {
      setShowVideo(true);
      setIsPlaying(true);
    }
  }, [autoPlay, videoId]);

  const handlePlay = () => {
    setShowVideo(true);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleClose = () => {
    setShowVideo(false);
    setIsPlaying(false);
    onClose?.();
  };

  if (!videoId && !embedUrl) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">No video available</p>
      </div>
    );
  }

  const finalEmbedUrl = embedUrl || `https://www.youtube.com/embed/${videoId}`;
  const videoUrl = `${finalEmbedUrl}?autoplay=${isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}&controls=${showControls ? 1 : 0}&rel=0&modestbranding=1`;

  return (
    <div className={`relative ${className}`}>
      {!showVideo ? (
        // Thumbnail view with play button
        <div className="relative group cursor-pointer" onClick={handlePlay}>
          <div className="relative overflow-hidden rounded-lg bg-gray-200">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title || 'Exercise video'}
                className="w-full h-48 object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                <Play className="w-12 h-12 text-gray-500" />
              </div>
            )}
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-4 group-hover:bg-opacity-70 transition-all">
                <Play className="w-8 h-8 text-white" fill="white" />
              </div>
            </div>
          </div>
          
          {/* Video info */}
          <div className="mt-3">
            {title && (
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                {title}
              </h3>
            )}
            {channelTitle && (
              <p className="text-xs text-gray-500 mt-1">
                {channelTitle}
              </p>
            )}
          </div>
        </div>
      ) : (
        // Video player
        <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
          <div className="relative">
            <iframe
              src={videoUrl}
              title={title || 'Exercise demonstration'}
              className={`w-full ${isFullscreen ? 'h-screen' : 'h-64 md:h-80'} rounded-lg`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            
            {/* Video controls overlay */}
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleMute}
                className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={handleFullscreen}
                className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
              >
                <Maximize className="w-4 h-4" />
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={handleClose}
                className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Video info below player */}
          <div className="mt-3">
            {title && (
              <h3 className="font-semibold text-sm text-gray-900">
                {title}
              </h3>
            )}
            {channelTitle && (
              <p className="text-xs text-gray-500 mt-1">
                {channelTitle}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for workout player
export function CompactYouTubeVideo({
  videoId,
  title,
  onClose,
  className = ''
}: {
  videoId?: string;
  title?: string;
  onClose?: () => void;
  className?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
    onClose?.();
  };

  if (!videoId) return null;

  return (
    <div className={`relative ${className}`}>
      {!isPlaying ? (
        <div className="relative group cursor-pointer" onClick={handlePlay}>
          <div className="relative overflow-hidden rounded-lg bg-gray-200">
            <div className="w-full h-32 bg-gray-300 flex items-center justify-center">
              <Play className="w-8 h-8 text-gray-500" />
            </div>
            
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-2 group-hover:bg-opacity-70 transition-all">
                <Play className="w-4 h-4 text-white" fill="white" />
              </div>
            </div>
          </div>
          
          {title && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-1">
              {title}
            </p>
          )}
        </div>
      ) : (
        <div className="relative">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1`}
            title={title || 'Exercise demonstration'}
            className="w-full h-32 rounded-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleClose}
            className="absolute top-1 right-1 bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
