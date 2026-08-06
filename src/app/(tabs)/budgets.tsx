import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import FinTrackedColors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function BudgetsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.iconCircle}>
          <Ionicons name="wallet" size={40} color={FinTrackedColors.secondary} />
        </View>
        <Text variant="headlineSmall" style={styles.title}>
          Budgets & Goals
        </Text>
        <Text style={styles.subtitle}>
          Set category spending limits, track savings goals, and monitor investment targets in Phase 3.
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
    backgroundColor: FinTrackedColors.secondary + '1A',
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
