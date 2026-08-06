import { create } from 'zustand';
import { Transaction, Account, Category, TransactionType } from '../types';
import { DEFAULT_ACCOUNTS, DEFAULT_CATEGORIES, INITIAL_TRANSACTIONS } from '../utils/seedData';
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

  // Financial Domain Collections
  accounts: Account[];
  categories: Category[];
  transactions: Transaction[];

  // Actions
  addTransaction: (input: NewTransactionInput) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Category) => void;

  // Computed Summaries
  getSummary: () => {
    netWorth: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
    monthlySavings: number;
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
      // Update account balance
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

  deleteTransaction: (id: string) => {
    set((state) => {
      const targetTx = state.transactions.find((t) => t.id === id);
      if (!targetTx) return state;

      // Revert account balance
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

  getSummary: () => {
    const { accounts, transactions } = get();

    // Total Net Worth = Sum of all account balances
    const netWorth = accounts.reduce((acc, a) => acc + a.balance, 0);

    // Monthly Income = Sum of all INCOME transactions
    const monthlyIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((acc, t) => acc + t.amount, 0);

    // Monthly Expenses = Sum of all EXPENSE transactions
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
    };
  },
}));
