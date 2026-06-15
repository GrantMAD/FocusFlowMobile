import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { Plus, Brain } from 'lucide-react-native';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';

export default function QuickCapture() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, completeOnboardingStep } = useAuthStore();

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting || !user) return;

    setIsSubmitting(true);
    
    // Add to brain_dump_items
    const { error } = await supabase
      .from('brain_dump_items')
      .insert([{ user_id: user.id, content: content.trim() }]);

    if (!error) {
      // Update daily log status
      await supabase
        .from('daily_logs')
        .update({ brain_dump_completed: true })
        .eq('user_id', user.id)
        .eq('date', new Date().toISOString().split('T')[0]);
        
      completeOnboardingStep('braindump');
      setContent('');
    }
    setIsSubmitting(false);
  };

  return (
    <View className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <View className="p-6 border-b border-gray-100 bg-purple-50/50">
        <View className="flex-row items-center gap-2 mb-4">
          <Brain size={20} color="#9333EA" />
          <Text className="font-bold text-gray-900">Brain Dump</Text>
        </View>
        
        <View className="flex-row gap-2">
          <TextInput
            value={content}
            onChangeText={setContent}
            placeholder="What's on your mind?"
            className="flex-1 bg-white border border-gray-200 text-gray-900 rounded-2xl px-4 py-3"
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="bg-purple-600 p-3 rounded-2xl justify-center items-center"
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text className="mt-2 text-[10px] text-gray-400 font-medium uppercase tracking-wider">
          Quickly capture thoughts to clear your head.
        </Text>
      </View>
    </View>
  );
}
