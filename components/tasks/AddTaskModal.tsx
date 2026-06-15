import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Switch } from 'react-native';
import { useTaskStore } from '@/stores/taskStore';
import { X } from 'lucide-react-native';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddTaskModal({ isOpen, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'now' | 'next' | 'later' | 'brain_dump'>('later');
  const [isDailyPriority, setIsDailyPriority] = useState(false);
  const { addTask } = useTaskStore();

  const handleSubmit = async () => {
    if (!title.trim()) return;

    await addTask({
      title,
      notes,
      priority,
      is_daily_priority: isDailyPriority,
      status: 'pending',
    });

    setTitle('');
    setNotes('');
    onClose();
  };

  return (
    <Modal visible={isOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>New Task</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <TextInput
            placeholder="What needs to be done?"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            autoFocus
          />
          <TextInput
            placeholder="Add more details..."
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, styles.textArea]}
            multiline
          />
          
          <View style={styles.row}>
            <Text style={styles.label}>Priority</Text>
            {/* Simple priority selector placeholder - can be improved to a real select component */}
            <TouchableOpacity onPress={() => setPriority('now')} style={[styles.priorityBtn, priority === 'now' && styles.selected]}>
                <Text>Now</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPriority('next')} style={[styles.priorityBtn, priority === 'next' && styles.selected]}>
                <Text>Next</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPriority('later')} style={[styles.priorityBtn, priority === 'later' && styles.selected]}>
                <Text>Later</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text>Daily Priority</Text>
            <Switch value={isDailyPriority} onValueChange={setIsDailyPriority} />
          </View>

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitText}>Create Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  closeButton: { padding: 5 },
  form: { gap: 15 },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, fontSize: 16 },
  textArea: { height: 100 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontWeight: 'bold' },
  priorityBtn: { padding: 10, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8 },
  selected: { backgroundColor: '#E9D5FF' },
  submitButton: { backgroundColor: '#7C3AED', padding: 16, borderRadius: 12, alignItems: 'center' },
  submitText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});
