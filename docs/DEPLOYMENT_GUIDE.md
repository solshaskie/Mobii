# Mobii Deployment Guide

## 🚀 **Production Deployment Guide**

This guide covers the complete deployment process for the Mobii application, including web app, backend API, and mobile app deployment.

---

## 📋 **Prerequisites**

### **Required Accounts & Services**
- [ ] **GitHub Account** - For source code and CI/CD
- [ ] **Vercel Account** - For web app and API deployment
- [ ] **Supabase Account** - For database and authentication
- [ ] **Cloudinary Account** - For media storage
- [ ] **OpenAI Account** - For AI features
- [ ] **Sentry Account** - For error tracking
- [ ] **Google Analytics** - For user analytics
- [ ] **Apple Developer Account** - For iOS app deployment
- [ ] **Google Play Console** - For Android app deployment

### **Required Tools**
- [ ] **Node.js 18+** - Runtime environment
- [ ] **npm 9+** - Package manager
- [ ] **Git** - Version control
- [ ] **Vercel CLI** - Deployment tool
- [ ] **Android Studio** - Android development
- [ ] **Xcode** - iOS development (macOS only)

---

## 🏗️ **Infrastructure Setup**

### **1. Vercel Project Setup**

#### **Create Vercel Project**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Initialize project
vercel

# Follow prompts:
# - Set up and deploy: Yes
# - Which scope: Select your account
# - Link to existing project: No
# - Project name: mobii
# - Directory: ./
# - Override settings: No
```

#### **Configure Environment Variables**
```bash
# Add environment variables to Vercel
vercel env add DATABASE_URL
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add NEXTAUTH_SECRET
vercel env add OPENAI_API_KEY
# ... add all other environment variables
```

### **2. Supabase Database Setup**

#### **Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Choose organization and project name
4. Set database password
5. Choose region closest to your users

#### **Configure Database**
```bash
# Get database connection string
# Format: postgresql://postgres:[password]@[host]:5432/postgres

# Update environment variables
vercel env add DATABASE_URL "postgresql://postgres:[password]@[host]:5432/postgres"
vercel env add SUPABASE_URL "https://[project-id].supabase.co"
vercel env add SUPABASE_ANON_KEY "[anon-key]"
```

#### **Run Database Migrations**
```bash
# Deploy database schema
npm run db:migrate:deploy

# Seed production data
npm run db:seed:prod
```

### **3. Cloudinary Setup**

#### **Create Cloudinary Account**
1. Go to [cloudinary.com](https://cloudinary.com)
2. Create free account
3. Get credentials from dashboard

#### **Configure Cloudinary**
```bash
vercel env add CLOUDINARY_CLOUD_NAME "[cloud-name]"
vercel env add CLOUDINARY_API_KEY "[api-key]"
vercel env add CLOUDINARY_API_SECRET "[api-secret]"
```

---

## 🔧 **Environment Configuration**

### **Production Environment Variables**

Create `.env.production` file with all required variables:

```bash
# Copy example file
cp env.production.example .env.production

# Edit with your actual values
nano .env.production
```

#### **Required Variables**
```bash
# Database
DATABASE_URL="postgresql://..."
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
JWT_SECRET="your-jwt-secret"

# AI Services
OPENAI_API_KEY="your-openai-key"
ELEVEN_LABS_API_KEY="your-eleven-labs-key"

# Media
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Analytics
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
SENTRY_DSN="https://your-sentry-dsn"

# Feature Flags
ENABLE_AI_FEATURES="true"
ENABLE_SENSOR_INTEGRATION="true"
```

---

## 🚀 **Deployment Process**

### **1. Pre-Deployment Checklist**

#### **Code Quality**
```bash
# Run all tests
npm run test:all

# Run linting
npm run lint:all

# Type checking
npm run type-check

# Security audit
npm run security:audit
```

#### **Build Verification**
```bash
# Build all packages
npm run build:all

# Verify builds
npm run analyze
```

### **2. Database Migration**

#### **Production Migration**
```bash
# Deploy migrations
npm run db:migrate:deploy

# Verify database connection
npm run db:verify

# Seed initial data
npm run db:seed:prod
```

### **3. Deploy to Vercel**

#### **Automatic Deployment (Recommended)**
```bash
# Push to main branch triggers automatic deployment
git push origin main
```

#### **Manual Deployment**
```bash
# Deploy to production
vercel --prod

# Or use npm script
npm run deploy:prod
```

### **4. Verify Deployment**

#### **Health Checks**
```bash
# Check API health
curl https://your-domain.com/api/health

# Check web app
curl https://your-domain.com

# Check database connection
curl https://your-domain.com/api/db/status
```

#### **Performance Testing**
```bash
# Run Lighthouse CI
npm run lighthouse

# Check Core Web Vitals
# Visit: https://pagespeed.web.dev/
```

---

## 📱 **Mobile App Deployment**

### **1. React Native Setup**

#### **Initialize Mobile App**
```bash
# Navigate to mobile directory
cd apps/mobile

# Install dependencies
npm install

# iOS setup (macOS only)
cd ios && pod install && cd ..

# Android setup
# Open Android Studio and sync project
```

#### **Environment Configuration**
```bash
# Create mobile environment file
cp .env.example .env

# Configure mobile-specific variables
MOBILE_APP_ID="com.mobii.app"
API_BASE_URL="https://your-api-domain.com"
```

### **2. Android App Deployment**

#### **Build Configuration**
```bash
# Update app/build.gradle
android {
    defaultConfig {
        applicationId "com.mobii.app"
        versionCode 1
        versionName "1.0.0"
    }
}
```

#### **Build Release APK**
```bash
# Generate release build
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/
```

#### **Google Play Console**
1. Create developer account
2. Create new app
3. Upload APK/AAB
4. Configure store listing
5. Submit for review

### **3. iOS App Deployment**

#### **Xcode Configuration**
```bash
# Open project in Xcode
open ios/Mobii.xcworkspace

