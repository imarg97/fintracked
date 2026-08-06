import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import FinTrackedColors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function AddTransactionScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.iconCircle}>
          <Ionicons name="add-circle" size={44} color={FinTrackedColors.primary} />
        </View>
        <Text variant="headlineSmall" style={styles.title}>
          Add Transaction
        </Text>
        <Text style={styles.subtitle}>
          Quick expense and income entry forms with auto-categorization will open here in Phase 2.
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
    backgroundColor: FinTrackedColors.primary + '1A',
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
