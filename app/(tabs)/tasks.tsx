import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import TaskList from '@/components/tasks/TaskList';
import { GradientHeader } from '@/components/ui/GradientHeader';

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <View className="flex-1 bg-white dark:bg-gray-950">
      <GradientHeader title="Tasks" subtitle="Organize your mind." />
      <View className="flex-1 p-6">
        <View className="flex-row justify-end mb-6">
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
