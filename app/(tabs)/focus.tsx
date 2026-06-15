import { useState } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity, TextInput } from 'react-native';
import FocusTimer from '@/components/focus/FocusTimer';
import AmbientSoundPicker from '@/components/focus/AmbientSoundPicker';
import SessionTypeSelector from '@/components/focus/SessionTypeSelector';
import { useFocusStore } from '@/stores/focusStore';

const MOODS = ['😩', '😕', '😐', '🙂', '🤩'];

export default function Focus() {
  const [showPreModal, setShowPreModal] = useState(false);
  const [sessionType, setSessionType] = useState('pomodoro');
  const [customDuration, setCustomDuration] = useState('25');
  const [moodBefore, setMoodBefore] = useState<number>(3);
  const { startSession } = useFocusStore();

  const handleStart = () => {
    const duration = sessionType === 'custom' ? parseInt(customDuration) * 60 : 15 * 60;
    startSession(sessionType as any, duration);
    setShowPreModal(false);
  };

  const handleTypeSelect = (id: string) => {
    setSessionType(id);
    setShowPreModal(true);
  };

  return (
    <View style={styles.container}>
      <FocusTimer />
      <SessionTypeSelector selectedId={sessionType} onSelect={handleTypeSelect} />
      <AmbientSoundPicker />

      <Modal visible={showPreModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Ready to Focus?</Text>
          
          {sessionType === 'custom' && (
            <View>
              <Text style={styles.label}>Duration (minutes)</Text>
              <TextInput 
                style={styles.input}
                value={customDuration}
                onChangeText={setCustomDuration}
                keyboardType="numeric"
              />
            </View>
          )}

          <Text style={styles.label}>How are you feeling?</Text>
          <View style={styles.moodContainer}>
            {MOODS.map((mood, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.moodBtn, moodBefore === index + 1 && styles.activeMoodBtn]}
                onPress={() => setMoodBefore(index + 1)}
              >
                <Text style={styles.moodText}>{mood}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={handleStart}>
            <Text style={styles.startBtnText}>Start Focusing</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowPreModal(false)}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 20 },
  startBtn: { backgroundColor: '#7C3AED', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  startBtnText: { color: 'white', fontWeight: 'bold' },
  cancelBtn: { padding: 16, alignItems: 'center' },
  input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12, marginBottom: 20, fontSize: 16 },
  modalContent: { flex: 1, padding: 20, justifyContent: 'center' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  moodContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  moodBtn: { padding: 15, borderRadius: 12, backgroundColor: '#F3F4F6' },
  activeMoodBtn: { backgroundColor: '#E9D5FF' },
  moodText: { fontSize: 24 }
});
