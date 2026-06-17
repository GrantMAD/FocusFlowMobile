import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function FocusSessionModal() {
  const router = useRouter();
  
  return (
    <View className="flex-1 bg-white p-6 justify-center items-center">
      <Text className="text-xl font-bold">Focus Session</Text>
      <TouchableOpacity onPress={() => router.back()} className="mt-4 p-4 bg-gray-200 rounded-xl">
        <Text>Close</Text>
      </TouchableOpacity>
    </View>
  );
}
