# 🗄️ Supabase Database Setup Guide

## 🚀 **Quick Setup (5 minutes)**

### **1. Create Tables in Supabase Dashboard**

Go to your Supabase project dashboard and run these SQL commands in the SQL Editor:

#### **Workouts Table**
```sql
CREATE TABLE workouts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  calories INTEGER,
  focus_areas TEXT[],
  exercises JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Progress Table**
```sql
CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  workout_id TEXT REFERENCES workouts(id),
  duration INTEGER NOT NULL,
  calories_burned INTEGER,
  exercises_completed INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### **Users Table (Optional)**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **2. Set Up Row Level Security (RLS)**

Enable RLS for basic security:

```sql
-- Enable RLS on all tables
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations)
CREATE POLICY "Allow all operations on workouts" ON workouts FOR ALL USING (true);
CREATE POLICY "Allow all operations on progress" ON progress FOR ALL USING (true);
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
```

### **3. Create Indexes for Performance**

```sql
-- Index for faster queries
CREATE INDEX idx_workouts_created_at ON workouts(created_at DESC);
CREATE INDEX idx_progress_completed_at ON progress(completed_at DESC);
CREATE INDEX idx_progress_workout_id ON progress(workout_id);
```

## 🔧 **Step-by-Step Instructions**

### **Step 1: Access SQL Editor**
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"

### **Step 2: Create Tables**
1. Copy and paste the SQL commands above
2. Click "Run" to execute
3. You should see "Success" messages

### **Step 3: Verify Tables**
1. Go to "Table Editor" in the left sidebar
2. You should see `workouts`, `progress`, and `users` tables
3. Click on each table to see the structure

## 🧪 **Test Your Setup**

### **Test 1: Insert Sample Data**
```sql
-- Insert a sample workout
INSERT INTO workouts (id, title, description, duration, difficulty, calories, focus_areas, exercises) 
VALUES (
  'test-workout-1',
  'Sample Chair Yoga Workout',
  'A gentle chair yoga session for beginners',
  15,
  'beginner',
  75,
  ARRAY['Core', 'Flexibility'],
  '[
    {
      "name": "Seated Deep Breathing",
      "description": "Sit tall and breathe deeply",
      "duration": 60,
      "sets": 1,
      "reps": "5 breaths",
      "category": "Warmup"
    }
  ]'::jsonb
);
```

### **Test 2: Query Data**
```sql
-- Check if data was inserted
SELECT * FROM workouts LIMIT 5;
```

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"Table already exists"**
   - Tables might already be created
   - Check the Table Editor to see existing tables

2. **"Permission denied"**
   - Make sure you're using the correct API keys
   - Check that RLS policies are set up correctly

3. **"Invalid JSON"**
   - Make sure JSON data is properly formatted
   - Use `::jsonb` cast for JSON fields

### **Verify Connection:**
1. Go to your app at http://localhost:3000
2. Open browser console (F12)
3. Look for any Supabase connection errors
4. Check that your `.env.local` has the correct URLs and keys

## 📊 **Database Schema Overview**

### **Workouts Table**
- `id`: Unique workout identifier
- `title`: Workout name
- `description`: Workout description
- `duration`: Length in minutes
- `difficulty`: beginner/intermediate/advanced
- `calories`: Estimated calories burned
- `focus_areas`: Array of focus areas
- `exercises`: JSON array of exercises
- `created_at`: Timestamp

### **Progress Table**
- `id`: Auto-incrementing primary key
- `workout_id`: Reference to workouts table
- `duration`: Actual time spent
- `calories_burned`: Actual calories burned
- `exercises_completed`: Number of exercises completed
- `completed_at`: Completion timestamp

### **Users Table (Optional)**
- `id`: UUID primary key
- `email`: User email
- `name`: User name
- `preferences`: JSON user preferences
- `created_at`: Account creation timestamp

## 🎯 **Next Steps**

1. **Test the app** - Generate a workout and see if it saves
2. **Check analytics** - Go to /analytics to see if data loads
3. **Add more features** - Get additional API keys for enhanced functionality

Your database is now ready to store workout data! 🚀
