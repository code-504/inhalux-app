import React from "react";
import { Redirect } from "expo-router";
import { enableLatestRenderer } from "react-native-maps";

import "react-native-gesture-handler";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { enableFreeze } from "react-native-screens";
import { useUserStore } from "@/stores/user";
import * as NavigationBar from "expo-navigation-bar";

enableLatestRenderer();
enableFreeze(true);

const index = () => {
    NavigationBar.setBackgroundColorAsync("transparent");
    NavigationBar.setButtonStyleAsync("dark");
    NavigationBar.setPositionAsync("absolute");

    console.log("jij jaa");

    const { authInitialized, isLoading } = useUserStore();
    const { expoPushToken } = usePushNotifications();
    //console.log("expoPushToken: ", expoPushToken);

    if (isLoading) return null;

    if (!authInitialized) return <Redirect href="/(auth)/login" />;

    return <Redirect href="/(tabs)/device" />;
};

export default gestureHandlerRootHOC(index);
