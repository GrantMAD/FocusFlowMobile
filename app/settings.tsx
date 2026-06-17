import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { profile, fetchProfile, updateProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setIsLoading(true);
    const { error } = await updateProfile({ full_name: fullName });
    setIsLoading(false);
    if (error) {
      Alert.alert('Error', 'Could not update profile');
    } else {
      Alert.alert('Success', 'Profile updated');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50 dark:bg-black"
    >
      <View className="flex-row items-center p-6 pb-2 pt-6">
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
          <Ionicons name="arrow-back" size={24} color={isDark ? '#FFFFFF' : '#000000'} />
        </TouchableOpacity>
        <Text className="text-2xl font-black text-gray-900 dark:text-white">Settings</Text>
      </View>

      <ScrollView className="p-6">
        
        <View className="bg-white dark:bg-gray-800 p-6 rounded-3xl mb-6 border border-gray-100 dark:border-gray-700">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">Profile</Text>
          
          <Text className="text-sm text-gray-500 dark:text-gray-400 mb-2">Full Name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-gray-900 dark:text-white mb-4"
          />
          
          <TouchableOpacity 
            onPress={handleUpdate}
            disabled={isLoading}
            className="bg-purple-600 p-4 rounded-xl items-center"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold">Update Profile</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="bg-white dark:bg-gray-800 p-6 rounded-3xl mb-6 border border-gray-100 dark:border-gray-700">
          <Text className="text-lg font-bold text-gray-900 dark:text-white mb-4">App Features</Text>
          {profile?.onboarding_progress && Object.entries(profile.onboarding_progress).map(([feature, completed]) => (
            <View key={feature} className="flex-row justify-between py-2">
              <Text className="text-gray-700 dark:text-gray-300 capitalize">{feature}</Text>
              <Text className="font-bold text-purple-600 dark:text-purple-400">
                {completed ? 'Completed' : 'Pending'}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
