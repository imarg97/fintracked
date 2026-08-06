import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { Goal } from '../../types';

interface AddGoalModalProps {
  visible: boolean;
  onClose: () => void;
  onAddGoal: (goal: Goal) => void;
}

export const AddGoalModal: React.FC<AddGoalModalProps> = ({ visible, onClose, onAddGoal }) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('Dec 2026');

  const handleSubmit = () => {
    const target = parseFloat(targetAmount);
    const current = parseFloat(currentAmount || '0');

    if (!title.trim() || isNaN(target) || target <= 0) {
      alert('Please enter a valid goal title and target amount!');
      return;
    }

    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      title: title.trim(),
      targetAmount: target,
      currentAmount: isNaN(current) ? 0 : current,
      targetDate: targetDate.trim() || 'Dec 2026',
      icon: 'flag',
      color: '#10B981',
    };

    onAddGoal(newGoal);
    setTitle('');
    setTargetAmount('');
    setCurrentAmount('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text variant="titleMedium" style={styles.title}>
              Add Custom Financial Goal
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={FinTrackedColors.textSecondary} />
            </Pressable>
          </View>

          {/* Form Inputs */}
          <Text style={styles.label}>Goal Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. New Car, House Downpayment, Emergency Fund"
            placeholderTextColor={FinTrackedColors.textMuted}
            mode="outlined"
            outlineColor={FinTrackedColors.surfaceBorder}
            activeOutlineColor={FinTrackedColors.primary}
            textColor={FinTrackedColors.textPrimary}
            style={styles.textInput}
          />

          <Text style={styles.label}>Target Amount (₹)</Text>
          <TextInput
            value={targetAmount}
            onChangeText={setTargetAmount}
            keyboardType="decimal-pad"
            placeholder="e.g. 500000"
            placeholderTextColor={FinTrackedColors.textMuted}
            mode="outlined"
            outlineColor={FinTrackedColors.surfaceBorder}
            activeOutlineColor={FinTrackedColors.primary}
            textColor={FinTrackedColors.textPrimary}
            style={styles.textInput}
          />

          <Text style={styles.label}>Initial Saved Amount (₹ - Optional)</Text>
          <TextInput
            value={currentAmount}
            onChangeText={setCurrentAmount}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={FinTrackedColors.textMuted}
            mode="outlined"
            outlineColor={FinTrackedColors.surfaceBorder}
            activeOutlineColor={FinTrackedColors.primary}
            textColor={FinTrackedColors.textPrimary}
            style={styles.textInput}
          />

          <Text style={styles.label}>Target Target Date</Text>
          <TextInput
            value={targetDate}
            onChangeText={setTargetDate}
            placeholder="e.g. Dec 2026"
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
            Create Goal
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
