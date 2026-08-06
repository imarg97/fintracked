import * as XLSX from 'xlsx';
import { Transaction, TransactionType } from '../types';

export interface ParsedTransactionResult {
  transactions: Transaction[];
  errors: string[];
}

/**
 * Formats an Excel date value (string or Excel serial number) to readable date string.
 */
const formatExcelDate = (val: any): string => {
  if (!val) return 'Past Entry';

  if (typeof val === 'number') {
    try {
      const dateObj = XLSX.SSF.parse_date_code(val);
      if (dateObj) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${String(dateObj.d).padStart(2, '0')} ${months[dateObj.m - 1]} ${dateObj.y}`;
      }
    } catch {
      /* fallback */
    }
  }

  return String(val).trim();
};

/**
 * Intelligent, fuzzy column matcher for Excel spreadsheets.
 * Finds Amount, Title/Description, Category, Account, and Date regardless of exact column casing or naming.
 */
export const parseExcelSpreadsheet = (
  base64OrBinaryData: string | ArrayBuffer
): ParsedTransactionResult => {
  const errors: string[] = [];
  const transactions: Transaction[] = [];

  try {
    const workbook = XLSX.read(base64OrBinaryData, { type: 'base64', cellDates: true });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert sheet to array of objects with raw headers
    const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
      defval: '',
      blankrows: false,
    });

    if (!rawRows || rawRows.length === 0) {
      return { transactions: [], errors: ['The selected Excel file contains no data rows.'] };
    }

    // Inspect first row keys to determine column mapping
    const sampleRow = rawRows[0];
    const keys = Object.keys(sampleRow);

    // Fuzzy Key Matchers
    const findMatchingKey = (possibleNames: string[]): string | undefined => {
      return keys.find((key) => {
        const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
        return possibleNames.some((p) => {
          const normalizedP = p.toLowerCase().replace(/[^a-z0-9]/g, '');
          return normalizedKey === normalizedP || normalizedKey.includes(normalizedP);
        });
      });
    };

    const amountKey = findMatchingKey([
      'amount',
      'amt',
      'price',
      'cost',
      'spent',
      'expense',
      'income',
      'debit',
      'credit',
      'val',
      'value',
      'rupees',
      'rs',
      'inr',
      'paid',
      'out',
      'in',
    ]);

    const titleKey = findMatchingKey([
      'title',
      'description',
      'particulars',
      'details',
      'remarks',
      'remark',
      'name',
      'item',
      'note',
      'notes',
      'merchant',
      'vendor',
      'narrative',
      'payee',
      'purpose',
    ]);

    const categoryKey = findMatchingKey(['category', 'cat', 'type', 'group', 'tag', 'classification']);
    const accountKey = findMatchingKey(['account', 'bank', 'source', 'wallet', 'mode', 'card']);
    const dateKey = findMatchingKey(['date', 'time', 'txndate', 'created', 'day']);

    rawRows.forEach((row, index) => {
      const rowNum = index + 2;

      // 1. Extract Amount
      let rawAmountVal = amountKey ? row[amountKey] : undefined;

      // Fallback: search row values for first valid numeric field if key was not found
      if (rawAmountVal === undefined || rawAmountVal === '') {
        for (const k of keys) {
          const val = row[k];
          if (typeof val === 'number' && val !== 0) {
            rawAmountVal = val;
            break;
          } else if (typeof val === 'string' && /^-?\d+(\.\d+)?$/.test(val.trim())) {
            rawAmountVal = val;
            break;
          }
        }
      }

      const cleanAmountStr = String(rawAmountVal || '')
        .replace(/[^0-9.-]+/g, '')
        .trim();
      const parsedAmount = Math.abs(parseFloat(cleanAmountStr));

      if (isNaN(parsedAmount) || parsedAmount === 0) {
        errors.push(`Row ${rowNum}: Could not find a valid numeric amount. Available columns: [${keys.join(', ')}]`);
        return;
      }

      // 2. Extract Title
      let title = titleKey ? String(row[titleKey]).trim() : '';
      if (!title) {
        // Fallback to first non-numeric text column
        for (const k of keys) {
          if (k !== amountKey && row[k] && typeof row[k] === 'string' && row[k].trim().length > 1) {
            title = row[k].trim();
            break;
          }
        }
      }
      if (!title) {
        title = `Imported Expense #${index + 1}`;
      }

      // 3. Determine Type (INCOME vs EXPENSE)
      let type: TransactionType = 'EXPENSE';
      const typeVal = String(row['type'] || row['Type'] || row['category'] || row['Category'] || '').toUpperCase();

      if (
        typeVal.includes('INC') ||
        typeVal.includes('CREDIT') ||
        typeVal.includes('SALARY') ||
        typeVal.includes('EARN') ||
        (amountKey && amountKey.toLowerCase().includes('credit'))
      ) {
        type = 'INCOME';
      }

      // 4. Extract Category & Account
      const categoryName = categoryKey && row[categoryKey] ? String(row[categoryKey]).trim() : (type === 'INCOME' ? 'Income' : 'General Expense');
      const accountName = accountKey && row[accountKey] ? String(row[accountKey]).trim() : 'Primary Bank';
      const dateStr = dateKey ? formatExcelDate(row[dateKey]) : 'Past Entry';

      transactions.push({
        id: `excel-tx-${Date.now()}-${index}`,
        title,
        amount: parsedAmount,
        type,
        category: categoryName,
        categoryId: `cat-imported-${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
        accountName,
        accountId: `acc-imported-${accountName.toLowerCase().replace(/\s+/g, '-')}`,
        iconName: type === 'INCOME' ? 'cash-outline' : 'receipt-outline',
        date: dateStr,
      });
    });
  } catch (err: any) {
    errors.push(`Failed to read spreadsheet file: ${err.message || 'Unknown format'}`);
  }

  return { transactions, errors };
};
