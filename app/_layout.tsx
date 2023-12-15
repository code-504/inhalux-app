import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';

import { useFonts } from 'expo-font';
import { Slot, SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { AuthProvider, useAuth } from '@/context/Authprovider';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '@tamagui/core/reset.css'
import { TamaguiProvider } from 'tamagui'
import appConfig from "@/tamagui.config"
import SimpleHeader from '@/components/Headers/SimpleHeader';
import { MonitorProvider } from '@/context/MonitorProvider';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Montserrat-Regular': require("@/assets/fonts/Montserrat-Regular.ttf"),
    'Montserrat-Semibold': require("@/assets/fonts/Montserrat-SemiBold.ttf"),
    'Montserrat-Bold': require("@/assets/fonts/Montserrat-Bold.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
        <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session, authInitialized } = useAuth();

  if (!authInitialized && !session?.user) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <TamaguiProvider config={appConfig}>
        <SafeAreaProvider>
          <MonitorProvider>
          <Stack initialRouteName='(auth)'>
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="configuration/index" options={{ header: () => <SimpleHeader title="Configuración" /> }} />
            <Stack.Screen name="notification/index" options={{ header: () => <SimpleHeader title="Notificaciones" /> }}  />
          </Stack>
          </MonitorProvider>
        </SafeAreaProvider>
      </TamaguiProvider>
    </ThemeProvider>
  );
}