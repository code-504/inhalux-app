import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar, Button, XStack } from 'tamagui'
import Colors from '@/constants/Colors'
import { MontserratBoldText, MontserratText } from '../StyledText'

// Resources
import MoreIcon from "@/assets/icons/more_vert.svg";
import { useAuth } from '@/context/Authprovider'

export default function MonitorHeader() {
    const {supaUser} = useAuth();

  return (
    <SafeAreaView style={styles.safeAre}>
        <View style={styles.header}>
            <View style={styles.containerView}>
                <Avatar size="$6" circular>
                    <Avatar.Image
                        accessibilityLabel="Cam"
                        src={supaUser?.avatar}
                    />
                    <Avatar.Fallback backgroundColor="$blue10" />
                </Avatar>

                <View style={styles.headerTitleView}>
                <MontserratText style={styles.headerTitleWellcomeText}>Bienvenido 👋</MontserratText>
                    <MontserratBoldText style={styles.headerTitleNameText}>{supaUser?.name || "Conectando..."}</MontserratBoldText>
                </View>
            </View>

            <Button style={styles.notificationButton} alignSelf="center" size="$6" circular>
                <MoreIcon />
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