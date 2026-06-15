import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import * as Notifications from 'expo-notifications';
import { Ionicons } from '@expo/vector-icons';

export default function Step5() {
  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<string>('undetermined');
  const router = useRouter();
  const { user, fetchProfile } = useAuthStore();

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setPermissionStatus(status);
    if (status === 'granted') {
      Alert.alert('Enabled', 'Notifications enabled!');
    } else {
      Alert.alert('Blocked', 'Notifications blocked.');
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    setIsLoading(true);

    const { error } = await supabase.from('profiles').update({
      onboarding_completed: true,
    }).eq('user_id', user.id);

    if (error) {
      Alert.alert('Error', 'Failed to complete onboarding: ' + error.message);
      setIsLoading(false);
    } else {
      await fetchProfile();
      router.replace('/(tabs)/today');
    }
  };

  return (
    <View className="flex-1 px-8 justify-center">
      <View className="items-center mb-12">
        <View className="w-24 h-24 bg-primary-600 rounded-[30px] items-center justify-center shadow-xl shadow-primary-200">
          <Ionicons name="notifications" size={48} color="white" />
        </View>
        <Text className="text-4xl font-bold text-gray-900 mt-8 text-center">Stay in Flow?</Text>
        <Text className="text-lg text-gray-500 mt-4 text-center px-4">
          Enable reminders to anchor your day and build a lasting focus streak.
        </Text>
      </View>

      {/* Simulated Notification Preview */}
      <View className="bg-white p-4 rounded-3xl border border-gray-100 flex-row items-center mb-12 shadow-md">
        <View className="w-12 h-12 rounded-2xl bg-primary-600 items-center justify-center">
          <Text className="text-white font-black text-xs">FF</Text>
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-sm font-bold text-gray-900">FocusFlow Reminder</Text>
          <Text className="text-xs text-gray-500">Time for your Morning Ritual! ☕️</Text>
        </View>
        <Text className="text-[10px] font-bold text-gray-400 uppercase">Now</Text>
      </View>

      <View className="space-y-4">
        <TouchableOpacity
          onPress={requestPermission}
          disabled={isLoading || permissionStatus === 'granted'}
          className={`w-full py-5 rounded-3xl shadow-lg flex-row justify-center items-center ${
            permissionStatus === 'granted' 
              ? 'bg-emerald-500' 
              : 'bg-primary-600'
          }`}
        >
          <Text className="text-white text-center text-lg font-bold">
            {permissionStatus === 'granted' ? 'Notifications Enabled!' : 'Allow Reminders'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleFinish}
          disabled={isLoading}
          className="w-full py-5 rounded-3xl flex-row justify-center items-center border border-gray-100"
        >
          <Text className="text-gray-400 text-center text-lg font-bold">
            {permissionStatus === 'granted' ? 'Finish Setup' : 'Maybe later'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
