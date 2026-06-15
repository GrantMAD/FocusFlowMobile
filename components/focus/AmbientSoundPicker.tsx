import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Audio } from 'expo-av';

const SOUNDS = [
  { id: 'cafe', title: 'Cafe', file: require('@/assets/sounds/Cafe.wav') },
  { id: 'rain', title: 'Rain', file: require('@/assets/sounds/Rain.wav') },
  { id: 'forest', title: 'Forest', file: require('@/assets/sounds/Forest.wav') },
  { id: 'white_noise', title: 'White Noise', file: require('@/assets/sounds/white_noise.wav') },
  { id: 'ocean', title: 'Ocean', file: require('@/assets/sounds/Ocean.wav') },
  { id: 'fire', title: 'Fire', file: require('@/assets/sounds/Fire.wav') },
];

export default function AmbientSoundPicker() {
  const [sound, setSound] = React.useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = React.useState<string | null>(null);

  const playSound = async (item: typeof SOUNDS[0]) => {
    if (sound) await sound.unloadAsync();

    if (playing === item.id) {
      setPlaying(null);
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(item.file, { isLooping: true });
    setSound(newSound);
    await newSound.playAsync();
    setPlaying(item.id);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ambient Sounds</Text>
      <FlatList
        data={SOUNDS}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.btn, playing === item.id && styles.activeBtn]} 
            onPress={() => playSound(item)}
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
