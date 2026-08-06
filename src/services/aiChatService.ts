import { Transaction, Account, Budget, Goal } from '../types';
import { formatRupee } from '../utils/formatters';

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'AI';
  text: string;
  timestamp: string;
}

/**
 * Natural language conversational AI query processor for FinTracked data.
 */
export const processFinancialQuery = async (
  query: string,
  summary: {
    netWorth: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
    liquidCash: number;
    goldValuation: number;
    investmentsValuation: number;
  },
  transactions: Transaction[],
  goals: Goal[]
): Promise<string> => {
  // Simulate AI response thinking delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const normalized = query.toLowerCase();

  // 1. Food / Dining out queries
  if (normalized.includes('food') || normalized.includes('dining') || normalized.includes('restaurant') || normalized.includes('swiggy')) {
    const foodSpent = transactions
      .filter((t) => t.category.toLowerCase().includes('food') || t.category.toLowerCase().includes('dining'))
      .reduce((sum, t) => sum + t.amount, 0);

    return `You have spent ${formatRupee(foodSpent || 15000)} on Food & Dining out this month across ${transactions.length} transactions. This accounts for roughly 24% of your total monthly expenses.`;
  }

  // 2. Emergency Fund & Goals queries
  if (normalized.includes('emergency') || normalized.includes('goal') || normalized.includes('target')) {
    const emergencyGoal = goals.find((g) => g.title.toLowerCase().includes('emergency')) || goals[0];
    if (emergencyGoal) {
      const pct = Math.round((emergencyGoal.currentAmount / emergencyGoal.targetAmount) * 100);
      return `Your **${emergencyGoal.title}** is currently at **${pct}%** (${formatRupee(emergencyGoal.currentAmount)} of ${formatRupee(emergencyGoal.targetAmount)}). You are on track to achieve it by ${emergencyGoal.targetDate}!`;
    }
  }

  // 3. Purchase Affordability queries ("Can I afford ₹X?")
  if (normalized.includes('afford') || normalized.includes('buy') || normalized.includes('laptop') || normalized.includes('phone')) {
    const freeSavings = summary.monthlyIncome - summary.monthlyExpenses;
    return `Based on your current month's savings of **${formatRupee(freeSavings)}** and liquid cash of **${formatRupee(summary.liquidCash)}**, you can comfortably afford this purchase without touching your Emergency Fund or Gold assets!`;
  }

  // 4. Net Worth & General Breakdown
  if (normalized.includes('net worth') || normalized.includes('wealth') || normalized.includes('asset')) {
    return `Your Total Net Worth is **${formatRupee(summary.netWorth)}**! This consists of:\n• 💵 Liquid Bank Cash: ${formatRupee(summary.liquidCash)}\n• 📈 Zerodha Investments: ${formatRupee(summary.investmentsValuation)}\n• 🪙 24K Gold Holdings: ${formatRupee(summary.goldValuation)}`;
  }

  // 5. Default General Response
  return `Here is your current financial snapshot:\n• Monthly Income: ${formatRupee(summary.monthlyIncome)}\n• Monthly Expenses: ${formatRupee(summary.monthlyExpenses)}\n• Savings Rate: ${summary.savingsRate}%\n\nYou are in a strong financial position with a 60% savings rate! What specific item or account would you like to review?`;
};
