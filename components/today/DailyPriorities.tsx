import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CheckCircle2, Circle, Plus } from 'lucide-react-native';
import { useTaskStore } from '@/stores/taskStore';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router';

export default function DailyPriorities() {
  const { tasks, toggleTask, fetchTasks } = useTaskStore();
  const { user } = useAuthStore();
  const priorities = tasks.filter(t => t.is_daily_priority);

  useEffect(() => {
    const updatePrioritiesSet = async () => {
      if (!user || priorities.length === 0) return;
      
      await supabase
        .from('daily_logs')
        .update({ daily_priorities_set: true })
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0]);
    };

    updatePrioritiesSet();
  }, [priorities.length, user]);

  useEffect(() => {
    if (!user) return;

    fetchTasks();

    const channel = supabase
      .channel(`tasks_changes_${user.id}_${Math.random().toString(36).substring(7)}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${user.id}`,
      }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchTasks]);

  return (
    <View className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-xl font-bold text-gray-900">Daily Priorities</Text>
        <Text className="text-sm font-medium text-gray-400">
          {priorities.filter(p => p.status === 'completed').length} / {priorities.length}
        </Text>
      </View>

      <View className="gap-3">
        {priorities.map((task) => (
          <TouchableOpacity
            key={task.id}
            onPress={() => toggleTask(task.id)}
            className="flex-row items-center gap-3 p-3 rounded-2xl border border-gray-50 bg-gray-50"
          >
            {task.status === 'completed' ? (
              <CheckCircle2 size={24} color="#22C55E" />
            ) : (
              <Circle size={24} color="#D1D5DB" />
            )}
            <Text className={`flex-1 font-medium ${
              task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </Text>
          </TouchableOpacity>
        ))}

        {priorities.length < 3 && (
          <TouchableOpacity 
            onPress={() => router.push('/modal/add-task')}
            className="flex-row items-center gap-2 p-3 rounded-2xl border-2 border-dashed border-gray-100"
          >
            <Plus size={20} color="#9CA3AF" />
            <Text className="text-sm font-semibold text-gray-400">Set a priority</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
