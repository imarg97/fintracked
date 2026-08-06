import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Pressable } from 'react-native';
import { Text, Avatar, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { useAppStore } from '../../store/useAppStore';
import { NetWorthCard } from '../../components/dashboard/NetWorthCard';
import { MetricCard } from '../../components/common/MetricCard';
import { RecentTransactionsCard } from '../../components/dashboard/RecentTransactionsCard';
import { formatRupee } from '../../utils/formatters';

export default function HomeScreen() {
  const router = useRouter();
  const { isPrivacyMode, togglePrivacyMode, userName, transactions, goals, getSummary } =
    useAppStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const summary = getSummary();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

  const handleSeeAll = () => {
    router.push('/transactions');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={FinTrackedColors.primary}
          />
        }
      >
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.greetingText}>WELCOME BACK</Text>
            <Text variant="headlineSmall" style={styles.userNameText}>
              {userName} 👋
            </Text>
          </View>
          <Pressable onPress={() => router.push('/profile')}>
            <Avatar.Text
              size={42}
              label={userName.substring(0, 2).toUpperCase()}
              style={styles.avatar}
              labelStyle={styles.avatarLabel}
            />
          </Pressable>
        </View>

        {/* Hero Net Worth Card */}
        <NetWorthCard
          netWorth={summary.netWorth}
          isPrivacyMode={isPrivacyMode}
          onTogglePrivacy={togglePrivacyMode}
        />

        {/* Net Worth Asset Breakdown Grid */}
        <Surface style={styles.assetBreakdownCard} elevation={0}>
          <Text style={styles.assetBreakdownTitle}>ASSET & LIABILITY BREAKDOWN</Text>
          <View style={styles.assetGrid}>
            <View style={styles.assetCol}>
              <Text style={styles.assetLabel}>💵 Liquid Cash</Text>
              <Text style={styles.assetVal}>{formatRupee(summary.liquidCash, isPrivacyMode)}</Text>
            </View>
            <View style={styles.assetCol}>
              <Text style={styles.assetLabel}>📈 Investments</Text>
              <Text style={styles.assetVal}>{formatRupee(summary.investmentsValuation, isPrivacyMode)}</Text>
            </View>
            <View style={styles.assetCol}>
              <Text style={styles.assetLabel}>🪙 Gold Holdings</Text>
              <Text style={styles.assetVal}>{formatRupee(summary.goldValuation, isPrivacyMode)}</Text>
            </View>
            <View style={styles.assetCol}>
              <Text style={styles.assetLabel}>💳 Liabilities</Text>
              <Text style={[styles.assetVal, { color: FinTrackedColors.error }]}>
                -{formatRupee(summary.totalLiabilities, isPrivacyMode)}
              </Text>
            </View>
          </View>
        </Surface>

        {/* Monthly Financial Metrics Grid */}
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Income"
            amount={summary.monthlyIncome}
            type="INCOME"
            isPrivacy={isPrivacyMode}
          />
          <View style={styles.gridSpacer} />
          <MetricCard
            label="Expenses"
            amount={summary.monthlyExpenses}
            type="EXPENSE"
            isPrivacy={isPrivacyMode}
          />
          <View style={styles.gridSpacer} />
          <MetricCard
            label="Savings Rate"
            percentage={summary.savingsRate}
            type="SAVINGS"
            isPrivacy={isPrivacyMode}
          />
        </View>

        {/* Excel Import Shortcut Banner */}
        <Pressable onPress={() => router.push('/import-excel')}>
          <Surface style={styles.excelBanner} elevation={0}>
            <Ionicons name="cloud-upload-outline" size={20} color={FinTrackedColors.primary} />
            <Text style={styles.excelBannerText}>Import your past transactions from spending.xlsx</Text>
            <Ionicons name="chevron-forward" size={16} color={FinTrackedColors.textSecondary} />
          </Surface>
        </Pressable>

        {/* Financial Goals Quick Preview */}
        {goals.length > 0 && (
          <Surface style={styles.goalsPreviewCard} elevation={0}>
            <View style={styles.goalsHeader}>
              <Text variant="titleMedium" style={styles.goalsTitle}>
                Target Goals ({goals.length})
              </Text>
              <Pressable onPress={() => router.push('/(tabs)/budgets')}>
                <Text style={styles.manageText}>Manage</Text>
              </Pressable>
            </View>

            {goals.slice(0, 2).map((g) => {
              const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              return (
                <View key={g.id} style={styles.goalRow}>
                  <View style={styles.goalLeft}>
                    <Ionicons name={g.icon as any} size={16} color={g.color} />
                    <Text style={styles.goalName}>{g.title}</Text>
                  </View>
                  <Text style={[styles.goalPct, { color: g.color }]}>{pct}%</Text>
                </View>
              );
            })}
          </Surface>
        )}

        {/* Recent Transactions Section */}
        <RecentTransactionsCard
          transactions={transactions.slice(0, 5)}
          isPrivacyMode={isPrivacyMode}
          onViewAll={handleSeeAll}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: FinTrackedColors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 30,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingText: {
    color: FinTrackedColors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  userNameText: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '800',
    marginTop: 2,
  },
  avatar: {
    backgroundColor: FinTrackedColors.surfaceVariant,
    borderWidth: 1.5,
    borderColor: FinTrackedColors.primary,
  },
  avatarLabel: {
    color: FinTrackedColors.primary,
    fontWeight: '700',
  },
  assetBreakdownCard: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginBottom: 20,
  },
  assetBreakdownTitle: {
    color: FinTrackedColors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  assetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  assetCol: {
    width: '48%',
    backgroundColor: FinTrackedColors.surfaceVariant + '40',
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  assetLabel: {
    color: FinTrackedColors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  assetVal: {
    color: FinTrackedColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridSpacer: {
    width: 10,
  },
  excelBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FinTrackedColors.primary + '1F',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: FinTrackedColors.primary + '40',
    marginBottom: 20,
  },
  excelBannerText: {
    color: FinTrackedColors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  goalsPreviewCard: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginBottom: 20,
  },
  goalsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalsTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
  },
  manageText: {
    color: FinTrackedColors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  goalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalName: {
    color: FinTrackedColors.textPrimary,
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '500',
  },
  goalPct: {
    fontWeight: '700',
    fontSize: 12,
  },
});
