import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckCircle2, Circle, Trash2, ChevronDown, ChevronRight, Plus } from 'lucide-react-native';
import { Task } from '@/types';
import { useTaskStore } from '@/stores/taskStore';
import { useSubscription } from '@/hooks/useSubscription';

type Props = {
  task: Task;
};

export default function TaskCard({ task }: Props) {
  const { toggleTask, deleteTask, toggleChunk, deleteChunk } = useTaskStore();
  const { isPro } = useSubscription();
  const [isExpanded, setIsExpanded] = React.useState(false);

  const completedChunks = task.chunks?.filter((c) => c.completed).length || 0;
  const totalChunks = task.chunks?.length || 0;

  return (
    <View style={styles.card}>
      <View style={styles.mainRow}>
        {isPro && totalChunks > 0 && (
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? <ChevronDown size={20} color="#6B7280" /> : <ChevronRight size={20} color="#6B7280" />}
          </TouchableOpacity>
        )}
        
        <TouchableOpacity onPress={() => toggleTask(task.id)}>
          {task.status === 'completed' ? (
            <CheckCircle2 size={24} color="#10B981" />
          ) : (
            <Circle size={24} color="#D1D5DB" />
          )}
        </TouchableOpacity>

        <View style={styles.taskInfo}>
          <Text style={[styles.title, task.status === 'completed' && styles.completedText]}>
            {task.title}
          </Text>
          {task.notes && <Text style={styles.notes} numberOfLines={1}>{task.notes}</Text>}
        </View>

        <TouchableOpacity onPress={() => deleteTask(task.id)}>
          <Trash2 size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Subtasks Section */}
      {isExpanded && isPro && (
        <View style={styles.subtasksContainer}>
          {task.chunks?.map((chunk) => (
            <View key={chunk.id} style={styles.subtaskRow}>
              <TouchableOpacity onPress={() => toggleChunk(task.id, chunk.id)}>
                {chunk.completed ? (
                  <CheckCircle2 size={18} color="#10B981" />
                ) : (
                  <Circle size={18} color="#D1D5DB" />
                )}
              </TouchableOpacity>
              <Text style={[styles.subtaskTitle, chunk.completed && styles.completedText]}>
                {chunk.title}
              </Text>
              <TouchableOpacity onPress={() => deleteChunk(task.id, chunk.id)}>
                <Trash2 size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  mainRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  taskInfo: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600', color: '#111827' },
  completedText: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  notes: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  subtasksContainer: { marginTop: 12, marginLeft: 32, gap: 8 },
  subtaskRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  subtaskTitle: { fontSize: 14, color: '#374151', flex: 1 },
});
