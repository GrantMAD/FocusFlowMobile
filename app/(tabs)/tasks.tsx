import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import TaskList from '@/components/tasks/TaskList';

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <View className="flex-1 bg-white dark:bg-gray-950">
      <View className="flex-1 p-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl font-black text-gray-900 dark:text-white">Tasks</Text>
          <TouchableOpacity 
            onPress={() => setIsModalOpen(true)}
            className="bg-purple-600 px-5 py-3 rounded-2xl shadow-md"
          >
            <Text className="text-white font-black uppercase tracking-widest text-xs">Add Task</Text>
          </TouchableOpacity>
        </View>

        <TaskList />

        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </View>
    </View>
  );
}
