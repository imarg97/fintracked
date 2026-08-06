import { Category, Account, Transaction, Budget, Goal, GoldHolding, InvestmentPortfolio } from '../types';
import { FinTrackedColors } from '../theme/theme';

export const DEFAULT_ACCOUNTS: Account[] = [
  {
    id: 'acc-hdfc',
    name: 'HDFC Salary Bank',
    type: 'BANK',
    balance: 1420000,
    lastFourDigits: '4120',
    color: '#3B82F6',
    icon: 'card-outline',
  },
  {
    id: 'acc-icici',
    name: 'ICICI Rubyx Credit',
    type: 'CREDIT_CARD',
    balance: -28900,
    lastFourDigits: '8901',
    color: '#EF4444',
    icon: 'card',
  },
  {
    id: 'acc-cash',
    name: 'Cash Wallet',
    type: 'CASH',
    balance: 18500,
    color: '#10B981',
    icon: 'cash-outline',
  },
  {
    id: 'acc-zerodha',
    name: 'Zerodha Mutual Funds',
    type: 'INVESTMENT',
    balance: 435600,
    color: '#F59E0B',
    icon: 'trending-up-outline',
  },
];

export const DEFAULT_CATEGORIES: Category[] = [
  // EXPENSES
  { id: 'cat-food', name: 'Food & Dining', type: 'EXPENSE', icon: 'fast-food-outline', color: '#F97316' },
  { id: 'cat-rent', name: 'Rent & Housing', type: 'EXPENSE', icon: 'home-outline', color: '#8B5CF6' },
  { id: 'cat-fuel', name: 'Fuel & Transport', type: 'EXPENSE', icon: 'car-outline', color: '#EF4444' },
  { id: 'cat-tech', name: 'Tech & Gadgets', type: 'EXPENSE', icon: 'laptop-outline', color: '#3B82F6' },
  { id: 'cat-shop', name: 'Shopping', type: 'EXPENSE', icon: 'bag-handle-outline', color: '#EC4899' },
  { id: 'cat-subs', name: 'Subscriptions & OTT', type: 'EXPENSE', icon: 'play-circle-outline', color: '#10B981' },
  { id: 'cat-health', name: 'Healthcare & Medical', type: 'EXPENSE', icon: 'medkit-outline', color: '#14B8A6' },

  // INCOME
  { id: 'cat-salary', name: 'Monthly Salary', type: 'INCOME', icon: 'cash-outline', color: '#10B981' },
  { id: 'cat-invest', name: 'Investment Returns', type: 'INCOME', icon: 'trending-up-outline', color: '#F59E0B' },
  { id: 'cat-bonus', name: 'Bonus & Incentives', type: 'INCOME', icon: 'gift-outline', color: '#6366F1' },

  // TRANSFER
  { id: 'cat-transfer', name: 'Account Transfer', type: 'TRANSFER', icon: 'swap-horizontal-outline', color: '#64748B' },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    title: 'Salary Credit - August',
    category: 'Monthly Salary',
    categoryId: 'cat-salary',
    amount: 155000,
    type: 'INCOME',
    date: 'Today, 09:30 AM',
    accountId: 'acc-hdfc',
    accountName: 'HDFC Salary Bank',
    iconName: 'cash-outline',
  },
  {
    id: 'tx-2',
    title: 'Apple Store Online',
    category: 'Tech & Gadgets',
    categoryId: 'cat-tech',
    amount: 28900,
    type: 'EXPENSE',
    date: 'Yesterday',
    accountId: 'acc-icici',
    accountName: 'ICICI Rubyx Credit',
    iconName: 'laptop-outline',
  },
  {
    id: 'tx-3',
    title: 'Fuel - HP Petrol Pump',
    category: 'Fuel & Transport',
    categoryId: 'cat-fuel',
    amount: 3500,
    type: 'EXPENSE',
    date: '04 Aug 2026',
    accountId: 'acc-hdfc',
    accountName: 'HDFC Salary Bank',
    iconName: 'car-outline',
  },
];

// MILESTONE 3 SEED DATA

export const DEFAULT_BUDGETS: Budget[] = [
  {
    id: 'bgt-food',
    categoryId: 'cat-food',
    categoryName: 'Food & Dining',
    monthlyLimit: 15000,
    icon: 'fast-food-outline',
    color: '#F97316',
  },
  {
    id: 'bgt-fuel',
    categoryId: 'cat-fuel',
    categoryName: 'Fuel & Transport',
    monthlyLimit: 6000,
    icon: 'car-outline',
    color: '#EF4444',
  },
  {
    id: 'bgt-tech',
    categoryId: 'cat-tech',
    categoryName: 'Tech & Gadgets',
    monthlyLimit: 30000,
    icon: 'laptop-outline',
    color: '#3B82F6',
  },
  {
    id: 'bgt-subs',
    categoryId: 'cat-subs',
    categoryName: 'Subscriptions & OTT',
    monthlyLimit: 3000,
    icon: 'play-circle-outline',
    color: '#10B981',
  },
];

export const DEFAULT_GOALS: Goal[] = [
  {
    id: 'goal-emergency',
    title: '6-Month Emergency Fund',
    targetAmount: 500000,
    currentAmount: 320000,
    targetDate: 'Dec 2026',
    icon: 'shield-checkmark-outline',
    color: '#10B981',
  },
  {
    id: 'goal-car',
    title: 'New Electric SUV Downpayment',
    targetAmount: 400000,
    currentAmount: 185000,
    targetDate: 'Mar 2027',
    icon: 'car-sport-outline',
    color: '#3B82F6',
  },
  {
    id: 'goal-travel',
    title: 'Japan Autumn Trip 2027',
    targetAmount: 250000,
    currentAmount: 90000,
    targetDate: 'Nov 2027',
    icon: 'airplane-outline',
    color: '#EC4899',
  },
];

export const DEFAULT_GOLD_HOLDING: GoldHolding = {
  grams: 50,
  ratePerGram: 7250, // INR per gram 24K
  lastUpdated: 'Today',
};

export const DEFAULT_INVESTMENT_PORTFOLIO: InvestmentPortfolio = {
  investedAmount: 350000,
  currentValue: 435600,
  mutualFundsValue: 285600,
  stocksValue: 150000,
  licValue: 0,
};
