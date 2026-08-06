import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FinTrackedColors from '../../constants/Colors';
import { useAppStore } from '../../store/useAppStore';
import { NetWorthCard } from '../../components/dashboard/NetWorthCard';
import { MetricCard } from '../../components/common/MetricCard';
import { RecentTransactionsCard } from '../../components/dashboard/RecentTransactionsCard';

export default function HomeScreen() {
  const router = useRouter();
  const { isPrivacyMode, togglePrivacyMode, userName, transactions, getSummary } =
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
          <Avatar.Text
            size={42}
            label={userName.substring(0, 2).toUpperCase()}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
        </View>

        {/* Hero Net Worth Card */}
        <NetWorthCard
          netWorth={summary.netWorth}
          isPrivacyMode={isPrivacyMode}
          onTogglePrivacy={togglePrivacyMode}
        />

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
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridSpacer: {
    width: 10,
  },
});
