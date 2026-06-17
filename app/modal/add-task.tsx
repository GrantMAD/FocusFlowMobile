import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AddTaskModal from '@/components/tasks/AddTaskModal';

export default function AddTaskModalRoute() {
  const router = useRouter();
  
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <AddTaskModal isOpen={true} onClose={() => router.back()} />
    </View>
  );
}
