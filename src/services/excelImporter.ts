import * as XLSX from 'xlsx';
import { Transaction, TransactionType } from '../types';

export interface RawExcelRow {
  Date?: string | number;
  date?: string | number;
  DATE?: string | number;
  Title?: string;
  title?: string;
  Description?: string;
  description?: string;
  Amount?: number | string;
  amount?: number | string;
  Category?: string;
  category?: string;
  Type?: string;
  type?: string;
  Account?: string;
  account?: string;
  [key: string]: any;
}

export interface ParsedTransactionResult {
  transactions: Transaction[];
  errors: string[];
}

/**
 * Parses binary or base64 data from an uploaded Excel (.xlsx, .csv) spreadsheet.
 * Auto-detects standard column headers like Date, Description, Amount, Category, Type, and Account.
 */
export const parseExcelSpreadsheet = (
  base64OrBinaryData: string | ArrayBuffer
): ParsedTransactionResult => {
  const errors: string[] = [];
  const transactions: Transaction[] = [];

  try {
    const workbook = XLSX.read(base64OrBinaryData, { type: 'base64' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    const rawRows: RawExcelRow[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    if (!rawRows || rawRows.length === 0) {
      return { transactions: [], errors: ['Excel file appears to be empty.'] };
    }

    rawRows.forEach((row, index) => {
      const rowNum = index + 2; // Accounting for 1-indexed Excel header row

      // 1. Resolve Title / Description
      const title =
        row.Title ||
        row.title ||
        row.Description ||
        row.description ||
        row['Particulars'] ||
        row['Transaction Details'] ||
        `Imported Record #${index + 1}`;

      // 2. Resolve Amount
      const rawAmount = row.Amount || row.amount || row['Debit'] || row['Credit'] || row['VALUE'];
      const parsedAmount = Math.abs(parseFloat(String(rawAmount).replace(/[^0-9.-]+/g, '')));

      if (isNaN(parsedAmount) || parsedAmount === 0) {
        errors.push(`Row ${rowNum}: Invalid or zero amount (${rawAmount})`);
        return;
      }

      // 3. Resolve Transaction Type (INCOME / EXPENSE)
      let type: TransactionType = 'EXPENSE';
      const rawType = String(row.Type || row.type || '').toUpperCase();

      if (rawType.includes('INC') || rawType.includes('CREDIT') || rawType.includes('EARNING')) {
        type = 'INCOME';
      } else if (row['Credit'] && parseFloat(String(row['Credit'])) > 0) {
        type = 'INCOME';
      }

      // 4. Resolve Category & Account
      const categoryName = String(row.Category || row.category || (type === 'INCOME' ? 'Income' : 'General Expense'));
      const accountName = String(row.Account || row.account || row['Bank'] || 'Imported Account');
      const dateStr = String(row.Date || row.date || row.DATE || 'Past Entry');

      transactions.push({
        id: `excel-tx-${Date.now()}-${index}`,
        title: String(title).trim(),
        amount: parsedAmount,
        type,
        category: categoryName.trim(),
        categoryId: `cat-imported-${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
        accountName: accountName.trim(),
        accountId: `acc-imported-${accountName.toLowerCase().replace(/\s+/g, '-')}`,
        iconName: type === 'INCOME' ? 'cash-outline' : 'receipt-outline',
        date: dateStr,
      });
    });
  } catch (err: any) {
    errors.push(`Failed to parse Excel file: ${err.message || 'Corrupted file'}`);
  }

  return { transactions, errors };
};
