import React from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import { useTaskStore } from '@/stores/taskStore';
import TaskCard from './TaskCard';
import { Task } from '@/types';

type Props = {
  tasks: Task[];
  isLoading?: boolean;
};

export default function TaskList({ tasks, isLoading }: Props) {
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center py-10">
        <ActivityIndicator color="#7C3AED" />
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View className="flex-1 justify-center items-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-[40px] border-2 border-dashed border-gray-100 dark:border-gray-800">
        <Text className="text-gray-400 dark:text-gray-500 font-bold">No tasks found.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TaskCard task={item} />}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    />
  );
}
