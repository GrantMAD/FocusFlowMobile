import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function TimerControls() {
  return (
    <View className="flex-row gap-4 justify-center">
      <TouchableOpacity className="p-4 bg-purple-600 rounded-full">
        <Text className="text-white font-bold">Start</Text>
      </TouchableOpacity>
    </View>
  );
}
