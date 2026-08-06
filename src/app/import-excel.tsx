import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Button, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../constants/Colors';
import { parseExcelSpreadsheet } from '../services/excelImporter';
import { useAppStore } from '../store/useAppStore';
import { Transaction } from '../types';
import { formatRupee } from '../utils/formatters';

export default function ImportExcelScreen() {
  const router = useRouter();
  const { importExcelTransactions, isPrivacyMode } = useAppStore();
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedItems, setParsedItems] = useState<Transaction[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePickDocument = async () => {
    try {
      setIsLoading(true);
      setSuccessMessage(null);
      setErrors([]);
      setParsedItems([]);

      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'text/csv',
          '*/*',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        setIsLoading(false);
        return;
      }

      const asset = result.assets[0];
      setFileName(asset.name);

      // Read file content as base64
      const response = await fetch(asset.uri);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onload = () => {
        const rawResult = reader.result as string;
        const base64Data = rawResult.includes(',') ? rawResult.split(',')[1] : rawResult;
        const { transactions, errors: parseErrors } = parseExcelSpreadsheet(base64Data);

        setParsedItems(transactions);
        setErrors(parseErrors);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setErrors(['Failed to read selected Excel file from system.']);
        setIsLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch (err: any) {
      setErrors([`File picker error: ${err.message}`]);
      setIsLoading(false);
    }
  };

  const handleConfirmImport = () => {
    if (parsedItems.length === 0) return;

    importExcelTransactions(parsedItems);
    setSuccessMessage(`Successfully imported ${parsedItems.length} transactions from ${fileName}!`);
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={FinTrackedColors.textPrimary} />
        </Pressable>
        <Text variant="titleMedium" style={styles.headerTitle}>
          Import Excel / CSV
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Upload Card */}
        <Surface style={styles.uploadCard} elevation={0}>
          <View style={styles.iconCircle}>
            <Ionicons name="document-text-outline" size={40} color={FinTrackedColors.primary} />
          </View>

          <Text variant="titleMedium" style={styles.uploadTitle}>
            Upload spending.xlsx
          </Text>

          <Text style={styles.uploadSub}>
            Import your historical lifetime earnings and spending. Column headers supported: Date, Title / Description, Amount / Spent / Cost, Category, Account.
          </Text>

          <Button
            mode="contained"
            onPress={handlePickDocument}
            loading={isLoading}
            style={styles.pickBtn}
            contentStyle={styles.pickBtnContent}
            labelStyle={styles.pickBtnLabel}
          >
            {fileName ? `File Selected: ${fileName}` : 'Choose .xlsx / .csv File'}
          </Button>
        </Surface>

        {/* Success Message Banner */}
        {successMessage && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color={FinTrackedColors.primary} />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}

        {/* Parsing Errors Banner */}
        {errors.length > 0 && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorTitle}>Column Mapping Note ({errors.length} rows affected):</Text>
            {errors.slice(0, 3).map((err, i) => (
              <Text key={i} style={styles.errorText}>
                • {err}
              </Text>
            ))}
            {errors.length > 3 && (
              <Text style={styles.errorText}>...and {errors.length - 3} other rows</Text>
            )}
          </View>
        )}

        {/* Parsed Preview List */}
        {parsedItems.length > 0 && (
          <View style={styles.previewSection}>
            <View style={styles.previewHeader}>
              <Text variant="titleMedium" style={styles.previewTitle}>
                Parsed Preview ({parsedItems.length} Transactions Ready)
              </Text>
            </View>

            {parsedItems.slice(0, 10).map((item) => (
              <View key={item.id} style={styles.previewRow}>
                <View style={styles.leftMeta}>
                  <Text style={styles.rowTitle}>{item.title}</Text>
                  <Text style={styles.rowSub}>
                    {item.category} • {item.accountName} • {item.date}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.rowAmount,
                    { color: item.type === 'INCOME' ? FinTrackedColors.primary : FinTrackedColors.textPrimary },
                  ]}
                >
                  {item.type === 'INCOME' ? '+' : '-'}
                  {formatRupee(item.amount, isPrivacyMode)}
                </Text>
              </View>
            ))}

            {parsedItems.length > 10 && (
              <Text style={styles.moreText}>+ {parsedItems.length - 10} more rows ready for import</Text>
            )}

            <Button
              mode="contained"
              onPress={handleConfirmImport}
              style={styles.importBtn}
              contentStyle={styles.importBtnContent}
              labelStyle={styles.importBtnLabel}
            >
              Confirm & Merge into FinTracked
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FinTrackedColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: FinTrackedColors.surfaceBorder + '80',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  uploadCard: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginBottom: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: FinTrackedColors.primary + '1F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  uploadTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
    marginBottom: 6,
  },
  uploadSub: {
    color: FinTrackedColors.textSecondary,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 18,
  },
  pickBtn: {
    backgroundColor: FinTrackedColors.primary,
    borderRadius: 14,
    width: '100%',
  },
  pickBtnContent: {
    height: 48,
  },
  pickBtnLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FinTrackedColors.primary + '1F',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  successText: {
    color: FinTrackedColors.primary,
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  errorBanner: {
    backgroundColor: FinTrackedColors.error + '1F',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  errorTitle: {
    color: FinTrackedColors.error,
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 4,
  },
  errorText: {
    color: FinTrackedColors.error,
    fontSize: 11,
    marginBottom: 2,
  },
  previewSection: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
  },
  previewHeader: {
    marginBottom: 12,
  },
  previewTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: FinTrackedColors.surfaceBorder + '50',
  },
  leftMeta: {
    flex: 1,
  },
  rowTitle: {
    color: FinTrackedColors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  rowSub: {
    color: FinTrackedColors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  rowAmount: {
    fontWeight: '700',
    fontSize: 13,
  },
  moreText: {
    color: FinTrackedColors.textMuted,
    textAlign: 'center',
    fontSize: 12,
    marginVertical: 12,
  },
  importBtn: {
    backgroundColor: FinTrackedColors.primary,
    borderRadius: 14,
    marginTop: 10,
  },
  importBtnContent: {
    height: 48,
  },
  importBtnLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
