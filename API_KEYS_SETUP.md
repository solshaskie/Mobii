# 🔑 API Keys Setup Guide

## 🆓 **FREE AI Alternatives (No OpenAI Needed!)**

Your Intel i5-2400 with 16GB RAM will work perfectly with these cloud-based free AI services!

### **1. 🥇 Hugging Face (Recommended - Most Generous)**
**Why it's perfect for your setup:**
- ✅ **FREE**: 30,000 requests/month
- ✅ **Fast**: Cloud-powered, no local processing
- ✅ **Easy**: Simple API calls
- ✅ **Quality**: Excellent for fitness content

**Get your FREE key:**
1. Go to [huggingface.co](https://huggingface.co)
2. Click "Sign Up" (free account)
3. Go to Settings → Access Tokens
4. Click "New token"
5. Name it "Mobii AI" and select "Read" permissions
6. Copy the token

**Add to your `.env.local`:**
```env
NEXT_PUBLIC_HUGGING_FACE_API_KEY=hf_your_token_here
```

### **2. 🥈 Google Gemini (Great Backup)**
**Why it's great:**
- ✅ **FREE**: 15 requests/minute (plenty for testing)
- ✅ **Fast**: Google's infrastructure
- ✅ **Quality**: Comparable to GPT-3.5

**Get your FREE key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the key

**Add to your `.env.local`:**
```env
NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=your_gemini_key_here
```

### **3. 🥉 Perplexity (Claude Alternative)**
**Why it's good:**
- ✅ **FREE**: Generous free tier
- ✅ **Quality**: Access to Claude models
- ✅ **Fast**: Cloud-based

**Get your FREE key:**
1. Go to [perplexity.ai](https://www.perplexity.ai/settings/api)
2. Sign up for free account
3. Go to API settings
4. Generate new API key

**Add to your `.env.local`:**
```env
NEXT_PUBLIC_PERPLEXITY_API_KEY=your_perplexity_key_here
```

## 🎵 **Audio Services**

### **Eleven Labs (Text-to-Speech)**
**Get FREE key:**
1. Go to [elevenlabs.io](https://elevenlabs.io/)
2. Sign up for free account
3. Go to Profile → API Key
4. Copy your key

**Add to your `.env.local`:**
```env
ELEVEN_LABS_API_KEY=your_eleven_labs_key_here
```

## 🎥 **Video Services**

### **YouTube API (Exercise Videos)**
**Get FREE key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project (free)
3. Enable YouTube Data API v3
4. Create credentials → API Key
5. Copy the key

**Add to your `.env.local`:**
```env
YOUTUBE_API_KEY=your_youtube_api_key_here
```

## ☁️ **Cloud Storage**

### **Cloudinary (Images & Videos)**
**Get FREE account:**
1. Go to [cloudinary.com](https://cloudinary.com/)
2. Sign up for free account
3. Go to Dashboard
4. Copy Cloud Name, API Key, and API Secret

**Add to your `.env.local`:**
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🗄️ **Database Options**

### **Option 1: Supabase (Recommended - Free)**
**Get FREE account:**
1. Go to [supabase.com](https://supabase.com/)
2. Sign up for free account
3. Create new project
4. Go to Settings → API
5. Copy URL and anon key

**Add to your `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### **Option 2: Local PostgreSQL**
**Install PostgreSQL locally:**
1. Download from [postgresql.org](https://www.postgresql.org/download/)
2. Create database named `mobii_db`
3. Add connection string

**Add to your `.env.local`:**
```env
DATABASE_URL=postgresql://username:password@localhost:5432/mobii_db
```

## 🔒 **Security**

### **JWT Secret**
Generate a random string for JWT signing:

**Option 1: Use Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Use online generator**
Go to [randomkeygen.com](https://randomkeygen.com/) and copy a 64-character string

**Add to your `.env.local`:**
```env
JWT_SECRET=your_generated_secret_here
```

## 📝 **Complete .env.local Template**

Copy this template to `apps/web/.env.local` and fill in your keys:

```env
# AI Services (FREE Alternatives)
NEXT_PUBLIC_HUGGING_FACE_API_KEY=your_hugging_face_key_here
NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY=your_gemini_key_here
NEXT_PUBLIC_PERPLEXITY_API_KEY=your_perplexity_key_here

# Audio & Video Services
ELEVEN_LABS_API_KEY=your_eleven_labs_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Database
DATABASE_URL=your_database_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Security
JWT_SECRET=your_jwt_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🚀 **Quick Start (Minimal Setup)**

If you want to test the app immediately with minimal setup:

1. **Get Hugging Face key** (5 minutes, completely free)
2. **Get Supabase account** (5 minutes, free tier)
3. **Generate JWT secret** (1 minute)

That's it! The app will work with smart default workouts even without all the other keys.

## ✅ **Priority Order**

1. **Essential (App works):** Hugging Face + Supabase + JWT Secret
2. **Enhanced (Better AI):** Add Google Gemini
3. **Full Features (Audio/Video):** Add Eleven Labs + YouTube + Cloudinary
4. **Backup AI:** Add Perplexity

## 🆘 **Need Help?**

- **Hugging Face issues:** Check their [API docs](https://huggingface.co/docs/api-inference)
- **Supabase issues:** Check their [quickstart guide](https://supabase.com/docs/guides/getting-started)
- **General setup:** The app has fallbacks, so it will work even with missing keys!

## 💡 **Pro Tips**

1. **Start with Hugging Face** - it's the most generous free tier
2. **Use Supabase** - easier than setting up local PostgreSQL
3. **Test incrementally** - add one service at a time
4. **Keep keys secure** - never commit `.env.local` to git

Your Intel i5-2400 will handle this perfectly! The AI processing happens in the cloud, so your computer just needs to make API calls. 🚀
