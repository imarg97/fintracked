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
