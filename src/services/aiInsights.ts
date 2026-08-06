import { Transaction, Budget, Goal } from '../types';
import { formatRupee } from '../utils/formatters';

export interface FinancialInsight {
  id: string;
  type: 'WARNING' | 'TIP' | 'SUCCESS';
  title: string;
  description: string;
  actionText?: string;
}

/**
 * AI Financial Insights Engine.
 * Analyzes cashflow, budgets, and savings rate to generate smart insight cards.
 */
export const generateFinancialInsights = (
  summary: {
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
    netWorth: number;
  },
  transactions: Transaction[],
  budgets: Budget[],
  goals: Goal[]
): FinancialInsight[] => {
  const insights: FinancialInsight[] = [];

  // 1. High Savings Rate Insight
  if (summary.savingsRate >= 50) {
    insights.push({
      id: 'ins-savings-high',
      type: 'SUCCESS',
      title: 'Outstanding 60% Savings Rate!',
      description: `You saved ${formatRupee(summary.monthlyIncome - summary.monthlyExpenses)} this month. Consider putting 50% of this surplus into your Emergency Fund.`,
      actionText: 'Top Up Emergency Fund',
    });
  }

  // 2. Category Budget Warnings
  budgets.forEach((b) => {
    const spent = transactions
      .filter((t) => t.categoryId === b.categoryId && t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const pct = Math.round((spent / b.monthlyLimit) * 100);
    if (pct >= 80) {
      insights.push({
        id: `ins-bgt-warn-${b.id}`,
        type: 'WARNING',
        title: `${b.categoryName} Budget Alert (${pct}%)`,
        description: `You have spent ${formatRupee(spent)} out of your ${formatRupee(b.monthlyLimit)} monthly cap. Only ${formatRupee(b.monthlyLimit - spent)} remaining.`,
        actionText: 'Review Budget',
      });
    }
  });

  // 3. Goal Progress Recommendation
  const topGoal = goals[0];
  if (topGoal) {
    const pct = Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100);
    insights.push({
      id: 'ins-goal-milestone',
      type: 'TIP',
      title: `${topGoal.title} is at ${pct}%`,
      description: `You need ${formatRupee(topGoal.targetAmount - topGoal.currentAmount)} more to reach your target by ${topGoal.targetDate}.`,
      actionText: 'View Goals',
    });
  }

  return insights;
};
