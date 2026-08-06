import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import FinTrackedColors from '../../constants/Colors';
import { useAppStore } from '../../store/useAppStore';
import { BudgetCard } from '../../components/budgets/BudgetCard';
import { GoalCard } from '../../components/budgets/GoalCard';
import { GoldTrackerCard } from '../../components/investments/GoldTrackerCard';
import { formatRupee } from '../../utils/formatters';
import { Ionicons } from '@expo/vector-icons';

export default function BudgetsScreen() {
  const {
    budgets,
    goals,
    goldHolding,
    investmentPortfolio,
    transactions,
    isPrivacyMode,
    updateGoalAmount,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'BUDGETS' | 'GOALS' | 'ASSETS'>('BUDGETS');

  // Compute monthly spent per category
  const getCategorySpent = (categoryId: string) => {
    return transactions
      .filter((t) => t.categoryId === categoryId && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleTopUpGoal = (goalId: string) => {
    // Add ₹10,000 top up to goal
    updateGoalAmount(goalId, 10000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Page Title */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.pageTitle}>
          Budgets & Assets
        </Text>
      </View>

      {/* Segment Switcher */}
      <View style={styles.segmentWrapper}>
        <SegmentedButtons
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as any)}
          buttons={[
            { value: 'BUDGETS', label: 'Budgets' },
            { value: 'GOALS', label: 'Goals' },
            { value: 'ASSETS', label: 'Investments' },
          ]}
          theme={{ colors: { secondaryContainer: FinTrackedColors.primary + '26' } }}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'BUDGETS' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Category Spending Caps
              </Text>
              <Text style={styles.sectionBadge}>{budgets.length} Active</Text>
            </View>

            {budgets.map((b) => (
              <BudgetCard
                key={b.id}
                budget={b}
                spentAmount={getCategorySpent(b.categoryId)}
                isPrivacyMode={isPrivacyMode}
              />
            ))}
          </View>
        )}

        {activeTab === 'GOALS' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Financial Targets
              </Text>
              <Text style={styles.sectionBadge}>{goals.length} Goals</Text>
            </View>

            {goals.map((g) => (
              <GoalCard
                key={g.id}
                goal={g}
                isPrivacyMode={isPrivacyMode}
                onTopUp={handleTopUpGoal}
              />
            ))}
          </View>
        )}

        {activeTab === 'ASSETS' && (
          <View>
            {/* Gold Asset Tracker */}
            <GoldTrackerCard gold={goldHolding} isPrivacyMode={isPrivacyMode} />

            {/* Mutual Funds & Stocks Card */}
            <View style={styles.investCard}>
              <View style={styles.investHeader}>
                <View style={styles.investIconBg}>
                  <Ionicons name="trending-up" size={20} color={FinTrackedColors.primary} />
                </View>
                <View>
                  <Text variant="titleMedium" style={styles.investTitle}>
                    Mutual Funds & Equity
                  </Text>
                  <Text style={styles.investSub}>Zerodha Portfolio</Text>
                </View>
              </View>

              <Text variant="headlineMedium" style={styles.investValue}>
                {formatRupee(investmentPortfolio.currentValue, isPrivacyMode)}
              </Text>

              <View style={styles.roiRow}>
                <Ionicons name="caret-up" size={16} color={FinTrackedColors.primary} />
                <Text style={styles.roiText}>
                  +₹{investmentPortfolio.currentValue - investmentPortfolio.investedAmount} (+24.4% ROI)
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FinTrackedColors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  pageTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '800',
  },
  segmentWrapper: {
    paddingHorizontal: 20,
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
  },
  sectionBadge: {
    color: FinTrackedColors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  investCard: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginBottom: 16,
  },
  investHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  investIconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: FinTrackedColors.primary + '1F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  investTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  investSub: {
    color: FinTrackedColors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  investValue: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '800',
    marginVertical: 4,
  },
  roiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  roiText: {
    color: FinTrackedColors.primary,
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 4,
  },
});
