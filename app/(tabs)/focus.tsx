import { useState } from 'react';
import { View, Modal, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import FocusTimer from '@/components/focus/FocusTimer';
import AmbientSoundPicker from '@/components/focus/AmbientSoundPicker';
import SessionTypeSelector from '@/components/focus/SessionTypeSelector';
import { useFocusStore } from '@/stores/focusStore';
import { GradientHeader } from '@/components/ui/GradientHeader';

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
    <View className="flex-1 bg-white dark:bg-gray-950">
      <GradientHeader title="Focus" subtitle="Deep work starts now." />
      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <FocusTimer />
        <SessionTypeSelector selectedId={sessionType} onSelect={handleTypeSelect} />
        <AmbientSoundPicker />

        <Modal visible={showPreModal} animationType="slide" presentationStyle="pageSheet">
          <View className="flex-1 bg-white dark:bg-gray-900 p-8 justify-center">
            <Text className="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">Ready to Focus?</Text>
            
            {sessionType === 'custom' && (
              <View className="mb-6">
                <Text className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 ml-1">Duration (minutes)</Text>
                <TextInput 
                  className="w-full bg-gray-50 dark:bg-gray-800 px-4 py-4 rounded-2xl border border-gray-100 dark:border-gray-700 font-bold text-gray-900 dark:text-white"
                  value={customDuration}
                  onChangeText={setCustomDuration}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}

            <Text className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 ml-1">How are you feeling?</Text>
            <View className="flex-row justify-between mb-8">
              {MOODS.map((mood, index) => (
                <TouchableOpacity 
                  key={index} 
                  className={`p-4 rounded-2xl ${moodBefore === index + 1 ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-50 dark:bg-gray-800'}`}
                  onPress={() => setMoodBefore(index + 1)}
                >
                  <Text className="text-2xl">{mood}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              className="bg-purple-600 py-5 rounded-2xl items-center shadow-lg"
              onPress={handleStart}
            >
              <Text className="text-white font-black uppercase tracking-widest">Start Focusing</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="py-4 items-center mt-2" 
              onPress={() => setShowPreModal(false)}
            >
              <Text className="text-gray-500 dark:text-gray-400 font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}
