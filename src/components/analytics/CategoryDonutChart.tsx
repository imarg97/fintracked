import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import Svg, { Circle, G } from 'react-native-svg';
import FinTrackedColors from '../../constants/Colors';
import { formatRupee } from '../../utils/formatters';

interface CategoryBreakdownItem {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

interface CategoryDonutChartProps {
  items: CategoryBreakdownItem[];
  totalExpense: number;
  isPrivacyMode: boolean;
}

const DEFAULT_ITEMS: CategoryBreakdownItem[] = [
  { category: 'Tech & Gadgets', amount: 28900, color: '#3B82F6', percentage: 46 },
  { category: 'Food & Dining', amount: 15000, color: '#F97316', percentage: 24 },
  { category: 'Rent & Housing', amount: 12000, color: '#8B5CF6', percentage: 19 },
  { category: 'Fuel & Transport', amount: 6500, color: '#EF4444', percentage: 11 },
];

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({
  items = DEFAULT_ITEMS,
  totalExpense = 62400,
  isPrivacyMode,
}) => {
  const radius = 50;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  let accumulatedOffset = 0;

  return (
    <Surface style={styles.card} elevation={0}>
      <Text variant="titleMedium" style={styles.title}>
        Expense Distribution
      </Text>
      <Text style={styles.subText}>Monthly spending grouped by categories</Text>

      <View style={styles.chartWrapper}>
        {/* Donut Graphic */}
        <View style={styles.donutContainer}>
          <Svg width={140} height={140} viewBox="0 0 140 140">
            <G rotation="-90" origin="70, 70">
              {items.map((item, index) => {
                const strokeDashoffset = circumference - (item.percentage / 100) * circumference;
                const rotationAngle = (accumulatedOffset / 100) * 360;
                accumulatedOffset += item.percentage;

                return (
                  <Circle
                    key={item.category}
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke={item.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    transform={`rotate(${rotationAngle}, 70, 70)`}
                  />
                );
              })}
            </G>
          </Svg>

          <View style={styles.centerTextOverlay}>
            <Text style={styles.centerLabel}>TOTAL</Text>
            <Text style={styles.centerAmount}>{formatRupee(totalExpense, isPrivacyMode)}</Text>
          </View>
        </View>

        {/* Legend Column */}
        <View style={styles.legendCol}>
          {items.map((item) => (
            <View key={item.category} style={styles.legendRow}>
              <View style={[styles.badgeDot, { backgroundColor: item.color }]} />
              <View style={styles.legendMeta}>
                <Text style={styles.catName} numberOfLines={1}>
                  {item.category}
                </Text>
                <Text style={styles.catVal}>
                  {formatRupee(item.amount, isPrivacyMode)} ({item.percentage}%)
                </Text>
              </View>
            </View>
          ))}
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
    marginBottom: 20,
  },
  title: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
  },
  subText: {
    color: FinTrackedColors.textSecondary,
    fontSize: 11,
    marginTop: 2,
    marginBottom: 16,
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donutContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  centerTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  centerLabel: {
    color: FinTrackedColors.textMuted,
    fontSize: 9,
    fontWeight: '700',
  },
  centerAmount: {
    color: FinTrackedColors.textPrimary,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
  legendCol: {
    flex: 1,
    marginLeft: 16,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendMeta: {
    flex: 1,
  },
  catName: {
    color: FinTrackedColors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  catVal: {
    color: FinTrackedColors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
});
