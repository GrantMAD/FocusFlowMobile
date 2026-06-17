import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Plus, Brain } from 'lucide-react-native';
import { useBrainDumpStore } from '@/stores/brainDumpStore';
import { useAuthStore } from '@/stores/authStore';

export default function QuickCapture() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addItem } = useBrainDumpStore();
  const { completeOnboardingStep } = useAuthStore();

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await addItem(content.trim());
    completeOnboardingStep('braindump');
    setContent('');
    setIsSubmitting(false);
  };

  return (
    <View className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
      <View className="p-6 border-b border-gray-100 dark:border-gray-800 bg-purple-50/50 dark:bg-purple-900/10">
        <View className="flex-row items-center gap-2 mb-4">
          <Brain size={20} color="#9333EA" />
          <Text className="font-bold text-gray-900 dark:text-white">Brain Dump</Text>
        </View>
        
        <View className="flex-row gap-2">
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="What's on your mind?"
            placeholderTextColor="#9CA3AF"
            className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl px-4 py-3"
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="bg-purple-600 p-3 rounded-2xl justify-center items-center"
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text className="mt-2 text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">
          Quickly capture thoughts to clear your head.
        </Text>
      </View>
    </View>
  );
}
