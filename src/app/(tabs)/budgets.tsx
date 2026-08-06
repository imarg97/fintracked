import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, SegmentedButtons, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import FinTrackedColors from '../../constants/Colors';
import { useAppStore } from '../../store/useAppStore';
import { BudgetCard } from '../../components/budgets/BudgetCard';
import { GoalCard } from '../../components/budgets/GoalCard';
import { GoldTrackerCard } from '../../components/investments/GoldTrackerCard';
import { AddGoalModal } from '../../components/budgets/AddGoalModal';
import { AddBudgetModal } from '../../components/budgets/AddBudgetModal';
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
    addGoal,
    deleteGoal,
    addBudget,
    deleteBudget,
    clearAllGoalsAndBudgets,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'BUDGETS' | 'GOALS' | 'ASSETS'>('BUDGETS');
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  const getCategorySpent = (categoryId: string) => {
    return transactions
      .filter((t) => t.categoryId === categoryId && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleTopUpGoal = (goalId: string) => {
    updateGoalAmount(goalId, 10000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Page Title */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.pageTitle}>
          Budgets & Goals
        </Text>
        <Pressable onPress={clearAllGoalsAndBudgets} style={styles.clearHeaderBtn} hitSlop={12}>
          <Text style={styles.clearHeaderBtnText}>Clear All</Text>
        </Pressable>
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
              <Button
                mode="text"
                onPress={() => setIsBudgetModalOpen(true)}
                icon={() => <Ionicons name="add" size={18} color={FinTrackedColors.primary} />}
                labelStyle={styles.addBtnLabel}
              >
                Add Budget
              </Button>
            </View>

            {budgets.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="pie-chart-outline" size={44} color={FinTrackedColors.textMuted} />
                <Text style={styles.emptyText}>No active budget caps. Tap "+ Add Budget" above to set one!</Text>
              </View>
            ) : (
              budgets.map((b) => (
                <View key={b.id} style={styles.cardWrapper}>
                  <BudgetCard
                    budget={b}
                    spentAmount={getCategorySpent(b.categoryId)}
                    isPrivacyMode={isPrivacyMode}
                  />
                  <Pressable
                    onPress={() => deleteBudget(b.id)}
                    style={styles.deleteBadge}
                    hitSlop={8}
                  >
                    <Ionicons name="trash-outline" size={14} color={FinTrackedColors.error} />
                  </Pressable>
                </View>
              ))
            )}
          </View>
        )}

        {activeTab === 'GOALS' && (
          <View>
            <View style={styles.sectionHeaderRow}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Financial Targets
              </Text>
              <Button
                mode="text"
                onPress={() => setIsGoalModalOpen(true)}
                icon={() => <Ionicons name="add" size={18} color={FinTrackedColors.primary} />}
                labelStyle={styles.addBtnLabel}
              >
                Add Goal
              </Button>
            </View>

            {goals.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="flag-outline" size={44} color={FinTrackedColors.textMuted} />
                <Text style={styles.emptyText}>No financial goals set. Tap "+ Add Goal" above to create your first target!</Text>
              </View>
            ) : (
              goals.map((g) => (
                <View key={g.id} style={styles.cardWrapper}>
                  <GoalCard
                    goal={g}
                    isPrivacyMode={isPrivacyMode}
                    onTopUp={handleTopUpGoal}
                  />
                  <Pressable
                    onPress={() => deleteGoal(g.id)}
                    style={styles.deleteBadge}
                    hitSlop={8}
                  >
                    <Ionicons name="trash-outline" size={14} color={FinTrackedColors.error} />
                  </Pressable>
                </View>
              ))
            )}
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
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add Modals */}
      <AddGoalModal
        visible={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onAddGoal={(g) => addGoal(g)}
      />
      <AddBudgetModal
        visible={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onAddBudget={(b) => addBudget(b)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FinTrackedColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  pageTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '800',
  },
  clearHeaderBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearHeaderBtnText: {
    color: FinTrackedColors.error,
    fontSize: 12,
    fontWeight: '700',
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
    marginBottom: 10,
  },
  sectionTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
  },
  addBtnLabel: {
    color: FinTrackedColors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  cardWrapper: {
    position: 'relative',
  },
  deleteBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: FinTrackedColors.error + '1F',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FinTrackedColors.error + '40',
  },
  emptyState: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginVertical: 10,
  },
  emptyText: {
    color: FinTrackedColors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
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
});
