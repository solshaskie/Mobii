'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Badge, Progress } from '@mobii/ui';
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
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  userProfileService, 
  UserProfile, 
  ProgressPhoto, 
  UserStats 
} from '../../services/user-profile-service';

interface UserProfileProps {
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ className = '' }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Partial<UserProfile>>({});

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

  const handleSaveProfile = () => {
    if (profile) {
      userProfileService.updateProfile(editingProfile);
      setIsEditing(false);
      setEditingProfile({});
      loadData();
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProfile({});
  };

  const handlePhotoUpload = (photoData: Omit<ProgressPhoto, 'id' | 'createdAt'>) => {
    userProfileService.addProgressPhoto(photoData);
    setShowPhotoUpload(false);
    loadData();
  };

  const handleDeletePhoto = (photoId: string) => {
    if (confirm('Are you sure you want to delete this progress photo?')) {
      userProfileService.deleteProgressPhoto(photoId);
      loadData();
    }
  };

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

  const bmi = userProfileService.calculateBMI();
  const bmiCategory = userProfileService.getBMICategory();
  const bmr = userProfileService.calculateBMR();
  const tdee = userProfileService.calculateTDEE();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Profile
            </CardTitle>
            <div className="flex gap-2">
                             <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setShowPhotoUpload(true)}
                 className="flex items-center gap-2"
               >
                 <Camera className="h-4 w-4" />
                 Add Photo
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPrivacySettings(true)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Privacy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            {/* Physical Stats */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Physical Stats</h3>
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
            </div>

            {/* Fitness Goals */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Fitness Goals</h3>
              <div className="space-y-2">
                {profile.fitnessGoals.map((goal, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{goal}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Fitness Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalWorkouts}</div>
                <div className="text-sm text-gray-600">Total Workouts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.currentStreak}</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.level}</div>
                <div className="text-sm text-gray-600">Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.experiencePoints}</div>
                <div className="text-sm text-gray-600">XP</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Photos */}
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
              <Button onClick={() => setShowPhotoUpload(true)}>
                Add First Photo
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

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Edit Profile</h3>
              <ProfileEditForm
                profile={profile}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Upload Modal */}
      <AnimatePresence>
        {showPhotoUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowPhotoUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Add Progress Photo</h3>
              <PhotoUploadForm
                onUpload={handlePhotoUpload}
                onCancel={() => setShowPhotoUpload(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy Settings Modal */}
      <AnimatePresence>
        {showPrivacySettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowPrivacySettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4">Privacy Settings</h3>
              <PrivacySettingsForm
                profile={profile}
                onSave={(updates) => {
                  userProfileService.updateProfile(updates);
                  setShowPrivacySettings(false);
                  loadData();
                }}
                onCancel={() => setShowPrivacySettings(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Profile Edit Form Component
interface ProfileEditFormProps {
  profile: UserProfile;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ profile, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    displayName: profile.displayName,
    dateOfBirth: profile.dateOfBirth || '',
    gender: profile.gender || 'prefer_not_to_say',
    heightFeet: profile.height.feet,
    heightInches: profile.height.inches,
    weightPounds: profile.weight.pounds,
    fitnessLevel: profile.fitnessLevel,
    activityLevel: profile.activityLevel,
    fitnessGoals: profile.fitnessGoals.join(', '),
    units: profile.units
  });

  const handleSubmit = () => {
    const heightCm = userProfileService.feetInchesToCm(formData.heightFeet, formData.heightInches);
    const weightKg = userProfileService.poundsToKg(formData.weightPounds);

    const updates: Partial<UserProfile> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      displayName: formData.displayName,
      dateOfBirth: formData.dateOfBirth || undefined,
      gender: formData.gender as any,
      height: {
        feet: formData.heightFeet,
        inches: formData.heightInches,
        centimeters: heightCm
      },
      weight: {
        pounds: formData.weightPounds,
        kilograms: weightKg
      },
      fitnessLevel: formData.fitnessLevel as any,
      activityLevel: formData.activityLevel as any,
      fitnessGoals: formData.fitnessGoals.split(',').map(g => g.trim()).filter(g => g),
      units: formData.units as any
    };

    userProfileService.updateProfile(updates);
    onSave();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First Name</label>
          <Input
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <Input
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Display Name</label>
        <Input
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth</label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
            className="w-full p-2 border rounded-md"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Height (ft)</label>
          <Input
            type="number"
            value={formData.heightFeet}
            onChange={(e) => setFormData({ ...formData, heightFeet: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Height (in)</label>
          <Input
            type="number"
            value={formData.heightInches}
            onChange={(e) => setFormData({ ...formData, heightInches: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Weight (lbs)</label>
          <Input
            type="number"
            value={formData.weightPounds}
            onChange={(e) => setFormData({ ...formData, weightPounds: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fitness Level</label>
          <select
            value={formData.fitnessLevel}
            onChange={(e) => setFormData({ ...formData, fitnessLevel: e.target.value as any })}
            className="w-full p-2 border rounded-md"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Activity Level</label>
          <select
            value={formData.activityLevel}
            onChange={(e) => setFormData({ ...formData, activityLevel: e.target.value as any })}
            className="w-full p-2 border rounded-md"
          >
            <option value="sedentary">Sedentary</option>
            <option value="lightly_active">Lightly Active</option>
            <option value="moderately_active">Moderately Active</option>
            <option value="very_active">Very Active</option>
            <option value="extremely_active">Extremely Active</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Fitness Goals (comma-separated)</label>
        <Input
          value={formData.fitnessGoals}
          onChange={(e) => setFormData({ ...formData, fitnessGoals: e.target.value })}
          placeholder="Lose Weight, Build Muscle, Improve Endurance"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="flex-1">
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};

// Photo Upload Form Component
interface PhotoUploadFormProps {
  onUpload: (photo: Omit<ProgressPhoto, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const PhotoUploadForm: React.FC<PhotoUploadFormProps> = ({ onUpload, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'front' as const,
    date: new Date().toISOString().split('T')[0],
    weight: '',
    bodyFat: '',
    muscleMass: '',
    notes: '',
    isPrivate: true
  });

  const handleSubmit = () => {
    const photo: Omit<ProgressPhoto, 'id' | 'createdAt'> = {
      userId: userProfileService.getCurrentProfile()?.id || '',
      date: formData.date,
      type: formData.type,
      imageUrl: `https://via.placeholder.com/400x600/4F46E5/FFFFFF?text=Progress+Photo+${formData.date}`,
      thumbnailUrl: `https://via.placeholder.com/200x300/4F46E5/FFFFFF?text=Thumbnail`,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      bodyFat: formData.bodyFat ? parseFloat(formData.bodyFat) : undefined,
      muscleMass: formData.muscleMass ? parseFloat(formData.muscleMass) : undefined,
      notes: formData.notes || undefined,
      isPrivate: formData.isPrivate,
      tags: [formData.type, 'progress']
    };

    onUpload(photo);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Photo Type</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
          className="w-full p-2 border rounded-md"
        >
          <option value="front">Front View</option>
          <option value="side">Side View</option>
          <option value="back">Back View</option>
          <option value="full_body">Full Body</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Weight (lbs)</label>
          <Input
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Body Fat (%)</label>
          <Input
            type="number"
            step="0.1"
            value={formData.bodyFat}
            onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Muscle Mass (lbs)</label>
          <Input
            type="number"
            step="0.1"
            value={formData.muscleMass}
            onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Notes</label>
        <Input
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Optional notes about this photo"
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPrivate"
          checked={formData.isPrivate}
          onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
          className="rounded"
        />
        <label htmlFor="isPrivate" className="text-sm">
          Keep this photo private
        </label>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSubmit} className="flex-1">
          Upload Photo
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};

// Privacy Settings Form Component
interface PrivacySettingsFormProps {
  profile: UserProfile;
  onSave: (updates: Partial<UserProfile>) => void;
  onCancel: () => void;
}

const PrivacySettingsForm: React.FC<PrivacySettingsFormProps> = ({ profile, onSave, onCancel }) => {
  const [privacySettings, setPrivacySettings] = useState(profile.privacySettings);

  const handleSave = () => {
    onSave({ privacySettings });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Profile Visibility</label>
        <select
          value={privacySettings.profileVisibility}
          onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value as any })}
          className="w-full p-2 border rounded-md"
        >
          <option value="public">Public</option>
          <option value="friends">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Progress Photos</label>
        <select
          value={privacySettings.progressPhotos}
          onChange={(e) => setPrivacySettings({ ...privacySettings, progressPhotos: e.target.value as any })}
          className="w-full p-2 border rounded-md"
        >
          <option value="public">Public</option>
          <option value="friends">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Weight Data</label>
        <select
          value={privacySettings.weightData}
          onChange={(e) => setPrivacySettings({ ...privacySettings, weightData: e.target.value as any })}
          className="w-full p-2 border rounded-md"
        >
          <option value="public">Public</option>
          <option value="friends">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Workout History</label>
        <select
          value={privacySettings.workoutHistory}
          onChange={(e) => setPrivacySettings({ ...privacySettings, workoutHistory: e.target.value as any })}
          className="w-full p-2 border rounded-md"
        >
          <option value="public">Public</option>
          <option value="friends">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Achievements</label>
        <select
          value={privacySettings.achievements}
          onChange={(e) => setPrivacySettings({ ...privacySettings, achievements: e.target.value as any })}
          className="w-full p-2 border rounded-md"
        >
          <option value="public">Public</option>
          <option value="friends">Friends Only</option>
          <option value="private">Private</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1">
          Save Settings
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  );
};