# Configure signing
# - Team: Your Apple Developer Team
# - Bundle Identifier: com.mobii.app
# - Version: 1.0.0
```

#### **Build for App Store**
```bash
# Archive app
# Product > Archive

# Upload to App Store Connect
# Organizer > Distribute App
```

#### **App Store Connect**
1. Create new app
2. Configure app information
3. Upload build
4. Submit for review

---

## 🔍 **Monitoring & Analytics**

### **1. Error Tracking (Sentry)**

#### **Setup Sentry**
```bash
# Install Sentry CLI
npm install -g @sentry/cli

# Initialize Sentry
sentry-cli init

# Configure DSN
vercel env add SENTRY_DSN "https://your-sentry-dsn"
```

#### **Monitor Errors**
- Visit [sentry.io](https://sentry.io)
- Check error rates and performance
- Set up alerts for critical errors

### **2. Performance Monitoring**

#### **Vercel Analytics**
- Automatic performance monitoring
- Core Web Vitals tracking
- Real user monitoring

#### **Custom Metrics**
```bash
# Add performance tracking
npm install @vercel/analytics

# Track custom events
import { track } from '@vercel/analytics';

track('workout_completed', {
  duration: 1800,
  calories: 150,
  type: 'chair_yoga'
});
```

### **3. User Analytics**

#### **Google Analytics 4**
```bash
# Add GA4 tracking
vercel env add NEXT_PUBLIC_GA_ID "G-XXXXXXXXXX"

# Track custom events
gtag('event', 'workout_started', {
  workout_type: 'chair_yoga',
  difficulty: 'beginner'
});
```

---

## 🔒 **Security Configuration**

### **1. SSL/TLS Setup**
- Automatic with Vercel
- Custom domain SSL certificates
- HSTS headers enabled

### **2. Security Headers**
```json
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### **3. Rate Limiting**
```bash
# Configure rate limits
vercel env add RATE_LIMIT_WINDOW_MS "900000"
vercel env add RATE_LIMIT_MAX_REQUESTS "100"
```

---

## 📊 **Performance Optimization**

### **1. Frontend Optimization**

#### **Bundle Analysis**
```bash
# Analyze bundle size
npm run analyze

# Optimize imports
# Use dynamic imports for large components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

#### **Image Optimization**
```bash
# Use Next.js Image component
import Image from 'next/image';

<Image
  src="/workout-image.jpg"
  alt="Workout"
  width={400}
  height={300}
  priority
/>
```

### **2. Backend Optimization**

#### **Database Indexing**
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_created_at ON workouts(created_at);
CREATE INDEX idx_exercises_category ON exercises(category);
```

#### **Caching Strategy**
```bash
# Redis caching
vercel env add REDIS_URL "redis://..."

# Implement caching for:
# - Exercise library
# - User preferences
# - Workout recommendations
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Clear cache and rebuild
npm run clean
rm -rf node_modules
npm install
npm run build:all
```

#### **Database Connection Issues**
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
npm run db:verify

# Check Supabase dashboard
# - Database status
# - Connection limits
```

#### **Mobile Build Issues**
```bash
# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
cd android && ./gradlew clean && cd ..
npx react-native run-android
```

### **Performance Issues**

#### **Slow Load Times**
- Check bundle size
- Optimize images
- Enable compression
- Use CDN for static assets

#### **High Memory Usage**
- Monitor memory usage
- Optimize component rendering
- Implement proper cleanup

---

## 📈 **Post-Deployment**

### **1. Monitoring Setup**

#### **Uptime Monitoring**
- Set up StatusCake or UptimeRobot
- Monitor critical endpoints
- Set up alerts for downtime

#### **Performance Monitoring**
- Monitor Core Web Vitals
- Track API response times
- Monitor database performance

### **2. User Feedback**

#### **Analytics Review**
- Monitor user behavior
- Track feature usage
- Identify pain points

#### **Error Tracking**
- Monitor error rates
- Set up error alerts
- Prioritize bug fixes

### **3. Continuous Improvement**

#### **Regular Updates**
- Weekly dependency updates
- Monthly security audits
- Quarterly performance reviews

#### **Feature Rollouts**
- Use feature flags
- A/B testing for new features
- Gradual rollout strategy

---

## 🎯 **Success Metrics**

### **Performance Targets**
- **Web App Load Time**: < 2 seconds
- **API Response Time**: < 200ms
- **Mobile App Launch**: < 1 second
- **Uptime**: > 99.9%

### **User Experience Metrics**
- **Workout Completion Rate**: > 85%
- **User Retention**: > 70% after 30 days
- **App Store Rating**: > 4.5 stars
- **Support Tickets**: < 5% of users

### **Technical Metrics**
- **Error Rate**: < 1%
- **Page Load Speed**: > 90 Lighthouse score
- **Bundle Size**: < 2MB for web, < 50MB for mobile
- **Test Coverage**: > 80%

---

## 📞 **Support & Maintenance**

### **Emergency Contacts**
- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)
- **OpenAI Support**: [platform.openai.com/support](https://platform.openai.com/support)

### **Maintenance Schedule**
- **Daily**: Monitor error rates and performance
- **Weekly**: Review analytics and user feedback
- **Monthly**: Security updates and dependency maintenance
- **Quarterly**: Performance optimization and feature planning

---

**Deployment Status**: ✅ **Ready for Production**  
**Last Updated**: December 2024  
**Next Review**: January 2025
