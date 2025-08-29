// User profile management service with privacy controls and fitness data
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  height: {
    feet: number;
    inches: number;
    centimeters: number;
  };
  weight: {
    pounds: number;
    kilograms: number;
  };
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  fitnessGoals: string[];
  medicalConditions?: string[];
  injuries?: string[];
  dietaryRestrictions?: string[];
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  timezone: string;
  language: string;
  units: 'imperial' | 'metric';
  privacySettings: {
    profileVisibility: 'public' | 'friends' | 'private';
    progressPhotos: 'public' | 'friends' | 'private';
    weightData: 'public' | 'friends' | 'private';
    workoutHistory: 'public' | 'friends' | 'private';
    achievements: 'public' | 'friends' | 'private';
  };
  preferences: {
    workoutDuration: number; // minutes
    workoutFrequency: number; // days per week
    preferredWorkoutTime: 'morning' | 'afternoon' | 'evening' | 'night';
    musicPreference?: string;
    voiceCoachStyle: 'motivational' | 'calm' | 'professional';
    notifications: {
      workoutReminders: boolean;
      progressUpdates: boolean;
      achievements: boolean;
      weeklyReports: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProgressPhoto {
  id: string;
  userId: string;
  date: string;
  type: 'front' | 'side' | 'back' | 'full_body';
  imageUrl: string;
  thumbnailUrl: string;
  weight?: number;
  bodyFat?: number;
  muscleMass?: number;
  notes?: string;
  isPrivate: boolean;
  tags?: string[];
  createdAt: string;
}

export interface UserStats {
  totalWorkouts: number;
  totalWorkoutTime: number; // minutes
  currentStreak: number;
  longestStreak: number;
  totalWeightLost: number;
  totalWeightGained: number;
  averageWorkoutDuration: number;
  favoriteExercises: string[];
  achievements: string[];
  level: number;
  experiencePoints: number;
}

export class UserProfileService {
  private profiles: UserProfile[] = [];
  private progressPhotos: ProgressPhoto[] = [];
  private currentUser: UserProfile | null = null;

  constructor() {
    this.loadFromStorage();
  }

  // Create new user profile
  createProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): UserProfile {
    const newProfile: UserProfile = {
      ...profile,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.profiles.push(newProfile);
    this.currentUser = newProfile;
    this.saveToStorage();
    
    return newProfile;
  }

  // Get current user profile
  getCurrentProfile(): UserProfile | null {
    return this.currentUser;
  }

  // Update user profile
  updateProfile(updates: Partial<UserProfile>): UserProfile | null {
    if (!this.currentUser) return null;

    this.currentUser = {
      ...this.currentUser,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Update in profiles array
    const index = this.profiles.findIndex(p => p.id === this.currentUser!.id);
    if (index !== -1) {
      this.profiles[index] = this.currentUser;
    }

    this.saveToStorage();
    return this.currentUser;
  }

  // Add progress photo
  addProgressPhoto(photo: Omit<ProgressPhoto, 'id' | 'createdAt'>): ProgressPhoto {
    const newPhoto: ProgressPhoto = {
      ...photo,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    this.progressPhotos.push(newPhoto);
    this.saveToStorage();
    
    return newPhoto;
  }

  // Get user's progress photos
  getProgressPhotos(userId?: string, includePrivate: boolean = false): ProgressPhoto[] {
    const targetUserId = userId || this.currentUser?.id;
    if (!targetUserId) return [];

    return this.progressPhotos
      .filter(photo => photo.userId === targetUserId)
      .filter(photo => includePrivate || !photo.isPrivate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Get progress photos by date range
  getProgressPhotosByDateRange(startDate: string, endDate: string, userId?: string): ProgressPhoto[] {
    const photos = this.getProgressPhotos(userId, true);
    return photos.filter(photo => 
      photo.date >= startDate && photo.date <= endDate
    );
  }

  // Delete progress photo
  deleteProgressPhoto(photoId: string): boolean {
    const index = this.progressPhotos.findIndex(photo => photo.id === photoId);
    if (index === -1) return false;

    this.progressPhotos.splice(index, 1);
    this.saveToStorage();
    return true;
  }

  // Update progress photo
  updateProgressPhoto(photoId: string, updates: Partial<ProgressPhoto>): ProgressPhoto | null {
    const index = this.progressPhotos.findIndex(photo => photo.id === photoId);
    if (index === -1) return null;

    this.progressPhotos[index] = {
      ...this.progressPhotos[index],
      ...updates
    };

    this.saveToStorage();
    return this.progressPhotos[index];
  }

  // Calculate BMI
  calculateBMI(): number | null {
    if (!this.currentUser) return null;

    const heightInMeters = this.currentUser.height.centimeters / 100;
    const weightInKg = this.currentUser.weight.kilograms;
    
    return weightInKg / (heightInMeters * heightInMeters);
  }

  // Get BMI category
  getBMICategory(): string | null {
    const bmi = this.calculateBMI();
    if (!bmi) return null;

    if (bmi < 18.5) return 'underweight';
    if (bmi < 25) return 'normal';
    if (bmi < 30) return 'overweight';
    return 'obese';
  }

  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
  calculateBMR(): number | null {
    if (!this.currentUser) return null;

    const { weight, height, gender, dateOfBirth } = this.currentUser;
    
    if (!dateOfBirth) return null;

    const age = this.calculateAge(dateOfBirth);
    const weightInKg = weight.kilograms;
    const heightInCm = height.centimeters;

    if (gender === 'male') {
      return (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
    } else if (gender === 'female') {
      return (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
    } else {
      // Use average of male and female for other/prefer not to say
      const maleBMR = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
      const femaleBMR = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
      return (maleBMR + femaleBMR) / 2;
    }
  }

  // Calculate TDEE (Total Daily Energy Expenditure)
  calculateTDEE(): number | null {
    const bmr = this.calculateBMR();
    if (!bmr || !this.currentUser) return null;

    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extremely_active: 1.9
    };

    const multiplier = activityMultipliers[this.currentUser.activityLevel];
    return bmr * multiplier;
  }

  // Calculate age from date of birth
  private calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Convert height from feet/inches to centimeters
  static feetInchesToCm(feet: number, inches: number): number {
    return (feet * 12 + inches) * 2.54;
  }

  // Convert height from centimeters to feet/inches
  static cmToFeetInches(cm: number): { feet: number; inches: number } {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { feet, inches };
  }

  // Convert weight from pounds to kilograms
  static poundsToKg(pounds: number): number {
    return pounds * 0.453592;
  }

  // Convert weight from kilograms to pounds
  static kgToPounds(kg: number): number {
    return kg * 2.20462;
  }

  // Get user stats (mock data for now)
  getUserStats(): UserStats {
    return {
      totalWorkouts: 45,
      totalWorkoutTime: 2700, // 45 hours
      currentStreak: 7,
      longestStreak: 21,
      totalWeightLost: 15.5,
      totalWeightGained: 0,
      averageWorkoutDuration: 36,
      favoriteExercises: ['Push-ups', 'Squats', 'Planks', 'Lunges'],
      achievements: ['First Workout', '7-Day Streak', 'Weight Loss Goal'],
      level: 5,
      experiencePoints: 1250
    };
  }

  // Check privacy settings
  canViewProfile(userId: string): boolean {
    const profile = this.profiles.find(p => p.id === userId);
    if (!profile) return false;

    // For now, allow viewing own profile and public profiles
    return userId === this.currentUser?.id || profile.privacySettings.profileVisibility === 'public';
  }

  canViewProgressPhotos(userId: string): boolean {
    const profile = this.profiles.find(p => p.id === userId);
    if (!profile) return false;

    return userId === this.currentUser?.id || profile.privacySettings.progressPhotos === 'public';
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Save to localStorage
  private saveToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mobii_user_profiles', JSON.stringify(this.profiles));
      localStorage.setItem('mobii_progress_photos', JSON.stringify(this.progressPhotos));
      localStorage.setItem('mobii_current_user', JSON.stringify(this.currentUser));
    }
  }

  // Load from localStorage
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const profilesData = localStorage.getItem('mobii_user_profiles');
      const photosData = localStorage.getItem('mobii_progress_photos');
      const currentUserData = localStorage.getItem('mobii_current_user');

      if (profilesData) {
        this.profiles = JSON.parse(profilesData);
      }

      if (photosData) {
        this.progressPhotos = JSON.parse(photosData);
      }

      if (currentUserData) {
        this.currentUser = JSON.parse(currentUserData);
      }
    }
  }

  // Clear all data (for testing)
  clearAllData(): void {
    this.profiles = [];
    this.progressPhotos = [];
    this.currentUser = null;
    this.saveToStorage();
  }

  // Add sample data for testing
  addSampleData(): void {
    // Create sample user profile
    const sampleProfile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'> = {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      displayName: 'JohnDoe',
      dateOfBirth: '1990-05-15',
      gender: 'male',
      height: {
        feet: 5,
        inches: 10,
        centimeters: 178
      },
      weight: {
        pounds: 180,
        kilograms: 81.6
      },
      fitnessLevel: 'intermediate',
      fitnessGoals: ['Lose Weight', 'Build Muscle', 'Improve Endurance'],
      activityLevel: 'moderately_active',
      timezone: 'America/New_York',
      language: 'en',
      units: 'imperial',
      privacySettings: {
        profileVisibility: 'public',
        progressPhotos: 'private',
        weightData: 'private',
        workoutHistory: 'friends',
        achievements: 'public'
      },
      preferences: {
        workoutDuration: 45,
        workoutFrequency: 4,
        preferredWorkoutTime: 'evening',
        musicPreference: 'Motivational',
        voiceCoachStyle: 'motivational',
        notifications: {
          workoutReminders: true,
          progressUpdates: true,
          achievements: true,
          weeklyReports: true
        }
      }
    };

    this.createProfile(sampleProfile);

    // Add sample progress photos
    const today = new Date();
    const samplePhotos: Omit<ProgressPhoto, 'id' | 'createdAt'>[] = [];

    // Generate sample photos for the last 30 days
    for (let i = 29; i >= 0; i -= 7) { // Every 7 days
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const baseWeight = 180 - (29 - i) * 0.5; // Simulate weight loss

      samplePhotos.push({
        userId: this.currentUser!.id,
        date: date.toISOString().split('T')[0],
        type: 'front',
        imageUrl: `https://via.placeholder.com/400x600/4F46E5/FFFFFF?text=Progress+Photo+${date.toLocaleDateString()}`,
        thumbnailUrl: `https://via.placeholder.com/200x300/4F46E5/FFFFFF?text=Thumbnail`,
        weight: Math.round(baseWeight * 10) / 10,
        bodyFat: Math.round((25 - (29 - i) * 0.2) * 10) / 10,
        muscleMass: Math.round((150 - (29 - i) * 0.1) * 10) / 10,
        notes: `Week ${Math.floor((29 - i) / 7) + 1} progress photo`,
        isPrivate: true,
        tags: ['front', 'weekly', 'progress']
      });

      samplePhotos.push({
        userId: this.currentUser!.id,
        date: date.toISOString().split('T')[0],
        type: 'side',
        imageUrl: `https://via.placeholder.com/400x600/10B981/FFFFFF?text=Side+View+${date.toLocaleDateString()}`,
        thumbnailUrl: `https://via.placeholder.com/200x300/10B981/FFFFFF?text=Side`,
        weight: Math.round(baseWeight * 10) / 10,
        bodyFat: Math.round((25 - (29 - i) * 0.2) * 10) / 10,
        muscleMass: Math.round((150 - (29 - i) * 0.1) * 10) / 10,
        notes: `Week ${Math.floor((29 - i) / 7) + 1} side view`,
        isPrivate: true,
        tags: ['side', 'weekly', 'progress']
      });
    }

    samplePhotos.forEach(photo => this.addProgressPhoto(photo));
  }
}

// Export singleton instance
export const userProfileService = new UserProfileService();
