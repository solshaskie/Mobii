# Mobii UI Wireframes & Design Specifications

## 🎨 Design System Overview

### Design Philosophy
- **Dark Mode First**: High contrast backgrounds with neon accents
- **Minimalist**: Clean, uncluttered interfaces with clear hierarchy
- **Accessible**: WCAG 2.1 AA compliance with proper contrast ratios
- **Responsive**: Mobile-first design that scales to all devices
- **Engaging**: Smooth animations and micro-interactions

### Color Palette
```css
/* Primary Colors */
--bg-primary: #0a0a0a;      /* Deep black background */
--bg-secondary: #1a1a1a;    /* Slightly lighter black */
--bg-tertiary: #2a2a2a;     /* Card backgrounds */

/* Text Colors */
--text-primary: #ffffff;     /* White text */
--text-secondary: #b3b3b3;  /* Secondary text */
--text-muted: #666666;      /* Muted text */

/* Neon Accent Colors */
--accent-green: #00ff88;    /* Success, progress */
--accent-pink: #ff0080;     /* Primary actions */
--accent-blue: #0080ff;     /* Information, links */
--accent-purple: #8000ff;   /* Premium features */
--accent-orange: #ff8000;   /* Warnings, highlights */

/* Gradients */
--gradient-primary: linear-gradient(135deg, #ff0080 0%, #8000ff 100%);
--gradient-secondary: linear-gradient(135deg, #00ff88 0%, #0080ff 100%);
```

## 📱 Layout Wireframes

### 1. Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header                                                      │
├─────────────────────────────────────────────────────────────┤
│ Sidebar │ Main Content Area                                │
│         │                                                  │
│ 🏠 Home │ ┌─────────────────────────────────────────────┐   │
│ 🏋️ Workouts │ │ Welcome back, [User]! │ [Profile] │   │
│ 📊 Progress │ └─────────────────────────────────────────────┘   │
│ ⚙️ Settings │                                                  │
│         │ ┌─────────────────────────────────────────────┐   │
│         │ │ Today's Workout                             │   │
│         │ │ [Workout Card]                              │   │
│         │ │ [Start Workout Button]                      │   │
│         │ └─────────────────────────────────────────────┘   │
│         │                                                  │
│         │ ┌─────────────────────────────────────────────┐   │
│         │ │ Quick Stats                                 │   │
│         │ │ [Progress Cards]                            │   │
│         │ └─────────────────────────────────────────────┘   │
│         │                                                  │
│         │ ┌─────────────────────────────────────────────┐   │
│         │ │ Recent Activity                             │   │
│         │ │ [Activity Timeline]                         │   │
│         │ └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### Dashboard Components

**Header**
- Logo (Mobii) with neon glow effect
- Search bar (optional)
- Notifications bell with badge
- User avatar with dropdown menu

**Sidebar Navigation**
- Collapsible on mobile
- Active state with neon accent
- Icons with labels
- Bottom section for premium features

**Main Content Area**
- Welcome message with user's name
- Today's workout card (prominent)
- Quick stats grid (4 cards)
- Recent activity feed

