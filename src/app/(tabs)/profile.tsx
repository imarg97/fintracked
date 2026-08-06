import React from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, Avatar, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { useAppStore } from '../../store/useAppStore';
import { formatRupee } from '../../utils/formatters';

export default function ProfileScreen() {
  const router = useRouter();
  const { userName, accounts, isPrivacyMode, getSummary } = useAppStore();

  const summary = getSummary();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <Surface style={styles.profileHeaderCard} elevation={0}>
          <Avatar.Text
            size={64}
            label={userName.substring(0, 2).toUpperCase()}
            style={styles.avatar}
            labelStyle={styles.avatarLabel}
          />
          <Text variant="headlineSmall" style={styles.userName}>
            {userName}
          </Text>
          <Text style={styles.userRole}>FinTracked Pro Account</Text>

          <View style={styles.netWorthRow}>
            <Text style={styles.netWorthLabel}>TOTAL NET WORTH</Text>
            <Text variant="titleLarge" style={styles.netWorthValue}>
              {formatRupee(summary.netWorth, isPrivacyMode)}
            </Text>
          </View>
        </Surface>

        {/* Excel Import Shortcut Card */}
        <Pressable onPress={() => router.push('/import-excel')}>
          <Surface style={styles.importBannerCard} elevation={0}>
            <View style={styles.importIconBg}>
              <Ionicons name="document-text" size={24} color={FinTrackedColors.primary} />
            </View>
            <View style={styles.importMeta}>
              <Text variant="titleMedium" style={styles.importTitle}>
                Import spending.xlsx
              </Text>
              <Text style={styles.importSub}>
                Upload lifetime earnings & expenses from Excel
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={FinTrackedColors.textSecondary} />
          </Surface>
        </Pressable>

        {/* Bank & Credit Accounts Breakdown */}
        <Text style={styles.sectionHeader}>Accounts & Wallets ({accounts.length})</Text>
        <Surface style={styles.accountsCard} elevation={0}>
          {accounts.map((acc, index) => (
            <View
              key={acc.id}
              style={[
                styles.accountRow,
                index !== accounts.length - 1 && styles.borderBottom,
              ]}
            >
              <View style={styles.accountLeft}>
                <View style={[styles.accIconBg, { backgroundColor: acc.color + '1F' }]}>
                  <Ionicons name={acc.icon as any} size={18} color={acc.color} />
                </View>
                <View>
                  <Text style={styles.accName}>{acc.name}</Text>
                  <Text style={styles.accType}>{acc.type}</Text>
                </View>
              </View>

              <Text
                style={[
                  styles.accBalance,
                  { color: acc.balance < 0 ? FinTrackedColors.error : FinTrackedColors.textPrimary },
                ]}
              >
                {formatRupee(acc.balance, isPrivacyMode)}
              </Text>
            </View>
          ))}
        </Surface>

        {/* Settings List */}
        <Text style={styles.sectionHeader}>Preferences & Security</Text>
        <Surface style={styles.settingsCard} elevation={0}>
          <View style={styles.settingRow}>
            <Ionicons name="finger-print-outline" size={20} color={FinTrackedColors.primary} />
            <Text style={styles.settingLabel}>Biometric Lock (FaceID / Fingerprint)</Text>
            <Text style={styles.settingStatus}>Enabled</Text>
          </View>

          <View style={[styles.settingRow, styles.borderTop]}>
            <Ionicons name="cloud-done-outline" size={20} color={FinTrackedColors.primary} />
            <Text style={styles.settingLabel}>Supabase Sync</Text>
            <Text style={styles.settingStatus}>Active</Text>
          </View>
        </Surface>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FinTrackedColors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: FinTrackedColors.surfaceVariant,
    borderWidth: 2,
    borderColor: FinTrackedColors.primary,
    marginBottom: 10,
  },
  avatarLabel: {
    color: FinTrackedColors.primary,
    fontWeight: '800',
  },
  userName: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '800',
  },
  userRole: {
    color: FinTrackedColors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  netWorthRow: {
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: FinTrackedColors.surfaceBorder + '80',
    width: '100%',
  },
  netWorthLabel: {
    color: FinTrackedColors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  netWorthValue: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '800',
    marginTop: 2,
  },
  importBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FinTrackedColors.primary + '1F',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: FinTrackedColors.primary + '40',
    marginBottom: 20,
  },
  importIconBg: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: FinTrackedColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  importMeta: {
    flex: 1,
  },
  importTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
  },
  importSub: {
    color: FinTrackedColors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  sectionHeader: {
    color: FinTrackedColors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 6,
  },
  accountsCard: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginBottom: 20,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: FinTrackedColors.surfaceBorder + '60',
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: FinTrackedColors.surfaceBorder + '60',
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accIconBg: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  accName: {
    color: FinTrackedColors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  accType: {
    color: FinTrackedColors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  accBalance: {
    fontWeight: '700',
    fontSize: 14,
  },
  settingsCard: {
    backgroundColor: FinTrackedColors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingLabel: {
    color: FinTrackedColors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  settingStatus: {
    color: FinTrackedColors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});
