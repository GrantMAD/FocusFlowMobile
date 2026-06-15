import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Moon, Pill, MessageSquare, CheckCircle2, Star, Zap } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

const MOODS = [
  { value: 1, label: '😩' },
  { value: 2, label: '😕' },
  { value: 3, label: '😐' },
  { value: 4, label: '🙂' },
  { value: 5, label: '🤩' },
];

const ENERGY_LEVELS = [
  { value: 1, label: 'Drained' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Moderate' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'High' },
];

export default function EveningReflection() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user, completeOnboardingStep } = useAuthStore();
  const [reflection, setReflection] = useState({
    mood_evening: 3,
    energy_level: 3,
    medication_taken: false,
    notes: '',
    evening_reflection_completed: false,
  });

  useEffect(() => {
    fetchReflectionStatus();
  }, []);

  const fetchReflectionStatus = async () => {
    if (!user) return;

    const { data: log, error } = await supabase.rpc('get_or_create_daily_log', { p_user_id: user.id });

    if (error) {
      console.error('Error fetching reflection status:', error);
      setIsLoading(false);
      return;
    }

    if (log) {
      setReflection({
        mood_evening: log.mood_evening || 3,
        energy_level: log.energy_level || 3,
        medication_taken: log.medication_taken || false,
        notes: log.notes || '',
        evening_reflection_completed: log.evening_reflection_completed || false,
      });
    }
    setIsLoading(false);
  };

  const handleUpdate = async (updates: Partial<typeof reflection>) => {
    const newReflection = { ...reflection, ...updates };
    setReflection(newReflection);

    if (!user) return;

    await supabase
      .from('daily_logs')
      .update(updates)
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0]);
  };

  const handleComplete = async () => {
    setIsSaving(true);
    if (!user) return;

    const { error } = await supabase
      .from('daily_logs')
      .update({ evening_reflection_completed: true })
      .eq('user_id', user.id)
      .eq('date', new Date().toISOString().split('T')[0]);

    if (error) {
      Alert.alert('Error', 'Failed to complete reflection');
    } else {
      setReflection(prev => ({ ...prev, evening_reflection_completed: true }));
      completeOnboardingStep('reflection');
      Alert.alert('Success', 'Reflection completed!');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-64 items-center justify-center">
        <ActivityIndicator color="#4F46E5" />
      </View>
    );
  }

  return (
    <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <View className="flex-row items-center justify-between mb-6">
        <View>
          <View className="flex-row items-center gap-2">
            <Moon size={20} color="#4F46E5" />
            <Text className="text-xl font-bold text-gray-900">Evening Reflection</Text>
          </View>
          <Text className="text-sm text-gray-500">Wind down and celebrate small wins.</Text>
        </View>
        {reflection.evening_reflection_completed && (
          <View className="px-3 py-1 bg-indigo-100 rounded-full">
            <Text className="text-indigo-700 text-xs font-bold uppercase">Done</Text>
          </View>
        )}
      </View>

      <View className="gap-8">
        {/* Mood Tracker */}
        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <Star size={16} color="#FACC15" />
            <Text className="text-sm font-bold text-gray-700">How was your day?</Text>
          </View>
          <View className="flex-row justify-between">
            {MOODS.map(mood => (
              <TouchableOpacity
                key={mood.value}
                onPress={() => handleUpdate({ mood_evening: mood.value })}
                className={`w-[18%] aspect-square rounded-2xl border-2 items-center justify-center ${
                  reflection.mood_evening === mood.value 
                    ? 'border-indigo-600 bg-indigo-50' 
                    : 'border-gray-50 bg-gray-50'
                }`}
              >
                <Text className="text-2xl">{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Energy Tracker */}
        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <Zap size={16} color="#F97316" />
            <Text className="text-sm font-bold text-gray-700">Energy Levels</Text>
          </View>
          <View className="flex-row gap-2">
            {ENERGY_LEVELS.map(level => (
              <TouchableOpacity
                key={level.value}
                onPress={() => handleUpdate({ energy_level: level.value })}
                className={`flex-1 py-3 rounded-xl border-2 items-center justify-center ${
                  reflection.energy_level === level.value 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-50 bg-gray-50'
                }`}
              >
                <Text className={`text-[10px] font-bold uppercase ${
                  reflection.energy_level === level.value ? 'text-orange-700' : 'text-gray-400'
                }`}>
                  {level.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Medication */}
        <TouchableOpacity
          onPress={() => handleUpdate({ medication_taken: !reflection.medication_taken })}
          className={`flex-row items-start gap-4 p-4 rounded-2xl border-2 ${
            reflection.medication_taken 
              ? 'border-green-600 bg-green-50' 
              : 'border-gray-50 bg-gray-50'
          }`}
        >
          <View className={`p-2 rounded-xl ${reflection.medication_taken ? 'bg-green-100' : 'bg-gray-200'}`}>
            <Pill size={20} color={reflection.medication_taken ? '#16A34A' : '#6B7280'} />
          </View>
          <View className="flex-1">
            <Text className={`font-bold text-sm ${reflection.medication_taken ? 'text-green-900' : 'text-gray-900'}`}>
              Medication
            </Text>
            <Text className="text-xs text-gray-500">Did you take your meds?</Text>
          </View>
          {reflection.medication_taken ? (
            <CheckCircle2 size={20} color="#16A34A" />
          ) : (
            <View className="w-5 h-5 rounded-full border-2 border-gray-300" />
          )}
        </TouchableOpacity>

        {/* Notes */}
        <View className="relative">
          <View className="absolute left-4 top-4 z-10">
            <MessageSquare size={20} color="#9CA3AF" />
          </View>
          <TextInput
            multiline
            placeholder="Notes, wins, or reflections..."
            value={reflection.notes}
            onChangeText={(text) => handleUpdate({ notes: text })}
            className="w-full min-h-[100px] pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-50 text-gray-900 rounded-2xl text-sm"
            textAlignVertical="top"
          />
        </View>

        {!reflection.evening_reflection_completed && (
          <TouchableOpacity
            onPress={handleComplete}
            disabled={isSaving}
            className="w-full bg-indigo-600 py-4 rounded-2xl items-center shadow-lg shadow-indigo-200"
          >
            <Text className="text-white font-bold text-lg">
              {isSaving ? 'Saving...' : 'Complete Daily Reflection'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
