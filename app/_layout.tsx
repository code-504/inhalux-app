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
import { MonitorProvider } from '@/context/MonitorProvider';
import { InhalerProvider } from '@/context/InhalerProvider';
import { TreatmentProvider } from '@/context/TreatmentProvider';
import { RelationProvider } from '@/context/RelationsProvider';
import { NotificationProvider } from '@/context/NotificationsProvider';
import NormalHeader from '@/components/Headers/NormalHeader';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/(tabs)',
};

import EditIcon from "@/assets/icons/edit.svg"
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import SimpleHeader from '@/components/Headers/SimpleHeader';

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
      <InhalerProvider>
        <NotificationProvider>
          <TreatmentProvider>
            <RelationProvider>
              <RootLayoutNav />
            </RelationProvider>
          </TreatmentProvider>
        </NotificationProvider>
      </InhalerProvider>
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
          <BottomSheetModalProvider>
          <Stack initialRouteName='page_test'>
            <Stack.Screen name='index' options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: "none" }} />
            <Stack.Screen name="device/[inhaler_id]" options={{ header: () => <SimpleHeader title="Información general" actionButton={{ fn: () => console.log("adios"), Icon: EditIcon }} />, presentation: "containedTransparentModal", animation: "none" }} />
            <Stack.Screen name="configuration/index" options={{ header: () => <NormalHeader title="Configuración" />, presentation: 'transparentModal' }} />
            <Stack.Screen name="configuration/profile" options={{ header: () => <NormalHeader title="Perfil de usuario" />, presentation: 'transparentModal' }} />
            <Stack.Screen name="configuration/password" options={{ presentation: 'transparentModal' }} />
            <Stack.Screen name="configuration/notifications" options={{ presentation: 'transparentModal' }} />
            <Stack.Screen name="configuration/shareoptions" options={{ presentation: 'transparentModal' }} />
            <Stack.Screen name="device/search_device" options={{ presentation: 'transparentModal' }} />
            <Stack.Screen name="device/connect_device" options={{ presentation: 'transparentModal' }} />
            <Stack.Screen name="monitor/scan_pacient" options={{ header: () => <NormalHeader title="Escanear" />, presentation: 'transparentModal' }}  />
            <Stack.Screen name="monitor/share_link" options={{ header: () => <NormalHeader title="Compartir" />, presentation: 'transparentModal' }}  />
            <Stack.Screen name="notification" options={{ header: () => <NormalHeader title="Notificaciones" />, presentation: 'transparentModal' }} />
          </Stack>
          </BottomSheetModalProvider>
          </MonitorProvider>
        </SafeAreaProvider>
      </TamaguiProvider>
    </ThemeProvider>
  );
}