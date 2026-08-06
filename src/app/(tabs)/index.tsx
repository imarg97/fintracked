import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import FinTrackedColors from '../../constants/Colors';
import { useAppStore } from '../../store/useAppStore';
import { NetWorthCard } from '../../components/dashboard/NetWorthCard';
import { MetricCard } from '../../components/common/MetricCard';
import { RecentTransactionsCard } from '../../components/dashboard/RecentTransactionsCard';
import { Transaction } from '../../types';
import { calculateSavingsRate } from '../../utils/formatters';

// Mock data for initial milestone preview
const MOCK_SUMMARY = {
  netWorth: 1845200,
  monthlyIncome: 155000,
  monthlyExpenses: 62400,
};

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Salary Credit',
    category: 'Income',
    amount: 155000,
    type: 'INCOME',
    date: 'Today, 09:30 AM',
    accountName: 'HDFC Bank ****4120',
    iconName: 'cash',
  },
  {
    id: 'tx-2',
    title: 'Apple Store Online',
    category: 'Gadgets & Tech',
    amount: 28900,
    type: 'EXPENSE',
    date: 'Yesterday',
    accountName: 'ICICI Credit Card',
    iconName: 'laptop-outline',
  },
  {
    id: 'tx-3',
    title: 'Fuel - HP Petrol Pump',
    category: 'Transport',
    amount: 3500,
    type: 'EXPENSE',
    date: '04 Aug 2026',
    accountName: 'SBI Debit Card',
    iconName: 'car-outline',
  },
];

export default function HomeScreen() {
  const { isPrivacyMode, togglePrivacyMode, userName } = useAppStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const savingsRate = calculateSavingsRate(
    MOCK_SUMMARY.monthlyIncome,
    MOCK_SUMMARY.monthlyExpenses
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  }, []);

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
          <Avatar.Text
            size={42}
            label={userName.substring(0, 2).toUpperCase()}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
        </View>

        {/* Hero Net Worth Card */}
        <NetWorthCard
          netWorth={MOCK_SUMMARY.netWorth}
          isPrivacyMode={isPrivacyMode}
          onTogglePrivacy={togglePrivacyMode}
        />

        {/* Monthly Financial Metrics Grid */}
        <View style={styles.metricsGrid}>
          <MetricCard
            label="Income"
            amount={MOCK_SUMMARY.monthlyIncome}
            type="INCOME"
            isPrivacy={isPrivacyMode}
          />
          <View style={styles.gridSpacer} />
          <MetricCard
            label="Expenses"
            amount={MOCK_SUMMARY.monthlyExpenses}
            type="EXPENSE"
            isPrivacy={isPrivacyMode}
          />
          <View style={styles.gridSpacer} />
          <MetricCard
            label="Savings Rate"
            percentage={savingsRate}
            type="SAVINGS"
            isPrivacy={isPrivacyMode}
          />
        </View>

        {/* Recent Transactions Section */}
        <RecentTransactionsCard
          transactions={MOCK_TRANSACTIONS}
          isPrivacyMode={isPrivacyMode}
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
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridSpacer: {
    width: 10,
  },
});
