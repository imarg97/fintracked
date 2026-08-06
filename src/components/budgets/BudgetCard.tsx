import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text, ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { Budget } from '../../types';
import { formatRupee } from '../../utils/formatters';

interface BudgetCardProps {
  budget: Budget;
  spentAmount: number;
  isPrivacyMode: boolean;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({
  budget,
  spentAmount,
  isPrivacyMode,
}) => {
  const percentage = Math.min(100, Math.round((spentAmount / budget.monthlyLimit) * 100));
  const remaining = budget.monthlyLimit - spentAmount;

  const getStatusColor = () => {
    if (percentage >= 90) return FinTrackedColors.error;
    if (percentage >= 75) return FinTrackedColors.gold;
    return FinTrackedColors.primary;
  };

  const statusColor = getStatusColor();

  return (
    <Surface style={styles.card} elevation={0}>
      <View style={styles.header}>
        <View style={styles.leftRow}>
          <View style={[styles.iconBg, { backgroundColor: budget.color + '1F' }]}>
            <Ionicons name={budget.icon as any} size={18} color={budget.color} />
          </View>
          <Text variant="titleMedium" style={styles.categoryName}>
            {budget.categoryName}
          </Text>
        </View>

        <Text style={[styles.percentageText, { color: statusColor }]}>
          {percentage}%
        </Text>
      </View>

      <ProgressBar
        progress={percentage / 100}
        color={statusColor}
        style={styles.progressBar}
      />

      <View style={styles.footerRow}>
        <Text style={styles.spentText}>
          Spent: {formatRupee(spentAmount, isPrivacyMode)}
        </Text>
        <Text style={styles.limitText}>
          {remaining >= 0 ? 'Remaining: ' : 'Over Cap: '}
          {formatRupee(Math.abs(remaining), isPrivacyMode)}
        </Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBg: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  categoryName: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  percentageText: {
    fontWeight: '800',
    fontSize: 13,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: FinTrackedColors.surfaceVariant,
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  spentText: {
    color: FinTrackedColors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  limitText: {
    color: FinTrackedColors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
});
