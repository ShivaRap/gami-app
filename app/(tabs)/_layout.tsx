import { Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { BottomNav } from '@/components/navigation/BottomNav';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="stats" />
        <Stack.Screen name="walk" />
        <Stack.Screen name="settings" />
        {/* Keep index for backwards compatibility, but redirect to stats */}
        <Stack.Screen name="index" />
      </Stack>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
