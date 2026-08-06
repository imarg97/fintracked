import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { Budget } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface AddBudgetModalProps {
  visible: boolean;
  onClose: () => void;
  onAddBudget: (budget: Budget) => void;
}

export const AddBudgetModal: React.FC<AddBudgetModalProps> = ({
  visible,
  onClose,
  onAddBudget,
}) => {
  const { categories } = useAppStore();
  const [selectedCategoryName, setSelectedCategoryName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');

  const handleSubmit = () => {
    const limit = parseFloat(monthlyLimit);

    if (!selectedCategoryName.trim() || isNaN(limit) || limit <= 0) {
      alert('Please enter a category name and monthly cap amount!');
      return;
    }

    const matchedCat = categories.find(
      (c) => c.name.toLowerCase() === selectedCategoryName.trim().toLowerCase()
    );

    const newBudget: Budget = {
      id: `bgt-${Date.now()}`,
      categoryId: matchedCat ? matchedCat.id : `cat-custom-${Date.now()}`,
      categoryName: selectedCategoryName.trim(),
      monthlyLimit: limit,
      icon: matchedCat ? matchedCat.icon : 'pie-chart',
      color: matchedCat ? matchedCat.color : '#3B82F6',
    };

    onAddBudget(newBudget);
    setSelectedCategoryName('');
    setMonthlyLimit('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.title}>
              Add Category Spending Limit
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={FinTrackedColors.textSecondary} />
            </Pressable>
          </View>

          {/* Form Inputs */}
          <Text style={styles.label}>Category Name</Text>
          <TextInput
            value={selectedCategoryName}
            onChangeText={setSelectedCategoryName}
            placeholder="e.g. Food & Dining, Rent, Fuel, Shopping"
            placeholderTextColor={FinTrackedColors.textMuted}
            mode="outlined"
            outlineColor={FinTrackedColors.surfaceBorder}
            activeOutlineColor={FinTrackedColors.primary}
            textColor={FinTrackedColors.textPrimary}
            style={styles.textInput}
          />

          <Text style={styles.label}>Monthly Cap Limit (₹)</Text>
          <TextInput
            value={monthlyLimit}
            onChangeText={setMonthlyLimit}
            keyboardType="decimal-pad"
            placeholder="e.g. 20000"
            placeholderTextColor={FinTrackedColors.textMuted}
            mode="outlined"
            outlineColor={FinTrackedColors.surfaceBorder}
            activeOutlineColor={FinTrackedColors.primary}
            textColor={FinTrackedColors.textPrimary}
            style={styles.textInput}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitBtn}
            contentStyle={styles.submitBtnContent}
            labelStyle={styles.submitBtnLabel}
          >
            Create Budget Cap
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: FinTrackedColors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: FinTrackedColors.surfaceBorder + '80',
  },
  title: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
  },
  label: {
    color: FinTrackedColors.textSecondary,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: FinTrackedColors.surface,
    fontSize: 13,
  },
  submitBtn: {
    backgroundColor: FinTrackedColors.primary,
    borderRadius: 14,
    marginTop: 20,
    marginBottom: 10,
  },
  submitBtnContent: {
    height: 48,
  },
  submitBtnLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
