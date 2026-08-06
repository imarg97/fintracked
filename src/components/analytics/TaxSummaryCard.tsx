import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { formatRupee } from '../../utils/formatters';

interface TaxSummaryCardProps {
  annualIncome?: number;
  isPrivacyMode: boolean;
}

export const TaxSummaryCard: React.FC<TaxSummaryCardProps> = ({
  annualIncome = 1860000, // ₹18.6L gross annual salary
  isPrivacyMode,
}) => {
  const standardDeduction = 75000;
  const sec80C = 150000; // ELSS, EPF, LIC cap
  const sec80D = 25000; // Medical insurance cap

  const taxableIncomeNewRegime = Math.max(0, annualIncome - standardDeduction);
  const taxableIncomeOldRegime = Math.max(0, annualIncome - standardDeduction - sec80C - sec80D);

  return (
    <Surface style={styles.card} elevation={0}>
      <View style={styles.header}>
        <View style={styles.iconBg}>
          <Ionicons name="calculator-outline" size={20} color={FinTrackedColors.gold} />
        </View>
        <View>
          <Text variant="titleMedium" style={styles.title}>
            Tax Estimator (FY 2026-27)
          </Text>
          <Text style={styles.subText}>Indian Income Tax Old vs New Regime</Text>
        </View>
      </View>

      <View style={styles.deductionRow}>
        <Text style={styles.deductLabel}>Gross Annual Salary</Text>
        <Text style={styles.deductVal}>{formatRupee(annualIncome, isPrivacyMode)}</Text>
      </View>

      <View style={styles.deductionRow}>
        <Text style={styles.deductLabel}>Standard Deduction</Text>
        <Text style={styles.deductVal}>-{formatRupee(standardDeduction)}</Text>
      </View>

      <View style={styles.deductionRow}>
        <Text style={styles.deductLabel}>Section 80C (ELSS/EPF/LIC)</Text>
        <Text style={styles.deductVal}>-{formatRupee(sec80C)}</Text>
      </View>

      <View style={styles.deductionRow}>
        <Text style={styles.deductLabel}>Section 80D (Health Ins.)</Text>
        <Text style={styles.deductVal}>-{formatRupee(sec80D)}</Text>
      </View>

      <View style={styles.regimeComparisonRow}>
        <View style={styles.regimeBox}>
          <Text style={styles.regimeTitle}>NEW REGIME</Text>
          <Text style={styles.regimeTaxable}>
            Taxable: {formatRupee(taxableIncomeNewRegime, isPrivacyMode)}
          </Text>
        </View>

        <View style={[styles.regimeBox, styles.regimeBoxActive]}>
          <Text style={[styles.regimeTitle, { color: FinTrackedColors.primary }]}>OLD REGIME</Text>
          <Text style={[styles.regimeTaxable, { color: FinTrackedColors.textPrimary }]}>
            Taxable: {formatRupee(taxableIncomeOldRegime, isPrivacyMode)}
          </Text>
        </View>
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
    borderColor: FinTrackedColors.surfaceBorder,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBg: {
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
  deductionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: FinTrackedColors.surfaceBorder + '50',
  },
  deductLabel: {
    color: FinTrackedColors.textSecondary,
    fontSize: 12,
  },
  deductVal: {
    color: FinTrackedColors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  regimeComparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  regimeBox: {
    flex: 1,
    backgroundColor: FinTrackedColors.surfaceVariant + '40',
    padding: 12,
    borderRadius: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
  },
  regimeBoxActive: {
    borderColor: FinTrackedColors.primary,
    backgroundColor: FinTrackedColors.primary + '1F',
    marginRight: 0,
  },
  regimeTitle: {
    color: FinTrackedColors.textMuted,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  regimeTaxable: {
    color: FinTrackedColors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
});
