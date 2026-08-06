import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { formatRupee } from '../../utils/formatters';

interface NetWorthCardProps {
  netWorth: number;
  isPrivacyMode: boolean;
  onTogglePrivacy: () => void;
}

export const NetWorthCard: React.FC<NetWorthCardProps> = ({
  netWorth,
  isPrivacyMode,
  onTogglePrivacy,
}) => {
  return (
    <Surface style={styles.card} elevation={2}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark" size={14} color={FinTrackedColors.primary} />
          <Text style={styles.badgeText}>TOTAL NET WORTH</Text>
        </View>

        <Pressable
          onPress={onTogglePrivacy}
          style={({ pressed }) => [styles.eyeBtn, pressed && { opacity: 0.6 }]}
          hitSlop={12}
        >
          <Ionicons
            name={isPrivacyMode ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={FinTrackedColors.textSecondary}
          />
        </Pressable>
      </View>

      <Text variant="displaySmall" style={styles.amountText}>
        {formatRupee(netWorth, isPrivacyMode)}
      </Text>

      <View style={styles.bottomRow}>
        <View style={styles.trendContainer}>
          <Ionicons name="trending-up" size={16} color={FinTrackedColors.primary} />
          <Text style={styles.trendText}>+12.4% this month</Text>
        </View>
        <Text style={styles.lastUpdatedText}>Updated today</Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FinTrackedColors.primary + '1F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: FinTrackedColors.primary,
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  eyeBtn: {
    padding: 4,
  },
  amountText: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginVertical: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: FinTrackedColors.surfaceBorder + '80',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    color: FinTrackedColors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  lastUpdatedText: {
    color: FinTrackedColors.textMuted,
    fontSize: 11,
  },
});
