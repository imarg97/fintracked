import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import FinTrackedColors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.iconCircle}>
          <Ionicons name="person" size={40} color={FinTrackedColors.gold} />
        </View>
        <Text variant="headlineSmall" style={styles.title}>
          Settings & Profile
        </Text>
        <Text style={styles.subtitle}>
          Account preferences, security, Supabase sync, and export options will be managed here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FinTrackedColors.background,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  centerContent: {
    alignItems: 'center',
    backgroundColor: FinTrackedColors.surface,
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: FinTrackedColors.gold + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: FinTrackedColors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 13,
  },
});
