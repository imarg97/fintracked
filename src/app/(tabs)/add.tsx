import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { AddTransactionForm } from '../../components/transactions/AddTransactionForm';

export default function AddTransactionScreen() {
  const router = useRouter();

  const handleSuccess = () => {
    // Navigate back to Home Dashboard on save
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.headerTitle}>
          New Transaction
        </Text>
        <Pressable
          onPress={() => router.replace('/(tabs)')}
          style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.6 }]}
          hitSlop={12}
        >
          <Ionicons name="close" size={24} color={FinTrackedColors.textSecondary} />
        </Pressable>
      </View>

      {/* Form Body */}
      <AddTransactionForm onSuccess={handleSuccess} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FinTrackedColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: FinTrackedColors.surfaceBorder + '80',
  },
  headerTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
});
