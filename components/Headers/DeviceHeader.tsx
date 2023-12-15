import {  Alert,  View, Text, StyleSheet } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar, Button, XStack } from 'tamagui'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratText } from '../StyledText'
import { supabase } from '@/services/supabase'
import { useAuth } from '@/context/Authprovider'
import { Link, router } from 'expo-router'

// Resources
import NotificationIcon from "@/assets/icons/notifications.svg";

export default function DeviceHeader() {
    const {supaUser} = useAuth();

    const handleNotificationPress = () => {
        router.push("/notification/")
    };

    return (
        <SafeAreaView style={styles.safeAre}>
            <View style={styles.header}>
                <View style={styles.containerView}>
                    <Link href="/configuration/">
                        <Avatar size="$6" circular>
                            <Avatar.Image
                                accessibilityLabel="Cam"
                                src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
                            />
                            <Avatar.Fallback backgroundColor="$blue10" />
                        </Avatar>
                    </Link>
                    
                    <View style={styles.headerTitleView}>
                        <MontserratText style={styles.headerTitleWellcomeText}>Bienvenido 👋</MontserratText>
                        <MontserratBoldText style={styles.headerTitleNameText}>{supaUser?.name || "Conectando..."}</MontserratBoldText>
                    </View>
                </View>
                
                <Button style={styles.notificationButton} alignSelf="center" size="$6" circular onPress={handleNotificationPress}>
                    <NotificationIcon />
                </Button>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeAre: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        backgroundColor: Colors.lightGrey,
    },
    containerView: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerTitleView: {
        display: "flex",
        flexDirection: "column",
        marginLeft: 16,
    },
    headerTitleWellcomeText: {
        color: Colors.light.grayText,
        fontSize: 14,
        marginBottom: 2
    },
    headerTitleNameText: {
        color: Colors.light.text,
        fontSize: 16
    },
    notificationButton: {
        backgroundColor: Colors.light.background
    }
})