import {  View, StyleSheet } from 'react-native'
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
    fn?: () => void;
    Icon ?: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    enableActionButton ?: boolean;
}

export default function SimpleHeader({ title, fn, Icon, enableActionButton }: HeaderProps) {

    const navigation = useNavigation();
    const enable = enableActionButton || false;
    const IconButton = Icon || null;

    const handleBackPress = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeAre}>

            <View style={styles.header}>
                <Button style={styles.backButton} alignSelf="center" size="$6" circular onPress={handleBackPress}>
                    <ArrowBackIcon />
                </Button>

                <MontserratSemiText style={styles.headerTitle}>{ title }</MontserratSemiText>

                {
                    Icon && 
                    <Button style={styles.backButton} alignSelf="center" size="$6" circular onPress={fn}>
                            <Icon />
                    </Button>
                }
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
        fontSize: 18
    },
    backButton: {
        position: "absolute",
        left: 0,
        backgroundColor: Colors.light.background
    }
})