import { View, Text, StyleSheet, ImageBackground, ScrollView, Animated, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import useBLE from '@/hooks/useBLE'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Input, Label, Spinner } from 'tamagui'
import Colors from '@/constants/Colors'
import { Stack, router } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar';
import NormalHeader from '@/components/Headers/NormalHeader'

// Resources
import BackgroundImage from "@/assets/images/background.png"

import { Picker, DatePicker } from 'react-native-wheel-datepicker';

NavigationBar.setBackgroundColorAsync(Colors.white);
NavigationBar.setButtonStyleAsync("dark");

const ConnectDevice = () => {

  	let scrollOffsetY = useRef(new Animated.Value(0)).current;

    const [city, setCity] = useState<number>();

    return (
        <View style={styles.safeArea}>
            <Stack.Screen options={{ header: () => <NormalHeader title="Configurar inhaLux" animHeaderValue={scrollOffsetY} /> }} />
            <ImageBackground source={BackgroundImage} style={styles.imageBackground} />

            <ScrollView 
				style={styles.content} 
				contentContainerStyle={{ flex: 1 }}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollOffsetY}}}],
                    {useNativeDriver: false}
                )}
            >

                <View style={{ flex: 1 }}>
                    <View style={styles.upView}>
                        <MontserratBoldText style={styles.title}>{`Configura \ntu inhaLux`}</MontserratBoldText>
						<MontserratSemiText style={styles.description}>Asigna el nivel de dosis y tu nombrer para comenzar</MontserratSemiText>
                    </View>

                    <View style={styles.downView}>
                        <View>
                            <MontserratSemiText style={styles.subTitle}>Configurar inhalador</MontserratSemiText>

                            <View style={styles.inputContainerView}>
                                <View style={styles.inputView}>
                                    <Label style={styles.inputLabel} htmlFor="name"><MontserratSemiText>Nombre</MontserratSemiText></Label>

                                    <Input
                                        id="name"
                                        borderRadius={32}
                                        borderWidth={0}
                                        style={styles.input}
                                    />
                                </View>

                                <View style={styles.inputView}>
                                    <Label style={styles.inputLabel} htmlFor="number"><MontserratSemiText>Número de cargas</MontserratSemiText></Label>

                                    
                                </View>
                            </View>
                        </View>

						<Button backgroundColor={Colors.primary} color={ Colors.buttonTextPrimary } borderRadius={32} height={64}>
							<MontserratSemiText style={styles.loginText}>Guardar inhalador</MontserratSemiText>
						</Button>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

export default ConnectDevice

const styles = StyleSheet.create({
    safeArea: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
        backgroundColor: Colors.lightGrey
	},
    imageBackground: {
		position: "absolute",
		resizeMode: 'cover',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
	},
    content: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
    },
    upView: {
        flex: 0.3,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        paddingTop: 48,
        paddingBottom: 24,
        paddingHorizontal: 24
    },
    downView: {
        flex: 0.7,
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
        backgroundColor: Colors.white,
        borderTopLeftRadius: 38,
        borderTopRightRadius: 38,
        paddingTop: 42,
		paddingBottom: 12,
		paddingHorizontal: 24
    },
    title: {
        fontSize: 32,
        lineHeight: 42
    },
	subTitle: {
        fontSize: 12,
        color: Colors.darkGray
    },
    description: {
        fontSize: 14,
        color: Colors.darkGray,
        lineHeight: 20
    },
	loginText: {
		fontSize: 16,
	},
    inputContainerView: {
		display: "flex",
		flexDirection: "column",
		gap: 24,
        marginTop: 24
	},
    infoText: {
        fontSize: 12,
        color: Colors.darkGray,
        lineHeight: 18
    },
    infoContent: {
        display: "flex",
        flexDirection: "row",
        gap: 16,
        marginRight: 24
    },
	inputView: {
		display: "flex",
		flexDirection: "column",
		gap: 4
	},
	inputLabel: {
		marginLeft: 6,
		fontSize: 14
	},
	input: {
		height: 60,
		backgroundColor: Colors.inputBackground
	},
})