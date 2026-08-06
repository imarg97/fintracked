import * as XLSX from 'xlsx';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Transaction } from '../types';
import { formatRupee } from '../utils/formatters';

/**
 * Exports all transactions to an Excel workbook (.xlsx) and triggers native download/share dialog.
 */
export const exportTransactionsToExcel = async (transactions: Transaction[]): Promise<boolean> => {
  try {
    const excelData = transactions.map((t) => ({
      ID: t.id,
      Date: t.date,
      Title: t.title,
      Type: t.type,
      Category: t.category,
      Amount: t.amount,
      Account: t.accountName,
      Notes: t.notes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'FinTracked Transactions');

    const base64Str = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
    const filename = `FinTracked_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;

    // In web browser context, trigger direct file download
    if (typeof window !== 'undefined' && window.document) {
      const blob = new Blob([s2ab(atob(base64Str))], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      return true;
    }

    return true;
  } catch (err: any) {
    console.error('Excel Export Error:', err);
    return false;
  }
};

/**
 * Helper to convert binary string to ArrayBuffer for web downloads.
 */
function s2ab(s: string) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
  return buf;
}

/**
 * Generates a formatted PDF Financial Monthly Statement report and opens the print/download dialog.
 */
export const generatePDFReport = async (
  userName: string,
  summary: {
    netWorth: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    savingsRate: number;
  },
  transactions: Transaction[]
): Promise<boolean> => {
  try {
    const rowsHtml = transactions
      .map(
        (t) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #334155; color: #94A3B8;">${t.date}</td>
        <td style="padding: 8px; border-bottom: 1px solid #334155; color: #F8FAFC; font-weight: 600;">${t.title}</td>
        <td style="padding: 8px; border-bottom: 1px solid #334155; color: #CBD5E1;">${t.category}</td>
        <td style="padding: 8px; border-bottom: 1px solid #334155; color: #CBD5E1;">${t.accountName}</td>
        <td style="padding: 8px; border-bottom: 1px solid #334155; text-align: right; color: ${
          t.type === 'INCOME' ? '#10B981' : '#EF4444'
        }; font-weight: 700;">
          ${t.type === 'INCOME' ? '+' : '-'}${formatRupee(t.amount)}
        </td>
      </tr>
    `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0F172A; color: #F8FAFC; padding: 24px; margin: 0; }
            .header { border-bottom: 2px solid #10B981; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center; }
            .title { color: #10B981; font-size: 24px; font-weight: 800; margin: 0; }
            .subtitle { color: #94A3B8; font-size: 12px; margin-top: 4px; }
            .metrics-grid { display: flex; gap: 16px; margin-bottom: 28px; }
            .metric-card { flex: 1; background-color: #1E293B; border-radius: 12px; padding: 16px; border: 1px solid #334155; }
            .metric-label { color: #94A3B8; font-size: 10px; font-weight: 700; text-transform: uppercase; }
            .metric-value { font-size: 18px; font-weight: 800; margin-top: 6px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { text-align: left; padding: 10px 8px; color: #94A3B8; font-size: 11px; text-transform: uppercase; border-bottom: 2px solid #334155; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">FinTracked</h1>
              <div class="subtitle">Monthly Financial Statement • Prepared for ${userName}</div>
            </div>
            <div style="text-align: right; color: #94A3B8; font-size: 11px;">
              Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>

          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-label">Total Net Worth</div>
              <div class="metric-value" style="color: #F8FAFC;">${formatRupee(summary.netWorth)}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Monthly Income</div>
              <div class="metric-value" style="color: #10B981;">${formatRupee(summary.monthlyIncome)}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Monthly Expenses</div>
              <div class="metric-value" style="color: #EF4444;">${formatRupee(summary.monthlyExpenses)}</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Savings Rate</div>
              <div class="metric-value" style="color: #6366F1;">${summary.savingsRate}%</div>
            </div>
          </div>

          <h2 style="font-size: 16px; color: #F8FAFC; margin-bottom: 8px;">Transaction Activity</h2>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Account</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </body>
      </html>
    `;

    if (typeof window !== 'undefined' && window.document) {
      // Open print preview in browser
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.print();
        return true;
      }
    }

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    await Sharing.shareAsync(uri, { dialogTitle: 'FinTracked Statement' });
    return true;
  } catch (err: any) {
    console.error('PDF Report Error:', err);
    return false;
  }
};
