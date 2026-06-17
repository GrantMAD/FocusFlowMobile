import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useBrainDumpStore } from '@/stores/brainDumpStore';
import { Brain, ArrowRight, Trash2 } from 'lucide-react-native';

export default function BrainDumpScreen() {
  const { items, isLoading, fetchItems, removeItem, convertToTask } = useBrainDumpStore();

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black p-4">
      <View className="flex-row items-center gap-2 mb-6">
        <Brain size={24} color="#9333EA" />
        <Text className="text-2xl font-black text-gray-900 dark:text-white">Brain Dump</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator className="mt-10" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchItems} />}
          renderItem={({ item }) => (
            <View className="bg-white dark:bg-gray-800 p-4 rounded-2xl mb-3 flex-row items-center justify-between border border-gray-100 dark:border-gray-700">
              <Text className="text-gray-900 dark:text-white flex-1 mr-2">{item.content}</Text>
              <View className="flex-row gap-2">
                <TouchableOpacity 
                  onPress={() => convertToTask(item.id)}
                  className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"
                >
                  <ArrowRight size={18} color="#9333EA" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => removeItem(item.id)}
                  className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg"
                >
                  <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
