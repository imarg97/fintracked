import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Surface, Text, ProgressBar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { Goal } from '../../types';
import { formatRupee } from '../../utils/formatters';

interface GoalCardProps {
  goal: Goal;
  isPrivacyMode: boolean;
  onTopUp?: (id: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  isPrivacyMode,
  onTopUp,
}) => {
  const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

  return (
    <Surface style={styles.card} elevation={0}>
      <View style={styles.header}>
        <View style={styles.leftRow}>
          <View style={[styles.iconBg, { backgroundColor: goal.color + '1F' }]}>
            <Ionicons name={goal.icon as any} size={18} color={goal.color} />
          </View>
          <View>
            <Text variant="titleMedium" style={styles.goalTitle}>
              {goal.title}
            </Text>
            <Text style={styles.dateText}>Target: {goal.targetDate}</Text>
          </View>
        </View>

        <Text style={[styles.percentageText, { color: goal.color }]}>
          {percentage}%
        </Text>
      </View>

      <ProgressBar
        progress={percentage / 100}
        color={goal.color}
        style={styles.progressBar}
      />

      <View style={styles.footerRow}>
        <View>
          <Text style={styles.savedLabel}>SAVED SO FAR</Text>
          <Text style={styles.amountValue}>
            {formatRupee(goal.currentAmount, isPrivacyMode)} of{' '}
            {formatRupee(goal.targetAmount, isPrivacyMode)}
          </Text>
        </View>

        {onTopUp && (
          <Pressable
            onPress={() => onTopUp(goal.id)}
            style={({ pressed }) => [styles.topUpBtn, pressed && { opacity: 0.7 }]}
          >
            <Ionicons name="add" size={14} color="#FFFFFF" />
            <Text style={styles.topUpText}>Top Up</Text>
          </Pressable>
        )}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginBottom: 14,
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
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  dateText: {
    color: FinTrackedColors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  percentageText: {
    fontWeight: '800',
    fontSize: 15,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: FinTrackedColors.surfaceVariant,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedLabel: {
    color: FinTrackedColors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  amountValue: {
    color: FinTrackedColors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  topUpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FinTrackedColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  topUpText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 2,
  },
});
