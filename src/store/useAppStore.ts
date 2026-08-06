import { create } from 'zustand';
import {
  Transaction,
  Account,
  Category,
  TransactionType,
  Budget,
  Goal,
  GoldHolding,
  InvestmentPortfolio,
} from '../types';
import {
  DEFAULT_ACCOUNTS,
  DEFAULT_CATEGORIES,
  INITIAL_TRANSACTIONS,
  DEFAULT_BUDGETS,
  DEFAULT_GOALS,
  DEFAULT_GOLD_HOLDING,
  DEFAULT_INVESTMENT_PORTFOLIO,
} from '../utils/seedData';
import { calculateSavingsRate } from '../utils/formatters';

interface NewTransactionInput {
  title: string;
  amount: number;
  type: TransactionType;
  categoryId: string;
  category: string;
  accountId: string;
  accountName: string;
  iconName: string;
  notes?: string;
  date?: string;
}

interface AppState {
  // User Profile & Privacy
  userName: string;
  isPrivacyMode: boolean;
  setUserName: (name: string) => void;
  togglePrivacyMode: () => void;

  // Collections
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  goldHolding: GoldHolding;
  investmentPortfolio: InvestmentPortfolio;

  // Actions
  addTransaction: (input: NewTransactionInput) => void;
  importExcelTransactions: (importedTxs: Transaction[]) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Category) => void;
  updateGoalAmount: (goalId: string, deltaAmount: number) => void;
  updateGoldHolding: (grams: number, ratePerGram: number) => void;

  // Computed Summaries
  getSummary: () => {
    netWorth: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
    monthlySavings: number;
    liquidCash: number;
    investmentsValuation: number;
    goldValuation: number;
    totalLiabilities: number;
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  userName: 'Anu',
  isPrivacyMode: false,
  setUserName: (name: string) => set({ userName: name }),
  togglePrivacyMode: () => set((state) => ({ isPrivacyMode: !state.isPrivacyMode })),

  accounts: DEFAULT_ACCOUNTS,
  categories: DEFAULT_CATEGORIES,
  transactions: INITIAL_TRANSACTIONS,
  budgets: DEFAULT_BUDGETS,
  goals: DEFAULT_GOALS,
  goldHolding: DEFAULT_GOLD_HOLDING,
  investmentPortfolio: DEFAULT_INVESTMENT_PORTFOLIO,

  addTransaction: (input: NewTransactionInput) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      title: input.title,
      amount: input.amount,
      type: input.type,
      category: input.category,
      categoryId: input.categoryId,
      accountId: input.accountId,
      accountName: input.accountName,
      iconName: input.iconName,
      notes: input.notes,
      date: input.date || 'Just now',
    };

    set((state) => {
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.id === input.accountId) {
          const balanceChange = input.type === 'INCOME' ? input.amount : -input.amount;
          return { ...acc, balance: acc.balance + balanceChange };
        }
        return acc;
      });

      return {
        transactions: [newTx, ...state.transactions],
        accounts: updatedAccounts,
      };
    });
  },

  importExcelTransactions: (importedTxs: Transaction[]) => {
    set((state) => {
      // Create any missing category or account on the fly
      const existingCatNames = new Set(state.categories.map((c) => c.name.toLowerCase()));
      const newCategories = [...state.categories];

      importedTxs.forEach((tx) => {
        if (!existingCatNames.has(tx.category.toLowerCase())) {
          existingCatNames.add(tx.category.toLowerCase());
          newCategories.push({
            id: tx.categoryId,
            name: tx.category,
            type: tx.type,
            icon: tx.iconName,
            color: '#6366F1',
          });
        }
      });

      return {
        transactions: [...importedTxs, ...state.transactions],
        categories: newCategories,
      };
    });
  },

  deleteTransaction: (id: string) => {
    set((state) => {
      const targetTx = state.transactions.find((t) => t.id === id);
      if (!targetTx) return state;

      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.id === targetTx.accountId) {
          const balanceRevert = targetTx.type === 'INCOME' ? -targetTx.amount : targetTx.amount;
          return { ...acc, balance: acc.balance + balanceRevert };
        }
        return acc;
      });

      return {
        transactions: state.transactions.filter((t) => t.id !== id),
        accounts: updatedAccounts,
      };
    });
  },

  addCategory: (category: Category) => {
    set((state) => ({ categories: [...state.categories, category] }));
  },

  updateGoalAmount: (goalId: string, deltaAmount: number) => {
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === goalId
          ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + deltaAmount) }
          : g
      ),
    }));
  },

  updateGoldHolding: (grams: number, ratePerGram: number) => {
    set({
      goldHolding: {
        grams,
        ratePerGram,
        lastUpdated: 'Just now',
      },
    });
  },

  getSummary: () => {
    const { accounts, transactions, goldHolding, investmentPortfolio } = get();

    // Liquid Cash = Sum of BANK & CASH accounts where balance > 0
    const liquidCash = accounts
      .filter((a) => a.type === 'BANK' || a.type === 'CASH')
      .reduce((sum, a) => sum + Math.max(0, a.balance), 0);

    // Total Liabilities = Sum of CREDIT_CARD and negative balances
    const totalLiabilities = accounts.reduce((sum, a) => {
      if (a.type === 'CREDIT_CARD' || a.balance < 0) {
        return sum + Math.abs(a.balance);
      }
      return sum;
    }, 0);

    const goldValuation = goldHolding.grams * goldHolding.ratePerGram;
    const investmentsValuation = investmentPortfolio.currentValue;

    // Total Net Worth = Cash + Investments + Gold - Liabilities
    const netWorth = liquidCash + investmentsValuation + goldValuation - totalLiabilities;

    const monthlyIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((acc, t) => acc + t.amount, 0);

    const monthlyExpenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((acc, t) => acc + t.amount, 0);

    const monthlySavings = Math.max(0, monthlyIncome - monthlyExpenses);
    const savingsRate = calculateSavingsRate(monthlyIncome, monthlyExpenses);

    return {
      netWorth,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      monthlySavings,
      liquidCash,
      investmentsValuation,
      goldValuation,
      totalLiabilities,
    };
  },
}));
