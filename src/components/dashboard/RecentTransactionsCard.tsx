import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { Transaction } from '../../types';
import { formatRupee } from '../../utils/formatters';

interface RecentTransactionsCardProps {
  transactions: Transaction[];
  isPrivacyMode: boolean;
  onViewAll?: () => void;
}

export const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({
  transactions,
  isPrivacyMode,
  onViewAll,
}) => {
  return (
    <Surface style={styles.container} elevation={0}>
      <View style={styles.header}>
        <Text variant="titleMedium" style={styles.title}>
          Recent Activity
        </Text>
        <Pressable onPress={onViewAll} hitSlop={8}>
          <Text style={styles.viewAll}>See All</Text>
        </Pressable>
      </View>

      {transactions.map((item, index) => {
        const isExpense = item.type === 'EXPENSE';
        return (
          <View
            key={item.id}
            style={[
              styles.itemRow,
              index !== transactions.length - 1 && styles.borderBottom,
            ]}
          >
            <View style={styles.leftSection}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: isExpense
                      ? FinTrackedColors.error + '1A'
                      : FinTrackedColors.primary + '1A',
                  },
                ]}
              >
                <Ionicons
                  name={item.iconName as any}
                  size={20}
                  color={
                    isExpense ? FinTrackedColors.error : FinTrackedColors.primary
                  }
                />
              </View>
              <View style={styles.meta}>
                <Text variant="bodyLarge" style={styles.itemTitle}>
                  {item.title}
                </Text>
                <Text style={styles.itemSub}>
                  {item.category} • {item.accountName}
                </Text>
              </View>
            </View>

            <View style={styles.rightSection}>
              <Text
                style={[
                  styles.amount,
                  {
                    color: isExpense
                      ? FinTrackedColors.textPrimary
                      : FinTrackedColors.primary,
                  },
                ]}
              >
                {isExpense ? '-' : '+'}
                {formatRupee(item.amount, isPrivacyMode)}
              </Text>
              <Text style={styles.dateText}>{item.date}</Text>
            </View>
          </View>
        );
      })}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
  },
  viewAll: {
    color: FinTrackedColors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: FinTrackedColors.surfaceBorder + '50',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  meta: {
    flex: 1,
  },
  itemTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  itemSub: {
    color: FinTrackedColors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: '700',
    fontSize: 14,
  },
  dateText: {
    color: FinTrackedColors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
});
