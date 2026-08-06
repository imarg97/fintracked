import * as XLSX from 'xlsx';
import { Transaction, TransactionType } from '../types';

export interface ParsedTransactionResult {
  transactions: Transaction[];
  errors: string[];
}

/**
 * Words that indicate a row is a summary/total/header row in Excel, not an individual transaction.
 */
const SUMMARY_ROW_KEYWORDS = [
  'month',
  'months',
  'total',
  'grand total',
  'subtotal',
  'summary',
  'average',
  'year',
  'years',
];

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
 * Handles single table sheets, matrix sheets (Months x Categories), and automatically ignores summary headers/totals.
 */
export const parseExcelSpreadsheet = (
  base64OrBinaryData: string | ArrayBuffer
): ParsedTransactionResult => {
  const errors: string[] = [];
  const transactions: Transaction[] = [];

  try {
    const workbook = XLSX.read(base64OrBinaryData, { type: 'base64', cellDates: true });

    // Loop through all sheets in the workbook
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];

      // Convert sheet to array of objects with raw headers
      const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: '',
        blankrows: false,
      });

      if (!rawRows || rawRows.length === 0) return;

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
        // 1. Extract Title
        let title = titleKey ? String(row[titleKey]).trim() : '';
        if (!title) {
          for (const k of keys) {
            if (k !== amountKey && row[k] && typeof row[k] === 'string' && row[k].trim().length > 1) {
              title = row[k].trim();
              break;
            }
          }
        }

        const normalizedTitle = title.toLowerCase();

        // 2. Ignore Summary / Total / Header rows
        if (SUMMARY_ROW_KEYWORDS.includes(normalizedTitle)) {
          return; // Silent skip for header keywords like "MONTH", "TOTAL", "GRAND TOTAL"
        }

        // 3. Extract Amount
        let rawAmountVal = amountKey ? row[amountKey] : undefined;

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

        // Skip rows without valid amounts silently if they look like notes or empty lines
        if (isNaN(parsedAmount) || parsedAmount === 0) {
          return;
        }

        if (!title) {
          title = `Imported Transaction #${index + 1}`;
        }

        // 4. Determine Type (INCOME vs EXPENSE)
        let type: TransactionType = 'EXPENSE';
        const typeVal = String(row['type'] || row['Type'] || row['category'] || row['Category'] || title).toUpperCase();

        if (
          typeVal.includes('INC') ||
          typeVal.includes('CREDIT') ||
          typeVal.includes('SALARY') ||
          typeVal.includes('EARN') ||
          typeVal.includes('SAVINGS') ||
          (amountKey && amountKey.toLowerCase().includes('credit'))
        ) {
          type = 'INCOME';
        }

        // 5. Extract Category & Account
        const categoryName = categoryKey && row[categoryKey] ? String(row[categoryKey]).trim() : (type === 'INCOME' ? 'Income' : 'General Expense');
        const accountName = accountKey && row[accountKey] ? String(row[accountKey]).trim() : 'Primary Bank';
        const dateStr = dateKey ? formatExcelDate(row[dateKey]) : 'Past Entry';

        transactions.push({
          id: `excel-tx-${sheetName}-${Date.now()}-${index}`,
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
    });
  } catch (err: any) {
    errors.push(`Failed to read spreadsheet file: ${err.message || 'Unknown format'}`);
  }

  return { transactions, errors };
};
