'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@mobii/ui';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Volume2, 
  Heart, 
  Star,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  category: 'motivational' | 'calm' | 'professional' | 'friendly' | 'energetic' | 'creative' | 'fitness' | 'meditation';
  gender: 'male' | 'female' | 'neutral';
  age: 'young' | 'adult' | 'mature';
  personality: string[];
  bestFor: string[];
  previewText?: string;
}

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
  className?: string;
}

// Predefined voice options
const predefinedVoices: VoiceOption[] = [
  // Motivational Voices
  {
    id: 'rachel_motivational',
    name: 'Rachel',
    description: 'Energetic and inspiring fitness coach',
    category: 'motivational',
    gender: 'female',
    age: 'adult',
    personality: ['energetic', 'inspiring', 'encouraging'],
    bestFor: ['high-intensity workouts', 'motivation', 'energy boost'],
    previewText: 'You\'ve got this! Let\'s crush this workout together!'
  },
  {
    id: 'mike_energetic',
    name: 'Mike',
    description: 'Dynamic and powerful motivator',
    category: 'motivational',
    gender: 'male',
    age: 'adult',
    personality: ['dynamic', 'powerful', 'enthusiastic'],
    bestFor: ['strength training', 'cardio', 'competition prep'],
    previewText: 'Time to push your limits! You\'re stronger than you think!'
  },
  {
    id: 'sarah_cheerleader',
    name: 'Sarah',
    description: 'Cheerful and supportive cheerleader',
    category: 'motivational',
    gender: 'female',
    age: 'young',
    personality: ['cheerful', 'supportive', 'positive'],
    bestFor: ['beginner workouts', 'morning routines', 'positive reinforcement'],
    previewText: 'You\'re doing amazing! Keep that energy up!'
  },

  // Calm Voices
  {
    id: 'zen_master',
    name: 'Zen Master',
    description: 'Peaceful and mindful meditation guide',
    category: 'calm',
    gender: 'male',
    age: 'mature',
    personality: ['peaceful', 'mindful', 'serene'],
    bestFor: ['yoga', 'meditation', 'cool-down', 'stress relief'],
    previewText: 'Breathe deeply. Find your center. You are exactly where you need to be.'
  },
  {
    id: 'serena_calm',
    name: 'Serena',
    description: 'Gentle and soothing wellness coach',
    category: 'calm',
    gender: 'female',
    age: 'adult',
    personality: ['gentle', 'soothing', 'nurturing'],
    bestFor: ['recovery workouts', 'evening routines', 'mindfulness'],
    previewText: 'Take it easy. Listen to your body. You\'re doing perfectly.'
  },

  // Professional Voices
  {
    id: 'dr_alex',
    name: 'Dr. Alex',
    description: 'Knowledgeable and precise fitness expert',
    category: 'professional',
    gender: 'male',
    age: 'adult',
    personality: ['knowledgeable', 'precise', 'authoritative'],
    bestFor: ['technical training', 'form instruction', 'educational content'],
    previewText: 'Maintain proper form. Focus on technique. Quality over quantity.'
  },
  {
    id: 'coach_maria',
    name: 'Coach Maria',
    description: 'Experienced and structured trainer',
    category: 'professional',
    gender: 'female',
    age: 'adult',
    personality: ['experienced', 'structured', 'reliable'],
    bestFor: ['structured workouts', 'progressive training', 'goal setting'],
    previewText: 'Let\'s follow the plan. Stay consistent. Results will follow.'
  },

  // Friendly Voices
  {
    id: 'buddy_chris',
    name: 'Buddy Chris',
    description: 'Your friendly workout partner',
    category: 'friendly',
    gender: 'male',
    age: 'young',
    personality: ['friendly', 'casual', 'supportive'],
    bestFor: ['casual workouts', 'social exercise', 'fun routines'],
    previewText: 'Hey there! Ready to have some fun while we get fit?'
  },
  {
    id: 'friend_lisa',
    name: 'Friend Lisa',
    description: 'Warm and encouraging companion',
    category: 'friendly',
    gender: 'female',
    age: 'adult',
    personality: ['warm', 'encouraging', 'relatable'],
    bestFor: ['daily routines', 'consistency building', 'emotional support'],
    previewText: 'I\'m here for you! Let\'s make today count together.'
  },

  // Energetic Voices
  {
    id: 'fire_ignite',
    name: 'Fire Ignite',
    description: 'Burning passion and unstoppable energy',
    category: 'energetic',
    gender: 'male',
    age: 'young',
    personality: ['passionate', 'unstoppable', 'intense'],
    bestFor: ['high-intensity training', 'competition prep', 'energy boost'],
    previewText: 'IGNITE THE FIRE! You\'re unstoppable! Let\'s burn!'
  },
  {
    id: 'lightning_bolt',
    name: 'Lightning Bolt',
    description: 'Fast-paced and electrifying motivator',
    category: 'energetic',
    gender: 'female',
    age: 'young',
    personality: ['fast-paced', 'electrifying', 'dynamic'],
    bestFor: ['HIIT workouts', 'sprint training', 'quick bursts'],
    previewText: 'Lightning speed! Quick and powerful! Let\'s move!'
  },

  // Creative Voices
  {
    id: 'artist_flow',
    name: 'Artist Flow',
    description: 'Creative and expressive movement guide',
    category: 'creative',
    gender: 'female',
    age: 'young',
    personality: ['creative', 'expressive', 'artistic'],
    bestFor: ['dance workouts', 'creative movement', 'self-expression'],
    previewText: 'Express yourself through movement. Dance with your soul.'
  },
  {
    id: 'poet_words',
    name: 'Poet Words',
    description: 'Eloquent and inspiring storyteller',
    category: 'creative',
    gender: 'male',
    age: 'mature',
    personality: ['eloquent', 'inspiring', 'philosophical'],
    bestFor: ['mindful movement', 'inspiration', 'reflection'],
    previewText: 'Every movement tells a story. Every breath is poetry.'
  },

  // Fitness Voices
  {
    id: 'athlete_peak',
    name: 'Athlete Peak',
    description: 'Elite performance and peak conditioning',
    category: 'fitness',
    gender: 'male',
    age: 'adult',
    personality: ['elite', 'performance-focused', 'competitive'],
    bestFor: ['advanced training', 'performance optimization', 'competition'],
    previewText: 'Peak performance. Elite level. Push beyond limits.'
  },
  {
    id: 'warrior_spirit',
    name: 'Warrior Spirit',
    description: 'Strong and resilient fighter',
    category: 'fitness',
    gender: 'female',
    age: 'adult',
    personality: ['strong', 'resilient', 'determined'],
    bestFor: ['strength training', 'mental toughness', 'overcoming challenges'],
    previewText: 'Warrior spirit. Unbreakable. Rise above challenges.'
  },

  // Meditation Voices
  {
    id: 'peace_guide',
    name: 'Peace Guide',
    description: 'Tranquil and harmonious presence',
    category: 'meditation',
    gender: 'female',
    age: 'mature',
    personality: ['tranquil', 'harmonious', 'peaceful'],
    bestFor: ['meditation', 'relaxation', 'inner peace'],
    previewText: 'Find your inner peace. Harmony within. Tranquility now.'
  },
  {
    id: 'wisdom_keeper',
    name: 'Wisdom Keeper',
    description: 'Ancient wisdom and deep understanding',
    category: 'meditation',
    gender: 'male',
    age: 'mature',
    personality: ['wise', 'understanding', 'profound'],
    bestFor: ['spiritual growth', 'deep reflection', 'wisdom seeking'],
    previewText: 'Ancient wisdom flows. Deep understanding grows. Inner light shines.'
  }
];

