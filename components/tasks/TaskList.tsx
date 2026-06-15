import React, { useEffect } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { useTaskStore } from '@/stores/taskStore';
import TaskCard from './TaskCard';

export default function TaskList() {
  const { tasks, fetchTasks, isLoading } = useTaskStore();

  useEffect(() => {
    fetchTasks();
  }, []);

  if (isLoading) {
    return <Text style={styles.center}>Loading tasks...</Text>;
  }

  if (tasks.length === 0) {
    return <Text style={styles.center}>No tasks yet.</Text>;
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TaskCard task={item} />}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 20 },
  center: { textAlign: 'center', marginTop: 20, color: '#6B7280' }
});
