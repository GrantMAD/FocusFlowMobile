import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Play, Pause, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useFocusStore } from '@/stores/focusStore';

export default function FocusTimer() {
  const { isActive, timeLeft, mode, pauseSession, resumeSession, endSession, tick } = useFocusStore();

  useEffect(() => {
    const timer = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isActive) pauseSession();
    else resumeSession();
  };

  const handleEnd = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    endSession(false);
  };

  return (
    <View className="items-center my-10 bg-white dark:bg-gray-900 p-10 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-xl shadow-purple-100 dark:shadow-none">
      <Text className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[4px] mb-4">
        {mode === 'work' ? 'Focus Time' : 'Break Time'}
      </Text>
      
      <Text className="text-8xl font-black text-gray-900 dark:text-white tabular-nums mb-10">
        {formatTime(timeLeft)}
      </Text>
      
      <View className="flex-row gap-6">
        <TouchableOpacity 
          className="bg-purple-600 w-20 h-20 rounded-full items-center justify-center shadow-lg shadow-purple-300 dark:shadow-none" 
          onPress={handlePauseResume}
        >
          {isActive ? <Pause size={32} color="#FFFFFF" /> : <Play size={32} color="#FFFFFF" className="ml-1" />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-red-500 w-20 h-20 rounded-full items-center justify-center shadow-lg shadow-red-200 dark:shadow-none" 
          onPress={handleEnd}
        >
          <X size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
