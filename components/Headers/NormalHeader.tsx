import {  View, StyleSheet, Animated } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from 'tamagui'
import Colors from '@/constants/Colors'
import { useNavigation } from 'expo-router'

// Resources
import ArrowBackIcon from "@/assets/icons/arrow_back.svg";
import { MontserratSemiText } from '../StyledText'

interface HeaderProps {
    title: string;
    animHeaderValue ?: Animated.Value
}

export default function NormalHeader({ title, animHeaderValue }: HeaderProps) {

    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    const animateHeaderOpacity = animHeaderValue?.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: 'clamp'
      })

    return (
        <SafeAreaView style={styles.safeAre}>

            <View style={ styles.header}>
                <Button style={styles.backButton} alignSelf="center" size="$6" circular onPress={handleBackPress}>
                    <ArrowBackIcon />
                </Button>

                <Animated.Text style={[
                    styles.headerTitle,
                    {
                        opacity: animateHeaderOpacity
                    }
                ]}>{ title }</Animated.Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeAre: {
        position: "relative",
        paddingVertical: 24,
        paddingHorizontal: 24,
        backgroundColor: Colors.lightGrey,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: "Montserrat-Semibold"
    },
    backButton: {
        position: "absolute",
        left: 0,
        backgroundColor: Colors.light.background
    }
})