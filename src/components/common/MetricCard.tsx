import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { formatRupee } from '../../utils/formatters';

interface MetricCardProps {
  label: string;
  amount?: number;
  percentage?: number;
  type: 'INCOME' | 'EXPENSE' | 'SAVINGS';
  isPrivacy: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  amount,
  percentage,
  type,
  isPrivacy,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'INCOME':
        return { name: 'arrow-down-circle' as const, color: FinTrackedColors.primary };
      case 'EXPENSE':
        return { name: 'arrow-up-circle' as const, color: FinTrackedColors.error };
      case 'SAVINGS':
        return { name: 'pie-chart' as const, color: FinTrackedColors.secondary };
    }
  };

  const iconInfo = getIcon();

  return (
    <Surface style={styles.card} elevation={0}>
      <View style={styles.header}>
        <View style={[styles.iconBg, { backgroundColor: iconInfo.color + '1A' }]}>
          <Ionicons name={iconInfo.name} size={18} color={iconInfo.color} />
        </View>
        <Text variant="labelMedium" style={styles.label}>
          {label}
        </Text>
      </View>

      <Text variant="titleMedium" style={styles.value}>
        {percentage !== undefined
          ? `${percentage}%`
          : formatRupee(amount || 0, isPrivacy)}
      </Text>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  label: {
    color: FinTrackedColors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  value: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
    fontSize: 16,
  },
});
