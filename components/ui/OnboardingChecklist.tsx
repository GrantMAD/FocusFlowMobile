import React from 'react';
import { View, Text } from 'react-native';
import { CheckCircle2, Circle, Trophy, Zap, Brain, Calendar, Moon, Sun } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';

const CHECKLIST_ITEMS = [
  { id: 'ritual', label: 'Ritual Mastery', description: 'Complete your first Morning Ritual.', icon: Sun },
  { id: 'priorities', label: 'Priority Planner', description: 'Set your daily priorities.', icon: Calendar },
  { id: 'focus', label: 'Focus Pioneer', description: 'Start your first Focus Session.', icon: Zap },
  { id: 'braindump', label: 'Mind Clearer', description: 'Add a thought to your Brain Dump.', icon: Brain },
  { id: 'reflection', label: 'Daily Reflection', description: 'Complete an Evening Reflection.', icon: Moon },
];

export default function OnboardingChecklist() {
  const { profile } = useAuthStore();
  
  const progress = profile?.onboarding_progress || {};
  const completedCount = Object.values(progress).filter(Boolean).length;
  const isAllDone = completedCount === CHECKLIST_ITEMS.length;

  if (isAllDone) return null;

  return (
    <View className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
      <View className="bg-indigo-600 p-6 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center">
            <Trophy size={24} color="#FFFFFF" />
          </View>
          <View>
            <Text className="text-lg font-black text-white">FocusFlow Mastery</Text>
            <Text className="text-xs text-indigo-100 font-medium">Master the essentials to unlock your potential.</Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-2xl font-black text-white leading-none">{completedCount}/{CHECKLIST_ITEMS.length}</Text>
          <Text className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mt-1">Steps Done</Text>
        </View>
      </View>

      <View className="p-4 flex-row flex-wrap gap-2 bg-gray-50">
        {CHECKLIST_ITEMS.map((item) => {
          const isDone = !!progress[item.id as keyof typeof progress];
          const Icon = item.icon;
          return (
            <View 
              key={item.id}
              className={`flex-1 min-w-[45%] p-3 rounded-2xl border-2 items-center text-center gap-2 ${
                isDone 
                  ? 'border-emerald-500/20 bg-emerald-50' 
                  : 'border-white bg-white'
              }`}
            >
              <View className={`p-2 rounded-xl ${isDone ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                <Icon size={20} color={isDone ? '#10B981' : '#9CA3AF'} />
              </View>
              <Text className={`text-[10px] font-black uppercase ${isDone ? 'text-emerald-700' : 'text-gray-900'}`}>
                {item.label}
              </Text>
              {isDone ? (
                <CheckCircle2 size={16} color="#10B981" />
              ) : (
                <View className="w-4 h-4 rounded-full border-2 border-gray-200" />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
}
