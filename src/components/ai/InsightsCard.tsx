import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { FinancialInsight } from '../../services/aiInsights';

interface InsightsCardProps {
  insight: FinancialInsight;
  onPressAction?: () => void;
}

export const InsightsCard: React.FC<InsightsCardProps> = ({
  insight,
  onPressAction,
}) => {
  const getBadgeStyle = () => {
    switch (insight.type) {
      case 'WARNING':
        return {
          icon: 'warning-outline' as const,
          color: FinTrackedColors.error,
          bg: FinTrackedColors.error + '1F',
        };
      case 'SUCCESS':
        return {
          icon: 'sparkles' as const,
          color: FinTrackedColors.primary,
          bg: FinTrackedColors.primary + '1F',
        };
      case 'TIP':
      default:
        return {
          icon: 'bulb-outline' as const,
          color: FinTrackedColors.secondary,
          bg: FinTrackedColors.secondary + '1F',
        };
    }
  };

  const badge = getBadgeStyle();

  return (
    <Surface style={styles.card} elevation={0}>
      <View style={styles.headerRow}>
        <View style={[styles.iconBg, { backgroundColor: badge.bg }]}>
          <Ionicons name={badge.icon} size={18} color={badge.color} />
        </View>
        <Text style={[styles.insightTitle, { color: badge.color }]}>{insight.title}</Text>
      </View>

      <Text style={styles.description}>{insight.description}</Text>

      {insight.actionText && (
        <Pressable onPress={onPressAction} style={styles.actionBtn} hitSlop={8}>
          <Text style={[styles.actionText, { color: badge.color }]}>{insight.actionText}</Text>
          <Ionicons name="chevron-forward" size={14} color={badge.color} />
        </Pressable>
      )}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBg: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  insightTitle: {
    fontWeight: '700',
    fontSize: 13,
    flex: 1,
  },
  description: {
    color: FinTrackedColors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: FinTrackedColors.surfaceBorder + '60',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
});
