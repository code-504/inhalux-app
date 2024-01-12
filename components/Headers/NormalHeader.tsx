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
    animHeaderValue ?: Animated.Value;
    positionHeader ?: "static" | "relative" | "absolute" | "fixed" | "sticky" | undefined;
    children ?: JSX.Element | JSX.Element[]
}

export default function NormalHeader({ title, animHeaderValue, positionHeader, children }: HeaderProps) {

    const navigation = useNavigation();

    const handleBackPress = () => {
        navigation.goBack();
    };

    const animateHeaderOpacity = animHeaderValue?.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    })

    const animateHeaderBackground = animHeaderValue?.interpolate({
        inputRange: [0, 210],
        outputRange: ["#FFFFFF00", Colors.lightGrey],
        extrapolate: 'clamp'
    })

    const animatedStyle = {
        backgroundColor: animateHeaderBackground
    }

    return (
        <Animated.View style={[ styles.header, animatedStyle, { position: positionHeader ? positionHeader : "absolute", }]}>
            <SafeAreaView>  
                
                    <View style={{         
                        position: "relative",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>

                        <Button style={styles.backButton} alignSelf="center" size="$6" circular onPress={handleBackPress}>
                            <ArrowBackIcon />
                        </Button>

                        {
                            children && 
                            <View style={styles.actionButton}>
                                {
                                    children
                                }
                            </View>
                        }

                        <Animated.Text style={[
                            styles.headerTitle,
                            {
                                opacity: animateHeaderOpacity
                            }
                        ]}>{ title }</Animated.Text>
                    </View>
            </SafeAreaView>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        paddingHorizontal: 24,
        paddingVertical: 32,
        backgroundColor: "transparent"
    },
    headerTitle: {
        width: "100%",
        maxWidth: 180,
        fontSize: 16,
        textAlign: "center",
        fontFamily: "Montserrat-Semibold"
    },
    backButton: {
        position: "absolute",
        left: 0,
        backgroundColor: Colors.light.background
    },
    actionButton: {
        position: "absolute",
        right: 0,
        display: "flex",
        flexDirection: "row",
        gap: 16
    }
})