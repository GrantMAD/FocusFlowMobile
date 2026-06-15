import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export default function Step1() {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { user, fetchProfile } = useAuthStore();

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setName(user.user_metadata.full_name);
    }
  }, [user]);

  const handleNext = async () => {
    if (!user) return;
    setIsSaving(true);

    const { error } = await supabase.from('profiles').upsert({
      user_id: user.id,
      full_name: name,
    }, { onConflict: 'user_id' });

    if (error) {
      Alert.alert('Error', 'Failed to save profile: ' + error.message);
      setIsSaving(false);
    } else {
      await fetchProfile();
      router.push('/(auth)/onboarding/step-2');
    }
  };

  return (
    <View className="flex-1 px-8 justify-center">
      <View className="mb-12">
        <Text className="text-3xl font-bold text-gray-900 text-center">What should we call you?</Text>
        <Text className="text-lg text-gray-500 text-center mt-2">We'll use this to personalise your experience.</Text>
      </View>

      <View className="space-y-6">
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          autoFocus
          className="w-full px-4 py-4 text-xl bg-gray-50 border border-gray-200 rounded-2xl text-gray-900"
        />
        
        <TouchableOpacity 
          onPress={handleNext}
          disabled={!name.trim() || isSaving}
          className={`w-full bg-primary-600 py-4 rounded-2xl shadow-lg flex-row justify-center items-center ${(!name.trim() || isSaving) ? 'opacity-50' : ''}`}
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center text-lg font-semibold">Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
