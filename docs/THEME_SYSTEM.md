# Mobii Theme System

## Overview

The Mobii theme system provides a comprehensive, dynamic theming solution that allows users to personalize their workout experience with 8 carefully crafted themes. The system is built with accessibility, performance, and ease of use in mind.

## Available Themes

### 1. **Dark Mode** (Default)
- **Description**: Classic dark theme with neon accents
- **Best for**: Evening workouts, low-light environments
- **Colors**: Deep blacks with vibrant neon pinks, greens, and blues

### 2. **Light Mode**
- **Description**: Clean light theme for daytime use
- **Best for**: Morning workouts, bright environments
- **Colors**: Clean whites with subtle grays and accent colors

### 3. **Active Energy**
- **Description**: High energy theme for intense workouts
- **Best for**: Cardio sessions, high-intensity training
- **Colors**: Deep blues with energetic orange and teal accents

### 4. **Motivating**
- **Description**: Warm, encouraging colors for motivation
- **Best for**: When you need extra motivation
- **Colors**: Rich browns and warm oranges with encouraging accents

### 5. **Low Strain**
- **Description**: Soft, gentle colors for easy sessions
- **Best for**: Recovery workouts, gentle yoga
- **Colors**: Soft grays and muted purples for a calming experience

### 6. **Zen Calm**
- **Description**: Peaceful, natural tones for meditation
- **Best for**: Meditation, breathing exercises, relaxation
- **Colors**: Natural beiges and earth tones

### 7. **Ocean Deep**
- **Description**: Deep blue theme for focus and calm
- **Best for**: Focused strength training, concentration
- **Colors**: Deep ocean blues with calming accents

### 8. **Sunset Glow**
- **Description**: Warm gradient theme for evening sessions
- **Best for**: Evening workouts, wind-down sessions
- **Colors**: Purple gradients with warm sunset tones

## Technical Implementation

### Architecture

The theme system uses a combination of:
- **CSS Custom Properties** for dynamic color switching
- **React Context** for state management
- **localStorage** for theme persistence
- **TailwindCSS** for utility classes

### File Structure

```
apps/web/src/
├── components/
│   ├── providers/
│   │   └── theme-provider.tsx    # Theme context and provider
│   └── ui/
│       └── theme-selector.tsx    # Theme selection component
├── app/
│   ├── themes/
│   │   └── page.tsx              # Theme showcase page
│   └── globals.css               # CSS custom properties
└── lib/
    └── utils.ts                  # Utility functions

packages/shared/src/
├── constants.ts                  # Theme color definitions
└── types.ts                      # Theme-related types
```

### Core Components

#### 1. ThemeProvider (`theme-provider.tsx`)

The main theme context provider that:
- Manages current theme state
- Provides theme switching functionality
- Handles localStorage persistence
- Applies CSS custom properties to document root

```typescript
const { currentTheme, setTheme, availableThemes } = useTheme();
```

#### 2. ThemeSelector (`theme-selector.tsx`)

A dropdown component that:
- Displays all available themes
- Shows theme previews
- Allows instant theme switching
- Provides theme descriptions

#### 3. Theme Showcase (`/themes` page)

A dedicated page that:
- Displays all themes in a grid layout
- Shows live previews of each theme
- Demonstrates theme features
- Provides detailed theme information

### CSS Custom Properties

The system uses CSS custom properties for all colors:

```css
:root {
  --background-primary: #0a0a0a;
  --background-secondary: #1a1a1a;
  --background-tertiary: #2a2a2a;
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --text-muted: #666666;
  --accent: #ff0080;
  --accent-green: #00ff88;
  --accent-blue: #0080ff;
  --accent-purple: #8000ff;
  --accent-orange: #ff8000;
  --accent-pink: #ff0080;
  --border: #333333;
  --success: #00ff88;
  --warning: #ff8000;
  --error: #ff4444;
  --info: #0080ff;
}
```

### TailwindCSS Integration

Colors are mapped to TailwindCSS using CSS custom properties:

```javascript
// tailwind.config.js
colors: {
  background: {
    primary: 'var(--background-primary)',
    secondary: 'var(--background-secondary)',
    tertiary: 'var(--background-tertiary)',
  },
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    muted: 'var(--text-muted)',
  },
  accent: {
    DEFAULT: 'var(--accent)',
    green: 'var(--accent-green)',
    blue: 'var(--accent-blue)',
    purple: 'var(--accent-purple)',
    orange: 'var(--accent-orange)',
    pink: 'var(--accent-pink)',
  },
}
```

## Usage

### Basic Theme Switching

```typescript
import { useTheme } from '../components/providers/theme-provider';

function MyComponent() {
  const { currentTheme, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme('active')}>
      Switch to Active Theme
    </button>
  );
}
```

### Accessing Theme Colors

