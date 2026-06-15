import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

const goals = [
  "Better focus",
  "Finish what I start",
  "Manage my time",
  "Reduce overwhelm",
  "Build habits",
  "Understand my ADHD",
  "Work/Life balance",
  "Boost productivity"
];

export default function Step4() {
  const [selected, setSelected] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { user, fetchProfile } = useAuthStore();

  const toggleGoal = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    if (!user) return;
    setIsSaving(true);

    const { error } = await supabase.from('profiles').update({
      primary_goals: selected,
    }).eq('user_id', user.id);

    if (error) {
      Alert.alert('Error', 'Failed to update: ' + error.message);
      setIsSaving(false);
    } else {
      await fetchProfile();
      router.push('/(auth)/onboarding/step-5');
    }
  };

  return (
    <View className="flex-1 px-8 justify-center">
      <View className="mb-8">
        <Text className="text-3xl font-bold text-gray-900 text-center">What are your main goals?</Text>
        <Text className="text-lg text-gray-500 text-center mt-2">What does success look like for you?</Text>
      </View>

      <View className="flex-row flex-wrap justify-between mb-8">
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal}
            disabled={isSaving}
            onPress={() => toggleGoal(goal)}
            className={`w-[48%] p-4 mb-3 border-2 rounded-2xl ${
              selected.includes(goal)
                ? 'border-primary-600 bg-primary-50'
                : 'border-gray-100 bg-gray-50'
            }`}
          >
            <Text className={`text-center font-medium ${selected.includes(goal) ? 'text-primary-700' : 'text-gray-600'}`}>
              {goal}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity 
        onPress={handleNext}
        disabled={selected.length === 0 || isSaving}
        className={`w-full bg-primary-600 py-4 rounded-2xl shadow-lg flex-row justify-center items-center ${(selected.length === 0 || isSaving) ? 'opacity-50' : ''}`}
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
