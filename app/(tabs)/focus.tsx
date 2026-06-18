import { useState, useEffect } from 'react';
import { View, Modal, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import FocusTimer from '@/components/focus/FocusTimer';
import AmbientSoundPicker from '@/components/focus/AmbientSoundPicker';
import SessionTypeSelector from '@/components/focus/SessionTypeSelector';
import { useFocusStore } from '@/stores/focusStore';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { useSubscription } from '@/hooks/useSubscription';
import { CheckCircle2 } from 'lucide-react-native';

const MOODS = ['😩', '😕', '😐', '🙂', '🤩'];

export default function Focus() {
  const [showPreModal, setShowPreModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [sessionType, setSessionType] = useState('pomodoro');
  const [customDuration, setCustomDuration] = useState('25');
  const [moodBefore, setMoodBefore] = useState<number>(3);
  const [moodAfter, setMoodAfter] = useState<number>(3);
  const { isPro } = useSubscription();

  const { 
    startSession, 
    canStartSession, 
    sessionsCompletedToday, 
    fetchSessionsCompletedToday,
    isActive,
    timeLeft,
    currentSession,
    endSession
  } = useFocusStore();

  useEffect(() => {
    fetchSessionsCompletedToday();
  }, []);

  // Watch for session completion
  useEffect(() => {
    if (!isActive && currentSession && timeLeft === 0) {
      setShowPostModal(true);
    }
  }, [isActive, currentSession, timeLeft]);

  const handleStartRequest = async (id: string) => {
    const canStart = await canStartSession();
    if (!canStart) {
      Alert.alert(
        'Upgrade to Pro',
        "You've reached your daily limit of 3 focus sessions. Unlock unlimited sessions and premium features with Pro.",
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'View Pricing', onPress: () => {} } // Navigate to paywall when implemented
        ]
      );
      return;
    }
    setSessionType(id);
    setShowPreModal(true);
  };

  const handleStart = () => {
    const duration = sessionType === 'custom' ? parseInt(customDuration) * 60 : 15 * 60;
    startSession(sessionType as any, duration, undefined, moodBefore);
    setShowPreModal(false);
  };

  const handleCompleteReflection = async () => {
    await endSession(true, moodAfter);
    setShowPostModal(false);
    setMoodAfter(3);
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-950">
      <GradientHeader 
        title="Focus" 
        subtitle={!isPro ? `Daily sessions: ${sessionsCompletedToday} / 3` : "Deep work starts now."} 
      />
      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <FocusTimer />
        <SessionTypeSelector selectedId={sessionType} onSelect={handleStartRequest} />
        <AmbientSoundPicker />

        {/* Pre-Session Modal */}
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

        {/* Post-Session Modal */}
        <Modal visible={showPostModal} animationType="fade" transparent={true}>
          <View className="flex-1 bg-black/50 justify-center items-center p-6">
            <View className="bg-white dark:bg-gray-900 w-full rounded-[40px] p-8 items-center shadow-2xl">
              <View className="bg-green-100 dark:bg-green-900/20 p-5 rounded-full mb-6">
                <CheckCircle2 size={40} color="#10B981" />
              </View>
              <Text className="text-3xl font-black text-gray-900 dark:text-white mb-2">Well Done!</Text>
              <Text className="text-gray-500 dark:text-gray-400 text-center mb-8">Session complete. How do you feel now?</Text>
              
              <View className="flex-row justify-between w-full mb-8">
                {MOODS.map((mood, index) => (
                  <TouchableOpacity 
                    key={index} 
                    className={`p-4 rounded-2xl ${moodAfter === index + 1 ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-50 dark:bg-gray-800'}`}
                    onPress={() => setMoodAfter(index + 1)}
                  >
                    <Text className="text-2xl">{mood}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                className="bg-purple-600 w-full py-5 rounded-2xl items-center shadow-lg"
                onPress={handleCompleteReflection}
              >
                <Text className="text-white font-black uppercase tracking-widest">Complete Reflection</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}
