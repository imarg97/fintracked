import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { AppTheme } from '../theme/theme';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reload/re-render ignore */
});

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after initialization
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync().catch(() => {});
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={AppTheme}>
        <StatusBar style="light" backgroundColor={AppTheme.colors.background} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: AppTheme.colors.background },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
