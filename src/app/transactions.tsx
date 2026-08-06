import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text, TextInput, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../constants/Colors';
import { useAppStore } from '../store/useAppStore';
import { formatRupee } from '../utils/formatters';
import { Transaction } from '../types';

export default function TransactionsScreen() {
  const router = useRouter();
  const { transactions, isPrivacyMode, deleteTransaction } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');

  const filteredTransactions = transactions.filter((item) => {
    const matchesFilter = selectedFilter === 'ALL' || item.type === selectedFilter;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.accountName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderItem = ({ item }: { item: Transaction }) => {
    const isExpense = item.type === 'EXPENSE';
    return (
      <View style={styles.itemCard}>
        <View style={styles.leftSection}>
          <View
            style={[
              styles.iconBg,
              {
                backgroundColor: isExpense
                  ? FinTrackedColors.error + '1A'
                  : FinTrackedColors.primary + '1A',
              },
            ]}
          >
            <Ionicons
              name={item.iconName as any}
              size={20}
              color={isExpense ? FinTrackedColors.error : FinTrackedColors.primary}
            />
          </View>
          <View style={styles.meta}>
            <Text variant="bodyLarge" style={styles.title}>
              {item.title}
            </Text>
            <Text style={styles.subText}>
              {item.category} • {item.accountName}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Text
            style={[
              styles.amount,
              { color: isExpense ? FinTrackedColors.textPrimary : FinTrackedColors.primary },
            ]}
          >
            {isExpense ? '-' : '+'}
            {formatRupee(item.amount, isPrivacyMode)}
          </Text>
          <View style={styles.actionRow}>
            <Text style={styles.dateText}>{item.date}</Text>
            <Pressable
              onPress={() => deleteTransaction(item.id)}
              style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.5 }]}
              hitSlop={8}
            >
              <Ionicons name="trash-outline" size={14} color={FinTrackedColors.error} />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={FinTrackedColors.textPrimary} />
        </Pressable>
        <Text variant="titleMedium" style={styles.headerTitle}>
          Transaction History
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <Searchbar
          placeholder="Search by title, category, or bank"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          placeholderTextColor={FinTrackedColors.textMuted}
          iconColor={FinTrackedColors.textSecondary}
        />
      </View>

      {/* Filter Segment Pills */}
      <View style={styles.filterRow}>
        {(['ALL', 'EXPENSE', 'INCOME'] as const).map((filter) => {
          const isSelected = selectedFilter === filter;
          return (
            <Pressable
              key={filter}
              onPress={() => setSelectedFilter(filter)}
              style={[styles.filterPill, isSelected && styles.filterPillActive]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  isSelected && styles.filterPillTextActive,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Transactions List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={48} color={FinTrackedColors.textMuted} />
            <Text style={styles.emptyText}>No matching transactions found</Text>
          </View>
        }
      />
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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  searchWrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  searchBar: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    height: 46,
  },
  searchInput: {
    color: FinTrackedColors.textPrimary,
    fontSize: 13,
    minHeight: 0,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 14,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: FinTrackedColors.surface,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: FinTrackedColors.primary,
    borderColor: FinTrackedColors.primary,
  },
  filterPillText: {
    color: FinTrackedColors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: FinTrackedColors.surface,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginBottom: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  meta: {
    flex: 1,
  },
  title: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  subText: {
    color: FinTrackedColors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: '700',
    fontSize: 14,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    color: FinTrackedColors.textMuted,
    fontSize: 10,
    marginRight: 8,
  },
  deleteBtn: {
    padding: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: FinTrackedColors.textMuted,
    marginTop: 12,
    fontSize: 13,
  },
});
