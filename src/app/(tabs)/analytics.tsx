import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { useAppStore } from '../../store/useAppStore';
import { CashflowTrendChart } from '../../components/analytics/CashflowTrendChart';
import { CategoryDonutChart } from '../../components/analytics/CategoryDonutChart';
import { TaxSummaryCard } from '../../components/analytics/TaxSummaryCard';
import { exportTransactionsToExcel, generatePDFReport } from '../../services/exportService';

export default function AnalyticsScreen() {
  const { userName, transactions, isPrivacyMode, getSummary } = useAppStore();

  const summary = getSummary();

  const handleExportExcel = async () => {
    await exportTransactionsToExcel(transactions);
  };

  const handleExportPDF = async () => {
    await generatePDFReport(userName, summary, transactions);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.pageTitle}>
          Analytics & Reports
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Export Shortcut Banner */}
        <View style={styles.exportBar}>
          <Button
            mode="contained"
            onPress={handleExportPDF}
            icon={() => <Ionicons name="document-text-outline" size={18} color="#FFFFFF" />}
            style={styles.pdfBtn}
            contentStyle={styles.btnContent}
            labelStyle={styles.btnLabel}
          >
            Export PDF Report
          </Button>

          <Button
            mode="outlined"
            onPress={handleExportExcel}
            icon={() => <Ionicons name="download-outline" size={18} color={FinTrackedColors.primary} />}
            style={styles.excelBtn}
            contentStyle={styles.btnContent}
            labelStyle={styles.excelBtnLabel}
          >
            Export Excel
          </Button>
        </View>

        {/* 1. Cashflow Trend Chart */}
        <CashflowTrendChart isPrivacyMode={isPrivacyMode} />

        {/* 2. Category Donut Distribution */}
        <CategoryDonutChart
          totalExpense={summary.monthlyExpenses}
          isPrivacyMode={isPrivacyMode}
          items={[
            { category: 'Tech & Gadgets', amount: 28900, color: '#3B82F6', percentage: 46 },
            { category: 'Food & Dining', amount: 15000, color: '#F97316', percentage: 24 },
            { category: 'Rent & Housing', amount: 12000, color: '#8B5CF6', percentage: 19 },
            { category: 'Fuel & Transport', amount: 6500, color: '#EF4444', percentage: 11 },
          ]}
        />

        {/* 3. Tax Summary Card */}
        <TaxSummaryCard isPrivacyMode={isPrivacyMode} />
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  exportBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  pdfBtn: {
    flex: 1,
    backgroundColor: FinTrackedColors.primary,
    borderRadius: 14,
    marginRight: 8,
  },
  excelBtn: {
    flex: 1,
    borderColor: FinTrackedColors.primary,
    borderRadius: 14,
    borderWidth: 1,
  },
  btnContent: {
    height: 44,
  },
  btnLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  excelBtnLabel: {
    color: FinTrackedColors.primary,
    fontWeight: '700',
    fontSize: 12,
  },
});
