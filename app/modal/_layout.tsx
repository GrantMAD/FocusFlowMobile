import { Stack } from 'expo-router';

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal', headerShown: false }}>
      <Stack.Screen name="add-task" />
      <Stack.Screen name="focus-session" />
      <Stack.Screen name="brain-dump-add" />
    </Stack>
  );
}
