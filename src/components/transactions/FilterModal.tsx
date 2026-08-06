import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: { datePreset: string; type: string }) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
}) => {
  const [selectedDatePreset, setSelectedDatePreset] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');

  const datePresets = [
    { label: 'All Time', value: 'ALL' },
    { label: 'This Month', value: 'THIS_MONTH' },
    { label: 'Last 30 Days', value: '30_DAYS' },
    { label: 'Year to Date', value: 'YTD' },
  ];

  const typeOptions = [
    { label: 'All Types', value: 'ALL' },
    { label: 'Expenses Only', value: 'EXPENSE' },
    { label: 'Income Only', value: 'INCOME' },
  ];

  const handleApply = () => {
    onApply({
      datePreset: selectedDatePreset,
      type: selectedType,
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.title}>
              Filter Transactions
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={FinTrackedColors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.body}>
            {/* Date Presets */}
            <Text style={styles.sectionLabel}>Date Range</Text>
            <View style={styles.chipRow}>
              {datePresets.map((dp) => (
                <Pressable
                  key={dp.value}
                  onPress={() => setSelectedDatePreset(dp.value)}
                  style={[
                    styles.chip,
                    selectedDatePreset === dp.value && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedDatePreset === dp.value && styles.chipTextActive,
                    ]}
                  >
                    {dp.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Type Filters */}
            <Text style={styles.sectionLabel}>Transaction Type</Text>
            <View style={styles.chipRow}>
              {typeOptions.map((to) => (
                <Pressable
                  key={to.value}
                  onPress={() => setSelectedType(to.value)}
                  style={[
                    styles.chip,
                    selectedType === to.value && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selectedType === to.value && styles.chipTextActive,
                    ]}
                  >
                    {to.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <Button
            mode="contained"
            onPress={handleApply}
            style={styles.applyBtn}
            contentStyle={styles.applyBtnContent}
            labelStyle={styles.applyBtnLabel}
          >
            Apply Filters
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: FinTrackedColors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '70%',
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: FinTrackedColors.surfaceBorder + '80',
  },
  title: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
  },
  body: {
    marginBottom: 20,
  },
  sectionLabel: {
    color: FinTrackedColors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: FinTrackedColors.surfaceVariant + '60',
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: {
    backgroundColor: FinTrackedColors.primary,
    borderColor: FinTrackedColors.primary,
  },
  chipText: {
    color: FinTrackedColors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  applyBtn: {
    backgroundColor: FinTrackedColors.primary,
    borderRadius: 16,
  },
  applyBtnContent: {
    height: 48,
  },
  applyBtnLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