### 2. Workout Player Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Workout Player - [Workout Name]                            │
├─────────────────────────────────────────────────────────────┤
│ Video/Image Area │ Exercise Info                           │
│                 │                                          │
│ ┌─────────────┐ │ Exercise: [Exercise Name]                │
│ │             │ │ Duration: [Timer]                        │
│ │   Video     │ │ Sets: [Current/Total]                    │
│ │   Player    │ │ Reps: [Current/Total]                    │
│ │             │ │                                          │
│ │ [Controls]  │ │ Instructions:                            │
│ └─────────────┘ │ [Step-by-step text]                      │
│                 │                                          │
│                 │ ┌─────────────────────────────────────┐   │
│                 │ │ Audio Controls                       │   │
│                 │ │ [TTS Voice] [Background Music]      │   │
│                 │ └─────────────────────────────────────┘   │
│                 │                                          │
│                 │ ┌─────────────────────────────────────┐   │
│                 │ │ Workout Progress                     │   │
│                 │ │ [Progress Bar] [Exercise List]      │   │
│                 │ └─────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│ Bottom Controls: [Previous] [Pause/Play] [Next] [Skip]    │
└─────────────────────────────────────────────────────────────┘
```

#### Workout Player Features

**Video/Image Area**
- Full-screen video player
- Fallback to static images
- YouTube embed integration
- Video controls overlay

**Exercise Information Panel**
- Current exercise details
- Timer with countdown
- Set/rep counter
- Step-by-step instructions
- Modification options

**Audio Controls**
- TTS voice selection
- Background music toggle
- Volume controls
- Voice speed adjustment

**Progress Tracking**
- Overall workout progress bar
- Exercise list with completion status
- Time remaining indicator
- Calories burned estimate

### 3. Progress Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Progress Dashboard                                          │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Overview Stats                                          │ │
│ │ [Total Workouts] [Streak] [Calories] [Time]            │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Progress Charts                                         │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐        │ │
│ │ │ Weight      │ │ Strength    │ │ Flexibility │        │ │
│ │ │ [Chart]     │ │ [Chart]     │ │ [Chart]     │        │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Workout History                                         │ │
│ │ [Calendar View] [List View] [Filter Options]           │ │
│ │ [Workout History Cards]                                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Goals & Achievements                                    │ │
│ │ [Goal Progress] [Achievement Badges] [Milestones]      │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### Progress Dashboard Components

**Overview Stats**
- Total workouts completed
- Current streak counter
- Total calories burned
- Total time spent exercising

**Progress Charts**
- Weight tracking over time
- Strength progression
- Flexibility improvements
- Interactive charts with zoom/pan

**Workout History**
- Calendar view with completion indicators
- List view with detailed workout cards
- Filter by date, type, difficulty
- Export functionality

**Goals & Achievements**
- Goal progress bars
- Achievement badges with unlock animations
- Milestone celebrations
- Goal setting interface

### 4. Mobile Layout Adaptations

#### Mobile Dashboard
```
┌─────────────────────────────────────┐
│ Header                              │
├─────────────────────────────────────┤
│ Welcome back, [User]!               │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Today's Workout                 │ │
│ │ [Workout Card]                  │ │
│ │ [Start Button]                  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Quick Stats                     │ │
│ │ [2x2 Grid of Stats]             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Recent Activity                 │ │
│ │ [Activity Cards]                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Bottom Navigation: [🏠] [🏋️] [📊] [⚙️] │
└─────────────────────────────────────┘
```

#### Mobile Workout Player
```
┌─────────────────────────────────────┐
│ Workout Player                      │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Video Player                    │ │
│ │ [Full-width video]              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Exercise: [Exercise Name]           │
│ Timer: [Countdown]                  │
│ Sets: [Current/Total]               │
│                                     │
│ Instructions:                       │
│ [Step-by-step text]                 │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Audio Controls                   │ │
│ │ [Voice] [Music] [Volume]        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Progress: [Progress Bar]            │
│                                     │
│ [Previous] [Pause/Play] [Next]      │
└─────────────────────────────────────┘
```

## 🎭 Component Specifications

### 1. Workout Cards

**Design**
- Rounded corners (12px)
- Subtle border with neon accent
- Hover effects with glow
- Gradient backgrounds

**Content**
- Workout thumbnail/image
- Title and description
- Duration and difficulty
- Progress indicator
- Action buttons

**States**
- Default: Subtle glow
- Hover: Enhanced glow + scale
- Active: Full neon border
- Completed: Success accent

### 2. Progress Indicators

**Circular Progress**
- Neon accent color
- Smooth animations
- Percentage display
- Pulsing effect for active state

**Linear Progress**
- Gradient background
- Smooth transitions
- Milestone markers
- Completion celebrations

### 3. Buttons

**Primary Button**
- Gradient background
- Neon glow effect
- Hover animations
- Loading states

**Secondary Button**
- Transparent background
- Neon border
- Subtle hover effects

**Icon Buttons**
- Circular design
- Icon with label
- Hover tooltips
- Active states

### 4. Navigation

**Sidebar**
- Dark background
- Neon accent for active items
- Smooth transitions
- Collapsible on mobile

**Bottom Navigation (Mobile)**
- Fixed position
- Icon-based design
- Active state indicators
- Haptic feedback

## 🎨 Animation Specifications

### Micro-interactions

**Button Hover**
- Scale: 1.02
- Duration: 200ms
- Easing: ease-out

**Card Hover**
- Scale: 1.05
- Glow intensity: +20%
- Duration: 300ms
- Easing: ease-in-out

**Page Transitions**
- Fade in/out
- Duration: 400ms
- Easing: ease-in-out

### Loading States

**Skeleton Loading**
- Pulse animation
- Duration: 1.5s
- Infinite loop

**Progress Animations**
- Smooth counting
- Duration: 1s
- Easing: ease-out

## 📱 Responsive Breakpoints

### Mobile (< 768px)
- Single column layout
- Bottom navigation
- Full-width components
- Touch-friendly interactions

### Tablet (768px - 1024px)
- Two-column layout
- Sidebar navigation
- Medium-sized components
- Hybrid touch/mouse interactions

### Desktop (> 1024px)
- Multi-column layout
- Full sidebar navigation
- Large components
- Mouse-optimized interactions

## 🔧 Implementation Guidelines

### CSS Architecture
- TailwindCSS utility classes
- Custom CSS variables for theming
- Component-based styling
- Responsive design utilities

### Animation Framework
- Framer Motion for complex animations
- CSS transitions for simple effects
- Intersection Observer for scroll animations
- Performance-optimized animations

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management

### Performance
- Lazy loading for images/videos
- Optimized animations
- Efficient re-renders
- Bundle size optimization

This comprehensive UI design system ensures a consistent, engaging, and accessible user experience across all devices and platforms.
