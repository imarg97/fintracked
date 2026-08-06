/**
 * Formats a numeric amount to Indian Rupee standard format (e.g. ₹1,25,000.00).
 * Supports Privacy Mode to mask values with •••••• when enabled.
 */
export const formatRupee = (amount: number, hidePrivacy: boolean = false): string => {
  if (hidePrivacy) {
    return '••••••••';
  }
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

  return formatted;
};

/**
 * Calculates savings rate percentage.
 */
export const calculateSavingsRate = (income: number, expenses: number): number => {
  if (income <= 0) return 0;
  const savings = income - expenses;
  return Math.max(0, Math.round((savings / income) * 100));
};
