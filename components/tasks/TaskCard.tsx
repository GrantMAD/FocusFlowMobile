import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { CheckCircle2, Circle, Trash2, ChevronDown, ChevronRight, Plus } from 'lucide-react-native';
import { Task } from '@/types';
import { useTaskStore } from '@/stores/taskStore';
import { useSubscription } from '@/hooks/useSubscription';

type Props = {
  task: Task;
};

export default function TaskCard({ task }: Props) {
  const { toggleTask, deleteTask, toggleChunk, deleteChunk, addChunk } = useTaskStore();
  const { isPro } = useSubscription();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newChunkTitle, setNewChunkTitle] = useState('');

  const totalChunks = task.chunks?.length || 0;

  const handleAddChunk = () => {
    if (!newChunkTitle.trim()) return;
    addChunk(task.id, newChunkTitle.trim());
    setNewChunkTitle('');
    setIsExpanded(true);
  };

  return (
    <View className="bg-white dark:bg-gray-900 p-5 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm mb-4">
      <View className="flex-row items-center gap-4">
        {isPro && totalChunks > 0 && (
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown size={20} color="#9CA3AF" /> : <ChevronRight size={20} color="#9CA3AF" />}
          </TouchableOpacity>
        )}
        
        <TouchableOpacity onPress={() => toggleTask(task.id)}>
          {task.status === 'completed' ? (
            <CheckCircle2 size={28} color="#10B981" />
          ) : (
            <Circle size={28} color="#D1D5DB" />
          )}
        </TouchableOpacity>

        <View className="flex-1">
          <Text className={`text-lg font-bold ${
            task.status === 'completed' ? 'text-gray-400 dark:text-gray-600 line-through' : 'text-gray-900 dark:text-white'
          }`}>
            {task.title}
          </Text>
          {task.notes && (
            <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1" numberOfLines={1}>
              {task.notes}
            </Text>
          )}
        </View>

        <TouchableOpacity 
          onPress={() => deleteTask(task.id)}
          className="p-2 bg-red-50 dark:bg-red-900/10 rounded-xl"
        >
          <Trash2 size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Subtasks Section */}
      {(isExpanded || totalChunks === 0) && isPro && (
        <View className="mt-6 ml-10 space-y-3 pt-4 border-t border-gray-50 dark:border-gray-800">
          {task.chunks?.map((chunk) => (
            <View key={chunk.id} className="flex-row items-center gap-3">
              <TouchableOpacity onPress={() => toggleChunk(task.id, chunk.id)}>
                {chunk.completed ? (
                  <CheckCircle2 size={20} color="#10B981" />
                ) : (
                  <Circle size={20} color="#D1D5DB" />
                )}
              </TouchableOpacity>
              <Text className={`flex-1 font-medium ${
                chunk.completed ? 'text-gray-400 dark:text-gray-600 line-through' : 'text-gray-700 dark:text-gray-300'
              }`}>
                {chunk.title}
              </Text>
              <TouchableOpacity onPress={() => deleteChunk(task.id, chunk.id)}>
                <Trash2 size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          ))}
          
          {/* Add Subtask Input Form */}
          <View className="flex-row gap-2 mt-2 items-center">
            <TextInput
              placeholder="Add a subtask..."
              placeholderTextColor="#9CA3AF"
              value={newChunkTitle}
              onChangeText={setNewChunkTitle}
              className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2 font-medium text-gray-900 dark:text-white text-xs border border-gray-100 dark:border-gray-700"
            />
            <TouchableOpacity 
              onPress={handleAddChunk}
              disabled={!newChunkTitle.trim()}
              className="bg-purple-600 p-2 rounded-xl disabled:opacity-50"
            >
              <Plus size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
