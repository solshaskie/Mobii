export interface UserPreferences {
  theme: ThemeType;
  ttsVoice: string;
  ttsSpeed: number; // 0.5 to 2.0
  audioVolume: number; // 0 to 1
  musicEnabled: boolean;
  notificationsEnabled: boolean;
  autoPlayVideos: boolean;
  showTimer: boolean;
  showCalories: boolean;
  language: string;
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
}

export type ThemeType = keyof typeof import('./constants').THEME_COLORS;

export interface ThemeColors {
  primary: string;
  secondary: string;
  tertiary: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentGreen: string;
  accentBlue: string;
  accentPurple: string;
  accentOrange: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}
