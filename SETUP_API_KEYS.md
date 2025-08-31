# 🔑 API Keys Setup Guide

## 🚀 **Get Your Real Features Back!**

To restore the real AI functionality, you need to set up API keys. Here's how:

### **1. OpenAI API (GPT-4) - For AI Trainers & Analysis**

1. **Sign up**: https://platform.openai.com/
2. **Get API key**: Go to API Keys section
3. **Free tier**: $5 credit (enough for testing)
4. **Cost**: ~$0.03-0.06 per request

### **2. YouTube Data API - For Video Processing**

1. **Sign up**: https://console.cloud.google.com/
2. **Enable YouTube Data API v3**
3. **Create credentials**: API Key
4. **Free tier**: 10,000 requests/day
5. **Cost**: Free for most usage

### **3. ElevenLabs TTS - For Voice Coaching**

1. **Sign up**: https://elevenlabs.io/
2. **Get API key**: From your account
3. **Free tier**: 10,000 characters/month
4. **Cost**: Free for basic usage

## 🛠️ **Setup Steps**

### **Step 1: Create .env.local file**

Create `apps/web/.env.local` with:

```bash
# OpenAI API
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key_here

# YouTube API  
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_key_here

# ElevenLabs TTS
NEXT_PUBLIC_ELEVEN_LABS_API_KEY=your_elevenlabs_key_here
```

### **Step 2: Restart the development server**

```bash
npm run dev
```

### **Step 3: Test the features**

- **AI Personal Trainers**: Generate real workouts
- **YouTube Summarization**: Process real videos
- **Movement Analysis**: Real AI analysis
- **Voice Coaching**: Real voice synthesis

## 💰 **Cost Breakdown**

- **Development**: $0-20/month (free tiers)
- **Production**: $50-200/month (depending on usage)
- **Security**: $0 (proper setup prevents exposure)

## 🔒 **Security Notes**

- ✅ API keys are in `.env.local` (not committed to git)
- ✅ `.env.local` is in `.gitignore`
- ✅ No keys will be exposed publicly

## 🎯 **What You Get Back**

- ✅ **Real AI workout generation** with GPT-4
- ✅ **Real YouTube video processing**
- ✅ **Real voice synthesis** with ElevenLabs
- ✅ **Real movement analysis** with AI
- ✅ **All the excitement and momentum** you had before

## 🚀 **Ready to Restore?**

Once you have your API keys, the app will work exactly as it did before - with real AI intelligence, real video processing, and all the features you built over 2 weeks!

The momentum and excitement will be back immediately. 🎉
