import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

const statuses = [
  { id: 'diagnosed', label: 'Professionally Diagnosed', description: 'I have a formal ADHD diagnosis.' },
  { id: 'self_identified', label: 'Self-Identified', description: 'I identify with ADHD traits but lack a formal diagnosis.' },
  { id: 'exploring', label: 'Just Exploring', description: "I'm curious if ADHD tools can help me focus." },
];

export default function Step2() {
  const [selected, setSelected] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { user, fetchProfile } = useAuthStore();

  const handleNext = async () => {
    if (!user) return;
    setIsSaving(true);

    const { error } = await supabase.from('profiles').update({
      diagnosis_status: selected,
    }).eq('user_id', user.id);

    if (error) {
      Alert.alert('Error', 'Failed to update: ' + error.message);
      setIsSaving(false);
    } else {
      await fetchProfile();
      router.push('/(auth)/onboarding/step-3');
    }
  };

  return (
    <View className="flex-1 px-8 justify-center">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900 text-center">Your ADHD Journey</Text>
        <Text className="text-lg text-gray-500 text-center mt-2">This helps us tailor the insights you receive.</Text>
      </View>

      <View className="space-y-4 mb-8">
        {statuses.map((status) => (
          <TouchableOpacity
            key={status.id}
            disabled={isSaving}
            onPress={() => setSelected(status.id)}
            className={`w-full p-5 border-2 rounded-2xl ${
              selected === status.id
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-100 bg-gray-50'
            }`}
          >
            <Text className="font-bold text-gray-900 text-lg">{status.label}</Text>
            <Text className="text-sm text-gray-500 mt-1">{status.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        onPress={handleNext}
        disabled={!selected || isSaving}
        className={`w-full bg-primary-600 py-4 rounded-2xl shadow-lg flex-row justify-center items-center ${(!selected || isSaving) ? 'opacity-50' : ''}`}
      >
        {isSaving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center text-lg font-semibold">Continue</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
