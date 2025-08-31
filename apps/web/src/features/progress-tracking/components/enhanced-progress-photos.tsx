'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Progress, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@mobii/ui';
import { 
  Camera, 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  X, 
  ArrowRight,
  Volume2,
  VolumeX,
  Target,
  User,
  Settings,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Image,
  Grid,
  Calendar,
  TrendingUp,
  BarChart3,
  Zap,
  Star,
  Award,
  Filter,
  Search,
  Plus,
  Edit,
  Save,
  AlertCircle,
  Info,
  CheckCircle,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  userProfileService,
  ProgressPhoto,
  UserProfile as UserProfileType
} from '../services/user-profile-service';

interface EnhancedProgressPhotosProps {
  className?: string;
}

interface PhotoSession {
  id: string;
  date: string;
  type: 'front' | 'side' | 'back' | 'full_body';
  photos: ProgressPhoto[];
  notes?: string;
  tags: string[];
  isPrivate: boolean;
  compressionLevel: 'low' | 'medium' | 'high';
  aiAnalysis?: {
    bodyComposition?: {
      estimatedBodyFat?: number;
      muscleMass?: number;
      bodyShape?: string;
    };
    progressMetrics?: {
      weightChange?: number;
      bodyFatChange?: number;
      muscleGain?: number;
    };
    recommendations?: string[];
  };
}

