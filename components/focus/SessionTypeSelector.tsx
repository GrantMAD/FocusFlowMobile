import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Layers } from 'lucide-react-native';

const TYPES = [
  { id: 'pomodoro', title: 'Pomodoro' },
  { id: 'deep_work', title: 'Deep Work' },
  { id: 'body_doubling', title: 'Body Doubling' },
  { id: 'custom', title: 'Custom' },
];

export default function SessionTypeSelector({ onSelect, selectedId }: { onSelect: (id: string) => void, selectedId: string }) {
  return (
    <View className="mt-4">
      <View className="flex-row items-center gap-2 mb-4">
        <Layers size={18} color="#7C3AED" />
        <Text className="text-lg font-black text-gray-900 dark:text-white">Session Type</Text>
      </View>
      <FlatList
        data={TYPES}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => onSelect(item.id)}
            className={`px-6 py-4 rounded-2xl border-2 transition-all mr-3 ${
              selectedId === item.id 
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' 
                : 'border-gray-50 dark:border-gray-800 bg-gray-50 dark:bg-gray-800'
            }`}
          >
            <Text className={`font-bold ${
              selectedId === item.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