```typescript
import { useTheme } from '../components/providers/theme-provider';

function MyComponent() {
  const { themeColors } = useTheme();
  
  return (
    <div style={{ backgroundColor: themeColors.primary }}>
      Content
    </div>
  );
}
```

### Using TailwindCSS Classes

```tsx
// These classes automatically adapt to the current theme
<div className="bg-background-primary text-text-primary">
  <button className="bg-accent text-text-primary">
    Themed Button
  </button>
</div>
```

## Adding New Themes

### 1. Define Theme Colors

Add your theme to `packages/shared/src/constants.ts`:

```typescript
export const THEME_COLORS = {
  // ... existing themes
  myNewTheme: {
    primary: '#your-primary-color',
    secondary: '#your-secondary-color',
    tertiary: '#your-tertiary-color',
    text: '#your-text-color',
    textSecondary: '#your-text-secondary-color',
    textMuted: '#your-text-muted-color',
    accent: '#your-accent-color',
    accentGreen: '#your-success-color',
    accentBlue: '#your-info-color',
    accentPurple: '#your-purple-color',
    accentOrange: '#your-warning-color',
    border: '#your-border-color',
    success: '#your-success-color',
    warning: '#your-warning-color',
    error: '#your-error-color',
    info: '#your-info-color',
  },
} as const;
```

### 2. Add Theme Metadata

```typescript
export const THEME_NAMES = {
  // ... existing themes
  myNewTheme: 'My New Theme',
} as const;

export const THEME_DESCRIPTIONS = {
  // ... existing themes
  myNewTheme: 'Description of your new theme',
} as const;
```

### 3. Update Types

The types will automatically update based on the `THEME_COLORS` constant.

## Accessibility Features

### Color Contrast

All themes are designed to meet WCAG 2.1 AA standards:
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio

### Color Blindness Support

Themes are tested for:
- **Protanopia** (red-green color blindness)
- **Deuteranopia** (red-green color blindness)
- **Tritanopia** (blue-yellow color blindness)

### Focus Indicators

Consistent focus indicators across all themes:
- High contrast focus rings
- Visible focus states
- Keyboard navigation support

## Performance Optimizations

### Instant Theme Switching

- CSS custom properties enable instant color changes
- No component re-renders required
- Smooth transitions between themes

### Minimal Bundle Size

- Theme definitions are shared across the app
- No duplicate color definitions
- Efficient CSS custom property usage

### Caching

- Theme preference is cached in localStorage
- No server requests for theme switching
- Fast initial load with cached theme

## Best Practices

### 1. Use Semantic Color Names

```typescript
// Good
backgroundColor: themeColors.primary
color: themeColors.text

// Avoid
backgroundColor: '#000000'
color: '#ffffff'
```

### 2. Leverage TailwindCSS Classes

```tsx
// Good
<div className="bg-background-primary text-text-primary">

// Avoid
<div style={{ backgroundColor: themeColors.primary }}>
```

### 3. Test Across All Themes

When adding new components:
- Test with all 8 themes
- Ensure readability in all themes
- Verify contrast ratios
- Check focus states

### 4. Consider Theme Context

Design components that work well across different themes:
- Use semantic color names
- Avoid hardcoded colors
- Consider theme-specific adjustments

## Troubleshooting

### Theme Not Switching

1. Check if `ThemeProvider` is wrapping your app
2. Verify theme name exists in `THEME_COLORS`
3. Check browser console for errors
4. Clear localStorage and try again

### Colors Not Updating

1. Ensure CSS custom properties are being set
2. Check TailwindCSS configuration
3. Verify class names are using theme variables
4. Clear browser cache

### Performance Issues

1. Check for unnecessary re-renders
2. Verify theme switching is using CSS custom properties
3. Monitor bundle size for theme definitions
4. Use React DevTools to profile theme changes

## Future Enhancements

### Planned Features

1. **Custom Theme Builder**
   - User-defined color palettes
   - Theme sharing between users
   - Import/export theme configurations

2. **Automatic Theme Detection**
   - System theme detection
   - Time-based theme switching
   - Location-based theme suggestions

3. **Advanced Accessibility**
   - High contrast mode
   - Reduced motion preferences
   - Screen reader optimizations

4. **Theme Analytics**
   - Theme usage tracking
   - Popular theme identification
   - User preference analysis

### Contributing

To contribute to the theme system:

1. Follow the existing theme structure
2. Test across all themes
3. Ensure accessibility compliance
4. Update documentation
5. Add theme previews

## Conclusion

The Mobii theme system provides a robust, accessible, and performant solution for user customization. With 8 carefully crafted themes and a flexible architecture, users can personalize their workout experience while maintaining excellent usability and accessibility standards.

The system is designed to be easily extensible, allowing for future enhancements while maintaining backward compatibility and performance.
