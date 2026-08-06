import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import FinTrackedColors from '../../constants/Colors';
import { formatRupee } from '../../utils/formatters';

interface CashflowDataPoint {
  month: string;
  income: number;
  expenses: number;
}

interface CashflowTrendChartProps {
  data?: CashflowDataPoint[];
  isPrivacyMode: boolean;
}

const DEFAULT_TREND_DATA: CashflowDataPoint[] = [
  { month: 'Apr', income: 145000, expenses: 58000 },
  { month: 'May', income: 150000, expenses: 64000 },
  { month: 'Jun', income: 150000, expenses: 61000 },
  { month: 'Jul', income: 155000, expenses: 59000 },
  { month: 'Aug', income: 155000, expenses: 62400 },
];

export const CashflowTrendChart: React.FC<CashflowTrendChartProps> = ({
  data = DEFAULT_TREND_DATA,
  isPrivacyMode,
}) => {
  const chartHeight = 150;
  const maxVal = Math.max(...data.map((d) => Math.max(d.income, d.expenses)), 180000);

  return (
    <Surface style={styles.card} elevation={0}>
      <View style={styles.header}>
        <View>
          <Text variant="titleMedium" style={styles.title}>
            Cashflow Trends
          </Text>
          <Text style={styles.subText}>Income vs Expense comparison (Last 5 Months)</Text>
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: FinTrackedColors.primary }]} />
            <Text style={styles.legendText}>Income</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: FinTrackedColors.error }]} />
            <Text style={styles.legendText}>Expense</Text>
          </View>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Svg height={chartHeight + 30} width="100%">
          {/* Baseline */}
          <Line x1="0" y1={chartHeight} x2="100%" y2={chartHeight} stroke={FinTrackedColors.surfaceBorder} strokeWidth="1" />

          {data.map((item, index) => {
            const barGroupWidth = 56;
            const barWidth = 14;
            const spacing = 16;
            const xOffset = index * (barGroupWidth + spacing) + 16;

            const incomeHeight = (item.income / maxVal) * chartHeight;
            const expenseHeight = (item.expenses / maxVal) * chartHeight;

            return (
              <React.Fragment key={item.month}>
                {/* Income Bar */}
                <Rect
                  x={xOffset}
                  y={chartHeight - incomeHeight}
                  width={barWidth}
                  height={incomeHeight}
                  fill={FinTrackedColors.primary}
                  rx={4}
                />
                {/* Expense Bar */}
                <Rect
                  x={xOffset + barWidth + 4}
                  y={chartHeight - expenseHeight}
                  width={barWidth}
                  height={expenseHeight}
                  fill={FinTrackedColors.error}
                  rx={4}
                />
                {/* Month Label */}
                <SvgText
                  x={xOffset + barWidth}
                  y={chartHeight + 20}
                  fill={FinTrackedColors.textSecondary}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {item.month}
                </SvgText>
              </React.Fragment>
            );
          })}
        </Svg>
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
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
  },
  subText: {
    color: FinTrackedColors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    color: FinTrackedColors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 6,
  },
});
