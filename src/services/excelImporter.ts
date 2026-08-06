import * as XLSX from 'xlsx';
import { Transaction, TransactionType } from '../types';

export interface ParsedTransactionResult {
  transactions: Transaction[];
  errors: string[];
}

const IGNORED_COLUMN_HEADER_KEYWORDS = [
  'total',
  'grand total',
  'subtotal',
  'summary',
  'average',
  '__empty',
];

const MONTH_NAMES = [
  'jan', 'january',
  'feb', 'february',
  'mar', 'march',
  'apr', 'april',
  'may',
  'jun', 'june',
  'jul', 'july',
  'aug', 'august',
  'sep', 'september',
  'oct', 'october',
  'nov', 'november',
  'dec', 'december',
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
 * Unpivots multi-column matrix expense sheets (Months x Categories)
 * and single-table transaction lists into clean individual FinTracked Transactions.
 */
export const parseExcelSpreadsheet = (
  base64OrBinaryData: string | ArrayBuffer
): ParsedTransactionResult => {
  const errors: string[] = [];
  const transactions: Transaction[] = [];

  try {
    const workbook = XLSX.read(base64OrBinaryData, { type: 'base64', cellDates: true });

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];

      const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, {
        defval: '',
        blankrows: false,
      });

      if (!rawRows || rawRows.length === 0) return;

      const keys = Object.keys(rawRows[0]);
      if (keys.length === 0) return;

      // 1. Detect if sheet is a Single Table or Matrix Sheet (Months x Categories)
      const firstColKey = keys[0];

      // Check if first column contains Month names (JAN, FEB, MAR...)
      const isMatrixMonthSheet = rawRows.some((r) => {
        const val = String(r[firstColKey] || '').toLowerCase().trim();
        return MONTH_NAMES.includes(val);
      });

      if (isMatrixMonthSheet) {
        // MATRIX UNPIVOTING ALGORITHM
        rawRows.forEach((row, rowIndex) => {
          const rowLabel = String(row[firstColKey] || '').trim();
          const normalizedRowLabel = rowLabel.toLowerCase();

          // Skip header or total summary rows
          if (!rowLabel || normalizedRowLabel === 'month' || normalizedRowLabel.includes('total')) {
            return;
          }

          // Unpivot each category column in this row
          keys.slice(1).forEach((colHeader, colIndex) => {
            const normalizedColHeader = colHeader.toLowerCase().trim();

            // Skip total or blank summary columns
            if (
              !colHeader ||
              IGNORED_COLUMN_HEADER_KEYWORDS.some((kw) => normalizedColHeader.includes(kw))
            ) {
              return;
            }

            const rawCellVal = row[colHeader];
            if (rawCellVal === '' || rawCellVal === undefined || rawCellVal === null) return;

            // Extract numeric value from individual cell
            const cleanStr = String(rawCellVal).replace(/[^0-9.-]+/g, '').trim();
            const parsedAmount = Math.abs(parseFloat(cleanStr));

            if (isNaN(parsedAmount) || parsedAmount === 0) return;

            // Determine if column is Income or Expense
            let type: TransactionType = 'EXPENSE';
            if (
              normalizedColHeader.includes('inc') ||
              normalizedColHeader.includes('salary') ||
              normalizedColHeader.includes('earn') ||
              normalizedColHeader.includes('credit')
            ) {
              type = 'INCOME';
            }

            const title = `${colHeader} (${rowLabel})`;
            const categoryName = colHeader.trim();

            transactions.push({
              id: `excel-tx-${sheetName}-${rowIndex}-${colIndex}-${Date.now()}`,
              title,
              amount: parsedAmount,
              type,
              category: categoryName,
              categoryId: `cat-imported-${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
              accountName: 'Primary Bank',
              accountId: 'acc-imported-bank',
              iconName: type === 'INCOME' ? 'cash-outline' : 'receipt-outline',
              date: `${rowLabel} ${sheetName}`,
            });
          });
        });
      } else {
        // SINGLE TABLE ALGORITHM (Standard Date/Title/Amount list)
        const amountKey = keys.find((k) => {
          const norm = k.toLowerCase().replace(/[^a-z0-9]/g, '');
          return ['amount', 'amt', 'spent', 'price', 'cost', 'debit', 'credit', 'value', 'rs', 'rupees', 'inr'].some((p) => norm.includes(p));
        });

        const titleKey = keys.find((k) => {
          const norm = k.toLowerCase().replace(/[^a-z0-9]/g, '');
          return ['title', 'description', 'particulars', 'details', 'remarks', 'name', 'item', 'merchant', 'vendor'].some((p) => norm.includes(p));
        });

        const categoryKey = keys.find((k) => k.toLowerCase().includes('category') || k.toLowerCase().includes('type'));
        const dateKey = keys.find((k) => k.toLowerCase().includes('date') || k.toLowerCase().includes('time'));

        rawRows.forEach((row, rowIndex) => {
          // Extract title
          const title = titleKey && row[titleKey] ? String(row[titleKey]).trim() : `Expense #${rowIndex + 1}`;

          // Extract numeric amount safely from single cell
          const rawAmt = amountKey ? row[amountKey] : Object.values(row).find((v) => typeof v === 'number' && v > 0);
          const cleanAmt = String(rawAmt || '').replace(/[^0-9.-]+/g, '').trim();
          const parsedAmount = Math.abs(parseFloat(cleanAmt));

          if (isNaN(parsedAmount) || parsedAmount === 0) return;

          let type: TransactionType = 'EXPENSE';
          const typeStr = String(row['type'] || row['Type'] || categoryKey ? row[categoryKey!] : '').toUpperCase();
          if (typeStr.includes('INC') || typeStr.includes('SALARY') || typeStr.includes('CREDIT')) {
            type = 'INCOME';
          }

          const categoryName = categoryKey && row[categoryKey] ? String(row[categoryKey]).trim() : (type === 'INCOME' ? 'Income' : 'General Expense');
          const dateStr = dateKey ? formatExcelDate(row[dateKey]) : 'Past Entry';

          transactions.push({
            id: `excel-tx-${sheetName}-${rowIndex}-${Date.now()}`,
            title,
            amount: parsedAmount,
            type,
            category: categoryName,
            categoryId: `cat-imported-${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
            accountName: 'Primary Bank',
            accountId: 'acc-imported-bank',
            iconName: type === 'INCOME' ? 'cash-outline' : 'receipt-outline',
            date: dateStr,
          });
        });
      }
    });
  } catch (err: any) {
    errors.push(`Failed to read spreadsheet file: ${err.message || 'Unknown format'}`);
  }

  return { transactions, errors };
};
