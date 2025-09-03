import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Moon, 
  Smile, 
  Heart, 
  Brain, 
  Plus,
  Calendar,
  TrendingUp,
  Clock,
  Sun,
  Target,
  Droplets,
  Pill,
  Book,
  Leaf,
  Zap,
  Coffee,
  Apple,
  Dumbbell,
  Phone,
  Users,
  Music,
  Camera,
  CheckCircle,
  Circle,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import { useUser } from '../context/UserContext';

interface Habit {
  id: string;
  name: string;
  icon: string;
  category: string;
  streak: number;
  completedToday: boolean;
  completedDates: string[];
  target?: number;
  unit?: string;
  isCustom: boolean;
}

const Wellness: React.FC = () => {
  const { profile, dailyData, updateDailyData, getCurrentDate } = useUser();
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [sleepInput, setSleepInput] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState({
    name: '',
    icon: 'Target',
    category: 'Health'
  });

  const currentDate = getCurrentDate();

  const moods = [
    { emoji: '😄', label: 'Excellent', value: 'excellent', color: 'bg-green-500' },
    { emoji: '😊', label: 'Good', value: 'good', color: 'bg-blue-500' },
    { emoji: '😐', label: 'Okay', value: 'okay', color: 'bg-yellow-500' },
    { emoji: '😔', label: 'Low', value: 'low', color: 'bg-orange-500' },
    { emoji: '😢', label: 'Poor', value: 'poor', color: 'bg-red-500' },
  ];

  const habitCategories = ['Health', 'Fitness', 'Mindfulness', 'Productivity', 'Social', 'Learning'];

  const iconOptions = [
    { name: 'Target', icon: Target },
    { name: 'Droplets', icon: Droplets },
    { name: 'Pill', icon: Pill },
    { name: 'Book', icon: Book },
    { name: 'Leaf', icon: Leaf },
    { name: 'Zap', icon: Zap },
    { name: 'Coffee', icon: Coffee },
    { name: 'Apple', icon: Apple },
    { name: 'Dumbbell', icon: Dumbbell },
    { name: 'Phone', icon: Phone },
    { name: 'Users', icon: Users },
    { name: 'Music', icon: Music },
    { name: 'Camera', icon: Camera },
    { name: 'Heart', icon: Heart },
    { name: 'Brain', icon: Brain },
    { name: 'Sun', icon: Sun },
    { name: 'Moon', icon: Moon }
  ];

  const defaultHabits: Habit[] = [
    {
      id: 'water',
      name: 'Drink 8 glasses of water',
      icon: 'Droplets',
      category: 'Health',
      streak: 7,
      completedToday: dailyData.water >= 64,
      completedDates: [],
      target: 8,
      unit: 'glasses',
      isCustom: false
    },
    {
      id: 'vitamins',
      name: 'Take daily vitamins',
      icon: 'Pill',
      category: 'Health',
      streak: 12,
      completedToday: false,
      completedDates: [],
      isCustom: false
    },
    {
      id: 'meditation',
      name: 'Meditate for 10 minutes',
      icon: 'Brain',
      category: 'Mindfulness',
      streak: 3,
      completedToday: false,
      completedDates: [],
      target: 10,
      unit: 'minutes',
      isCustom: false
    },
    {
      id: 'gratitude',
      name: 'Practice gratitude',
      icon: 'Heart',
      category: 'Mindfulness',
      streak: 5,
      completedToday: false,
      completedDates: [],
      isCustom: false
    },
    {
      id: 'nature',
      name: 'Spend time in nature',
      icon: 'Leaf',
      category: 'Health',
      streak: 2,
      completedToday: false,
      completedDates: [],
      target: 30,
      unit: 'minutes',
      isCustom: false
    },
    {
      id: 'reading',
      name: 'Read for 30 minutes',
      icon: 'Book',
      category: 'Learning',
      streak: 0,
      completedToday: false,
      completedDates: [],
      target: 30,
      unit: 'minutes',
      isCustom: false
    },
    {
      id: 'exercise',
      name: 'Exercise for 30 minutes',
      icon: 'Dumbbell',
      category: 'Fitness',
      streak: 0,
      completedToday: false,
      completedDates: [],
      target: 30,
      unit: 'minutes',
      isCustom: false
    },
    {
      id: 'sleep',
      name: 'Get 8 hours of sleep',
      icon: 'Moon',
      category: 'Health',
      streak: 0,
      completedToday: dailyData.sleepHours >= 8,
      completedDates: [],
      target: 8,
      unit: 'hours',
      isCustom: false
    },
    {
      id: 'social',
      name: 'Connect with friends/family',
      icon: 'Users',
      category: 'Social',
      streak: 0,
      completedToday: false,
      completedDates: [],
      isCustom: false
    },
    {
      id: 'screen-time',
      name: 'Limit screen time',
      icon: 'Phone',
      category: 'Health',
      streak: 0,
      completedToday: false,
      completedDates: [],
      target: 2,
      unit: 'hours max',
      isCustom: false
    }
  ];

  const sleepQuality = [
    { night: 'Mon', quality: 85, hours: 7.5 },
    { night: 'Tue', quality: 92, hours: 8.2 },
    { night: 'Wed', quality: 78, hours: 6.8 },
    { night: 'Thu', quality: 88, hours: 7.8 },
    { night: 'Fri', quality: 90, hours: 8.0 },
    { night: 'Sat', quality: 95, hours: 8.5 },
    { night: 'Sun', quality: 87, hours: 7.9 },
  ];

  // Load habits from localStorage
  useEffect(() => {
    const savedHabits = localStorage.getItem('aifit_habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    } else {
      setHabits(defaultHabits);
    }
  }, []);

  // Save habits to localStorage
  const saveHabits = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    localStorage.setItem('aifit_habits', JSON.stringify(updatedHabits));
  };

  const addSleep = () => {
    if (sleepInput) {
      updateDailyData({ sleepHours: parseFloat(sleepInput) });
      
      // Update sleep habit if it exists
      const updatedHabits = habits.map(habit => {
        if (habit.id === 'sleep') {
          return {
            ...habit,
            completedToday: parseFloat(sleepInput) >= (habit.target || 8)
          };
        }
        return habit;
      });
      saveHabits(updatedHabits);
      
      setSleepInput('');
      setShowSleepModal(false);
    }
  };

  const addMood = (mood: string) => {
    updateDailyData({ mood });
    setShowMoodModal(false);
  };

  const toggleHabit = (habitId: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const wasCompleted = habit.completedToday;
        const newCompletedToday = !wasCompleted;
        
        let newStreak = habit.streak;
        let newCompletedDates = [...habit.completedDates];
        
        if (newCompletedToday) {
          // Mark as completed
          if (!newCompletedDates.includes(currentDate)) {
            newCompletedDates.push(currentDate);
            newStreak = habit.streak + 1;
          }
        } else {
          // Mark as not completed
          newCompletedDates = newCompletedDates.filter(date => date !== currentDate);
          newStreak = Math.max(0, habit.streak - 1);
        }
        
        return {
          ...habit,
          completedToday: newCompletedToday,
          streak: newStreak,
          completedDates: newCompletedDates
        };
      }
      return habit;
    });
    
    saveHabits(updatedHabits);
  };

  const addCustomHabit = () => {
    if (!newHabit.name.trim()) return;
    
    const customHabit: Habit = {
      id: `custom-${Date.now()}`,
      name: newHabit.name,
      icon: newHabit.icon,
      category: newHabit.category,
      streak: 0,
      completedToday: false,
      completedDates: [],
      isCustom: true
    };
    
    saveHabits([...habits, customHabit]);
    setNewHabit({ name: '', icon: 'Target', category: 'Health' });
    setShowHabitModal(false);
  };

  const deleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    saveHabits(updatedHabits);
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(option => option.name === iconName);
    return iconOption ? iconOption.icon : Target;
  };

  const getHabitsByCategory = (category: string) => {
    return habits.filter(habit => habit.category === category);
  };

  const completedHabitsToday = habits.filter(habit => habit.completedToday).length;
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? Math.round((completedHabitsToday / totalHabits) * 100) : 0;

  const averageSleep = sleepQuality.reduce((sum, night) => sum + night.hours, 0) / sleepQuality.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Wellness</h1>
            <p className="text-gray-600">Track your sleep, mood & daily habits</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowSleepModal(true)}
              className="bg-purple-600 text-white p-3 rounded-full shadow-lg"
            >
              <Moon size={20} />
            </button>
            <button
              onClick={() => setShowMoodModal(true)}
              className="bg-yellow-500 text-white p-3 rounded-full shadow-lg"
            >
              <Smile size={20} />
            </button>
          </div>
        </motion.div>

        {/* Today's Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
              <Moon className="text-purple-600" size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Sleep</p>
            <p className="text-2xl font-bold text-gray-800">{dailyData.sleepHours || 0}h</p>
            <p className="text-xs text-gray-500">Last night</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-3">
              <Smile className="text-yellow-600" size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Mood</p>
            <p className="text-lg font-bold text-gray-800">
              {dailyData.mood ? moods.find(m => m.value === dailyData.mood)?.emoji : '😐'}
            </p>
            <p className="text-xs text-gray-500">Today</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <Target className="text-green-600" size={24} />
            </div>
            <p className="text-sm text-gray-600 mb-1">Habits</p>
            <p className="text-2xl font-bold text-gray-800">{completedHabitsToday}/{totalHabits}</p>
            <p className="text-xs text-gray-500">{completionPercentage}% complete</p>
          </div>
        </motion.div>

        {/* Enhanced Daily Habits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Daily Habits</h3>
              <p className="text-sm text-gray-600">{completedHabitsToday} of {totalHabits} completed today</p>
            </div>
            <button
              onClick={() => setShowHabitModal(true)}
              className="bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Today's Progress</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
              />
            </div>
          </div>

          {/* Habits by Category */}
          <div className="space-y-6">
            {habitCategories.map(category => {
              const categoryHabits = getHabitsByCategory(category);
              if (categoryHabits.length === 0) return null;

              return (
                <div key={category}>
                  <h4 className="font-medium text-gray-800 mb-3 text-sm uppercase tracking-wide">
                    {category}
                  </h4>
                  <div className="space-y-3">
                    {categoryHabits.map((habit) => {
                      const IconComponent = getIconComponent(habit.icon);
                      return (
                        <div key={habit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => toggleHabit(habit.id)}
                              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                habit.completedToday 
                                  ? 'bg-green-500 text-white' 
                                  : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                              }`}
                            >
                              {habit.completedToday ? <CheckCircle size={16} /> : <Circle size={16} />}
                            </button>
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <IconComponent className="text-blue-600" size={16} />
                            </div>
                            <div>
                              <p className="text-gray-800 font-medium text-sm">{habit.name}</p>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <span>{habit.streak} day streak</span>
                                {habit.target && (
                                  <span>• {habit.target} {habit.unit}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              {[...Array(Math.min(habit.streak, 7))].map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-green-500 rounded-full" />
                              ))}
                            </div>
                            {habit.isCustom && (
                              <button
                                onClick={() => deleteHabit(habit.id)}
                                className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                              >
                                <Trash2 size={12} className="text-red-600" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Sleep Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Sleep Analysis</h3>
            <Moon className="text-purple-600" size={24} />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{averageSleep.toFixed(1)}h</p>
              <p className="text-sm text-gray-600">Avg Sleep</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">87%</p>
              <p className="text-sm text-gray-600">Quality</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">6/7</p>
              <p className="text-sm text-gray-600">Good Nights</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-2">This Week</p>
            {sleepQuality.map((night, index) => (
              <div key={night.night} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 w-8">{night.night}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${night.quality}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-600">{night.hours}h</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mood Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Mood Tracker</h3>
            <Heart className="text-red-500" size={24} />
          </div>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => addMood(mood.value)}
                className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                  dailyData.mood === mood.value ? 'bg-gray-100 scale-110' : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl mb-1">{mood.emoji}</span>
                <span className="text-xs text-gray-600">{mood.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-2">Weekly Mood Trend</p>
            <div className="flex items-end justify-between h-16">
              {['😊', '😄', '😐', '😊', '😔', '😄', '😊'].map((emoji, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-lg mb-1">{emoji}</span>
                  <span className="text-xs text-gray-500">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Mindfulness */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold mb-2">aiMind Session</h3>
              <p className="text-sm opacity-90">Guided meditation for better sleep</p>
            </div>
            <Brain className="text-white" size={24} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-75">Tonight's Session</p>
              <p className="font-semibold">Deep Sleep Journey</p>
            </div>
            <button className="bg-white bg-opacity-20 px-6 py-2 rounded-full font-medium">
              Start 10 min
            </button>
          </div>
        </motion.div>

        {/* Premium Insights */}
        {!profile?.isPremium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-yellow-200"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Unlock Wellness Insights</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get personalized sleep recommendations, mood analysis, and wellness coaching
              </p>
              <button className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-medium">
                Upgrade to Premium
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Add Custom Habit Modal */}
      {showHabitModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Add Custom Habit</h3>
              <button
                onClick={() => setShowHabitModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Habit Name</label>
                <input
                  type="text"
                  placeholder="e.g., Drink green tea"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                >
                  {habitCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.name}
                        onClick={() => setNewHabit({ ...newHabit, icon: option.name })}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          newHabit.icon === option.name
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent size={20} className={newHabit.icon === option.name ? 'text-green-600' : 'text-gray-600'} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowHabitModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={addCustomHabit}
                disabled={!newHabit.name.trim()}
                className="flex-1 py-3 bg-green-600 text-white rounded-xl font-medium disabled:bg-gray-300"
              >
                Add Habit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Sleep Modal */}
      {showSleepModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Log Sleep</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How many hours did you sleep?
              </label>
              <input
                type="number"
                step="0.5"
                placeholder="e.g., 7.5"
                value={sleepInput}
                onChange={(e) => setSleepInput(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowSleepModal(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={addSleep}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium"
              >
                Log Sleep
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Mood Modal */}
      {showMoodModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">How are you feeling today?</h3>
            
            <div className="grid grid-cols-5 gap-3 mb-6">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => addMood(mood.value)}
                  className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <span className="text-3xl mb-2">{mood.emoji}</span>
                  <span className="text-xs text-gray-600 text-center">{mood.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowMoodModal(false)}
              className="w-full py-3 border border-gray-300 rounded-xl font-medium text-gray-700"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Wellness;