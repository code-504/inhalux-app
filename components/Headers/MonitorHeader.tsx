import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar, Button, XStack } from 'tamagui'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratText } from '../StyledText'
import { Link, router } from 'expo-router'
import { useAuth } from '@/context/Authprovider'

// Resources
import ShareOptionsIcon from "@/assets/icons/share_options.svg"

export default function MonitorHeader() {
    const {supaUser} = useAuth();

  return (
    <SafeAreaView style={styles.safeAre}>
        <View style={styles.header}>
            <View style={styles.containerView}>
                <Link href="/configuration">
                    <Avatar size="$6" circular onPress={() => router.push("/configuration/")}>
                        <Avatar.Image
                            accessibilityLabel="Cam"
                            src={supaUser?.avatar}
                        />
                        <Avatar.Fallback backgroundColor="$blue10" />
                    </Avatar>
                </Link>

                <View style={styles.headerTitleView}>
                    <MontserratText style={styles.headerTitleWellcomeText}>Bienvenido 👋</MontserratText>
                    <MontserratBoldText style={styles.headerTitleNameText}>{supaUser?.name || "Conectando..."}</MontserratBoldText>
                </View>

            </View>

            <Button onPress={() => router.push("/configuration/shareoptions")} style={styles.notificationButton} alignSelf="center" size="$6" circular>
                <ShareOptionsIcon />
            </Button>
        </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    safeAre: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        backgroundColor: Colors.lightGrey
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