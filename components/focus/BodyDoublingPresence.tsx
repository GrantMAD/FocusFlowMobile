import React from 'react';
import { View, Text } from 'react-native';
import { Users } from 'lucide-react-native';

export default function BodyDoublingPresence() {
  return (
    <View className="flex-row items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
      <Users size={16} color="#6366F1" />
      <Text className="text-indigo-700 dark:text-indigo-300 text-xs font-bold">
        12 others are focusing right now
      </Text>
    </View>
  );
}
