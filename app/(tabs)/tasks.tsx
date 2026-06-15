import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AddTaskModal from '@/components/tasks/AddTaskModal';
import TaskList from '@/components/tasks/TaskList';

export default function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity 
          onPress={() => setIsModalOpen(true)}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Add Task</Text>
        </TouchableOpacity>
      </View>

      <TaskList />

      <AddTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  addButton: { backgroundColor: '#7C3AED', padding: 12, borderRadius: 12 },
  addButtonText: { color: 'white', fontWeight: 'bold' }
});
