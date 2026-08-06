import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { GoldHolding } from '../../types';
import { formatRupee } from '../../utils/formatters';

interface GoldTrackerCardProps {
  gold: GoldHolding;
  isPrivacyMode: boolean;
}

export const GoldTrackerCard: React.FC<GoldTrackerCardProps> = ({
  gold,
  isPrivacyMode,
}) => {
  const totalValuation = gold.grams * gold.ratePerGram;

  return (
    <Surface style={styles.card} elevation={0}>
      <View style={styles.header}>
        <View style={styles.leftRow}>
          <View style={styles.goldBadgeIcon}>
            <Ionicons name="ribbon-outline" size={20} color={FinTrackedColors.gold} />
          </View>
          <View>
            <Text variant="titleMedium" style={styles.title}>
              Gold Holdings
            </Text>
            <Text style={styles.subText}>24K Physical & Digital Gold</Text>
          </View>
        </View>
        <View style={styles.gramBadge}>
          <Text style={styles.gramText}>{gold.grams}g</Text>
        </View>
      </View>

      <Text variant="headlineMedium" style={styles.totalValue}>
        {formatRupee(totalValuation, isPrivacyMode)}
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.rateLabel}>
          Live Rate: <Text style={styles.rateValue}>{formatRupee(gold.ratePerGram)}/g</Text>
        </Text>
        <Text style={styles.updatedText}>Updated {gold.lastUpdated}</Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: FinTrackedColors.gold + '40',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goldBadgeIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: FinTrackedColors.gold + '1F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  title: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  subText: {
    color: FinTrackedColors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  gramBadge: {
    backgroundColor: FinTrackedColors.gold + '26',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gramText: {
    color: FinTrackedColors.gold,
    fontWeight: '800',
    fontSize: 13,
  },
  totalValue: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '800',
    marginVertical: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: FinTrackedColors.surfaceBorder + '80',
  },
  rateLabel: {
    color: FinTrackedColors.textSecondary,
    fontSize: 11,
  },
  rateValue: {
    color: FinTrackedColors.gold,
    fontWeight: '700',
  },
  updatedText: {
    color: FinTrackedColors.textMuted,
    fontSize: 11,
  },
});
