import { MD3DarkTheme as PaperDarkTheme, MD3Theme } from 'react-native-paper';

export const FinTrackedColors = {
  background: '#0B0E14',      // Deep Obsidian Dark
  surface: '#161B26',         // Elevated Slate Card Surface
  surfaceVariant: '#1E2536',  // Secondary Card / Pressed Surface
  surfaceBorder: '#273147',   // Subtle Border / Divider
  primary: '#10B981',         // Financial Emerald Green
  primaryContainer: '#064E3B',// Deep Emerald Highlight
  secondary: '#6366F1',       // Indigo Accent
  secondaryContainer: '#312E81',
  error: '#EF4444',           // Vibrant Red for Expense / Alert
  errorContainer: '#7F1D1D',
  textPrimary: '#F9FAFB',     // Crisp White Text
  textSecondary: '#9CA3AF',   // Muted Slate Text
  textMuted: '#6B7280',       // Dark Muted Text
  gold: '#F59E0B',            // Gold Tracking Accent
  cardGradientStart: '#1E293B',
  cardGradientEnd: '#0F172A',
};

export const AppTheme: MD3Theme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: FinTrackedColors.primary,
    primaryContainer: FinTrackedColors.primaryContainer,
    secondary: FinTrackedColors.secondary,
    secondaryContainer: FinTrackedColors.secondaryContainer,
    background: FinTrackedColors.background,
    surface: FinTrackedColors.surface,
    surfaceVariant: FinTrackedColors.surfaceVariant,
    error: FinTrackedColors.error,
    errorContainer: FinTrackedColors.errorContainer,
    onBackground: FinTrackedColors.textPrimary,
    onSurface: FinTrackedColors.textPrimary,
    onSurfaceVariant: FinTrackedColors.textSecondary,
    outline: FinTrackedColors.surfaceBorder,
  },
  roundness: 16,
};