export const EnhancedProgressPhotos: React.FC<EnhancedProgressPhotosProps> = ({ className = '' }) => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [sessions, setSessions] = useState<PhotoSession[]>([]);
  const [activeTab, setActiveTab] = useState('gallery');
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'weight'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [compressionSettings, setCompressionSettings] = useState({
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'jpeg' as 'jpeg' | 'webp' | 'png'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const currentProfile = userProfileService.getCurrentProfile();
    const progressPhotos = userProfileService.getProgressPhotos(undefined, true);
    
    setProfile(currentProfile);
    setPhotos(progressPhotos);
    
    // Group photos into sessions
    const photoSessions = groupPhotosIntoSessions(progressPhotos);
    setSessions(photoSessions);
  };

  const groupPhotosIntoSessions = (photos: ProgressPhoto[]): PhotoSession[] => {
    const sessionsMap = new Map<string, PhotoSession>();
    
    photos.forEach(photo => {
      const sessionKey = `${photo.date}_${photo.type}`;
      
      if (!sessionsMap.has(sessionKey)) {
        sessionsMap.set(sessionKey, {
          id: sessionKey,
          date: photo.date,
          type: photo.type,
          photos: [],
          tags: photo.tags || [],
          isPrivate: photo.isPrivate,
          compressionLevel: 'medium',
          aiAnalysis: generateAIAnalysis(photo)
        });
      }
      
      sessionsMap.get(sessionKey)!.photos.push(photo);
    });
    
    return Array.from(sessionsMap.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const generateAIAnalysis = (photo: ProgressPhoto) => {
    // Mock AI analysis - would be replaced with actual AI processing
    return {
      bodyComposition: {
        estimatedBodyFat: photo.bodyFat || Math.random() * 10 + 15,
        muscleMass: photo.muscleMass || Math.random() * 20 + 140,
        bodyShape: ['Athletic', 'Lean', 'Muscular', 'Average'][Math.floor(Math.random() * 4)]
      },
      progressMetrics: {
        weightChange: photo.weight ? Math.random() * 5 - 2.5 : undefined,
        bodyFatChange: photo.bodyFat ? Math.random() * 2 - 1 : undefined,
        muscleGain: photo.muscleMass ? Math.random() * 3 : undefined
      },
      recommendations: [
        'Continue with current training program',
        'Consider increasing protein intake',
        'Add more cardio sessions',
        'Focus on strength training'
      ].slice(0, 2)
    };
  };

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || photo.type === filterType;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'date':
        comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'weight':
        comparison = (b.weight || 0) - (a.weight || 0);
        break;
    }
    return sortOrder === 'desc' ? comparison : -comparison;
  });

  const getProgressStats = () => {
    if (photos.length < 2) return null;
    
    const sortedPhotos = photos.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstPhoto = sortedPhotos[0];
    const lastPhoto = sortedPhotos[sortedPhotos.length - 1];
    
    return {
      totalPhotos: photos.length,
      dateRange: `${firstPhoto.date} to ${lastPhoto.date}`,
      weightChange: lastPhoto.weight && firstPhoto.weight ? lastPhoto.weight - firstPhoto.weight : null,
      bodyFatChange: lastPhoto.bodyFat && firstPhoto.bodyFat ? lastPhoto.bodyFat - firstPhoto.bodyFat : null,
      muscleChange: lastPhoto.muscleMass && firstPhoto.muscleMass ? lastPhoto.muscleMass - firstPhoto.muscleMass : null,
      sessionsCount: sessions.length
    };
  };

  const handleDeletePhoto = (photoId: string) => {
    if (confirm('Are you sure you want to delete this progress photo?')) {
      userProfileService.deleteProgressPhoto(photoId);
      loadData();
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session && confirm(`Are you sure you want to delete the entire session from ${session.date}?`)) {
      session.photos.forEach(photo => {
        userProfileService.deleteProgressPhoto(photo.id);
      });
      loadData();
    }
  };

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new window.Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const maxWidth = compressionSettings.maxWidth;
        const maxHeight = compressionSettings.maxHeight;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: `image/${compressionSettings.format}`,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          `image/${compressionSettings.format}`,
          compressionSettings.quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const progressStats = getProgressStats();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-500" />
              Enhanced Progress Photos
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/automated-photo-capture'}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100"
              >
                <Camera className="h-4 w-4" />
                Auto Capture
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSessionModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New Session
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {progressStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{progressStats.totalPhotos}</div>
                <div className="text-sm text-gray-600">Total Photos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{progressStats.sessionsCount}</div>
                <div className="text-sm text-gray-600">Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {progressStats.weightChange ? `${progressStats.weightChange > 0 ? '+' : ''}${progressStats.weightChange.toFixed(1)}` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Weight Change (lbs)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {progressStats.bodyFatChange ? `${progressStats.bodyFatChange > 0 ? '+' : ''}${progressStats.bodyFatChange.toFixed(1)}%` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Body Fat Change</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <Grid className="h-4 w-4" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-4">
          {/* Search and Filter */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search photos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="front">Front View</option>
                    <option value="side">Side View</option>
                    <option value="back">Back View</option>
                    <option value="full_body">Full Body</option>
                  </select>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [sort, order] = e.target.value.split('-');
                      setSortBy(sort as any);
                      setSortOrder(order as any);
                    }}
                    className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="type-asc">Type A-Z</option>
                    <option value="weight-desc">Weight High-Low</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative group bg-white rounded-lg shadow-sm border overflow-hidden"
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={photo.thumbnailUrl}
                    alt={`Progress photo ${photo.date}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedPhoto(photo);
                          setShowPhotoModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePhoto(photo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {photo.isPrivate && (
                    <div className="absolute top-2 right-2">
                      <Lock className="h-4 w-4 text-white bg-black bg-opacity-50 rounded p-1" />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {photo.type}
                    </Badge>
                  </div>
                </div>
                <div className="p-3">
                  <div className="font-medium text-sm">{new Date(photo.date).toLocaleDateString()}</div>
                  <div className="text-gray-500 text-xs capitalize">{photo.type} view</div>
                  {photo.weight && (
                    <div className="text-gray-500 text-xs">{photo.weight} lbs</div>
                  )}
                  {photo.notes && (
                    <div className="text-gray-500 text-xs truncate">{photo.notes}</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {filteredPhotos.length === 0 && (
            <div className="text-center py-12">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Photos Found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <Button onClick={() => setShowUploadModal(true)}>
                Upload Photos
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <Card key={session.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{new Date(session.date).toLocaleDateString()}</CardTitle>
                    <Badge variant="outline" className="capitalize">
                      {session.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-3">
                    {session.photos.length > 0 && (
                      <img
                        src={session.photos[0].thumbnailUrl}
                        alt={`Session ${session.date}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Photos:</span>
                      <span className="font-medium">{session.photos.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Privacy:</span>
                      <span className="flex items-center gap-1">
                        {session.isPrivate ? (
                          <>
                            <Lock className="h-3 w-3" />
                            <span>Private</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-3 w-3" />
                            <span>Public</span>
                          </>
                        )}
                      </span>
                    </div>
                    {session.aiAnalysis?.bodyComposition && (
                      <div className="pt-2 border-t">
                        <div className="text-xs text-gray-600 mb-1">AI Analysis</div>
                        <div className="text-xs">
                          <div>Body Fat: {session.aiAnalysis.bodyComposition.estimatedBodyFat?.toFixed(1)}%</div>
                          <div>Muscle: {session.aiAnalysis.bodyComposition.muscleMass?.toFixed(0)} lbs</div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedPhoto(session.photos[0]);
                        setShowPhotoModal(true);
                      }}
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Progress Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.slice(0, 5).map((session, index) => (
                    <div key={session.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{new Date(session.date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500 capitalize">{session.type.replace('_', ' ')} session</div>
                      </div>
                      {session.aiAnalysis?.progressMetrics && (
                        <div className="text-right">
                          {session.aiAnalysis.progressMetrics.weightChange && (
                            <div className="text-xs">
                              {session.aiAnalysis.progressMetrics.weightChange > 0 ? '+' : ''}
                              {session.aiAnalysis.progressMetrics.weightChange.toFixed(1)} lbs
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions[0]?.aiAnalysis?.recommendations?.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-500" />
                Photo Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Compression Quality</label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={compressionSettings.quality}
                    onChange={(e) => setCompressionSettings({
                      ...compressionSettings,
                      quality: parseFloat(e.target.value)
                    })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>High Compression</span>
                    <span>Low Compression</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Width (px)</label>
                    <input
                      type="number"
                      value={compressionSettings.maxWidth}
                      onChange={(e) => setCompressionSettings({
                        ...compressionSettings,
                        maxWidth: parseInt(e.target.value)
                      })}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Height (px)</label>
                    <input
                      type="number"
                      value={compressionSettings.maxHeight}
                      onChange={(e) => setCompressionSettings({
                        ...compressionSettings,
                        maxHeight: parseInt(e.target.value)
                      })}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Image Format</label>
                  <select
                    value={compressionSettings.format}
                    onChange={(e) => setCompressionSettings({
                      ...compressionSettings,
                      format: e.target.value as any
                    })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="jpeg">JPEG</option>
                    <option value="webp">WebP</option>
                    <option value="png">PNG</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Photo Modal */}
      <AnimatePresence>
        {showPhotoModal && selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowPhotoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Photo Details</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPhotoModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedPhoto.imageUrl}
                    alt={`Progress photo ${selectedPhoto.date}`}
                    className="w-full rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Photo Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span>{new Date(selectedPhoto.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="capitalize">{selectedPhoto.type.replace('_', ' ')}</span>
                      </div>
                      {selectedPhoto.weight && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weight:</span>
                          <span>{selectedPhoto.weight} lbs</span>
                        </div>
                      )}
                      {selectedPhoto.bodyFat && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Body Fat:</span>
                          <span>{selectedPhoto.bodyFat}%</span>
                        </div>
                      )}
                      {selectedPhoto.muscleMass && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Muscle Mass:</span>
                          <span>{selectedPhoto.muscleMass} lbs</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {selectedPhoto.notes && (
                    <div>
                      <h4 className="font-semibold mb-2">Notes</h4>
                      <p className="text-sm text-gray-600">{selectedPhoto.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = selectedPhoto.imageUrl;
                        link.download = `progress-photo-${selectedPhoto.date}.jpg`;
                        link.click();
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleDeletePhoto(selectedPhoto.id);
                        setShowPhotoModal(false);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
