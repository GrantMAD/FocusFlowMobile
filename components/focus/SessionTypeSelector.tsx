import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const TYPES = [
  { id: 'pomodoro', title: 'Pomodoro' },
  { id: 'deep_work', title: 'Deep Work' },
  { id: 'body_doubling', title: 'Body Doubling' },
  { id: 'custom', title: 'Custom' },
];

export default function SessionTypeSelector({ onSelect, selectedId }: { onSelect: (id: string) => void, selectedId: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Type</Text>
      <FlatList
        data={TYPES}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.btn, selectedId === item.id && styles.activeBtn]} 
            onPress={() => onSelect(item.id)}
          >
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  btn: { padding: 12, backgroundColor: '#F3F4F6', borderRadius: 12, marginRight: 10 },
  activeBtn: { backgroundColor: '#E9D5FF' }
});
