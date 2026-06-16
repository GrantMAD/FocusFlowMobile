import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Switch, ScrollView, Platform } from 'react-native';
import { useTaskStore } from '@/stores/taskStore';
import { X, Flag, Calendar } from 'lucide-react-native';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTaskModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'now' | 'next' | 'later' | 'brain_dump'>('later');
  const [isDailyPriority, setIsDailyPriority] = useState(false);
  const { addTask } = useTaskStore();

  const handleSubmit = async () => {
    if (!title.trim()) return;

    await addTask({
      title,
      notes,
      priority,
      is_daily_priority: isDailyPriority,
      status: 'pending',
    });

    setTitle('');
    setNotes('');
    onClose();
  };

  const priorityColors = {
    now: 'border-red-500 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400',
    next: 'border-orange-500 bg-orange-50 dark:bg-orange-900/10 text-orange-600 dark:text-orange-400',
    later: 'border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400',
    brain_dump: 'border-purple-500 bg-purple-50 dark:bg-purple-900/10 text-purple-600 dark:text-purple-400',
  };

  return (
    <Modal visible={isOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View className="flex-1 bg-white dark:bg-gray-900 p-8">
        <View className="flex-row justify-between items-center mb-8">
          <Text className="text-2xl font-black text-gray-900 dark:text-white">New Task</Text>
          <TouchableOpacity onPress={onClose} className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full">
            <X size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="space-y-6">
            <View>
              <Text className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">Task Title</Text>
              <TextInput
                placeholder="What needs to be done?"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 font-bold text-gray-900 dark:text-white"
                autoFocus
              />
            </View>

            <View>
              <Text className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">Notes (Optional)</Text>
              <TextInput
                placeholder="Add more details..."
                placeholderTextColor="#9CA3AF"
                value={notes}
                onChangeText={setNotes}
                className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 font-bold text-gray-900 dark:text-white h-32"
                multiline
                textAlignVertical="top"
              />
            </View>
            
            <View>
              <View className="flex-row items-center gap-2 mb-3 ml-1">
                <Flag size={14} color="#7C3AED" />
                <Text className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Priority</Text>
              </View>
              <View className="flex-row gap-2 flex-wrap">
                {(['now', 'next', 'later'] as const).map((p) => (
                  <TouchableOpacity 
                    key={p}
                    onPress={() => setPriority(p)} 
                    className={`px-6 py-3 rounded-xl border-2 transition-all ${
                      priority === p ? priorityColors[p] : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <Text className={`font-bold capitalize ${priority === p ? '' : 'text-gray-400 dark:text-gray-500'}`}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="flex-row items-center justify-between bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
              <View className="flex-row items-center gap-3">
                <View className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Calendar size={18} color="#7C3AED" />
                </View>
                <Text className="font-bold text-gray-700 dark:text-gray-300">Set as Daily Priority</Text>
              </View>
              <Switch 
                value={isDailyPriority} 
                onValueChange={setIsDailyPriority}
                trackColor={{ false: '#E5E7EB', true: '#7C3AED' }}
                thumbColor={Platform.OS === 'ios' ? '#FFFFFF' : isDailyPriority ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>

            <TouchableOpacity 
              onPress={handleSubmit} 
              className="w-full bg-purple-600 py-5 rounded-2xl items-center shadow-lg shadow-purple-200 dark:shadow-none mt-4"
            >
              <Text className="text-white font-black uppercase tracking-widest">Create Task</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
