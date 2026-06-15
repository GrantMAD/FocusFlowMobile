import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useFocusStore } from '@/stores/focusStore';

export default function FocusTimer() {
  const { isActive, timeLeft, mode, pauseSession, resumeSession, endSession, tick } = useFocusStore();

  useEffect(() => {
    const timer = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePauseResume = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isActive) pauseSession();
    else resumeSession();
  };

  const handleEnd = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    endSession(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.modeText}>{mode === 'work' ? 'Focus Time' : 'Break Time'}</Text>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={handlePauseResume}>
          {isActive ? <Pause size={32} color="#FFFFFF" /> : <Play size={32} color="#FFFFFF" />}
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.controlButton, styles.endButton]} onPress={handleEnd}>
          <X size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 40 },
  modeText: { fontSize: 18, color: '#6B7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 2 },
  timerText: { fontSize: 80, fontWeight: '900', color: '#1F2937' },
  controls: { flexDirection: 'row', gap: 20, marginTop: 30 },
  controlButton: { backgroundColor: '#7C3AED', padding: 20, borderRadius: 50 },
  endButton: { backgroundColor: '#EF4444' }
});
