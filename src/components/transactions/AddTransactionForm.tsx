import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, TransactionSchemaType } from '../../utils/validation';
import { useAppStore } from '../../store/useAppStore';
import { CategoryChip } from '../common/CategoryChip';
import FinTrackedColors from '../../constants/Colors';
import { TransactionType } from '../../types';
import { Ionicons } from '@expo/vector-icons';

interface AddTransactionFormProps {
  onSuccess: () => void;
}

export const AddTransactionForm: React.FC<AddTransactionFormProps> = ({ onSuccess }) => {
  const { categories, accounts, addTransaction } = useAppStore();
  const [selectedType, setSelectedType] = useState<TransactionType>('EXPENSE');

  const defaultCategory = categories.find((c) => c.type === selectedType) || categories[0];
  const defaultAccount = accounts[0];

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TransactionSchemaType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: '',
      amount: '',
      type: 'EXPENSE',
      categoryId: defaultCategory?.id || '',
      accountId: defaultAccount?.id || '',
      notes: '',
    },
  });

  const selectedCategoryId = watch('categoryId');
  const selectedAccountId = watch('accountId');

  const filteredCategories = categories.filter((cat) => cat.type === selectedType);

  const handleTypeChange = (newType: string) => {
    const typeEnum = newType as TransactionType;
    setSelectedType(typeEnum);
    setValue('type', typeEnum);

    const firstCatOfNewType = categories.find((c) => c.type === typeEnum);
    if (firstCatOfNewType) {
      setValue('categoryId', firstCatOfNewType.id);
    }
  };

  const onSubmit = (data: TransactionSchemaType) => {
    const numericAmount = parseFloat(data.amount);
    const category = categories.find((c) => c.id === data.categoryId);
    const account = accounts.find((a) => a.id === data.accountId);

    if (!category || !account) return;

    addTransaction({
      title: data.title,
      amount: numericAmount,
      type: data.type,
      categoryId: category.id,
      category: category.name,
      accountId: account.id,
      accountName: account.name,
      iconName: category.icon,
      notes: data.notes,
      date: 'Just now',
    });

    onSuccess();
  };

  return (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      {/* 1. Transaction Type Segmented Switcher */}
      <View style={styles.segmentWrapper}>
        <SegmentedButtons
          value={selectedType}
          onValueChange={handleTypeChange}
          buttons={[
            {
              value: 'EXPENSE',
              label: 'Expense',
              checkedColor: '#FFFFFF',
              style: selectedType === 'EXPENSE' ? { backgroundColor: FinTrackedColors.error } : {},
            },
            {
              value: 'INCOME',
              label: 'Income',
              checkedColor: '#FFFFFF',
              style: selectedType === 'INCOME' ? { backgroundColor: FinTrackedColors.primary } : {},
            },
            {
              value: 'TRANSFER',
              label: 'Transfer',
              checkedColor: '#FFFFFF',
              style: selectedType === 'TRANSFER' ? { backgroundColor: FinTrackedColors.secondary } : {},
            },
          ]}
          theme={{ colors: { secondaryContainer: FinTrackedColors.surfaceVariant } }}
        />
      </View>

      {/* 2. Amount Input Hero */}
      <View style={styles.amountContainer}>
        <Text style={styles.currencyPrefix}>₹</Text>
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={FinTrackedColors.textMuted}
              style={styles.amountInput}
              textColor={FinTrackedColors.textPrimary}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
          )}
        />
      </View>
      {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}

      {/* 3. Title Input */}
      <Text style={styles.fieldLabel}>Transaction Title</Text>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="e.g. Swiggy, Salary, Petrol"
            placeholderTextColor={FinTrackedColors.textMuted}
            mode="outlined"
            outlineColor={FinTrackedColors.surfaceBorder}
            activeOutlineColor={FinTrackedColors.primary}
            textColor={FinTrackedColors.textPrimary}
            style={styles.textInput}
          />
        )}
      />
      {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}

      {/* 4. Category Selector Grid */}
      <Text style={styles.fieldLabel}>Category</Text>
      <View style={styles.categoryGrid}>
        {filteredCategories.map((cat) => (
          <CategoryChip
            key={cat.id}
            category={cat}
            isSelected={selectedCategoryId === cat.id}
            onSelect={(id) => setValue('categoryId', id)}
          />
        ))}
      </View>
      {errors.categoryId && <Text style={styles.errorText}>{errors.categoryId.message}</Text>}

      {/* 5. Account Selector Cards */}
      <Text style={styles.fieldLabel}>Pay / Deposit Account</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.accountScroll}>
        {accounts.map((acc) => {
          const isSelected = selectedAccountId === acc.id;
          return (
            <Pressable
              key={acc.id}
              onPress={() => setValue('accountId', acc.id)}
              style={[
                styles.accountCard,
                isSelected && { borderColor: FinTrackedColors.primary, backgroundColor: FinTrackedColors.primary + '1F' },
              ]}
            >
              <Ionicons name={acc.icon as any} size={20} color={isSelected ? FinTrackedColors.primary : acc.color} />
              <Text style={[styles.accountName, isSelected && { color: FinTrackedColors.textPrimary, fontWeight: '700' }]}>
                {acc.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      {errors.accountId && <Text style={styles.errorText}>{errors.accountId.message}</Text>}

      {/* 6. Notes Input */}
      <Text style={styles.fieldLabel}>Notes / Tags (Optional)</Text>
      <Controller
        control={control}
        name="notes"
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Add optional details or tags"
            placeholderTextColor={FinTrackedColors.textMuted}
            mode="outlined"
            outlineColor={FinTrackedColors.surfaceBorder}
            activeOutlineColor={FinTrackedColors.primary}
            textColor={FinTrackedColors.textPrimary}
            style={styles.textInput}
          />
        )}
      />

      {/* 7. Save Action Button */}
      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={styles.submitBtn}
        contentStyle={styles.submitBtnContent}
        labelStyle={styles.submitBtnLabel}
      >
        Save Transaction
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  segmentWrapper: {
    marginBottom: 20,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginBottom: 16,
  },
  currencyPrefix: {
    color: FinTrackedColors.primary,
    fontSize: 32,
    fontWeight: '800',
    marginRight: 6,
  },
  amountInput: {
    backgroundColor: 'transparent',
    fontSize: 36,
    fontWeight: '800',
    flex: 1,
    height: 56,
  },
  fieldLabel: {
    color: FinTrackedColors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: FinTrackedColors.surface,
    fontSize: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  accountScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FinTrackedColors.surface,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginRight: 10,
  },
  accountName: {
    color: FinTrackedColors.textSecondary,
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '500',
  },
  errorText: {
    color: FinTrackedColors.error,
    fontSize: 11,
    marginTop: 4,
  },
  submitBtn: {
    marginTop: 28,
    marginBottom: 40,
    borderRadius: 16,
    backgroundColor: FinTrackedColors.primary,
  },
  submitBtnContent: {
    height: 52,
  },
  submitBtnLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
