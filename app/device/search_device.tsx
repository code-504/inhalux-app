import { View, Text, StyleSheet, ImageBackground, ScrollView, Animated, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import useBLE from '@/hooks/useBLE'
import { MontserratBoldText, MontserratSemiText, MontserratText } from '@/components/StyledText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, Spinner } from 'tamagui'
import Colors from '@/constants/Colors'
import { Stack, router } from 'expo-router'
import * as NavigationBar from 'expo-navigation-bar';

// Resources
import BackgroundImage from "@/assets/images/background.png"
import NormalHeader from '@/components/Headers/NormalHeader'

NavigationBar.setBackgroundColorAsync(Colors.white);
NavigationBar.setButtonStyleAsync("dark");

const SearchDevice = () => {

  	const { 
		requestPermissions, 
		allDevices, 
		setAllDevices,
		bluetoothState,
		onBluetoothState,
		connectedDevice, 
		scanForPeripherals, 
		connectToDevice, 
		bleManager, 
		checkBluetooth 
	} = useBLE();

	const [isLoading, setIsLoading] = useState({
		loading: true,
		message: "Encender luetooth",
		state: "noBluetooth"
	});

  	let scrollOffsetY = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		requestPermissions();

		const subscription = onBluetoothState();

		return () => {
			subscription.remove();
			if (bluetoothState)
				if (bluetoothState === "PoweredOn")
					bleManager.stopDeviceScan();
		}
	}, [])

	useEffect(() => {

		if (!bluetoothState)
			return;

		if (bluetoothState === 'PoweredOn') {
			console.log("cd")
			scanForPeripherals();

			setIsLoading({
				loading: true,
				message: "Buscando",
				state: "searching"
			});
		}
	
		  if (bluetoothState === 'PoweredOff') {
			bleManager.stopDeviceScan();
			setAllDevices([]);
			setIsLoading({
				loading: false,
				message: "Encender Bluetooth",
				state: "noBluetooth"
			});
		}

	}, [bluetoothState])

  useEffect(() => {
    allDevices.map((item, index) => {
      console.log(item, "\n")
    })
	
	if (allDevices.length > 0)
		setIsLoading({
			loading: false,
			message: "Conectar",
			state: "connect"
		});
  }, [allDevices])

  const bluetoothButton = async () => {
	try {
		if (isLoading.state === "noBluetooth") 
			await bleManager.enable();

		if (isLoading.state === "connect") 
			router.push("/device/connect_device")
	} catch(error) {
		console.log(error)
	}
  }

  	return (
		<View style={styles.safeArea}>
			<Stack.Screen options={{ header: () => <NormalHeader title="Conectar inhaLux" animHeaderValue={scrollOffsetY} /> }} />
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
							<MontserratBoldText style={styles.title}>{`Buscando \ntu inhaLux`}</MontserratBoldText>
							<MontserratSemiText style={styles.description}>Presiona tu inhaLux 3 veces para activar el escaneo bluetooth</MontserratSemiText>
						</View>

						<View style={styles.downView}>
							<MontserratSemiText style={styles.subTitle}>Conectar dispositivo</MontserratSemiText>
							{
								isLoading.loading ? <Spinner size={"large"} color={Colors.primary} /> :
								allDevices.length > 0 &&
								<View>
									<Button size="$6" borderRadius={'$radius.10'} onPress={() => connectToDevice(allDevices[0])}>
									<MontserratSemiText>{ allDevices[0].name }</MontserratSemiText>
									</Button>
								</View>
							}

							<Button onPress={() => bluetoothButton()} backgroundColor={isLoading.loading ? Colors.dotsGray : Colors.primary} color={ isLoading.loading ? Colors.black : Colors.buttonTextPrimary } borderRadius={32} height={64}>
								<MontserratSemiText style={styles.loginText}>{ isLoading.message }</MontserratSemiText>
							</Button>
						</View>
					</View>
			</ScrollView>
		</View>
  	)
}

export default SearchDevice

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
})