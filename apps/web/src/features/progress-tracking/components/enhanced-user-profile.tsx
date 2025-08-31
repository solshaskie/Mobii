'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Progress, Tabs, TabsContent, TabsList, TabsTrigger } from '@mobii/ui';
import { 
  User, 
  Camera, 
  Settings, 
  Edit, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  Lock,
  Unlock,
  TrendingUp,
  Award,
  Target,
  Calendar,
  Activity,
  Heart,
  Zap,
  Download,
  Upload,
  Shield,
  Bell,
  Clock,
  BarChart3,
  Trophy,
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  userProfileService,
  UserProfileService,
  UserProfile as UserProfileType,
  ProgressPhoto,
  UserStats
} from '../services/user-profile-service';

interface EnhancedUserProfileProps {
  className?: string;
}

export const EnhancedUserProfile: React.FC<EnhancedUserProfileProps> = ({ className = '' }) => {
  const [profile, setProfile] = useState<UserProfileType | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showFitnessAssessment, setShowFitnessAssessment] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const currentProfile = userProfileService.getCurrentProfile();
    const userStats = userProfileService.getUserStats();
    const progressPhotos = userProfileService.getProgressPhotos(undefined, true);

    setProfile(currentProfile);
    setStats(userStats);
    setPhotos(progressPhotos);
  };

  const getFitnessScore = () => {
    if (!stats) return 0;
    
    // Calculate fitness score based on various metrics
    let score = 0;
    score += Math.min(stats.totalWorkouts * 2, 100); // Max 100 from workouts
    score += Math.min(stats.currentStreak * 5, 50); // Max 50 from streak
    score += Math.min(stats.level * 10, 100); // Max 100 from level
    score += Math.min(stats.achievements.length * 15, 75); // Max 75 from achievements
    
    return Math.min(score, 100);
  };

  const getPrivacyLevel = () => {
    if (!profile) return 'Unknown';
    
    const settings = profile.privacySettings;
    const publicCount = Object.values(settings).filter(s => s === 'public').length;
    const privateCount = Object.values(settings).filter(s => s === 'private').length;
    
    if (privateCount >= 4) return 'Very Private';
    if (privateCount >= 2) return 'Private';
    if (publicCount >= 4) return 'Very Public';
    return 'Moderate';
  };

  const getPrivacyColor = (level: string) => {
    switch (level) {
      case 'Very Private': return 'text-green-600';
      case 'Private': return 'text-blue-600';
      case 'Moderate': return 'text-yellow-600';
      case 'Very Public': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!profile) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Profile Found</h3>
        <p className="text-gray-500 mb-4">Please create a profile to get started</p>
        <Button onClick={() => userProfileService.addSampleData()}>
          Create Sample Profile
        </Button>
      </div>
    );
  }

  const fitnessScore = getFitnessScore();
  const privacyLevel = getPrivacyLevel();
  const bmi = userProfileService.calculateBMI();
  const bmiCategory = userProfileService.getBMICategory();
  const bmr = userProfileService.calculateBMR();
  const tdee = userProfileService.calculateTDEE();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Header with Quick Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Enhanced Profile
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFitnessAssessment(true)}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Assessment
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDataExport(true)}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/automated-photo-capture'}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100"
              >
                <Camera className="h-4 w-4" />
                Auto Capture
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Avatar and Basic Info */}
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">{profile.displayName}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <Badge className={`mt-2 ${getFitnessLevelColor(profile.fitnessLevel)}`}>
                {profile.fitnessLevel}
              </Badge>
            </div>

            {/* Fitness Score */}
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{fitnessScore}</div>
              <div className="text-sm text-gray-600 mb-2">Fitness Score</div>
              <Progress value={fitnessScore} className="w-full" />
              <div className="text-xs text-gray-500 mt-1">
                {fitnessScore >= 80 ? 'Excellent' : fitnessScore >= 60 ? 'Good' : fitnessScore >= 40 ? 'Fair' : 'Needs Improvement'}
              </div>
            </div>

            {/* Privacy Level */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className={`h-6 w-6 ${getPrivacyColor(privacyLevel)}`} />
                <div className={`text-lg font-bold ${getPrivacyColor(privacyLevel)}`}>
                  {privacyLevel}
                </div>
              </div>
              <div className="text-sm text-gray-600 mb-2">Privacy Level</div>
              <div className="text-xs text-gray-500">
                {privacyLevel === 'Very Private' ? 'Maximum privacy' : 
                 privacyLevel === 'Private' ? 'Most data private' :
                 privacyLevel === 'Moderate' ? 'Balanced settings' : 'Most data public'}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="text-center">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="font-bold text-blue-600">{stats?.totalWorkouts || 0}</div>
                  <div className="text-gray-500">Workouts</div>
                </div>
                <div>
                  <div className="font-bold text-green-600">{stats?.currentStreak || 0}</div>
                  <div className="text-gray-500">Day Streak</div>
                </div>
                <div>
                  <div className="font-bold text-purple-600">{stats?.level || 1}</div>
                  <div className="text-gray-500">Level</div>
                </div>
                <div>
                  <div className="font-bold text-orange-600">{stats?.achievements?.length || 0}</div>
                  <div className="text-gray-500">Achievements</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="fitness" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Fitness Data
          </TabsTrigger>
          <TabsTrigger value="photos" className="flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Progress Photos
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Physical Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Physical Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Height</div>
                      <div className="font-medium">
                        {profile.height.feet}'{profile.height.inches}" ({profile.height.centimeters}cm)
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Weight</div>
                      <div className="font-medium">
                        {profile.weight.pounds} lbs ({profile.weight.kilograms}kg)
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">BMI</div>
                      <div className={`font-medium ${getBMIColor(bmiCategory || '')}`}>
                        {bmi ? bmi.toFixed(1) : 'N/A'} ({bmiCategory || 'N/A'})
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Activity Level</div>
                      <div className="font-medium capitalize">
                        {profile.activityLevel.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  
                  {bmr && tdee && (
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">BMR</div>
                          <div className="font-medium">{Math.round(bmr)} calories/day</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">TDEE</div>
                          <div className="font-medium">{Math.round(tdee)} calories/day</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Fitness Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-500" />
                  Fitness Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.fitnessGoals.map((goal, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{goal}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Fitness Data Tab */}
        <TabsContent value="fitness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Fitness Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.totalWorkouts}</div>
                    <div className="text-sm text-gray-600">Total Workouts</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round(stats.averageWorkoutDuration)} min avg
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.currentStreak}</div>
                    <div className="text-sm text-gray-600">Current Streak</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Best: {stats.longestStreak} days
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{stats.level}</div>
                    <div className="text-sm text-gray-600">Level</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {stats.experiencePoints} XP
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{stats.achievements.length}</div>
                    <div className="text-sm text-gray-600">Achievements</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Unlocked
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress Photos Tab */}
        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-purple-500" />
                Progress Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              {photos.length === 0 ? (
                <div className="text-center py-8">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Progress Photos</h3>
                  <p className="text-gray-500 mb-4">Start tracking your progress with photos</p>
                  <Button onClick={() => window.location.href = '/automated-photo-capture'}>
                    Start Photo Session
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {photos.slice(0, 6).map((photo) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group"
                    >
                      <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
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
                              onClick={() => {/* Handle view */}}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeletePhoto(photo.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {photo.isPrivate && (
                          <div className="absolute top-2 right-2">
                            <Lock className="h-4 w-4 text-white bg-black bg-opacity-50 rounded p-1" />
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-sm">
                        <div className="font-medium">{new Date(photo.date).toLocaleDateString()}</div>
                        <div className="text-gray-500 capitalize">{photo.type} view</div>
                        {photo.weight && (
                          <div className="text-gray-500">{photo.weight} lbs</div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-500" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(profile.privacySettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </div>
                      <div className="text-sm text-gray-500">
                        {value === 'public' ? 'Visible to everyone' :
                         value === 'friends' ? 'Visible to friends only' :
                         'Only visible to you'}
                      </div>
                    </div>
                    <Badge variant={value === 'private' ? 'secondary' : value === 'friends' ? 'outline' : 'default'}>
                      {value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-orange-500" />
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Workout Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Duration:</span>
                      <span className="text-sm font-medium">{profile.preferences.workoutDuration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Frequency:</span>
                      <span className="text-sm font-medium">{profile.preferences.workoutFrequency} days/week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Preferred Time:</span>
                      <span className="text-sm font-medium capitalize">{profile.preferences.preferredWorkoutTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Notifications</h4>
                  <div className="space-y-2">
                    {Object.entries(profile.preferences.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <div className={`w-4 h-4 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fitness Assessment Modal */}
      <AnimatePresence>
        {showFitnessAssessment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowFitnessAssessment(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Fitness Assessment</h3>
              <FitnessAssessmentForm
                profile={profile}
                onClose={() => setShowFitnessAssessment(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Export Modal */}
      <AnimatePresence>
        {showDataExport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowDataExport(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Export Data</h3>
              <DataExportForm
                profile={profile}
                stats={stats}
                photos={photos}
                onClose={() => setShowDataExport(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper functions
const getBMIColor = (category: string) => {
  switch (category) {
    case 'underweight': return 'text-blue-600';
    case 'normal': return 'text-green-600';
    case 'overweight': return 'text-yellow-600';
    case 'obese': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const getFitnessLevelColor = (level: string) => {
  switch (level) {
    case 'beginner': return 'text-green-600';
    case 'intermediate': return 'text-blue-600';
    case 'advanced': return 'text-purple-600';
    case 'expert': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const handleDeletePhoto = (photoId: string) => {
  if (confirm('Are you sure you want to delete this progress photo?')) {
    userProfileService.deleteProgressPhoto(photoId);
    // Reload data
    window.location.reload();
  }
};

// Fitness Assessment Form Component
interface FitnessAssessmentFormProps {
  profile: UserProfileType;
  onClose: () => void;
}

const FitnessAssessmentForm: React.FC<FitnessAssessmentFormProps> = ({ profile, onClose }) => {
  const [assessment, setAssessment] = useState({
    pushUps: '',
    pullUps: '',
    plankTime: '',
    mileTime: '',
    flexibility: 'average',
    strength: 'average',
    endurance: 'average',
    balance: 'average'
  });

  const handleSubmit = () => {
    // Save assessment data
    console.log('Assessment data:', assessment);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Push-ups (max)</label>
          <Input
            type="number"
            value={assessment.pushUps}
            onChange={(e) => setAssessment({ ...assessment, pushUps: e.target.value })}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Pull-ups (max)</label>
          <Input
            type="number"
            value={assessment.pullUps}
            onChange={(e) => setAssessment({ ...assessment, pullUps: e.target.value })}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Plank Time (seconds)</label>
          <Input
            type="number"
            value={assessment.plankTime}
            onChange={(e) => setAssessment({ ...assessment, plankTime: e.target.value })}
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mile Time (minutes)</label>
          <Input
            type="number"
            step="0.1"
            value={assessment.mileTime}
            onChange={(e) => setAssessment({ ...assessment, mileTime: e.target.value })}
            placeholder="0.0"
          />
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold">Self-Assessment</h4>
        {['flexibility', 'strength', 'endurance', 'balance'].map((trait) => (
          <div key={trait} className="flex items-center justify-between">
            <span className="text-sm capitalize">{trait}</span>
            <select
              value={assessment[trait as keyof typeof assessment]}
              onChange={(e) => setAssessment({ ...assessment, [trait]: e.target.value })}
              className="p-2 border rounded-md text-sm"
            >
              <option value="poor">Poor</option>
              <option value="below_average">Below Average</option>
              <option value="average">Average</option>
              <option value="above_average">Above Average</option>
              <option value="excellent">Excellent</option>
            </select>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="flex-1">
          Save Assessment
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};

// Data Export Form Component
interface DataExportFormProps {
  profile: UserProfileType;
  stats: UserStats | null;
  photos: ProgressPhoto[];
  onClose: () => void;
}

const DataExportForm: React.FC<DataExportFormProps> = ({ profile, stats, photos, onClose }) => {
  const [exportOptions, setExportOptions] = useState({
    includeProfile: true,
    includeStats: true,
    includePhotos: false,
    includeWorkoutHistory: true,
    format: 'json' as 'json' | 'csv'
  });

  const handleExport = () => {
    const data: any = {};
    
    if (exportOptions.includeProfile) {
      data.profile = profile;
    }
    
    if (exportOptions.includeStats && stats) {
      data.stats = stats;
    }
    
    if (exportOptions.includePhotos) {
      data.photos = photos;
    }
    
    if (exportOptions.includeWorkoutHistory) {
      data.workoutHistory = []; // Would include actual workout data
    }

    const dataStr = exportOptions.format === 'json' 
      ? JSON.stringify(data, null, 2)
      : convertToCSV(data);
    
    const dataBlob = new Blob([dataStr], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mobii-data-${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
    link.click();
    
    onClose();
  };

  const convertToCSV = (data: any) => {
    // Simple CSV conversion - would be more sophisticated in real implementation
    return Object.entries(data).map(([key, value]) => 
      `${key},${JSON.stringify(value)}`
    ).join('\n');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h4 className="font-semibold">Export Options</h4>
        {Object.entries(exportOptions).map(([key, value]) => {
          if (key === 'format') return null;
          return (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => setExportOptions({ 
                  ...exportOptions, 
                  [key]: e.target.checked 
                })}
                className="rounded"
              />
            </div>
          );
        })}
        
        <div className="flex items-center justify-between">
          <span className="text-sm">Format</span>
          <select
            value={exportOptions.format}
            onChange={(e) => setExportOptions({ 
              ...exportOptions, 
              format: e.target.value as 'json' | 'csv' 
            })}
            className="p-2 border rounded-md text-sm"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleExport} className="flex-1">
          Export Data
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};
