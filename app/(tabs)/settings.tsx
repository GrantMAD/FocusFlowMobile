import { View, Text, TouchableOpacity } from 'react-native';
import { useAuthStore } from '@/stores/authStore';

export default function Settings() {
  const { signOut } = useAuthStore();

  return (
    <View className="flex-1 justify-center items-center bg-white px-8">
      <Text className="text-2xl font-bold text-gray-900">Settings</Text>
      <Text className="text-gray-500 mb-8">Feature implementation coming soon.</Text>
      
      <TouchableOpacity 
        onPress={() => signOut()}
        className="w-full bg-red-50 py-4 rounded-xl border border-red-100"
      >
        <Text className="text-red-600 text-center font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
