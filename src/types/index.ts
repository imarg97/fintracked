export type TransactionType = 'INCOME' | 'EXPENSE' | 'TRANSFER';

export type AccountType = 'BANK' | 'CREDIT_CARD' | 'CASH' | 'WALLET' | 'INVESTMENT';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  lastFourDigits?: string;
  color: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}

export interface Transaction {
  id: string;
  title: string;
  category: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  date: string;
  accountId: string;
  accountName: string;
  iconName: string;
  notes?: string;
}

export interface AddTransactionFormInput {
  title: string;
  amount: string;
  type: TransactionType;
  categoryId: string;
  accountId: string;
  notes?: string;
}

export interface DashboardSummary {
  netWorth: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  monthlySavings: number;
}

// MILESTONE 3 TYPES

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  monthlyLimit: number;
  icon: string;
  color: string;
}

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  icon: string;
  color: string;
}

export interface GoldHolding {
  grams: number;
  ratePerGram: number; // e.g. 7250 INR/gram
  lastUpdated: string;
}

export interface InvestmentPortfolio {
  investedAmount: number;
  currentValue: number;
  mutualFundsValue: number;
  stocksValue: number;
  licValue: number;
}

export interface ExcelImportResult {
  success: boolean;
  totalParsed: number;
  importedCount: number;
  ignoredCount: number;
  errors: string[];
}
