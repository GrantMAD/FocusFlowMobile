import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import TaskList from '@/components/tasks/TaskList';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { useTaskStore } from '@/stores/taskStore';
import { Search, Plus, Filter } from 'lucide-react-native';

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'now' | 'next' | 'later'>('all');
  const { tasks, fetchTasks, isLoading } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = filter === 'all' || t.priority === filter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return matchesFilter && matchesSearch;
  });

  const filterOptions = [
    { id: 'all', label: 'All' },
    { id: 'now', label: 'Now' },
    { id: 'next', label: 'Next' },
    { id: 'later', label: 'Later' },
  ];

  return (
    <View className="flex-1 bg-white dark:bg-gray-950">
      <GradientHeader title="Tasks" subtitle="Organize your mind." />
      
      <View className="flex-1 px-6">
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-50 dark:bg-gray-900 px-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 mt-6 mb-4">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search tasks..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-3 font-bold text-gray-900 dark:text-white"
          />
        </View>

        {/* Priority Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="flex-none mb-6"
          contentContainerStyle={{ gap: 8 }}
        >
          {filterOptions.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              onPress={() => setFilter(opt.id as any)}
              className={`px-6 py-2 rounded-full border ${
                filter === opt.id 
                  ? 'bg-purple-600 border-purple-600 shadow-md shadow-purple-200 dark:shadow-none' 
                  : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'
              }`}
            >
              <Text className={`font-black text-xs uppercase tracking-widest ${
                filter === opt.id ? 'text-white' : 'text-gray-400 dark:text-gray-500'
              }`}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'}
          </Text>
          <TouchableOpacity 
            onPress={() => setIsModalOpen(true)}
            className="bg-purple-600 p-3 rounded-2xl shadow-lg shadow-purple-300 dark:shadow-none"
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <TaskList tasks={filteredTasks} isLoading={isLoading} />

        <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </View>
    </View>
  );
}