// Categories for filtering
const categories = [
  { id: 'all', name: 'All Voices' },
  { id: 'motivational', name: 'Motivational' },
  { id: 'calm', name: 'Calm' },
  { id: 'professional', name: 'Professional' },
  { id: 'friendly', name: 'Friendly' },
  { id: 'energetic', name: 'Energetic' },
  { id: 'creative', name: 'Creative' },
  { id: 'fitness', name: 'Fitness' },
  { id: 'meditation', name: 'Meditation' }
];

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoice,
  onVoiceChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showMoreVoices, setShowMoreVoices] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current selected voice
  const getCurrentVoice = () => {
    return predefinedVoices.find(voice => voice.id === selectedVoice) || predefinedVoices[0];
  };

  // Filter voices based on search and category
  const getFilteredVoices = () => {
    let filtered = predefinedVoices;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(voice => voice.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(voice =>
        voice.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        voice.personality.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
        voice.bestFor.some(b => b.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  // Handle voice selection
  const handleVoiceSelect = (voiceId: string) => {
    onVoiceChange(voiceId);
    setIsOpen(false);
    setShowMoreVoices(false);
  };

  // Preview voice
  const previewVoice = async (voice: VoiceOption) => {
    if (voice.previewText && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(voice.previewText);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowMoreVoices(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentVoice = getCurrentVoice();
  const filteredVoices = getFilteredVoices();

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Voice Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-blue-500" />
            Voice Coach Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Voice Display */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Volume2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{currentVoice.name}</h3>
                  <p className="text-sm text-gray-600">{currentVoice.description}</p>
                </div>
              </div>
              <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                Change Voice
              </Button>
            </div>

            {/* Voice Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Dropdown */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden"
                >
                  {/* Search Bar */}
                  <div className="p-3 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="Search voices..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Voice List */}
                  <div className="max-h-64 overflow-y-auto">
                    {filteredVoices.map((voice) => (
                      <div
                        key={voice.id}
                        className={`p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                          selectedVoice === voice.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                        onClick={() => handleVoiceSelect(voice.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Volume2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{voice.name}</h4>
                              <p className="text-sm text-gray-600">{voice.description}</p>
                              <div className="flex gap-1 mt-1">
                                {voice.personality.slice(0, 2).map((trait) => (
                                  <Badge key={trait} variant="secondary" className="text-xs">
                                    {trait}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {selectedVoice === voice.id && (
                              <Check className="h-4 w-4 text-blue-600" />
                            )}
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                previewVoice(voice);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Volume2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add More Voices Button */}
                  <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <Button
                      onClick={() => setShowMoreVoices(true)}
                      variant="outline"
                      className="w-full flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Browse All Available Voices
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Expanded Voice Browser */}
      <AnimatePresence>
        {showMoreVoices && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Voice Library</h2>
                  <Button
                    onClick={() => setShowMoreVoices(false)}
                    variant="ghost"
                    size="sm"
                  >
                    ✕
                  </Button>
                </div>
                <p className="text-gray-600 mt-2">
                  Explore our complete collection of voice coaches. Each voice is designed for specific workout styles and preferences.
                </p>
              </div>

              <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {predefinedVoices.map((voice) => (
                    <Card
                      key={voice.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedVoice === voice.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleVoiceSelect(voice.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Volume2 className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{voice.name}</h3>
                              <p className="text-xs text-gray-500 capitalize">{voice.category}</p>
                            </div>
                          </div>
                          {selectedVoice === voice.id && (
                            <Check className="h-5 w-5 text-blue-600" />
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3">{voice.description}</p>

                        <div className="space-y-2">
                          <div>
                            <h4 className="text-xs font-medium text-gray-700 mb-1">Personality:</h4>
                            <div className="flex flex-wrap gap-1">
                              {voice.personality.map((trait) => (
                                <Badge key={trait} variant="secondary" className="text-xs">
                                  {trait}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-medium text-gray-700 mb-1">Best For:</h4>
                            <div className="flex flex-wrap gap-1">
                              {voice.bestFor.slice(0, 2).map((use) => (
                                <Badge key={use} variant="outline" className="text-xs">
                                  {use}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {voice.previewText && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                previewVoice(voice);
                              }}
                              variant="ghost"
                              size="sm"
                              className="w-full mt-2"
                            >
                              <Volume2 className="h-3 w-3 mr-1" />
                              Preview
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
