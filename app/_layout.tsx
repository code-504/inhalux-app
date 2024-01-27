import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";

import { useFonts } from "expo-font";
import { Slot, SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { TamaguiProvider } from "tamagui";
import appConfig from "@/tamagui.config";
import { MonitorProvider } from "@/context/MonitorProvider";
import { InhalerProvider } from "@/context/InhalerProvider";
import { TreatmentProvider } from "@/context/TreatmentProvider";
import { NotificationProvider } from "@/context/NotificationsProvider";
import NormalHeader from "@/components/Headers/NormalHeader";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            cacheTime: 1000 * 60 * 60 * 24, // 24 hours
        },
    },
});

const asyncStoragePersister = createAsyncStoragePersister({
    storage: AsyncStorage,
});

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "/(tabs)",
};

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "@/context/Authprovider";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        "Montserrat-Regular": require("@/assets/fonts/Montserrat-Regular.ttf"),
        "Montserrat-Semibold": require("@/assets/fonts/Montserrat-SemiBold.ttf"),
        "Montserrat-Bold": require("@/assets/fonts/Montserrat-Bold.ttf"),
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
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
        >
            <AuthProvider>
                <InhalerProvider>
                    {/* <NotificationProvider> */}
                        <TreatmentProvider>
                            {/* <RelationProvider> */}
                                <RootLayoutNav />
                            {/* </RelationProvider> */}
                        </TreatmentProvider>
                    {/* </NotificationProvider> */}
                </InhalerProvider>
            </AuthProvider>
        </PersistQueryClientProvider>
    );
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            <TamaguiProvider config={appConfig}>
                <PaperProvider>
                    <SafeAreaProvider>
                        <MonitorProvider>
                            <BottomSheetModalProvider>
                                <Stack initialRouteName="index">
                                    <Stack.Screen
                                        name="index"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="(auth)/login"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="(auth)/signup"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="(auth)/recovery"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen
                                        name="(tabs)"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen name="device/[inhaler_id]" />
                                    <Stack.Screen name="device/edit_name" />
                                    <Stack.Screen
                                        name="configuration/index"
                                        options={{
                                            header: () => (
                                                <NormalHeader
                                                    positionHeader="relative"
                                                    title="Configuración"
                                                />
                                            ),
                                        }}
                                    />
                                    <Stack.Screen
                                        name="configuration/profile"
                                        options={{
                                            header: () => (
                                                <NormalHeader
                                                    positionHeader="relative"
                                                    title="Perfil de usuario"
                                                />
                                            ),
                                        }}
                                    />
                                    <Stack.Screen name="configuration/permissions" />
                                    <Stack.Screen name="configuration/password" />
                                    <Stack.Screen name="configuration/notifications" />
                                    <Stack.Screen name="configuration/shareoptions" />
                                    <Stack.Screen
                                        name="configuration/treatment_register"
                                        options={{ headerShown: false }}
                                    />
                                    <Stack.Screen name="device/search_device" />
                                    <Stack.Screen name="device/connect_device" />
                                    <Stack.Screen
                                        name="monitor/scan_pacient"
                                        options={{
                                            header: () => (
                                                <NormalHeader title="Escanear" />
                                            ),
                                        }}
                                    />
                                    <Stack.Screen
                                        name="monitor/share_link"
                                        options={{
                                            header: () => (
                                                <NormalHeader title="Compartir" />
                                            ),
                                        }}
                                    />
                                    <Stack.Screen name="monitor/pacient_view" />
                                    <Stack.Screen name="monitor/monitor_view" />
                                    <Stack.Screen
                                        name="notification"
                                        options={{
                                            header: () => (
                                                <NormalHeader title="Notificaciones" />
                                            ),
                                        }}
                                    />
                                </Stack>
                            </BottomSheetModalProvider>
                        </MonitorProvider>
                    </SafeAreaProvider>
                </PaperProvider>
            </TamaguiProvider>
        </ThemeProvider>
    );
}
