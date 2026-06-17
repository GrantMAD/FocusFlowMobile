import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Brain } from 'lucide-react-native';
import { useBrainDumpStore } from '@/stores/brainDumpStore';

export default function BrainDumpAddModal() {
  const router = useRouter();
  const { addItem } = useBrainDumpStore();
  const [content, setContent] = React.useState('');

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-xl font-bold mb-4">Quick Capture</Text>
      {/* TextInput here with addItem, then router.back() */}
      <TouchableOpacity onPress={() => router.back()} className="mt-4 p-4 bg-gray-200 rounded-xl">
        <Text>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}
