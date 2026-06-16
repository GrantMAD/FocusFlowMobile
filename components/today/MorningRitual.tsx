import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Coffee, Brain, PenTool, CheckCircle, CheckCircle2, Circle } from 'lucide-react-native';
import { BlurView } from 'expo-blur';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { createNotification } from '@/lib/notifications';

const ritualSteps = [
  { id: 'hydration', label: 'Hydration', icon: Coffee, description: 'Drink a glass of water.', dbColumn: 'ritual_hydration' },
  { id: 'meditation', label: 'Mindfulness', icon: Brain, description: '3 minutes of deep breathing.', dbColumn: 'ritual_meditation' },
  { id: 'priorities', label: 'Plan Day', icon: CheckCircle, description: 'Set your 3 daily priorities.', dbColumn: 'ritual_priorities' },
  { id: 'braindump', label: 'Brain Dump', icon: PenTool, description: 'Clear your mind of lingering tasks.', dbColumn: 'ritual_braindump' },
];

const MOODS = [
  { value: 1, label: '😩' },
  { value: 2, label: '😕' },
  { value: 3, label: '😐' },
  { value: 4, label: '🙂' },
  { value: 5, label: '🤩' },
];

export default function MorningRitual() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [moodMorning, setMoodMorning] = useState<number | null>(null);
  const { user, completeOnboardingStep } = useAuthStore();

  useEffect(() => {
    fetchRitualStatus();
  }, []);

  const fetchRitualStatus = async () => {
    if (!user) return;

    const { data: log, error } = await supabase
      .rpc('get_or_create_daily_log', { p_user_id: user.id });

    if (error) {
      console.error('Error fetching ritual status:', error);
      return;
    }

    if (log) {
      const activeSteps = ritualSteps
        .filter(step => log[step.dbColumn])
        .map(step => step.id);
      setCompletedSteps(activeSteps);
      setMoodMorning(log.mood_morning);
    }
  };

  const handleMoodSelect = async (mood: number) => {
    setMoodMorning(mood);
    if (!user) return;

    await supabase
      .from('daily_logs')
      .update({ mood_morning: mood })
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0]);
  };

  const toggleStep = async (stepId: string) => {
    const step = ritualSteps.find(s => s.id === stepId);
    if (!step) return;

    const isCurrentlyDone = completedSteps.includes(stepId);
    const newSteps = isCurrentlyDone 
      ? completedSteps.filter(s => s !== stepId) 
      : [...completedSteps, stepId];
    
    setCompletedSteps(newSteps);

    if (!user) return;

    const updatePayload = { 
      [step.dbColumn]: !isCurrentlyDone,
      morning_ritual_completed: newSteps.length === ritualSteps.length 
    };

    await supabase
      .from('daily_logs')
      .update(updatePayload)
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0]);
  };

  const isRitualComplete = completedSteps.length === ritualSteps.length;

  useEffect(() => {
    if (isRitualComplete) {
      completeOnboardingStep('ritual');
      if (user) {
        createNotification(
          user.id,
          'Ritual Complete! ☕',
          'You started your day with intention. Great work!',
          'success'
        );
      }
    }
  }, [isRitualComplete, user]);

  return (
    <View className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">Morning Ritual</Text>
          <Text className="text-sm text-gray-500 dark:text-gray-400">Start your day with intention.</Text>
        </View>
        {isRitualComplete && (
          <View className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
            <Text className="text-green-700 dark:text-green-400 text-xs font-bold uppercase">Complete</Text>
          </View>
        )}
      </View>

      <View className="mb-8">
        <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Morning Mood</Text>
        <View className="flex-row justify-between">
          {MOODS.map(mood => (
            <TouchableOpacity
              key={mood.value}
              onPress={() => handleMoodSelect(mood.value)}
              className={`w-[18%] aspect-square rounded-2xl border-2 items-center justify-center ${
                moodMorning === mood.value 
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <Text className="text-2xl">{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="gap-4">
        {ritualSteps.map((step) => {
          const isDone = completedSteps.includes(step.id);
          const Icon = step.icon;
          return (
            <TouchableOpacity
              key={step.id}
              onPress={() => toggleStep(step.id)}
              className={`flex-row items-start gap-4 p-4 rounded-2xl border-2 transition-all ${
                isDone 
                  ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-gray-50 dark:border-gray-800'
              }`}
            >
              <View className={`p-2 rounded-xl ${isDone ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <Icon size={20} color={isDone ? '#9333EA' : '#6B7280'} />
              </View>
              <View className="flex-1">
                <Text className={`font-bold text-sm ${isDone ? 'text-purple-900 dark:text-purple-400' : 'text-gray-900 dark:text-white'}`}>
                  {step.label}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">{step.description}</Text>
              </View>
              {isDone ? (
                <CheckCircle2 size={20} color="#9333EA" />
              ) : (
                <Circle size={20} color="#E5E7EB" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
